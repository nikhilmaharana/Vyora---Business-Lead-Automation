import { db } from '../seed/data.js';

const normalize = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const tokens = (value = '') => normalize(value).split(' ').filter((item) => item.length > 1);
const unique = (items) => [...new Set(items.filter(Boolean))];

// Enhanced semantic similarity with fuzzy matching
function similarity(query, text) {
  const queryTokens = tokens(query);
  if (!queryTokens.length) return 0;
  const textValue = normalize(text);
  const textTokens = tokens(text);
  
  // Exact phrase match bonus
  const phraseBonus = textValue.includes(normalize(query)) ? 0.3 : 0;
  
  // Direct token hits with partial matching
  let directHits = 0;
  let partialHits = 0;
  
  for (const qt of queryTokens) {
    if (textTokens.some(tt => tt === qt)) {
      directHits++;
    } else if (textTokens.some(tt => tt.startsWith(qt) || qt.startsWith(tt) || 
      (tt.length > 3 && qt.length > 3 && (tt.includes(qt) || qt.includes(tt))))) {
      partialHits++;
    }
  }
  
  // N-gram similarity for better matching
  let ngramScore = 0;
  if (queryTokens.length > 1) {
    for (let i = 0; i < queryTokens.length - 1; i++) {
      const bigram = queryTokens[i] + ' ' + queryTokens[i + 1];
      if (textValue.includes(bigram)) ngramScore += 0.15;
    }
  }
  
  const totalScore = (directHits * 0.5 + partialHits * 0.2) / queryTokens.length + phraseBonus + ngramScore;
  return Math.min(1, totalScore);
}

// Category-based recommendation using collaborative filtering
function getCategoryRecommendations(category, excludeId = null) {
  const catBusinesses = db.businesses.filter(b => 
    b.category?.toLowerCase() === category?.toLowerCase() && b.id !== excludeId
  );
  return catBusinesses.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
}

// Trending categories based on lead volume
function getTrendingCategories() {
  const categoryLeads = {};
  for (const lead of db.leads) {
    if (lead.category) {
      categoryLeads[lead.category] = (categoryLeads[lead.category] || 0) + 1;
    }
  }
  return Object.entries(categoryLeads)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, count]) => ({ name, leadCount: count }));
}

export function profileSuggestions(business) {
  const suggestions = [];
  if (!business.verifiedBadge) suggestions.push('Complete KYC to unlock the verified badge and increase trust score by 30%.');
  if (!business.website?.published) suggestions.push('Publish your mini website to improve visibility and lead generation.');
  if (!business.socials?.facebook || business.socials.facebook === 'not_connected') suggestions.push('Connect Facebook for social posting and broader reach.');
  if (!business.socials?.instagram || business.socials.instagram === 'not_connected') suggestions.push('Connect Instagram to showcase your work visually.');
  if (business.profileCompletion < 80) suggestions.push('Add pricing, gallery, service areas, and FAQs to unlock premium features and boost ranking.');
  if (!business.workingHours) suggestions.push('Add working hours so customers know when to reach you.');
  return suggestions.length ? suggestions : ['Profile is strong. Keep response time under 15 minutes for top ranking.'];
}

