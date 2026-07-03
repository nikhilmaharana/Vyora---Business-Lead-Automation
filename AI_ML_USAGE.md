# AI/ML Algorithm Usage in Vyora Business Lead Generation System

## Overview
This document details where AI/ML inspired algorithms and intelligent scoring mechanisms are used throughout the platform.

---

## 1. Hybrid Search Ranking (`smart.js` → `searchBusinesses`)
**File:** `business_backend/server/src/utils/smart.js`

The core search uses a **weighted multi-signal scoring model** similar to ML ranking algorithms:

### Signals Used:
| Signal | Weight | Description |
|--------|--------|-------------|
| **Text Similarity** | 25% | Semantic keyword matching with fuzzy/partial matching and n-gram scoring |
| **Location Fit** | 15% | Geo-location relevance scoring |
| **Budget Fit** | 12% | Budget range compatibility scoring |
| **Trust Score** | 20% | Rating × 3 + verified badge bonus |
| **Response Speed** | 12% | Inverse response time scoring |
| **Conversion Rate** | 8% | Historical conversion performance |
| **Profile Completion** | 8% | Profile completeness score |

### Algorithm Features:
- `similarity()` function implements fuzzy matching with:
  - Exact phrase matching bonus (+0.3)
  - Direct token hits (weighted 0.5 each)
  - Partial token matching (weighted 0.2 each)
  - N-gram (bigram) similarity scoring (+0.15 per match)

---

## 2. Lead Scoring Engine (`smart.js` → `leadScore`)
**File:** `business_backend/server/src/utils/smart.js`

Rule-based scoring system that classifies leads as **Hot**, **Warm**, or **Cold**:

| Criteria | Score |
|----------|-------|
| Urgent timeline (today/urgent) | +30 |
| High budget (>₹75,000) | +25 |
| Medium budget (₹10,000-₹75,000) | +15 |
| High-intent source (WhatsApp/Call) | +10 |
| Verified customer | +10 |

**Thresholds:**
- **Hot:** Score ≥ 40
- **Warm:** Score ≥ 20
- **Cold:** Below 20

---

## 3. Business Matching Engine (`smart.js` → `matchBusinesses`)
Uses the search ranking algorithm to automatically match incoming leads to the most relevant businesses based on:
- Category match
- Location proximity
- Budget compatibility
- SmartScore ranking

Results are limited by `platformConfig.leadDistributionLimit`.

---

## 4. AI Suggestions Engine (`smart.js` → `aiSuggestion`)
NLP-style template generation for:
- **Auto-replies**: Context-aware response generation based on lead requirement
- **Quote generation**: Budget-aware quotation suggestions
- **Title generation**: SEO-optimized listing titles
- **Tag suggestions**: Relevant keyword extraction
- **Chatbot responses**: Contextual conversation starters

---

## 5. Profile Completeness Scoring (`smart.js` → `profileSuggestions`)
Intelligent gap analysis that identifies missing profile elements and generates actionable suggestions:
- KYC status verification
- Website publication status
- Social media connection status
- Pricing/gallery/FAQ completeness
- Working hours availability

---

## 6. Category Ranking (`api.js` → `GET /categories`)
**File:** `business_backend/server/src/routes/api.js`

Hybrid scoring algorithm for category listing:
- **Query Relevance**: Semantic matching (exact: 100pts, partial: 85pts, includes: 70pts, token match: 60% ratio)
- **Popularity Score**: businessCount × 12 + listings × 5 (capped at 100)
- **Rating Score**: avgRating × 20
- **Trust Score**: verifiedCount × 15 (capped at 30)
- **Combined**: `queryRelevance + trustScore` (with query) or `popularity×0.35 + rating×0.45 + trust×0.2` (browse mode)

---

## 7. Trending Categories (`smart.js` → `getTrendingCategories`)
Lead volume-based trend detection:
- Counts leads per category
- Ranks by frequency
- Returns top 8 trending categories

This powers the "Trending Services" feature.

---

## 8. Collaborative Filtering (`smart.js` → `getCategoryRecommendations`)
Simple collaborative filtering that recommends businesses in the same category, sorted by rating:
- Groups businesses by category
- Sorts by rating (descending)
- Returns top 4 recommendations excluding current business

---

## 9. Vendor Analytics (`smart.js` → `analyticsForBusiness`)
Performance scoring algorithm:
```
performanceScore = rating × 12 + conversionRate + (verifiedBadge ? 10 : 0) + (profileCompletion / 10)
```
Ranges from 0-100, providing a unified vendor performance metric.

---

## 10. Smart Search API (`api.js` → `GET /search/smart`)
Combines search results with AI-powered recommendations:
- Analyzes search query
- Finds related categories based on service keyword matches
- Returns both search results and category recommendations
- Algorithm metadata included in API response

---

## Summary
The platform uses a **hybrid approach** combining:
- **Rule-based expert systems** (lead scoring, profile suggestions)
- **Weighted multi-signal ranking** (search, matching)
- **Semantic similarity algorithms** (text matching, n-gram)
- **Simple collaborative filtering** (recommendations)
- **Trend detection** (trending categories)
- **Templated NLP** (auto-replies, chatbot)

This provides intelligent automation without requiring external ML model dependencies, making the system lightweight yet capable of smart decision-making.