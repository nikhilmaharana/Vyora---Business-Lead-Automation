import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { logEnvironmentStatus } from './config/env.js';
import { initializeEmailService } from './services/emailService.js';
import apiRoutes from './routes/api.js';
import User from './models/User.js';
import Business from './models/Business.js';
import Lead from './models/Lead.js';
import Listing from './models/Listing.js';
import { db } from './seed/data.js';
import { catalogBusinesses, catalogServices } from './seed/catalog.js';

const app = express();
const port = process.env.PORT || 5000;
// const host = process.env.HOST || '127.0.0.1';

app.use(helmet());
const allowedOrigins = new Set([
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174'
]);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 500 }));

app.use((req, res, next) => {
  next();
});

let mongoEnabled = false;
let syncQueue = Promise.resolve();
const cleanDocument = ({ _id, __v, createdAt, updatedAt, ...document }) => document;

function loadBuiltInCatalog() {
  for (const business of catalogBusinesses) {
    if (!db.businesses.some((item) => item.id === business.id)) db.businesses.push(business);
  }
  for (const listing of catalogServices) {
    if (!db.listings.some((item) => item.id === listing.id)) db.listings.push(listing);
  }
}

async function syncMongo() {
  if (!mongoEnabled) return;
  // Upsert all records instead of delete+insert to prevent data loss
  const upsertAll = async (Model, items) => {
    if (!items.length) return;
    await Model.bulkWrite(
      items.map(item => ({
        updateOne: {
          filter: { id: item.id },
          update: { $set: item },
          upsert: true
        }
      }))
    );
  };
  await Promise.all([
    upsertAll(User, db.users),
    upsertAll(Business, db.businesses),
    upsertAll(Lead, db.leads),
    upsertAll(Listing, db.listings)
  ]);
}

async function migrateBuiltInCatalog() {
  await Promise.all([
    ...catalogBusinesses.map((item) => Business.updateOne({ id: item.id }, { $set: item }, { upsert: true })),
    ...catalogServices.map((item) => Listing.updateOne({ id: item.id }, { $set: item }, { upsert: true }))
  ]);
}

app.use((req, res, next) => {
  res.on('finish', () => {
    if (!mongoEnabled || req.method === 'GET' || res.statusCode >= 400) return;
    syncQueue = syncQueue
      .then(() => {
        console.log('[MongoDB sync] Starting post-write sync', {
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode
        });
        return syncMongo();
      })
      .then(() => console.log('[MongoDB sync] Completed post-write sync'))
      .catch((error) => {
        console.error('[MongoDB sync] Failed post-write sync:', error.message);
        console.error(error.stack);
      });
  });
  next();
});

app.use('/api', apiRoutes);

app.use('/api', (req, res) => {
  console.warn('[API 404] Route not found', {
    method: req.method,
    path: req.originalUrl,
    contentType: req.headers['content-type'] || null,
    hasAuthorizationHeader: Boolean(req.headers.authorization)
  });
  res.status(404).json({
    message: `API route not found: ${req.method} ${req.originalUrl}`,
    detail: 'Confirm the backend server was restarted after route changes and the frontend VITE_API_URL points to this API.'
  });
});

