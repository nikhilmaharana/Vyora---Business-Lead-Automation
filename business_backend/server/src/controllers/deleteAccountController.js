import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import EmailVerification from '../models/EmailVerification.js';
import User from '../models/User.js';
import Business from '../models/Business.js';
import Lead from '../models/Lead.js';
import Listing from '../models/Listing.js';
import { db } from '../seed/data.js';

/**
 * Helper to check if MongoDB is connected
 */
function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * Execute a MongoDB operation with a timeout
 */
async function withMongoTimeout(operation, timeoutMs = 8000) {
  if (!isMongoConnected()) {
    throw new Error('MongoDB is not connected');
  }
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('MongoDB operation timed out')), timeoutMs);
  });
  return await Promise.race([operation(), timeoutPromise]);
}

function getOwnedBusinessIds(userId, memoryUser, mongoBusinesses = []) {
  const ids = new Set();
  if (memoryUser?.businessId) ids.add(memoryUser.businessId);
  mongoBusinesses.forEach((business) => {
    if (business?.id) ids.add(business.id);
  });
  db.businesses
    .filter((business) => business.ownerId === userId)
    .forEach((business) => ids.add(business.id));
  return [...ids];
}

async function deleteMongoAccount({ userId, userEmail, mongoUser }) {
  const session = await mongoose.startSession();
  const deletionStats = {
    users: 0,
    businesses: 0,
    listings: 0,
    leads: 0,
    emailVerifications: 0
  };
  let ownedBusinesses = [];

  try {
    await withMongoTimeout(async () => {
      await session.withTransaction(async () => {
        ownedBusinesses = await Business.find({ ownerId: userId }).session(session).lean();
        const ownedBusinessIds = ownedBusinesses.map((business) => business.id).filter(Boolean);

        console.log('[DELETE ACCOUNT] MongoDB transaction cleanup targets', {
          userId,
          ownedBusinessIds
        });

        const leadFilter = ownedBusinessIds.length
          ? { $or: [{ customerId: userId }, { businessIds: { $in: ownedBusinessIds } }] }
          : { customerId: userId };

        const listingFilter = ownedBusinessIds.length
          ? { $or: [{ ownerId: userId }, { businessId: { $in: ownedBusinessIds } }] }
          : { ownerId: userId };

        const [leadResult, listingResult, businessResult, verificationResult, userResult] = await Promise.all([
          Lead.deleteMany(leadFilter).session(session),
          Listing.deleteMany(listingFilter).session(session),
          Business.deleteMany({ ownerId: userId }).session(session),
          userEmail ? EmailVerification.deleteMany({ email: userEmail }).session(session) : Promise.resolve({ deletedCount: 0 }),
          User.deleteOne(mongoUser?._id ? { _id: mongoUser._id } : { id: userId }).session(session)
        ]);

        deletionStats.leads = leadResult.deletedCount || 0;
        deletionStats.listings = listingResult.deletedCount || 0;
        deletionStats.businesses = businessResult.deletedCount || 0;
        deletionStats.emailVerifications = verificationResult.deletedCount || 0;
        deletionStats.users = userResult.deletedCount || 0;

        if (!deletionStats.users) {
          throw new Error('MongoDB user deletion did not delete any user records.');
        }
      });
    }, 15000);
  } finally {
    await session.endSession();
  }

  return { deletionStats, ownedBusinessIds: ownedBusinesses.map((business) => business.id).filter(Boolean) };
}

/**
 * DELETE /api/auth/delete-account
 * Permanently deletes the authenticated user's account and all associated data.
 * Requires the user to send a confirmation phrase: "DELETE MY ACCOUNT"
 */