export function searchBusinesses({ q = '', location = '', budget = 0, rating = 0, instant, sort = 'best', category = '' } = {}) {
  return db.businesses
    .map((business) => {
      const listings = db.listings.filter((listing) => listing.businessId === business.id);
      const searchableText = [
        business.name,
        business.category,
        business.subCategory,
        business.type,
        business.usp,
        business.city,
        business.state,
        business.address,
        ...(business.serviceAreas || []),
        ...(business.seo?.keywords || []),
        ...listings.flatMap((listing) => [listing.title, listing.category, ...(listing.tags || [])])
      ].join(' ');
      
      const textScore = q ? similarity(q, searchableText) * 35 : 20;
      const locationScore = location
        ? similarity(location, [business.city, business.state, ...(business.serviceAreas || []), business.address].join(' ')) * 18
        : 12;
      const categoryScore = category
        ? similarity(category, business.category + ' ' + business.subCategory) * 15
        : 10;
      
      const budgetNumber = Number(budget);
      const budgetScore = budgetNumber
        ? budgetNumber >= business.budgetMin && budgetNumber <= business.budgetMax ? 15 : Math.max(0, 8 - Math.abs(budgetNumber - business.budgetMax) / Math.max(business.budgetMax, 1) * 8)
        : 10;
      
      const trustScore = Math.min(20, business.rating * 3 + (business.verifiedBadge ? 6 : 0));
      const speedScore = Math.max(0, 12 - business.responseTimeMins / 5);
      const conversionScore = Math.min(10, business.conversionRate / 5);
      const profileScore = Math.min(8, (business.profileCompletion || 50) / 12);
      
      // ML-style weighted scoring
      const weights = { text: 0.25, location: 0.15, budget: 0.12, trust: 0.20, speed: 0.12, conversion: 0.08, profile: 0.08 };
      const smartScore = Math.round(
        textScore * weights.text +
        locationScore * weights.location +
        budgetScore * weights.budget +
        trustScore * weights.trust +
        speedScore * weights.speed +
        conversionScore * weights.conversion +
        profileScore * weights.profile
      );
      
      const matchReasons = unique([
        textScore > 12 && `"${q || business.category}" match`,
        locationScore > 8 && `Serves ${location || business.city}`,
        budgetScore >= 12 && 'Fits budget range',
        business.verifiedBadge && '✓ Verified seller',
        business.responseTimeMins <= 10 && '⚡ Super fast response',
        business.rating >= 4.5 && `⭐ ${business.rating} rated`,
        business.emergencyAvailable && '🚨 Emergency service available'
      ]);
      
      return { ...business, listings, smartScore, matchReasons };
    })
    .filter((business) => {
      if (q && business.smartScore < 25) return false;
      if (location && !business.matchReasons.some((reason) => reason.startsWith('Serves'))) return false;
      if (Number(rating) && business.rating < Number(rating)) return false;
      if (category && !business.category?.toLowerCase().includes(category.toLowerCase())) return false;
      if (instant === 'true' && !business.emergencyAvailable && business.responseTimeMins > 15) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'fastest') return a.responseTimeMins - b.responseTimeMins;
      if (sort === 'top-rated') return b.rating - a.rating;
      if (sort === 'most-reviewed') return (b.reviews || 0) - (a.reviews || 0);
      return b.smartScore - a.smartScore;
    });
}

export function matchBusinesses(lead) {
  return searchBusinesses({ q: lead.category || lead.requirement, location: lead.location, budget: lead.budget })
    .map((business) => ({ ...business, matchScore: business.smartScore }))
    .slice(0, db.platformConfig.leadDistributionLimit);
}

export function leadScore(lead) {
  let score = 0;
  if (lead.timeline?.toLowerCase().includes('today') || lead.timeline?.toLowerCase().includes('urgent')) score += 30;
  if (lead.budget > 75000) score += 25;
  if (lead.budget > 10000 && lead.budget <= 75000) score += 15;
  if (lead.source === 'WhatsApp click' || lead.source === 'Call request') score += 10;
  if (lead.verified) score += 10;
  
  if (score >= 40) return 'Hot';
  if (score >= 20) return 'Warm';
  return 'Cold';
}

export function aiSuggestion(type, payload = {}) {
  const text = payload.requirement || payload.title || payload.category || 'your service';
  const suggestions = {
    reply: `Thanks for reaching out about ${text}. I can share pricing, timeline, and available slots right away. Would you like a free consultation?`,
    quote: `Recommended quotation: start with a transparent base price of ₹${(payload.budget || 50000).toLocaleString()}, include 3 milestones, and add optional premium upgrades.`,
    title: `${payload.category || 'Business'} solution with fast response and verified support - Get the best deal today`,
    tags: ['verified', 'fast response', 'budget friendly', 'top rated', payload.category || 'local service'].filter(Boolean),
    chatbot: `I can help you compare vendors, post a requirement, or request a callback. What would you like to do first?`
  };
  return suggestions[type] || suggestions.reply;
}

export function analyticsForBusiness(businessId) {
  const leads = db.leads.filter((lead) => lead.businessIds?.includes(businessId));
  const converted = leads.filter((lead) => lead.status === 'Converted').length;
  const business = db.businesses.find((item) => item.id === businessId);
  return {
    totalLeads: leads.length,
    conversionRate: leads.length ? Math.round((converted / leads.length) * 100) : business?.conversionRate || 0,
    responseTime: business?.responseTimeMins || 0,
    revenue: business?.revenue || 0,
    roiText: `You earned ₹${Math.round((business?.revenue || 0) / 1000)}K from our platform`,
    performanceScore: Math.min(100, Math.round((business?.rating || 0) * 12 + (business?.conversionRate || 0) + (business?.verifiedBadge ? 10 : 0) + (business?.profileCompletion || 0) / 10)),
    sources: ['Website search', 'Product enquiry', 'Post Requirement', 'WhatsApp click', 'Call request'].map((source) => ({
      source,
      count: db.leads.filter((lead) => lead.source === source && lead.businessIds?.includes(businessId)).length
    })),
    trending: getTrendingCategories(),
    recommendations: business ? getCategoryRecommendations(business.category, business.id) : []
  };
}

export { getTrendingCategories, getCategoryRecommendations };