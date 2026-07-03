import { nanoid } from 'nanoid';
import { db } from '../seed/data.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Business from '../models/Business.js';
import Lead from '../models/Lead.js';
import Listing from '../models/Listing.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * GET /api/admin/analytics - Complete admin analytics dashboard
 */
export async function getAnalytics(req, res) {
  try {
    const users = db.users || [];
    const businesses = db.businesses || [];
    const leads = db.leads || [];
    const listings = db.listings || [];
    const reviews = db.reviews || [];

    // User stats
    const totalUsers = users.length;
    const totalVendors = users.filter(u => u.role === 'business_owner').length;
    const totalAdmins = users.filter(u => u.role === 'admin' || u.role === 'super_admin').length;
    const activeUsers = users.filter(u => !u.blocked).length;

    // Vendor stats
    const pendingVendors = users.filter(u => u.role === 'business_owner' && u.vendorStatus === 'pending_approval').length;
    const approvedVendors = users.filter(u => u.role === 'business_owner' && u.vendorStatus === 'approved').length;
    const rejectedVendors = users.filter(u => u.role === 'business_owner' && u.vendorStatus === 'rejected').length;

    // Business stats
    const totalBusinesses = businesses.length;
    const approvedBusinesses = businesses.filter(b => b.approved).length;
    const pendingBusinesses = businesses.filter(b => !b.approved).length;
    const verifiedBusinesses = businesses.filter(b => b.verifiedBadge).length;
    const featuredBusinesses = businesses.filter(b => b.featured).length;

    // Lead stats
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
    const convertedLeads = leads.filter(l => l.status === 'Converted').length;
    const followUpLeads = leads.filter(l => l.status === 'Follow-up').length;
    const hotLeads = leads.filter(l => l.score === 'Hot').length;
    const warmLeads = leads.filter(l => l.score === 'Warm').length;
    const leadConversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    // Listing stats
    const totalListings = listings.length;
    const approvedListings = listings.filter(l => l.status === 'approved').length;
    const pendingListings = listings.filter(l => l.status === 'pending approval').length;

    // Review stats
    const totalReviews = reviews.length;
    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) * 10) / 10
      : 0;

    // Revenue stats
    const totalRevenue = businesses.reduce((s, b) => s + (b.revenue || 0), 0);
    const avgRevenue = businesses.length > 0 ? Math.round(totalRevenue / businesses.length) : 0;

    // Category performance
    const categoryStats = {};
    for (const b of businesses) {
      if (!b.category) continue;
      if (!categoryStats[b.category]) {
        categoryStats[b.category] = { name: b.category, businessCount: 0, totalRevenue: 0, avgRating: 0, totalRating: 0, leadCount: 0 };
      }
      categoryStats[b.category].businessCount += 1;
      categoryStats[b.category].totalRevenue += b.revenue || 0;
      categoryStats[b.category].totalRating += b.rating || 0;
    }
    for (const l of leads) {
      if (!l.category) continue;
      if (!categoryStats[l.category]) {
        categoryStats[l.category] = { name: l.category, businessCount: 0, totalRevenue: 0, avgRating: 0, totalRating: 0, leadCount: 0 };
      }
      categoryStats[l.category].leadCount += 1;
    }
    for (const cat of Object.values(categoryStats)) {
      cat.avgRating = cat.businessCount > 0 ? Math.round((cat.totalRating / cat.businessCount) * 10) / 10 : 0;
    }

    // Top performing vendors
    const topVendors = businesses
      .filter(b => b.approved)
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 10)
      .map(b => ({
        id: b.id,
        name: b.name,
        ownerName: b.ownerName,
        category: b.category,
        city: b.city,
        rating: b.rating,
        revenue: b.revenue || 0,
        conversionRate: b.conversionRate || 0,
        profileCompletion: b.profileCompletion || 0,
        plan: b.plan || 'Free'
      }));

    // Growth metrics (simulated monthly data based on timestamps)
    const monthlyRegistrations = {};
    for (const u of users) {
      if (!u.createdAt) continue;
      const month = u.createdAt.slice(0, 7);
      monthlyRegistrations[month] = (monthlyRegistrations[month] || 0) + 1;
    }

    // Fake data stats
    const fakeUsers = users.filter(u => u.isFakeAccount).length;
    const fakeBusinesses = businesses.filter(b => b.isFakeBusiness).length;

    return res.json({
      overview: {
        totalUsers,
        totalVendors,
        totalAdmins,
        activeUsers,
        totalBusinesses,
        approvedBusinesses,
        pendingBusinesses,
        verifiedBusinesses,
        featuredBusinesses,
        totalLeads,
        totalListings,
        totalReviews,
        totalRevenue,
        avgRevenue,
        avgRating,
        leadConversionRate,
        fakeUsers,
        fakeBusinesses
      },
      vendors: {
        total: totalVendors,
        pending: pendingVendors,
        approved: approvedVendors,
        rejected: rejectedVendors
      },
      leads: {
        total: totalLeads,
        new: newLeads,
        contacted: contactedLeads,
        converted: convertedLeads,
        followUp: followUpLeads,
        hot: hotLeads,
        warm: warmLeads,
        conversionRate: leadConversionRate
      },
      listings: {
        total: totalListings,
        approved: approvedListings,
        pending: pendingListings
      },
      categories: Object.values(categoryStats).sort((a, b) => b.businessCount - a.businessCount),
      topVendors,
      monthlyRegistrations: Object.entries(monthlyRegistrations)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({ month, count }))
    });
  } catch (error) {
    console.error('[Admin Analytics] Error:', error);
    return res.status(500).json({ message: 'Failed to fetch analytics' });
  }
}