export async function deleteAccount(req, res) {
  try {
    const { confirmation } = req.body;

    console.log('[DELETE ACCOUNT] Request received', {
      hasBody: Boolean(req.body),
      bodyKeys: Object.keys(req.body || {}),
      confirmationMatches: confirmation?.trim() === 'DELETE MY ACCOUNT'
    });

    // Require exact confirmation phrase for safety
    if (!confirmation || confirmation.trim() !== 'DELETE MY ACCOUNT') {
      console.log('[DELETE ACCOUNT] Invalid confirmation phrase');
      return res.status(400).json({
        message: 'Please type "DELETE MY ACCOUNT" to confirm permanent account deletion.'
      });
    }

    // Get authenticated user from JWT (set by auth middleware)
    const authUser = req.user;
    console.log('[DELETE ACCOUNT] Auth user from middleware', { id: authUser?.id, email: authUser?.email, role: authUser?.role });

    if (!authUser || !authUser.id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userId = authUser.id;
    const userEmail = authUser.email ? authUser.email.toLowerCase().trim() : '';

    console.log(`[DELETE ACCOUNT] Looking up user. userId=${userId}, userEmail=${userEmail}, mongoConnected=${isMongoConnected()}`);

    // Find the user in both MongoDB and in-memory store
    let mongoUser = null;
    let mongoLookupFailed = false;
    if (isMongoConnected()) {
      try {
        // IMPORTANT: User.id is a nanoid string stored in a field called "id", NOT in MongoDB's _id (which is ObjectId).
        // Searching by _id with a nanoid string throws a Mongoose CastError.
        mongoUser = await withMongoTimeout(() => User.findOne({ id: userId }).lean().maxTimeMS(5000), 6000);
        console.log(`[DELETE ACCOUNT] MongoDB lookup by nanoid id: ${mongoUser ? 'FOUND' : 'NOT FOUND'}`);
      } catch (mongoErr) {
        mongoLookupFailed = true;
        console.log(`[DELETE ACCOUNT] MongoDB lookup by id failed: ${mongoErr.message}. Trying by email...`);
        console.error(mongoErr.stack);
      }
      
      // Fallback: try by email
      if (!mongoUser && userEmail) {
        try {
          mongoUser = await withMongoTimeout(() => User.findOne({ email: userEmail }).lean().maxTimeMS(5000), 6000);
          console.log(`[DELETE ACCOUNT] MongoDB lookup by email: ${mongoUser ? 'FOUND' : 'NOT FOUND'}`);
        } catch (mongoErr) {
          mongoLookupFailed = true;
          console.log(`[DELETE ACCOUNT] MongoDB lookup by email also failed: ${mongoErr.message}`);
          console.error(mongoErr.stack);
        }
      }
    }

    const memoryUserIndex = db.users.findIndex(u => u.id === userId || (userEmail && u.email === userEmail));
    const memoryUser = memoryUserIndex !== -1 ? db.users[memoryUserIndex] : null;
    console.log(`[DELETE ACCOUNT] In-memory user: ${memoryUser ? 'FOUND at index ' + memoryUserIndex : 'NOT FOUND'}`);

    if (!mongoUser && !memoryUser) {
      console.log('[DELETE ACCOUNT] User not found in either MongoDB or in-memory store');
      return res.status(404).json({ message: 'User account not found.' });
    }

    if (mongoLookupFailed) {
      console.error('[DELETE ACCOUNT] Refusing to report success because MongoDB lookup failed');
      return res.status(503).json({
        message: 'We could not verify your account in the database right now. Please try again in a moment.',
        detail: 'MongoDB lookup failed or timed out before account deletion.'
      });
    }

    const userToDelete = mongoUser || memoryUser;
    const userRole = userToDelete.role || 'user';
    const userEmailFinal = userToDelete.email || userEmail;
    const userBusinessId = userToDelete.businessId || memoryUser?.businessId || null;

    console.log(`[DELETE ACCOUNT] Deleting account for user: ${userEmailFinal} (${userId}, role: ${userRole})`);

    // ===== DELETE FROM MONGODB =====
    let mongoOwnedBusinessIds = [];
    if (mongoUser && isMongoConnected()) {
      try {
        const mongoDeleteResult = await deleteMongoAccount({
          userId,
          userEmail: userEmailFinal,
          mongoUser
        });
        mongoOwnedBusinessIds = mongoDeleteResult.ownedBusinessIds;
        console.log('[DELETE ACCOUNT] MongoDB records deleted', mongoDeleteResult.deletionStats);
      } catch (mongoErr) {
        console.error(`[DELETE ACCOUNT] MongoDB deletion error: ${mongoErr.message}`);
        console.error(mongoErr.stack);
        return res.status(500).json({
          message: 'Account deletion failed while removing database records. Please try again or contact support.',
          detail: mongoErr.message
        });
      }
    } else {
      console.log('[DELETE ACCOUNT] No MongoDB user record found; skipping MongoDB account deletion');
    }

    // ===== DELETE FROM IN-MEMORY STORE =====
    try {
      // Remove user
      if (memoryUserIndex !== -1) {
        db.users.splice(memoryUserIndex, 1);
        console.log(`[DELETE ACCOUNT] Removed user from in-memory store`);
      }

      const ownedBusinessIds = getOwnedBusinessIds(userId, { ...memoryUser, businessId: userBusinessId }, mongoOwnedBusinessIds.map((id) => ({ id })));
      console.log('[DELETE ACCOUNT] In-memory cleanup targets', { ownedBusinessIds });

      // Remove user's businesses
      const beforeBusinesses = db.businesses.length;
      db.businesses = db.businesses.filter(b => b.ownerId !== userId);
      console.log(`[DELETE ACCOUNT] Removed ${beforeBusinesses - db.businesses.length} businesses from in-memory store`);

      // Remove user's listings
      const beforeListings = db.listings.length;
      db.listings = db.listings.filter(l => !ownedBusinessIds.includes(l.businessId) && l.ownerId !== userId);
      console.log(`[DELETE ACCOUNT] Removed ${beforeListings - db.listings.length} listings from in-memory store`);

      // Remove leads associated with this user
      const beforeLeads = db.leads.length;
      db.leads = db.leads.filter(l => l.customerId !== userId && !(l.businessIds || []).some((businessId) => ownedBusinessIds.includes(businessId)));
      console.log(`[DELETE ACCOUNT] Removed ${beforeLeads - db.leads.length} leads from in-memory store`);

      if (db.reviews) {
        const beforeReviews = db.reviews.length;
        db.reviews = db.reviews.filter((review) => review.userId !== userId && !ownedBusinessIds.includes(review.businessId));
        console.log(`[DELETE ACCOUNT] Removed ${beforeReviews - db.reviews.length} reviews from in-memory store`);
      }

      if (db.campaigns) {
        const beforeCampaigns = db.campaigns.length;
        db.campaigns = db.campaigns.filter((campaign) => !ownedBusinessIds.includes(campaign.businessId));
        console.log(`[DELETE ACCOUNT] Removed ${beforeCampaigns - db.campaigns.length} campaigns from in-memory store`);
      }

      // Remove email verifications
      if (userEmailFinal && db.emailVerifications) {
        const beforeVerif = db.emailVerifications.length;
        db.emailVerifications = db.emailVerifications.filter(v => v.email !== userEmailFinal);
        console.log(`[DELETE ACCOUNT] Removed ${beforeVerif - db.emailVerifications.length} email verifications from in-memory store`);
      }

      // Remove user from any favorites lists in other users
      db.users.forEach(u => {
        if (u.favorites) {
          u.favorites = u.favorites.filter(favId => favId !== userId);
        }
      });
      console.log(`[DELETE ACCOUNT] Cleaned up favorites references`);

      console.log(`[DELETE ACCOUNT] In-memory records deleted for user: ${userEmailFinal}`);
    } catch (memoryErr) {
      console.error(`[DELETE ACCOUNT] In-memory deletion error: ${memoryErr.message}`);
      console.error(memoryErr.stack);
      return res.status(500).json({
        message: 'Account deletion failed while clearing local application data. Please try again or contact support.',
        detail: memoryErr.message
      });
    }

    console.log(`[DELETE ACCOUNT] SUCCESS: Account fully deleted for ${userEmailFinal}`);
    return res.json({
      success: true,
      message: 'Your account has been permanently deleted. We\'re sorry to see you go.'
    });
  } catch (error) {
    console.error('❌ Delete account error:', error);
    console.error(error.stack);
    return res.status(500).json({
      message: error.message || 'Failed to delete account. Please try again or contact support.'
    });
  }
}
