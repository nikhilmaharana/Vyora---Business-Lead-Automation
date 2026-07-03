# Business Lead Generation and Automation System

A MERN-stack B2B marketplace inspired by IndiaMART: buyers can search products/services, sellers can publish listings, leads are matched to vendors, and admins can manage approvals, KYC, plans, fraud signals, and automation settings.

The app includes a local demo database, so it runs immediately without MongoDB. Add `MONGO_URI` only when you want Atlas or a local MongoDB instance.

## Run Locally

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Create environment file:
   ```bash
   cp server/.env.example server/.env
   ```

3. Start the API/dashboard app:
   ```bash
   npm run dev
   ```

4. Open:
   - Operations dashboard: http://localhost:5173
   - Backend health: http://localhost:5000/api/health

The repository also contains the polished customer-facing app in
`../business_frontend`. Start it separately with `npm run dev` in that folder.
Its API target is configured in `business_frontend/.env` (copy `.env.example`).
Do not run both Vite apps on port 5173 at the same time; use `npm run dev -- --port 5174`
for one of them if you want both open.

The API binds to `127.0.0.1` by default. Change `HOST` in `server/.env` only if you need LAN access.

## MongoDB Atlas

MongoDB Atlas allows one free cluster per Atlas project. You can still use your existing EcomNex cluster for this project by using a separate database name in the connection string, for example:

```bash
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster-name.mongodb.net/business_leads?retryWrites=true&w=majority
```

That keeps EcomNex and this project logically separate while sharing the same free cluster. If your current Atlas project already has a free cluster and you want another free cluster, create a new Atlas project and create the free cluster there.

Use `business_leads` as the database name. In Atlas, add your current IP address
under **Network Access** and create a database user under **Database Access**.
Replace `MONGO_URI` in `server/.env`, restart the server, and the initial users,
businesses, and leads will be seeded once. From then on core account, business,
and lead changes persist in Atlas.

## Smart Search / AI-ML Use Case

The backend exposes `/api/search/smart`. It uses a practical hybrid ranking algorithm instead of a hard-coded filter:

- keyword and fuzzy token similarity
- category and product/listing relevance
- city/service-area match
- budget fit
- verified seller and rating trust score
- response speed
- conversion performance
- explainable match reasons returned with every result

Lead posting uses the same ranking model to auto-match buyers with the best sellers.

## Demo Login

Use any email and password with the login form. Useful seeded identities:

- `customer@demo.com`
- `vendor@demo.com`
- `admin@demo.com`
- `superadmin@demo.com`

The demo OTP is `123456`.

## Implemented Modules

- Customer signup/login, search, filters, post requirement, matched vendors, favorites, compare, booking/callback, chat, reviews, status tracking
- Vendor profile completion, services/listings, media metadata, packages, service areas, KYC, lead CRM, notes, follow-ups, team management
- WhatsApp automation flow, follow-up stages, broadcast campaigns, multilingual and AI reply suggestions as mock integrations
- Vendor analytics: leads, conversion, response time, revenue, lead source, ROI, performance score
- Subscription plans, lead credits, bid marketplace, pay-per-lead unlock
- Social media scheduler and engagement tracking
- Mini website generator settings and SEO metadata
- Admin dashboard, user/vendor/lead/revenue/content/fraud controls
- Super-admin roles, permissions, API/payment/WhatsApp configuration controls
- Trust system: admin approval, KYC verification, verified badge, review authenticity score
- Advanced search/discovery, referral rewards, AI chatbot helper, voice-search-ready query box
- SmartRank hybrid search with explainable seller matching