/**
 * GET /api/admin/users - Get all users with filters
 */
export async function getUsers(req, res) {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    let filteredUsers = [...(db.users || [])];

    if (search) {
      const q = search.toLowerCase();
      filteredUsers = filteredUsers.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q)
      );
    }
    if (role) {
      filteredUsers = filteredUsers.filter(u => u.role === role);
    }
    if (status === 'active') {
      filteredUsers = filteredUsers.filter(u => !u.blocked);
    } else if (status === 'blocked') {
      filteredUsers = filteredUsers.filter(u => u.blocked);
    } else if (status === 'verified') {
      filteredUsers = filteredUsers.filter(u => u.verified);
    } else if (status === 'fake') {
      filteredUsers = filteredUsers.filter(u => u.isFakeAccount);
    }

    const total = filteredUsers.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedUsers = filteredUsers
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(startIndex, startIndex + parseInt(limit))
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        verified: u.verified,
        blocked: u.blocked,
        vendorStatus: u.vendorStatus,
        isFakeAccount: u.isFakeAccount,
        createdAt: u.createdAt,
        activity: u.activity?.slice(-3) || []
      }));

    return res.json({
      users: paginatedUsers,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('[Admin Users] Error:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
}

/**
 * PATCH /api/admin/users/:id - Update user
 */
export async function updateUser(req, res) {
  try {
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, phone, role, blocked, verified, isFakeAccount } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined && ['user', 'business_owner', 'admin', 'super_admin'].includes(role)) user.role = role;
    if (blocked !== undefined) user.blocked = blocked;
    if (verified !== undefined) user.verified = verified;
    if (isFakeAccount !== undefined) user.isFakeAccount = isFakeAccount;

    return res.json({ user, message: 'User updated successfully' });
  } catch (error) {
    console.error('[Admin Update User] Error:', error);
    return res.status(500).json({ message: 'Failed to update user' });
  }
}

/**
 * DELETE /api/admin/users/:id - Delete user
 */
