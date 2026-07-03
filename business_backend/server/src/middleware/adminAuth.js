import jwt from 'jsonwebtoken';
import { db } from '../seed/data.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

/**
 * Verify JWT and attach user to req.user
 */
export async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    let user = db.users.find(u => u.id === decoded.id);

    if (!user && mongoose.connection.readyState === 1) {
      const mongoUser = await User.findOne({ id: decoded.id }).lean().maxTimeMS(5000);
      if (mongoUser) {
        const { _id, __v, ...cleanUser } = mongoUser;
        user = { ...cleanUser, id: cleanUser.id || decoded.id };
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found. Please log in again.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Require admin or super_admin role
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

/**
 * Require super_admin role only
 */
export function requireSuperAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Super admin access required' });
  }
  next();
}

/**
 * Require vendor (business_owner) role
 */
export function requireVendor(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  if (req.user.role !== 'business_owner') {
    return res.status(403).json({ message: 'Vendor access required' });
  }
  if (req.user.vendorStatus !== 'approved') {
    return res.status(403).json({ message: 'Your vendor account is not yet approved by admin' });
  }
  next();
}

/**
 * Require user or any authenticated role
 */
export function requireUser(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

export default { authenticateJWT, requireAdmin, requireSuperAdmin, requireVendor, requireUser };