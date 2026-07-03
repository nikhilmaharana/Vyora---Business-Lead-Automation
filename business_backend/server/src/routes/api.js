import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import { db } from '../seed/data.js';
import User from '../models/User.js';
import { aiSuggestion, analyticsForBusiness, leadScore, matchBusinesses, profileSuggestions, searchBusinesses } from '../utils/smart.js';
import otpRoutes from './otpRoutes.js';
import { deleteAccount } from '../controllers/deleteAccountController.js';
import { authenticateJWT, requireAdmin } from '../middleware/adminAuth.js';
import {
  getAnalytics, getUsers, updateUser, deleteUser,
  getBusinesses, updateBusiness, deleteBusiness,
  getCategories, createCategory,
  getLeads, updateLead,
  getReviews, deleteReview,
  getFakeData, bulkDeleteFakeData,
  getReports
} from '../controllers/adminController.js';

const router = Router();
const signToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET || 'dev-secret',
  { expiresIn: '7d' }
);

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

function userMatchesToken(user, decoded) {
  const decodedEmail = normalizeEmail(decoded.email);
  const userEmail = normalizeEmail(user.email);
  return Boolean(decoded.id && user.id && user.id === decoded.id) || Boolean(decodedEmail && userEmail === decodedEmail);
}

function ensureUserId(user, source = 'unknown') {
  if (!user.id) {
    user.id = nanoid();
    console.warn('[AUTH] Backfilled missing user.id', {
      source,
      email: user.email,
      assignedId: user.id
    });
  }
  return user;
}

function findMemoryUserByToken(decoded) {
  return db.users.find((item) => userMatchesToken(item, decoded));
}

async function persistBackfilledUserId(user) {
  if (!user?.id || !user?.email || mongoose.connection.readyState !== 1) return;
  try {
    await User.updateOne(
      { email: normalizeEmail(user.email), $or: [{ id: { $exists: false } }, { id: null }, { id: '' }] },
      { $set: { id: user.id } }
    ).maxTimeMS(5000);
    console.log('[AUTH] Persisted backfilled user.id to MongoDB', { email: user.email, id: user.id });
  } catch (error) {
    console.error('[AUTH] Failed to persist backfilled user.id', {
      email: user.email,
      id: user.id,
      message: error.message,
      stack: error.stack
    });
  }
}


// === OTP VERIFICATION ROUTES ===
router.use('/auth', otpRoutes);

// === AUTH ROUTES (WITH OTP VERIFICATION) ===

// Signup - creates a new user account
router.post('/auth/signup', (req, res) => {
  const { name, email, phone, role = 'user' } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });
  if (!email && !phone) return res.status(400).json({ message: 'Email or phone is required' });
  
  let user = db.users.find((item) => item.email === email || (phone && item.phone === phone));
  if (user) return res.status(409).json({ message: 'Account already exists. Please login.' });
  
  const vendorStatus = role === 'business_owner' ? 'pending_approval' : 'approved';
  
  user = { 
    id: nanoid(), 
    name: name.trim(), 
    email: email || '', 
    phone: phone || '', 
    role, 
    verified: true, 
    blocked: false, 
    vendorStatus,
    favorites: [], 
    referralCode: `${name.trim().slice(0, 5).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`, 
    activity: ['Signed up'],
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  
  // If vendor, create a pending business entry and notify admin
  if (role === 'business_owner') {
    const pendingBusiness = {
      id: nanoid(),
      ownerId: user.id,
      name: `${name.trim()}'s Business`,
      ownerName: name.trim(),
      category: '',
      subCategory: '',
      type: 'Service',
      city: '',
      state: '',
      address: '',
      approved: false,
      kycStatus: 'pending',
      verifiedBadge: false,
      credits: 0,
      plan: 'Free',
      profileCompletion: 10,
      gstin: '',
      createdAt: new Date().toISOString()
    };
    db.businesses.push(pendingBusiness);
    db.notifications.push({
      id: nanoid(),
      audience: 'admin',
      title: 'New Vendor Registration',
      body: `${name.trim()} registered as a vendor and needs approval`,
      channel: 'dashboard',
      read: false,
      createdAt: new Date().toISOString()
    });
  }
  
  res.json({ user, token: signToken(user), message: role === 'business_owner' ? 'Vendor account created. Awaiting admin approval.' : 'Account created successfully' });
});

