import { db } from './data.js';

console.log(JSON.stringify({ message: 'Seed data is loaded automatically in memory.', counts: {
  users: db.users.length,
  businesses: db.businesses.length,
  listings: db.listings.length,
  leads: db.leads.length
}}, null, 2));