export async function deleteUser(req, res) {
  try {
    const index = db.users.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'User not found' });

    const [deletedUser] = db.users.splice(index, 1);

    // Also remove associated businesses
    if (deletedUser.role === 'business_owner') {
      const bizIndex = db.businesses.findIndex(b => b.ownerId === deletedUser.id);
      if (bizIndex !== -1) db.businesses.splice(bizIndex, 1);
    }

    return res.json({ message: 'User deleted successfully', userId: req.params.id });
  } catch (error) {
    console.error('[Admin Delete User] Error:', error);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
}

/**
 * GET /api/admin/businesses - Get all businesses
 */
export async function getBusinesses(req, res) {
  try {
    const { search, category, status, page = 1, limit = 20 } = req.query;
    let filtered = [...(db.businesses || [])];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(b =>
        b.name?.toLowerCase().includes(q) ||
        b.ownerName?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q)
      );
    }
    if (category) {
      filtered = filtered.filter(b => b.category === category);
    }
    if (status === 'approved') {
      filtered = filtered.filter(b => b.approved);
    } else if (status === 'pending') {
      filtered = filtered.filter(b => !b.approved);
    } else if (status === 'featured') {
      filtered = filtered.filter(b => b.featured);
    } else if (status === 'verified') {
      filtered = filtered.filter(b => b.verifiedBadge);
    } else if (status === 'fake') {
      filtered = filtered.filter(b => b.isFakeBusiness);
    }

    const total = filtered.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginated = filtered
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(startIndex, startIndex + parseInt(limit));

    return res.json({
      businesses: paginated,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('[Admin Businesses] Error:', error);
    return res.status(500).json({ message: 'Failed to fetch businesses' });
  }
}

/**
 * PATCH /api/admin/businesses/:id - Update business
 */
export async function updateBusiness(req, res) {
  try {
    const business = db.businesses.find(b => b.id === req.params.id);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    const { name, category, approved, verifiedBadge, featured, isFakeBusiness } = req.body;
    if (name !== undefined) business.name = name;
    if (category !== undefined) business.category = category;
    if (approved !== undefined) business.approved = approved;
    if (verifiedBadge !== undefined) business.verifiedBadge = verifiedBadge;
    if (featured !== undefined) business.featured = featured;
    if (isFakeBusiness !== undefined) business.isFakeBusiness = isFakeBusiness;

    return res.json({ business, message: 'Business updated successfully' });
  } catch (error) {
    console.error('[Admin Update Business] Error:', error);
    return res.status(500).json({ message: 'Failed to update business' });
  }
}

/**
 * DELETE /api/admin/businesses/:id - Delete business
 */
export async function deleteBusiness(req, res) {
  try {
    const index = db.businesses.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Business not found' });
    db.businesses.splice(index, 1);
    return res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('[Admin Delete Business] Error:', error);
    return res.status(500).json({ message: 'Failed to delete business' });
  }
}

/**
 * GET /api/admin/categories - Get all categories with stats
 */
export async function getCategories(req, res) {
  try {
    const categories = new Map();
    const businesses = db.businesses || [];

    for (const b of businesses) {
      if (!b.category) continue;
      if (!categories.has(b.category)) {
        categories.set(b.category, {
          name: b.category,
          businessCount: 0,
          totalRevenue: 0,
          avgRating: 0,
          totalRating: 0,
          leadCount: 0,
          verifiedCount: 0,
          subCategories: new Set(),
          cities: new Set()
        });
      }
      const entry = categories.get(b.category);
      entry.businessCount += 1;
      entry.totalRevenue += b.revenue || 0;
      entry.totalRating += b.rating || 0;
      if (b.verifiedBadge) entry.verifiedCount += 1;
      if (b.subCategory) entry.subCategories.add(b.subCategory);
      if (b.city) entry.cities.add(b.city);
    }

    const leads = db.leads || [];
    for (const l of leads) {
      if (!l.category || !categories.has(l.category)) continue;
      categories.get(l.category).leadCount += 1;
    }

    const result = Array.from(categories.values())
      .map(c => ({
        ...c,
        avgRating: c.businessCount > 0 ? Math.round((c.totalRating / c.businessCount) * 10) / 10 : 0,
        subCategories: Array.from(c.subCategories).slice(0, 10),
        cities: Array.from(c.cities).slice(0, 10)
      }))
      .sort((a, b) => b.businessCount - a.businessCount);

    return res.json({ categories: result, total: result.length });
  } catch (error) {
    console.error('[Admin Categories] Error:', error);
    return res.status(500).json({ message: 'Failed to fetch categories' });
  }
}