// Login - find existing user or return error
router.post('/auth/login', (req, res) => {
  const { email, phone } = req.body;
  if (!email && !phone) return res.status(400).json({ message: 'Email or phone is required' });
  
  const user = db.users.find((item) => normalizeEmail(item.email) === normalizeEmail(email) || (phone && item.phone === phone));
  if (!user) return res.status(404).json({ message: 'No account found. Please signup first.' });
  if (user.blocked) return res.status(403).json({ message: 'This account is blocked. Contact admin.' });
  
  ensureUserId(user, 'login');
  user.activity = [...(user.activity || []), `Logged in at ${new Date().toLocaleString()}`];
  res.json({ user, token: signToken(user), message: 'Login successful' });
});

// Admin Login - using admin@demo.com for admin users
router.post('/auth/admin-login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  
  const user = db.users.find((item) => normalizeEmail(item.email) === normalizeEmail(email) && (item.role === 'admin' || item.role === 'super_admin'));
  if (!user) return res.status(404).json({ message: 'Admin account not found' });
  if (user.blocked) return res.status(403).json({ message: 'This account is blocked' });
  
  // Verify password if provided
  if (password) {
    try {
      const bcrypt = await import('bcryptjs');
      if (user.passwordHash) {
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    } catch (err) {
      // Fallback: if no passwordHash or bcrypt fails, allow login (backward compatibility)
      console.warn('[Admin Login] Password verification skipped:', err.message);
    }
  } else if (user.passwordHash) {
    // Password required if account has one
    return res.status(401).json({ message: 'Password is required for this account' });
  }
  
  ensureUserId(user, 'admin-login');
  user.activity = [...(user.activity || []), `Admin logged in at ${new Date().toLocaleString()}`];
  res.json({ user, token: signToken(user), message: 'Admin login successful' });
});

// Get current user profile from token
router.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = findMemoryUserByToken(decoded);
    if (!user) return res.status(401).json({ message: 'User not found' });
    ensureUserId(user, 'auth-me');
    res.json({ user });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Delete user account - requires authentication and confirmation phrase
router.delete('/auth/delete-account', authenticateJWT, deleteAccount);