app.use((err, req, res, next) => {
  console.error('[Express error]', {
    method: req.method,
    path: req.originalUrl,
    message: err.message,
    stack: err.stack
  });
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

async function start() {
  logEnvironmentStatus();
  await initializeEmailService();

  loadBuiltInCatalog();
  if (process.env.MONGO_URI) {
    try {
      // Mongoose 8.x connection configuration with proper pool settings
      mongoose.set('bufferCommands', false); // Don't buffer commands when disconnected - fail fast

      await mongoose.connect(process.env.MONGO_URI, {
        // Connection pool settings
        maxPoolSize: 10,          // Maximum number of connections in the pool
        minPoolSize: 2,           // Maintain at least 2 connections
        waitQueueTimeoutMS: 5000, // Don't wait more than 5s for a connection from pool
        serverSelectionTimeoutMS: 8000, // Timeout for server selection (down from 10000)
        socketTimeoutMS: 30000,   // Socket timeout for operations (down from 45000)
        heartbeatFrequencyMS: 10000, // Check connection health every 10s

        // Connection retry settings
        retryWrites: true,
        retryReads: false,         // Don't retry reads to avoid stale data

        // TLS settings
        tlsAllowInvalidCertificates: !!process.env.MONGO_ALLOW_INVALID_TLS,
        tlsAllowInvalidHostnames: !!process.env.MONGO_ALLOW_INVALID_TLS,
      });

      mongoEnabled = true;
      console.log('MongoDB connected successfully');

      // Set up connection event handlers for resilience
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Operations will fall back to in-memory store.');
        mongoEnabled = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected. Resuming database operations.');
        mongoEnabled = true;
      });

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err.message);
        mongoEnabled = false;
      });

      // Migrate catalog businesses + services to MongoDB
      await migrateBuiltInCatalog();

      // Ensure default admin account exists in MongoDB
      try {
        const defaultAdminEmail = 'nikhil@admin.com';
        const existingAdmin = await User.findOne({ email: defaultAdminEmail }).maxTimeMS(5000);
        if (!existingAdmin) {
          const adminData = db.users.find(u => u.email === defaultAdminEmail);
          if (adminData) {
            await User.updateOne(
              { email: defaultAdminEmail },
              { $set: adminData },
              { upsert: true }
            );
            console.log('[Seed] Created default admin account: nikhil@admin.com');
          }
        } else {
          console.log('[Seed] Default admin account already exists: nikhil@admin.com');
        }
      } catch (seedError) {
        console.error('[Seed] Error ensuring admin account:', seedError.message);
      }

      // Ensure all seed users with passwordHash preserved in MongoDB
      try {
        const seedUsers = db.users.filter(u => u.passwordHash);
        for (const seedUser of seedUsers) {
          const existing = await User.findOne({ email: seedUser.email }).maxTimeMS(5000);
          if (existing) {
            // Update existing user with password hash and other seed fields
            const updateFields = {};
            for (const [key, value] of Object.entries(seedUser)) {
              if (key !== 'id' && key !== 'email') {
                updateFields[key] = value;
              }
            }
            await User.updateOne({ email: seedUser.email }, { $set: updateFields }).maxTimeMS(5000);
          } else {
            await User.updateOne(
              { email: seedUser.email },
              { $set: seedUser },
              { upsert: true }
            ).maxTimeMS(5000);
          }
        }
        console.log(`[Seed] Ensured ${seedUsers.length} seed users with password hashes in MongoDB`);
      } catch (seedError) {
        console.error('[Seed] Error ensuring seed user passwords:', seedError.message);
      }

      // Sync all in-memory data to MongoDB (includes all seed data)
      const [mongoUsers, mongoBusinesses, mongoLeads, mongoListings] = await Promise.all([
        User.find().lean(), Business.find().lean(), Lead.find().lean(), Listing.find().lean()
      ]);

      if (mongoUsers.length > 0 || mongoBusinesses.length > 0 || mongoLeads.length > 0 || mongoListings.length > 0) {
        // Load existing MongoDB data into in-memory store
        if (mongoUsers.length) db.users.splice(0, db.users.length, ...mongoUsers.map(cleanDocument));
        if (mongoBusinesses.length) db.businesses.splice(0, db.businesses.length, ...mongoBusinesses.map(cleanDocument));
        if (mongoLeads.length) db.leads.splice(0, db.leads.length, ...mongoLeads.map(cleanDocument));
        if (mongoListings.length) db.listings.splice(0, db.listings.length, ...mongoListings.map(cleanDocument));
        console.log(`Loaded persisted MongoDB data: ${db.users.length} users, ${db.businesses.length} businesses, ${db.leads.length} leads, ${db.listings.length} listings`);
      } else {
        // First run: seed all data from in-memory db to MongoDB
        await syncMongo();
        console.log(`MongoDB seeded with initial data: ${db.users.length} users, ${db.businesses.length} businesses, ${db.leads.length} leads, ${db.listings.length} listings`);
      }
    } catch (mongoError) {
      console.error('MongoDB connection error:', mongoError.message);
      console.log('Falling back to in-memory data store');
      mongoEnabled = false;
    }
  } else {
    console.log('MongoDB not configured; using seeded in-memory data store');
  }

  const server = app.listen(port, () => {
    console.log(`API running on port ${port}`);
  });

  console.log('[API routes] Registered delete account route: DELETE /api/auth/delete-account');

  server.on('error', (error) => {
    console.error(`Unable to start API on port ${port}: ${error.message}`);
    process.exit(1);
  });
}
start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