/**
 * POST /api/admin/categories - Create category
 */
export async function createCategory(req, res) {
  try {
    const { name, icon, description, featured } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    // Category is not stored separately - we just return success
    // Categories are derived from business categories
    return res.json({
      category: {
        id: nanoid(),
        name: name.trim(),
        icon: icon || '',
        description: description || '',
        featured: featured || false,
        createdAt: new Date().toISOString()
      },
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('[Admin Create Category] Error:', error);
    return res.status(500).json({ message: 'Failed to create category' });
  }
}

/**
 * GET /api/admin/leads - Get all leads with filters
 */
export async function getLeads(req, res) {
  try {
    const { search, status, score, page = 1, limit = 20 } = req.query;
    let filtered = [...(db.leads || [])];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.mobile?.includes(q) ||
        l.category?.toLowerCase().includes(q) ||
        l.requirement?.toLowerCase().includes(q)
      );
    }
    if (status) {
      filtered = filtered.filter(l => l.status?.toLowerCase() === status.toLowerCase());
    }
    if (score) {
      filtered = filtered.filter(l => l.score?.toLowerCase() === score.toLowerCase());
    }

    const total = filtered.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginated = filtered
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(startIndex, startIndex + parseInt(limit));

    return res.json({
      leads: paginated,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('[Admin Leads] Error:', error);
    return res.status(500).json({ message: 'Failed to fetch leads' });
  }
}

/**
 * PATCH /api/admin/leads/:id - Update lead
 */
export async function updateLead(req, res) {
  try {
    const lead = db.leads.find(l => l.id === req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const { status, score, assignedTo, notes } = req.body;
    if (status !== undefined) lead.status = status;
    if (score !== undefined) lead.score = score;
    if (assignedTo !== undefined) lead.assignedTo = assignedTo;
    if (notes !== undefined) lead.notes = [...(lead.notes || []), notes];

    return res.json({ lead, message: 'Lead updated successfully' });
  } catch (error) {
    console.error('[Admin Update Lead] Error:', error);
    return res.status(500).json({ message: 'Failed to update lead' });
  }
}

/**
 * GET /api/admin/reviews - Get all reviews
 */
export async function getReviews(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const reviews = db.reviews || [];
    const total = reviews.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginated = reviews.slice(startIndex, startIndex + parseInt(limit));

    return res.json({
      reviews: paginated,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('[Admin Reviews] Error:', error);
    return res.status(500).json({ message: 'Failed to fetch reviews' });
  }
}

/**
 * DELETE /api/admin/reviews/:id - Delete review
 */
export async function deleteReview(req, res) {
  try {
    const index = db.reviews?.findIndex(r => r.id === req.params.id);
    if (index === -1 || index === undefined) return res.status(404).json({ message: 'Review not found' });
    db.reviews.splice(index, 1);
    return res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('[Admin Delete Review] Error:', error);
    return res.status(500).json({ message: 'Failed to delete review' });
  }
}

/**
 * GET /api/admin/fake-data - Get all fake/flagged data
 */
export async function getFakeData(req, res) {
  try {
    const fakeUsers = (db.users || []).filter(u => u.isFakeAccount);
    const fakeBusinesses = (db.businesses || []).filter(b => b.isFakeBusiness);
    const flaggedListings = (db.listings || []).filter(l => l.duplicateWarning);

    return res.json({
      fakeUsers,
      fakeBusinesses,
      flaggedListings,
      stats: {
        totalFakeUsers: fakeUsers.length,
        totalFakeBusinesses: fakeBusinesses.length,
        totalFlaggedListings: flaggedListings.length
      }
    });
  } catch (error) {
    console.error('[Admin Fake Data] Error:', error);
    return res.status(500).json({ message: 'Failed to fetch fake data' });
  }
}

/**
 * POST /api/admin/fake-data/bulk-delete - Delete all fake data
 */
export async function bulkDeleteFakeData(req, res) {
  try {
    const { type } = req.body;

    if (type === 'users' || type === 'all') {
      db.users = (db.users || []).filter(u => !u.isFakeAccount);
    }
    if (type === 'businesses' || type === 'all') {
      db.businesses = (db.businesses || []).filter(b => !b.isFakeBusiness);
    }
    if (type === 'listings' || type === 'all') {
      db.listings = (db.listings || []).filter(l => !l.duplicateWarning);
    }

    return res.json({ message: `Fake ${type || 'data'} deleted successfully` });
  } catch (error) {
    console.error('[Admin Bulk Delete Fake Data] Error:', error);
    return res.status(500).json({ message: 'Failed to delete fake data' });
  }
}

/**
 * GET /api/admin/reports - Generate reports
 */
export async function getReports(req, res) {
  try {
    const { type = 'summary', startDate, endDate } = req.query;
    const users = db.users || [];
    const businesses = db.businesses || [];
    const leads = db.leads || [];
    const listings = db.listings || [];

    // Filter by date range if provided
    let filteredUsers = users;
    let filteredBusinesses = businesses;
    let filteredLeads = leads;

    if (startDate) {
      const start = new Date(startDate);
      filteredUsers = filteredUsers.filter(u => new Date(u.createdAt || 0) >= start);
      filteredBusinesses = filteredBusinesses.filter(b => new Date(b.createdAt || 0) >= start);
      filteredLeads = filteredLeads.filter(l => new Date(l.createdAt || 0) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      filteredUsers = filteredUsers.filter(u => new Date(u.createdAt || 0) <= end);
      filteredBusinesses = filteredBusinesses.filter(b => new Date(b.createdAt || 0) <= end);
      filteredLeads = filteredLeads.filter(l => new Date(l.createdAt || 0) <= end);
    }

    return res.json({
      type,
      period: { startDate, endDate },
      summary: {
        newUsers: filteredUsers.length,
        newBusinesses: filteredBusinesses.length,
        newLeads: filteredLeads.length,
        activeVendors: filteredUsers.filter(u => u.role === 'business_owner' && u.vendorStatus === 'approved').length,
        totalRevenue: filteredBusinesses.reduce((s, b) => s + (b.revenue || 0), 0)
      },
      usersByRole: {
        users: filteredUsers.filter(u => u.role === 'user').length,
        vendors: filteredUsers.filter(u => u.role === 'business_owner').length,
        admins: filteredUsers.filter(u => u.role === 'admin' || u.role === 'super_admin').length
      },
      businessesByStatus: {
        approved: filteredBusinesses.filter(b => b.approved).length,
        pending: filteredBusinesses.filter(b => !b.approved).length,
        verified: filteredBusinesses.filter(b => b.verifiedBadge).length
      },
      leadsByStatus: {
        new: filteredLeads.filter(l => l.status === 'New').length,
        contacted: filteredLeads.filter(l => l.status === 'Contacted').length,
        converted: filteredLeads.filter(l => l.status === 'Converted').length,
        followUp: filteredLeads.filter(l => l.status === 'Follow-up').length
      }
    });
  } catch (error) {
    console.error('[Admin Reports] Error:', error);
    return res.status(500).json({ message: 'Failed to generate reports' });
  }
}