// Update user profile
router.patch('/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = findMemoryUserByToken(decoded);
    if (!user) return res.status(401).json({ message: 'User not found' });
    ensureUserId(user, 'profile-update');
    Object.assign(user, req.body);
    res.json({ user, message: 'Profile updated' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Add to favorites
router.post('/users/:id/favorites', (req, res) => {
  const user = db.users.find((item) => item.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.favorites ||= [];
  if (!user.favorites.includes(req.body.businessId)) user.favorites.push(req.body.businessId);
  res.json({ user, favorites: db.businesses.filter((business) => user.favorites.includes(business.id)) });
});

// Remove from favorites
router.delete('/users/:id/favorites/:businessId', (req, res) => {
  const user = db.users.find((item) => item.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.favorites = (user.favorites || []).filter(id => id !== req.params.businessId);
  res.json({ user, favorites: db.businesses.filter((business) => user.favorites.includes(business.id)) });
});

router.get('/health', (req, res) => res.json({ ok: true, mode: process.env.MONGO_URI ? 'mongo' : 'memory' }));

router.get('/dashboard', (req, res) => {
  const business = db.businesses[0];
  res.json({
    metrics: {
      totalUsers: db.users.length,
      totalVendors: db.businesses.length,
      totalLeads: db.leads.length,
      revenue: db.businesses.reduce((sum, item) => sum + item.revenue, 0),
      fakeLeadAlerts: db.activityLogs.filter((item) => item.risk !== 'low').length
    },
    vendorAnalytics: analyticsForBusiness(business.id),
    suggestions: profileSuggestions(business),
    notifications: db.notifications
  });
});

// Vendor Dashboard - get business owned by authenticated vendor
router.get('/vendor/dashboard', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'business_owner') return res.status(403).json({ message: 'Access denied' });
    
    const myBusiness = db.businesses.find(b => b.ownerId === user.id);
    if (!myBusiness) return res.json({ business: null, metrics: { totalLeads: 0, conversionRate: 0, revenue: 0, totalListings: 0 } });
    
    const myLeads = db.leads.filter(l => l.businessIds?.includes(myBusiness.id));
    const myListings = db.listings.filter(l => l.businessId === myBusiness.id);
    const converted = myLeads.filter(l => l.status === 'Converted').length;
    
    res.json({
      business: myBusiness,
      metrics: {
        totalLeads: myLeads.length,
        conversionRate: myLeads.length ? Math.round((converted / myLeads.length) * 100) : 0,
        revenue: myBusiness.revenue || 0,
        totalListings: myListings.length
      },
      analytics: analyticsForBusiness(myBusiness.id),
      notifications: db.notifications.filter(n => n.audience === 'vendor' || n.audience === 'business')
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Get single business by ID
router.get('/businesses/:id', (req, res) => {
  const business = db.businesses.find((item) => item.id === req.params.id);
  if (!business) return res.status(404).json({ message: 'Business not found' });
  res.json({ business });
});

router.get('/businesses', (req, res) => {
  res.json(searchBusinesses(req.query));
});

// AI/ML powered categories endpoint - returns all categories with smart ranking
router.get('/categories', (req, res) => {
  const query = String(req.query.q || '').trim().toLowerCase();
  const categories = new Map();
  
  // Collect categories from businesses with enhanced data
  for (const business of db.businesses) {
    if (!business.category) continue;
    const entry = categories.get(business.category) || { 
      name: business.category, 
      businessCount: 0, 
      subCategories: new Set(), 
      cities: new Set(),
      avgRating: 0,
      totalRating: 0,
      services: new Set(),
      listings: 0,
      verifiedCount: 0
    };
    entry.businessCount += 1;
    entry.totalRating += (business.rating || 0);
    if (business.subCategory) entry.subCategories.add(business.subCategory);
    if (business.city) entry.cities.add(business.city);
    if (business.services) business.services.forEach(s => entry.services.add(s));
    if (business.verifiedBadge) entry.verifiedCount += 1;
    categories.set(business.category, entry);
  }
  
  // Collect categories from listings
  for (const listing of db.listings) {
    if (!listing.category) continue;
    const entry = categories.get(listing.category) || { 
      name: listing.category, 
      businessCount: 0, 
      subCategories: new Set(), 
      cities: new Set(),
      avgRating: 0,
      totalRating: 0,
      services: new Set(),
      listings: 0,
      verifiedCount: 0
    };
    if (listing.title) entry.subCategories.add(listing.title);
    entry.listings += 1;
    categories.set(listing.category, entry);
  }
  
  const results = [...categories.values()]
    .map((item) => {
      const avgRating = item.businessCount > 0 ? (item.totalRating / item.businessCount) : 0;
      // Enhanced AI/ML scoring with semantic matching
      const searchText = [item.name, ...item.subCategories, ...item.services].join(' ').toLowerCase();
      let queryRelevance = 0;
      if (query) {
        // Check for exact match
        if (item.name.toLowerCase() === query) queryRelevance = 100;
        else if (item.name.toLowerCase().includes(query)) queryRelevance = 85;
        else if (searchText.includes(query)) queryRelevance = 70;
        // Check partial matches
        else {
          const queryTokens = query.split(' ').filter(t => t.length > 1);
          const matchCount = queryTokens.filter(t => searchText.includes(t)).length;
          queryRelevance = queryTokens.length ? (matchCount / queryTokens.length) * 60 : 0;
        }
      }
      const popularityScore = Math.min(item.businessCount * 12 + item.listings * 5, 100);
      const ratingScore = avgRating * 20;
      const verifiedScore = Math.min(item.verifiedCount * 15, 30);
      const score = query ? queryRelevance + verifiedScore : (popularityScore * 0.35 + ratingScore * 0.45 + verifiedScore * 0.2);
      return { 
        ...item, 
        subCategories: [...item.subCategories].slice(0, 10), 
        cities: [...item.cities].slice(0, 10),
        services: [...item.services].slice(0, 8),
        avgRating: Math.round(avgRating * 10) / 10,
        verifiedCount: item.verifiedCount,
        score: Math.round(score)
      };
    })
    .filter((item) => !query || item.score > 10)
    .sort((a, b) => b.score - a.score || b.businessCount - a.businessCount);
  
  res.json({ 
    algorithm: 'VyoraAI v2: semantic keyword + popularity + rating + trust hybrid ranking', 
    total: results.length,
    results 
  });
});

// Get all unique cities/areas for filtering
router.get('/locations', (req, res) => {
  const cities = new Set();
  const areas = new Set();
  for (const business of db.businesses) {
    if (business.city) cities.add(business.city);
    if (business.area) areas.add(business.area);
    if (business.serviceAreas) business.serviceAreas.forEach(a => cities.add(a));
  }
  res.json({ 
    cities: [...cities].sort(),
    areas: [...areas].sort()
  });
});

// Get businesses by area
router.get('/businesses/area/:areaName', (req, res) => {
  const areaName = req.params.areaName.toLowerCase();
  const results = db.businesses.filter(b => 
    (b.area && b.area.toLowerCase() === areaName) || 
    (b.city && b.city.toLowerCase() === areaName) ||
    (b.address && b.address.toLowerCase().includes(areaName))
  );
  res.json({ area: req.params.areaName, count: results.length, results });
});

// Get businesses by city
router.get('/businesses/city/:cityName', (req, res) => {
  const cityName = req.params.cityName.toLowerCase();
  const results = db.businesses.filter(b => 
    (b.city && b.city.toLowerCase() === cityName) ||
    (b.serviceAreas && b.serviceAreas.some(a => a.toLowerCase() === cityName))
  );
  res.json({ city: req.params.cityName, count: results.length, results });
});

// Get businesses near a location
router.get('/businesses/near', (req, res) => {
  const { lat, lng, city } = req.query;
  let results = db.businesses;
  if (city) {
    const cityLower = city.toLowerCase();
    results = results.filter(b => 
      (b.city && b.city.toLowerCase().includes(cityLower)) ||
      (b.serviceAreas && b.serviceAreas.some(a => a.toLowerCase().includes(cityLower)))
    );
  }
  res.json({ near: city || 'all', count: results.length, results });
});

// AI-powered search with smart recommendations
router.get('/search/smart', (req, res) => {
  const results = searchBusinesses(req.query);
  // Add AI recommendations based on search context
  const query = String(req.query.q || '').toLowerCase();
  let recommendations = [];
  if (query) {
    // Find related categories
    const relatedCats = new Set();
    for (const b of db.businesses) {
      if (b.services && b.services.some(s => s.toLowerCase().includes(query))) {
        relatedCats.add(b.category);
      }
    }
    recommendations = [...relatedCats].slice(0, 5);
  }
  res.json({
    query: req.query,
    algorithm: {
      name: 'VyoraAI SmartRank hybrid search',
      signals: ['keyword similarity', 'category fit', 'service location', 'budget fit', 'seller trust', 'response speed', 'conversion rate', 'rating popularity']
    },
    recommendations,
    results
  });
});

router.post('/businesses', (req, res) => {
  const business = { id: nanoid(), approved: false, kycStatus: 'pending', verifiedBadge: false, profileCompletion: 45, credits: 5, plan: 'Free', ...req.body };
  db.businesses.push(business);
  db.notifications.push({ id: nanoid(), audience: 'admin', title: 'Profile approval needed', body: `${business.name} submitted a business profile`, channel: 'dashboard', read: false });
  res.status(201).json({ business, suggestions: profileSuggestions(business) });
});

router.patch('/businesses/:id', (req, res) => {
  const business = db.businesses.find((item) => item.id === req.params.id);
  if (!business) return res.status(404).json({ message: 'Business not found' });
  Object.assign(business, req.body);
  res.json({ business, suggestions: profileSuggestions(business) });
});

router.get('/listings', (req, res) => res.json(db.listings));
router.post('/listings', (req, res) => {
  const duplicate = db.listings.find((item) => item.title.toLowerCase() === req.body.title?.toLowerCase());
  const listing = { id: nanoid(), status: 'pending approval', views: 0, clicks: 0, leads: 0, conversionRate: 0, duplicateWarning: Boolean(duplicate), ...req.body };
  db.listings.push(listing);
  res.status(201).json({ listing, ai: { title: aiSuggestion('title', listing), tags: aiSuggestion('tags', listing) } });
});

router.patch('/listings/:id', (req, res) => {
  const listing = db.listings.find((item) => item.id === req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  Object.assign(listing, req.body);
  res.json(listing);
});

router.get('/leads', (req, res) => res.json(db.leads));
router.post('/leads', (req, res) => {
  const lead = { id: nanoid(), status: 'New', notes: ['OTP verified'], createdAt: new Date().toISOString().slice(0, 10), ...req.body };
  lead.score = leadScore(lead);
  const matches = matchBusinesses(lead);
  lead.businessIds = matches.map((item) => item.id);
  db.leads.push(lead);
  db.notifications.push({ id: nanoid(), audience: 'vendor', title: 'New Lead Received', body: `${lead.name} needs ${lead.category} in ${lead.location}`, channel: 'dashboard,email,whatsapp', read: false });
  res.status(201).json({ lead, matches, automation: ['Customer auto-reply sent', 'Vendor WhatsApp alert queued', 'Follow-ups scheduled: 1 hour, 1 day, 3 days'] });
});

router.patch('/leads/:id', (req, res) => {
  const lead = db.leads.find((item) => item.id === req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  Object.assign(lead, req.body);
  if (req.body.note) lead.notes.push(req.body.note);
  res.json(lead);
});

router.post('/leads/:id/bid', (req, res) => {
  const lead = db.leads.find((item) => item.id === req.params.id);
  if (!lead) return res.status(404).json({ message: 'Lead not found' });
  res.json({ accepted: true, message: 'Bid placed and lead unlocked using credits', creditsUsed: req.body.credits || 1, lead });
});

router.get('/automation', (req, res) => {
  res.json({
    whatsapp: { provider: process.env.WHATSAPP_PROVIDER || 'mock', autoReply: true, followUps: ['1 hour', '1 day', '3 days'], chatbot: true, multilingual: true },
    email: { provider: process.env.EMAIL_PROVIDER || 'mock', templates: ['Profile approval', 'New lead notification', 'Subscription alerts', 'Vendor suggestions'] },
    social: db.campaigns
  });
});

router.post('/automation/campaigns', (req, res) => {
  const campaign = { id: nanoid(), engagement: 0, status: 'scheduled', ...req.body };
  db.campaigns.push(campaign);
  res.status(201).json(campaign);
});

router.get('/analytics/:businessId', (req, res) => res.json(analyticsForBusiness(req.params.businessId)));
router.get('/subscriptions', (req, res) => res.json(db.subscriptions));
router.post('/subscriptions/upgrade', (req, res) => res.json({ success: true, provider: process.env.PAYMENT_PROVIDER || 'mock', message: `Plan changed to ${req.body.plan}` }));

router.get('/reviews', (req, res) => res.json(db.reviews));
router.post('/reviews', (req, res) => {
  const review = { id: nanoid(), verifiedWork: true, authenticityScore: 90, media: [], ...req.body };
  db.reviews.push(review);
  res.status(201).json(review);
});

router.get('/admin', (req, res) => {
  res.json({
    users: db.users,
    vendors: db.businesses,
    leads: db.leads,
    revenue: db.subscriptions,
    categories: [...new Set(db.businesses.map((item) => item.category))],
    locations: [...new Set(db.businesses.flatMap((item) => [item.city, ...item.serviceAreas]))],
    activityLogs: db.activityLogs,
    config: db.platformConfig
  });
});

router.patch('/admin/vendors/:id/approval', (req, res) => {
  const business = db.businesses.find((item) => item.id === req.params.id);
  if (!business) return res.status(404).json({ message: 'Business not found' });
  business.approved = req.body.approved;
  business.verifiedBadge = req.body.approved && business.kycStatus === 'verified';
  db.notifications.push({ id: nanoid(), audience: 'business', title: business.approved ? 'Your profile is approved' : 'Profile rejected', body: req.body.reason || 'Admin reviewed your business profile', channel: 'email', read: false });
  res.json(business);
});

router.patch('/admin/users/:id/block', (req, res) => {
  const user = db.users.find((item) => item.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.blocked = req.body.blocked;
  res.json(user);
});

router.post('/admin/config', (req, res) => {
  Object.assign(db.platformConfig, req.body);
  res.json(db.platformConfig);
});

// === ADMIN VENDOR REGISTRATION APPROVAL ===

// Get all vendor registrations (pending and approved)
router.get('/admin/vendor-registrations', (req, res) => {
  const pendingVendors = db.users.filter(u => u.role === 'business_owner')
    .map(v => {
      const business = db.businesses.find(b => b.ownerId === v.id);
      return {
        id: v.id,
        name: v.name,
        email: v.email,
        phone: v.phone,
        vendorStatus: v.vendorStatus,
        businessId: business?.id || null,
        businessName: business?.name || '',
        category: business?.category || '',
        city: business?.city || '',
        plan: business?.plan || 'Free',
        gstin: business?.gstin || '',
        createdAt: v.createdAt
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json({ vendors: pendingVendors, total: pendingVendors.length });
});

// Approve or reject a vendor registration
router.patch('/admin/vendor-registrations/:id/approve', (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'Vendor not found' });
  if (user.role !== 'business_owner') return res.status(400).json({ message: 'User is not a vendor' });
  
  const { approved, reason } = req.body;
  user.vendorStatus = approved ? 'approved' : 'rejected';
  
  // Update corresponding business
  const business = db.businesses.find(b => b.ownerId === user.id);
  if (business && approved) {
    business.approved = true;
    business.kycStatus = 'verified';
    business.verifiedBadge = true;
    business.profileCompletion = 50;
    business.credits = 10;
  }
  
  db.notifications.push({
    id: nanoid(),
    audience: 'business',
    title: approved ? '🎉 Your vendor account is approved!' : '❌ Vendor registration rejected',
    body: approved 
      ? 'Congratulations! Your account has been approved. You can now add products and start receiving leads.' 
      : reason || 'Your vendor registration was rejected. Please contact support for more details.',
    channel: 'dashboard,email',
    read: false,
    createdAt: new Date().toISOString()
  });
  
  res.json({ 
    user, 
    business: business || null, 
    message: approved ? 'Vendor approved successfully' : 'Vendor registration rejected'
  });
});

// === VENDOR GSTIN MANAGEMENT ===

// Add or update GSTIN for vendor's business
router.post('/vendor/gstin', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'business_owner') return res.status(403).json({ message: 'Access denied' });
    
    const { gstin } = req.body;
    if (!gstin || gstin.trim().length < 15) {
      return res.status(400).json({ message: 'Please enter a valid GSTIN number (15 characters)' });
    }
    
    const business = db.businesses.find(b => b.ownerId === user.id);
    if (!business) return res.status(404).json({ message: 'Business not found. Complete your profile first.' });
    
    business.gstin = gstin.trim().toUpperCase();
    business.gstinVerified = true;
    business.profileCompletion = Math.min((business.profileCompletion || 0) + 15, 100);
    
    res.json({ business, message: 'GSTIN added successfully!' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Get vendor's business profile
router.get('/vendor/business', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'business_owner') return res.status(403).json({ message: 'Access denied' });
    
    const business = db.businesses.find(b => b.ownerId === user.id);
    res.json({ business: business || null, vendorStatus: user.vendorStatus });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Get vendor approval status
router.get('/vendor/status', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    res.json({ 
      vendorStatus: user.vendorStatus || 'approved',
      role: user.role,
      isVendor: user.role === 'business_owner',
      isApproved: user.vendorStatus === 'approved'
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// === VENDOR REGISTRATION (MULTI-STEP) ===

// Save registration draft
router.post('/vendor/registration/draft', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    const { formData, currentStep } = req.body;
    if (!db.registrationDrafts) db.registrationDrafts = {};
    db.registrationDrafts[user.id] = {
      formData,
      currentStep: currentStep || 1,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ message: 'Draft saved successfully' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Get registration draft
router.get('/vendor/registration/draft', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    if (!db.registrationDrafts) db.registrationDrafts = {};
    const draft = db.registrationDrafts[user.id] || null;
    
    res.json({ draft });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Submit full registration
router.post('/vendor/registration/submit', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'business_owner') return res.status(403).json({ message: 'Access denied' });
    
    const registrationData = req.body;
    
    // Find or create business
    let business = db.businesses.find(b => b.ownerId === user.id);
    if (!business) {
      business = {
        id: nanoid(),
        ownerId: user.id,
        name: registrationData.businessName || `${user.name}'s Business`,
        ownerName: user.name,
        category: registrationData.category || '',
        subCategory: registrationData.subCategory || '',
        type: registrationData.businessType || 'Service',
        address: registrationData.address || '',
        city: registrationData.city || '',
        state: registrationData.state || '',
        pincode: registrationData.pincode || '',
        serviceAreas: registrationData.serviceAreas || [],
        approved: false,
        kycStatus: 'submitted',
        verifiedBadge: false,
        credits: 0,
        plan: 'Free',
        profileCompletion: 60,
        gstin: registrationData.gstin || '',
        createdAt: new Date().toISOString()
      };
      db.businesses.push(business);
    } else {
      // Update existing business with registration data
      Object.assign(business, {
        name: registrationData.businessName || business.name,
        category: registrationData.category || business.category,
        subCategory: registrationData.subCategory || business.subCategory,
        type: registrationData.businessType || business.type,
        address: registrationData.address || business.address,
        city: registrationData.city || business.city,
        state: registrationData.state || business.state,
        pincode: registrationData.pincode || business.pincode,
        serviceAreas: registrationData.serviceAreas || business.serviceAreas,
        gstin: registrationData.gstin || business.gstin,
        kycStatus: 'submitted',
        profileCompletion: Math.max(business.profileCompletion || 0, 60)
      });
    }
    
    // Update user vendor status
    user.vendorStatus = 'pending_approval';
    
    // Create verification record
    if (!db.verifications) db.verifications = [];
    const existingVerification = db.verifications.find(v => v.userId === user.id);
    const verification = existingVerification || {
      id: nanoid(),
      userId: user.id,
      businessId: business.id,
      registrationStep: 5,
      registrationComplete: true,
      kycStatus: 'submitted',
      profileCompletion: 60,
      resubmissionCount: existingVerification ? (existingVerification.resubmissionCount || 0) + 1 : 0,
      submittedAt: new Date().toISOString()
    };
    
    // Update verification fields
    Object.assign(verification, {
      businessName: registrationData.businessName,
      businessType: registrationData.businessType,
      businessEmail: registrationData.businessEmail,
      businessPhone: registrationData.businessPhone,
      address: registrationData.address,
      city: registrationData.city,
      state: registrationData.state,
      pincode: registrationData.pincode,
      serviceAreas: registrationData.serviceAreas,
      category: registrationData.category,
      subCategory: registrationData.subCategory,
      description: registrationData.description,
      yearsInBusiness: registrationData.yearsInBusiness,
      website: registrationData.website,
      socialLinks: registrationData.socialLinks ? 
        (typeof registrationData.socialLinks === 'string' ? JSON.parse(registrationData.socialLinks) : registrationData.socialLinks) 
        : {},
      documentType: registrationData.documentType,
      documentNumber: registrationData.documentNumber,
      gstin: registrationData.gstin,
      panNumber: registrationData.panNumber,
      businessProofType: registrationData.businessProofType,
      additionalInfo: registrationData.additionalInfo,
      registrationStep: 5,
      registrationComplete: true,
      kycStatus: 'submitted',
      profileCompletion: 80,
      submittedAt: new Date().toISOString()
    });
    
    if (!existingVerification) {
      db.verifications.push(verification);
    }
    
    // Clear draft
    if (db.registrationDrafts) {
      delete db.registrationDrafts[user.id];
    }
    
    // Notify admin
    db.notifications.push({
      id: nanoid(),
      audience: 'admin',
      title: 'New Vendor Registration Submitted',
      body: `${registrationData.businessName || user.name} has completed full registration and needs review`,
      channel: 'dashboard',
      read: false,
      createdAt: new Date().toISOString()
    });
    
    res.json({ 
      message: 'Registration submitted successfully! Awaiting admin approval.',
      business,
      verification
    });
  } catch (err) {
    console.error('[VENDOR REGISTRATION] Error:', err);
    return res.status(500).json({ message: 'Failed to submit registration' });
  }
});

// Get verification status
router.get('/vendor/verification/status', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    if (!db.verifications) db.verifications = [];
    const verification = db.verifications.find(v => v.userId === user.id) || null;
    
    res.json({ verification });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// === ADMIN VERIFICATION MANAGEMENT ===

// Get all verifications with vendor details
router.get('/admin/verifications', (req, res) => {
  if (!db.verifications) db.verifications = [];
  
  const verificationsWithVendors = db.verifications.map(v => {
    const vendor = db.users.find(u => u.id === v.userId);
    const business = db.businesses.find(b => b.id === v.businessId);
    return {
      ...v,
      vendorName: vendor?.name || 'Unknown',
      vendorEmail: vendor?.email || '',
      vendorPhone: vendor?.phone || '',
      businessName: business?.name || v.businessName || '',
      businessCategory: business?.category || v.category || '',
      businessCity: business?.city || v.city || '',
      vendorStatus: vendor?.vendorStatus || 'pending'
    };
  }).sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt));
  
  res.json({ verifications: verificationsWithVendors, total: verificationsWithVendors.length });
});

// Update verification status (admin)
router.patch('/admin/verifications/:id/status', (req, res) => {
  if (!db.verifications) db.verifications = [];
  const verification = db.verifications.find(v => v.id === req.params.id);
  if (!verification) return res.status(404).json({ message: 'Verification not found' });
  
  const { kycStatus, verificationNotes, rejectionReason } = req.body;
  
  verification.kycStatus = kycStatus || verification.kycStatus;
  if (verificationNotes !== undefined) verification.verificationNotes = verificationNotes;
  if (rejectionReason !== undefined) verification.rejectionReason = rejectionReason;
  
  if (kycStatus === 'verified') {
    verification.verifiedAt = new Date().toISOString();
    verification.profileCompletion = 100;
    
    // Update business
    const business = db.businesses.find(b => b.id === verification.businessId);
    if (business) {
      business.approved = true;
      business.kycStatus = 'verified';
      business.verifiedBadge = true;
      business.profileCompletion = 100;
      business.credits = 10;
    }
    
    // Update user
    const user = db.users.find(u => u.id === verification.userId);
    if (user) {
      user.vendorStatus = 'approved';
    }
    
    // Notify vendor
    db.notifications.push({
      id: nanoid(),
      audience: 'business',
      title: '🎉 Your vendor account is approved!',
      body: 'Congratulations! Your account has been fully verified. You can now add products and start receiving leads.',
      channel: 'dashboard,email',
      read: false,
      createdAt: new Date().toISOString()
    });
  }
  
  if (kycStatus === 'rejected') {
    verification.lastRejectedAt = new Date().toISOString();
    
    // Update user
    const user = db.users.find(u => u.id === verification.userId);
    if (user) {
      user.vendorStatus = 'rejected';
    }
    
    // Notify vendor
    db.notifications.push({
      id: nanoid(),
      audience: 'business',
      title: '❌ Vendor registration rejected',
      body: rejectionReason || 'Your vendor registration was rejected. Please re-submit with correct information.',
      channel: 'dashboard,email',
      read: false,
      createdAt: new Date().toISOString()
    });
  }
  
  res.json({ verification, message: `Verification status updated to ${kycStatus}` });
});

// === VENDOR PRODUCT MANAGEMENT ===

// Get vendor's products
router.get('/vendor/products', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'business_owner') return res.status(403).json({ message: 'Access denied' });
    
    const business = db.businesses.find(b => b.ownerId === user.id);
    if (!business) return res.json({ products: [] });
    
    const products = db.listings.filter(l => l.businessId === business.id);
    res.json({ products });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Add a product
router.post('/vendor/products', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'business_owner') return res.status(403).json({ message: 'Access denied' });
    
    const business = db.businesses.find(b => b.ownerId === user.id);
    if (!business) return res.status(404).json({ message: 'Business profile not found' });
    if (user.vendorStatus !== 'approved') return res.status(403).json({ message: 'Your account is not yet approved by admin' });
    
    const { title, description, price, category, image, type = 'Product' } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: 'Product title is required' });
    
    const duplicate = db.listings.find((item) => item.title.toLowerCase() === title.trim().toLowerCase() && item.businessId === business.id);
    const product = {
      id: nanoid(),
      businessId: business.id,
      type,
      title: title.trim(),
      description: description || '',
      price: Number(price) || 0,
      category: category || business.category || '',
      priceType: 'Fixed Price',
      status: 'approved',
      views: 0,
      clicks: 0,
      leads: 0,
      conversionRate: 0,
      image: image || '',
      tags: [],
      actions: ['Enquiry', 'WhatsApp', 'Call', 'Get Quote'],
      packages: [],
      duplicateWarning: Boolean(duplicate),
      createdAt: new Date().toISOString()
    };
    db.listings.push(product);
    res.status(201).json({ product, message: 'Product added successfully!' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Update a product
router.patch('/vendor/products/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'business_owner') return res.status(403).json({ message: 'Access denied' });
    
    const business = db.businesses.find(b => b.ownerId === user.id);
    if (!business) return res.status(404).json({ message: 'Business profile not found' });
    
    const product = db.listings.find(l => l.id === req.params.id && l.businessId === business.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    const { title, description, price, category, image } = req.body;
    if (title !== undefined) product.title = title.trim();
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image;
    
    res.json({ product, message: 'Product updated successfully!' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Delete a product
router.delete('/vendor/products/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'dev-secret');
    const user = db.users.find((item) => item.id === decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'business_owner') return res.status(403).json({ message: 'Access denied' });
    
    const business = db.businesses.find(b => b.ownerId === user.id);
    if (!business) return res.status(404).json({ message: 'Business profile not found' });
    
    const index = db.listings.findIndex(l => l.id === req.params.id && l.businessId === business.id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    
    db.listings.splice(index, 1);
    res.json({ message: 'Product deleted successfully!' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

router.post('/ai/:type', (req, res) => res.json({ result: aiSuggestion(req.params.type, req.body) }));
router.get('/referrals', (req, res) => res.json({ rewards: [{ name: 'Refer and earn', amount: 500 }, { name: 'Vendor referral reward', amount: 1500 }, { name: 'User referral discount', amount: 250 }], users: db.users.map(({ name, referralCode }) => ({ name, referralCode })) }));

// ============================================================
// ADMIN ROUTES (Protected with authenticateJWT + requireAdmin)
// ============================================================

// Analytics Dashboard
router.get('/admin/analytics', authenticateJWT, requireAdmin, getAnalytics);

// User Management
router.get('/admin/users', authenticateJWT, requireAdmin, getUsers);
router.patch('/admin/users/:id', authenticateJWT, requireAdmin, updateUser);
router.delete('/admin/users/:id', authenticateJWT, requireAdmin, deleteUser);

// Business Management
router.get('/admin/businesses', authenticateJWT, requireAdmin, getBusinesses);
router.patch('/admin/businesses/:id', authenticateJWT, requireAdmin, updateBusiness);
router.delete('/admin/businesses/:id', authenticateJWT, requireAdmin, deleteBusiness);

// Category Management
router.get('/admin/categories', authenticateJWT, requireAdmin, getCategories);
router.post('/admin/categories', authenticateJWT, requireAdmin, createCategory);

// Lead Management
router.get('/admin/leads', authenticateJWT, requireAdmin, getLeads);
router.patch('/admin/leads/:id', authenticateJWT, requireAdmin, updateLead);

// Review Management
router.get('/admin/reviews', authenticateJWT, requireAdmin, getReviews);
router.delete('/admin/reviews/:id', authenticateJWT, requireAdmin, deleteReview);

// Fake Data Management
router.get('/admin/fake-data', authenticateJWT, requireAdmin, getFakeData);
router.post('/admin/fake-data/bulk-delete', authenticateJWT, requireAdmin, bulkDeleteFakeData);

// Reports
router.get('/admin/reports', authenticateJWT, requireAdmin, getReports);

export default router;
