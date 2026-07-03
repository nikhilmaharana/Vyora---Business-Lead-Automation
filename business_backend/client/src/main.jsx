import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BadgeCheck, BarChart3, Bell, Bot, BriefcaseBusiness, CalendarClock, CheckCircle2, CreditCard,
  FileText, Globe2, Heart, LayoutDashboard, LockKeyhole, LogOut, Megaphone, MessageCircle,
  Search, Send, ShieldCheck, SlidersHorizontal, Sparkles, Star, UserCog, UserPlus,
  Users, WalletCards
} from 'lucide-react';
import { api } from './services/api.js';
import './styles.css';

const navItems = [
  ['overview', LayoutDashboard, 'Overview'],
  ['customer', Search, 'Customer'],
  ['vendor', BriefcaseBusiness, 'Seller Workspace'],
  ['automation', MessageCircle, 'Automation'],
  ['admin', ShieldCheck, 'Admin'],
  ['super', UserCog, 'Super Admin']
];

const money = (value = 0) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

function Stat({ icon: Icon, label, value, tone = 'mint' }) {
  const tones = {
    mint: 'bg-mint/10 text-mint',
    gold: 'bg-gold/15 text-amber-700',
    coral: 'bg-coral/10 text-coral'
  };
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${tones[tone] || tones.mint}`}>
          <Icon size={20} />
        </span>
      </div>
    </div>
  );
}

function Pill({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700'
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

function Section({ title, icon: Icon, children, action }) {
  return (
    <section className="panel">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-mint/10 text-mint"><Icon size={18} /></span>
          <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Notice({ notice, onClear }) {
  if (!notice) return null;
  const tone = notice.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700';
  return (
    <div className={`mb-4 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-medium ${tone}`}>
      <span>{notice.message}</span>
      <button className="text-xs font-semibold" onClick={onClear}>Close</button>
    </div>
  );
}

function AuthPanel({ session, setSession, notify }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: 'Demo Buyer', email: 'customer@demo.com', phone: '9876543210', role: 'user', otp: '123456' });

  async function submitAuth(event) {
    event.preventDefault();
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const { data } = await api.post(endpoint, form);
      setSession({ token: data.token, user: data.user, otpVerified: false });
      setMode('otp');
      notify(`${mode === 'signup' ? 'Signup' : 'Login'} started. Demo OTP is ${data.otp?.otp || '123456'}.`);
    } catch (error) {
      notify(error.response?.data?.message || 'Authentication failed', 'error');
    }
  }

  async function sendOtp() {
    const { data } = await api.post('/auth/otp/send', form);
    notify(data.message);
  }

  async function verifyOtp(event) {
    event.preventDefault();
    const { data } = await api.post('/auth/otp/verify', form);
    if (!data.verified) return notify(data.message, 'error');
    setSession((current) => ({ ...current, otpVerified: true, user: { ...current?.user, verified: true } }));
    notify('OTP verified. Account is ready.');
  }

  if (session?.otpVerified) {
    return (
      <section className="auth-panel">
        <div>
          <p className="text-sm font-semibold text-mint">Account verified</p>
          <h2 className="text-xl font-semibold tracking-tight text-ink">{session.user.name || 'Demo User'}</h2>
          <p className="muted">{session.user.email || session.user.phone} - {session.user.role}</p>
        </div>
        <div className="toolbar">
          <Pill tone="green">OTP verified</Pill>
          <button className="mini" onClick={() => { setSession(null); notify('Logged out.'); }}><LogOut size={14} /> Logout</button>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-panel">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-mint">Account access</p>
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          {mode === 'otp' ? 'Verify your OTP' : mode === 'signup' ? 'Create a buyer or seller account' : 'Login to continue'}
        </h2>
        <p className="muted">Demo OTP is 123456. Database connection can be added later.</p>
      </div>
      <form onSubmit={mode === 'otp' ? verifyOtp : submitAuth} className="grid min-w-0 flex-1 gap-3 lg:grid-cols-[1fr_1fr_auto]">
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 lg:col-span-3">
          <button type="button" className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white text-mint shadow-sm' : 'text-slate-600'}`} onClick={() => setMode('login')}>Login</button>
          <button type="button" className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${mode === 'signup' ? 'bg-white text-mint shadow-sm' : 'text-slate-600'}`} onClick={() => setMode('signup')}>Signup</button>
          <button type="button" className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${mode === 'otp' ? 'bg-white text-mint shadow-sm' : 'text-slate-600'}`} onClick={() => setMode('otp')}>OTP</button>
        </div>
        {mode === 'signup' && <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input className="input" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {mode !== 'otp' && (
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">Buyer</option>
            <option value="business_owner">Seller</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        )}
        {mode === 'otp' && <input className="input" placeholder="Enter OTP" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} />}
        <button className="btn">
          <LockKeyhole size={16} />
          {mode === 'otp' ? 'Verify OTP' : mode === 'signup' ? 'Create Account' : 'Login'}
        </button>
        {mode === 'otp' && <button type="button" className="mini lg:col-start-3" onClick={sendOtp}><Send size={14} /> Resend OTP</button>}
      </form>
    </section>
  );
}

function Overview({ data }) {
  const metrics = data?.metrics || {};
  const analytics = data?.vendorAnalytics || {};
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Stat icon={Users} label="Users" value={metrics.totalUsers || 0} />
        <Stat icon={BriefcaseBusiness} label="Vendors" value={metrics.totalVendors || 0} />
        <Stat icon={Bell} label="Leads" value={metrics.totalLeads || 0} />
        <Stat icon={WalletCards} label="Revenue" value={money(metrics.revenue)} tone="gold" />
        <Stat icon={LockKeyhole} label="Fraud Alerts" value={metrics.fakeLeadAlerts || 0} tone="coral" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <Section title="Analytics Dashboard" icon={BarChart3}>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="soft-card">
              <p className="text-sm text-slate-500">Leads received</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{analytics.totalLeads}</p>
            </div>
            <div className="soft-card">
              <p className="text-sm text-slate-500">Conversion rate</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{analytics.conversionRate}%</p>
            </div>
            <div className="soft-card">
              <p className="text-sm text-slate-500">Response time</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{analytics.responseTime}m</p>
            </div>
            <div className="soft-card">
              <p className="text-sm text-slate-500">Performance score</p>
              <p className="mt-2 text-3xl font-semibold text-ink">{analytics.performanceScore}/100</p>
            </div>
          </div>
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{analytics.roiText}</p>
        </Section>
        <Section title="Smart Suggestions" icon={Sparkles}>
          <div className="space-y-3">
            {(data?.suggestions || []).map((item) => (
              <div key={item} className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 shrink-0 text-mint" size={16} />
                {item}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Customer({ businesses, leads, refresh, session, notify }) {
  const popularCategories = ['Industrial Machinery', 'Food & Grocery', 'Medical Equipment', 'Interior Design', 'Home Services', 'Digital Marketing'];
  const [filters, setFilters] = useState({ q: 'packaging machine', location: '', budget: '', rating: '', instant: false, sort: 'best' });
  const [results, setResults] = useState(businesses);
  const [algorithm, setAlgorithm] = useState(null);
  const [form, setForm] = useState({ name: 'Demo Buyer', mobile: '9999999999', category: 'Industrial Machinery', requirement: 'Need automatic pouch packing machine with installation', budget: 300000, location: 'Ahmedabad', timeline: '30 days', source: 'Post Requirement' });
  const [matches, setMatches] = useState([]);
  const [saved, setSaved] = useState([]);
  const [compare, setCompare] = useState([]);

  useEffect(() => setResults(businesses), [businesses]);

  async function searchBusinesses(event) {
    event.preventDefault();
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value !== false));
    const { data } = await api.get(`/search/smart?${params}`);
    setAlgorithm(data.algorithm);
    setResults(data.results);
    notify(`Found ${data.results.length} smart seller matches.`);
  }

  async function quickSearch(category) {
    const nextFilters = { ...filters, q: category };
    setFilters(nextFilters);
    const params = new URLSearchParams(Object.entries(nextFilters).filter(([, value]) => value !== '' && value !== false));
    const { data } = await api.get(`/search/smart?${params}`);
    setAlgorithm(data.algorithm);
    setResults(data.results);
    notify(`Showing sellers for ${category}.`);
  }

  async function postLead(event) {
    event.preventDefault();
    const { data } = await api.post('/leads', form);
    setMatches(data.matches);
    await refresh();
    notify(`Lead created and sent to ${data.matches.length} matched seller(s).`);
  }

  async function saveSeller(business) {
    if (!session?.user?.id) {
      setSaved((items) => [...new Set([...items, business.id])]);
      return notify('Seller saved locally. Login to save it to your account.');
    }
    const { data } = await api.post(`/users/${session.user.id}/favorites`, { businessId: business.id });
    setSaved(data.favorites.map((item) => item.id));
    notify(`${business.name} saved to favorites.`);
  }

  function requestPrice(business, listing) {
    setForm({
      ...form,
      category: business.category,
      location: business.city,
      budget: listing?.discountPrice || listing?.price || business.budgetMin,
      requirement: `Need latest price for ${listing?.title || business.category} from ${business.name}`
    });
    notify('Enquiry form filled. Submit it to send the requirement.');
  }

  function toggleCompare(business) {
    setCompare((items) => {
      const exists = items.some((item) => item.id === business.id);
      const next = exists ? items.filter((item) => item.id !== business.id) : [...items, business].slice(-3);
      notify(exists ? `${business.name} removed from compare.` : `${business.name} added to compare.`);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <section className="hero-panel">
        <div className="grid gap-5 xl:grid-cols-[1fr_.42fr]">
          <div>
            <p className="text-sm font-semibold text-mint">India B2B marketplace</p>
            <h2 className="mt-1 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-ink">Search verified sellers, compare prices, and send enquiries in one clean workflow</h2>
            <form onSubmit={searchBusinesses} className="mt-5 grid gap-3 md:grid-cols-[1.2fr_.8fr_.6fr_auto]">
              <input className="input" placeholder="Search products, services, or sellers" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
              <input className="input" placeholder="City or service area" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
              <input className="input" placeholder="Budget" type="number" value={filters.budget} onChange={(e) => setFilters({ ...filters, budget: e.target.value })} />
              <button className="btn"><Search size={16} /> Search</button>
            </form>
            <div className="mt-4 toolbar">
              {popularCategories.map((category) => <button key={category} className="mini" onClick={() => quickSearch(category)}>{category}</button>)}
            </div>
          </div>
          <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink"><Sparkles size={16} className="text-mint" /> SmartRank AI search</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">Every result is ranked by product fit, city coverage, budget match, verified trust, response speed, and conversion history.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
              {(algorithm?.signals || ['keyword similarity', 'service location', 'seller trust', 'response speed']).map((signal) => <span key={signal} className="rounded-lg bg-white px-3 py-2">{signal}</span>)}
            </div>
          </div>
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[1fr_.48fr]">
      <Section title="Seller Results" icon={SlidersHorizontal} action={
        <div className="toolbar">
          <select className="input w-36" value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })}>
            <option value="">Any rating</option><option value="4">4+ stars</option><option value="4.5">4.5+ stars</option>
          </select>
          <select className="input" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="best">Best match</option><option value="fastest">Fastest response</option><option value="top-rated">Top-rated</option>
          </select>
          <label className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm"><input type="checkbox" checked={filters.instant} onChange={(e) => setFilters({ ...filters, instant: e.target.checked })} /> Instant</label>
        </div>
      }>
        <div className="mt-4 space-y-3">
          {results.map((business) => (
            <div key={business.id} className="data-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-ink">{business.name}</h3>
                  <p className="muted">{business.category} - {business.subCategory} in {business.city}</p>
                </div>
                <div className="toolbar"><Pill tone="green"><Star size={12} className="inline" /> {business.rating}</Pill>{business.verifiedBadge && <Pill tone="blue">Verified</Pill>}<Pill>{business.smartScore || 0}% match</Pill></div>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                <span>{money(business.budgetMin)} - {money(business.budgetMax)}</span>
                <span>{business.responseTimeMins}m response</span>
                <span>{business.conversionRate}% conversion</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(business.matchReasons || []).map((reason) => <Pill key={reason} tone="blue">{reason}</Pill>)}
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {(business.listings || []).slice(0, 2).map((listing) => (
                  <div key={listing.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                    <strong>{listing.title}</strong>
                    <p className="text-slate-600">{money(listing.discountPrice || listing.price)} - {listing.priceType}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 toolbar">
                <button className="mini" onClick={() => saveSeller(business)}><Heart size={14} /> {saved.includes(business.id) ? 'Saved' : 'Save'}</button>
                <button className="mini" onClick={() => notify(`WhatsApp alert prepared for ${business.name}.`)}><MessageCircle size={14} /> WhatsApp</button>
                <button className="mini" onClick={() => toggleCompare(business)}>Compare</button>
                <button className="mini" onClick={() => requestPrice(business, business.listings?.[0])}>Get Latest Price</button>
              </div>
            </div>
          ))}
        </div>
        {compare.length > 0 && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-cloud text-slate-600"><tr><th className="p-3">Seller</th><th className="p-3">Rating</th><th className="p-3">Response</th><th className="p-3">Budget</th><th className="p-3">Trust</th></tr></thead>
              <tbody>{compare.map((business) => <tr key={business.id} className="border-t border-slate-200"><td className="p-3 font-semibold">{business.name}</td><td className="p-3">{business.rating}</td><td className="p-3">{business.responseTimeMins}m</td><td className="p-3">{money(business.budgetMin)}-{money(business.budgetMax)}</td><td className="p-3">{business.verifiedBadge ? 'Verified' : 'Pending'}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </Section>
      <Section title="Post Requirement" icon={Bell}>
        <form onSubmit={postLead} className="grid gap-3">
          <input className="input" placeholder="Requirement" value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} required />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input className="input" type="number" placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
            <input className="input" placeholder="Timeline" value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} />
          </div>
          <button className="btn"><Sparkles size={16} /> Create lead with OTP verification</button>
        </form>
        <div className="mt-4 space-y-3">
          {(matches.length ? matches : leads).slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-lg bg-cloud p-3 text-sm">
              <div className="flex justify-between gap-3"><strong>{item.name}</strong><Pill tone={item.score === 'Hot' ? 'red' : 'amber'}>{item.score || `${item.matchScore}% match`}</Pill></div>
              <p className="mt-1 text-slate-600">{item.requirement || item.category}</p>
              <p className="mt-1 text-slate-500">{item.location || item.city}</p>
            </div>
          ))}
        </div>
      </Section>
      </div>
    </div>
  );
}

function Vendor({ businesses, listings, leads, refresh, notify }) {
  const business = businesses[0] || {};
  const [leadStatus, setLeadStatus] = useState('');
  const [profile, setProfile] = useState({ name: business.name || '', serviceAreas: business.serviceAreas?.join(', ') || '', workingHours: business.workingHours || '', usp: business.usp || '' });
  const [listing, setListing] = useState({ title: 'New B2B Product Listing', category: business.category || 'Industrial Machinery', type: 'Product', price: 25000, discountPrice: 22000, tags: 'verified, wholesale, fast response' });

  useEffect(() => {
    setProfile({ name: business.name || '', serviceAreas: business.serviceAreas?.join(', ') || '', workingHours: business.workingHours || '', usp: business.usp || '' });
    setListing((current) => ({ ...current, category: business.category || current.category }));
  }, [business.id]);

  async function updateLead(id, status) {
    setLeadStatus(status);
    await api.patch(`/leads/${id}`, { status, note: `Status updated to ${status}` });
    await refresh();
    notify(`Lead updated to ${status}.`);
  }

  async function updateProfile(event) {
    event.preventDefault();
    await api.patch(`/businesses/${business.id}`, { ...profile, serviceAreas: profile.serviceAreas.split(',').map((item) => item.trim()).filter(Boolean), profileCompletion: Math.min(100, (business.profileCompletion || 70) + 4) });
    await refresh();
    notify('Business profile updated.');
  }

  async function createListing(event) {
    event.preventDefault();
    const { data } = await api.post('/listings', { ...listing, businessId: business.id, price: Number(listing.price), discountPrice: Number(listing.discountPrice), tags: listing.tags.split(',').map((item) => item.trim()).filter(Boolean), actions: ['Enquiry', 'WhatsApp', 'Get Quote'], packages: [] });
    await refresh();
    notify(`${data.listing.title} created. AI title suggestion is ready.`);
  }

  async function generateListingText() {
    const { data } = await api.post('/ai/title', listing);
    setListing((current) => ({ ...current, title: data.result }));
    notify('AI generated a listing title.');
  }

  async function generateQuote(lead) {
    const { data } = await api.post('/ai/quote', lead);
    await api.patch(`/leads/${lead.id}`, { note: data.result });
    await refresh();
    notify(`Quote generated for ${lead.name}.`);
  }

  function prepareWhatsApp(lead) {
    notify(`WhatsApp reply prepared for ${lead.name}: pricing, timeline, and callback request.`);
  }

  return (
    <div className="space-y-5">
      <Section title="Business Profile Management" icon={BadgeCheck}>
        <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <h3 className="text-xl font-semibold text-ink">{business.name}</h3>
            <p className="muted leading-6">{business.usp}</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-mint" style={{ width: `${business.profileCompletion || 0}%` }} /></div>
            <p className="mt-2 text-sm font-medium text-slate-600">Profile {business.profileCompletion}% complete. Features unlock at 80%.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Pill tone={business.approved ? 'green' : 'amber'}>{business.approved ? 'Approved' : 'Pending approval'}</Pill>
            <Pill tone={business.kycStatus === 'verified' ? 'green' : 'amber'}>KYC {business.kycStatus}</Pill>
            <Pill tone="blue">{business.plan} plan</Pill>
            <p className="text-sm text-slate-600">Service areas: {business.serviceAreas?.join(', ')}</p>
            <p className="text-sm text-slate-600">Hours: {business.workingHours}</p>
            <p className="text-sm text-slate-600">Credits: {business.credits}</p>
          </div>
        </div>
        <form onSubmit={updateProfile} className="mt-5 grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Business name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <input className="input" placeholder="Service areas" value={profile.serviceAreas} onChange={(e) => setProfile({ ...profile, serviceAreas: e.target.value })} />
          <input className="input" placeholder="Working hours" value={profile.workingHours} onChange={(e) => setProfile({ ...profile, workingHours: e.target.value })} />
          <input className="input" placeholder="USP" value={profile.usp} onChange={(e) => setProfile({ ...profile, usp: e.target.value })} />
          <button className="btn md:col-span-2"><BadgeCheck size={16} /> Save Profile</button>
        </form>
      </Section>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Section title="Lead Management CRM" icon={CalendarClock}>
          <div className="space-y-3">
            {leads.map((lead) => (
              <div key={lead.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="font-semibold text-ink">{lead.name}</h3><p className="muted">{lead.requirement}</p></div>
                  <Pill tone={lead.score === 'Hot' ? 'red' : 'amber'}>{lead.score}</Pill>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                  <span>Budget {money(lead.budget)}</span><span>{lead.location}</span><span>Follow-up: {lead.followUpAt || 'Today'}</span>
                </div>
                <div className="mt-3 toolbar">
                  {['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'].map((status) => <button key={status} className="mini" onClick={() => updateLead(lead.id, status)}>{status}</button>)}
                  <button className="mini" onClick={() => prepareWhatsApp(lead)}><MessageCircle size={14} /> WhatsApp</button>
                  <button className="mini" onClick={() => generateQuote(lead)}><FileText size={14} /> Quote</button>
                </div>
              </div>
            ))}
          </div>
          {leadStatus && <p className="mt-3 text-sm font-medium text-mint">Lead updated to {leadStatus}</p>}
        </Section>
        <Section title="Listings & Products" icon={Globe2}>
          <form onSubmit={createListing} className="mb-4 grid gap-3">
            <input className="input" placeholder="Listing title" value={listing.title} onChange={(e) => setListing({ ...listing, title: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="input" placeholder="Category" value={listing.category} onChange={(e) => setListing({ ...listing, category: e.target.value })} />
              <select className="input" value={listing.type} onChange={(e) => setListing({ ...listing, type: e.target.value })}><option>Product</option><option>Service</option><option>Package</option></select>
              <input className="input" type="number" placeholder="Price" value={listing.price} onChange={(e) => setListing({ ...listing, price: e.target.value })} />
              <input className="input" type="number" placeholder="Discount price" value={listing.discountPrice} onChange={(e) => setListing({ ...listing, discountPrice: e.target.value })} />
            </div>
            <input className="input" placeholder="Tags comma separated" value={listing.tags} onChange={(e) => setListing({ ...listing, tags: e.target.value })} />
            <div className="toolbar"><button className="btn">Add Listing</button><button type="button" className="mini" onClick={generateListingText}><Sparkles size={14} /> AI Title</button></div>
          </form>
          <div className="space-y-3">
            {listings.map((listing) => (
              <div key={listing.id} className="data-card">
                <div className="flex justify-between gap-3"><strong>{listing.title}</strong><Pill tone={listing.status === 'approved' ? 'green' : 'amber'}>{listing.status}</Pill></div>
                <p className="mt-2 text-sm text-slate-600">{listing.type} - {money(listing.discountPrice || listing.price)}</p>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-slate-600">
                  <span>{listing.views} views</span><span>{listing.clicks} clicks</span><span>{listing.leads} leads</span><span>{listing.conversionRate}% conv.</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Automation({ automation, subscriptions, refresh, notify }) {
  const [campaign, setCampaign] = useState({ businessId: 'b1', channel: 'WhatsApp', title: 'New buyer offer', scheduledFor: 'Tomorrow 10:00' });

  async function createCampaign(event) {
    event.preventDefault();
    await api.post('/automation/campaigns', campaign);
    await refresh();
    notify('Campaign scheduled.');
  }

  async function upgrade(plan) {
    const { data } = await api.post('/subscriptions/upgrade', { plan: plan.name });
    notify(data.message);
  }

  async function runAssistant(type) {
    const { data } = await api.post(`/ai/${type}`, { category: 'Industrial Machinery', requirement: 'Buyer wants verified suppliers and quick quotes' });
    notify(data.result);
  }

  async function loadReferrals(kind) {
    const { data } = await api.get('/referrals');
    const reward = data.rewards.find((item) => item.name === kind) || data.rewards[0];
    notify(`${reward.name}: ${money(reward.amount)} reward available.`);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Section title="WhatsApp & Email Automation" icon={MessageCircle}>
        <div className="grid gap-3">
          <div className="soft-card"><strong>Auto reply</strong><p className="muted">Buyer enquiries receive an instant acknowledgement.</p></div>
          <div className="soft-card"><strong>Follow-up automation</strong><p className="muted">{automation.whatsapp?.followUps?.join(' -> ')}</p></div>
          <div className="soft-card"><strong>AI suggestions and chatbot</strong><p className="muted">Generate replies, quotations, tags, and chatbot responses.</p></div>
        </div>
      </Section>
      <Section title="Social, Billing & Lead Access" icon={CreditCard}>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {subscriptions.map((plan) => <div key={plan.id} className="data-card"><strong>{plan.name}</strong><p className="text-sm text-slate-500">{money(plan.price)}</p><p className="text-xs text-slate-500">{plan.leadLimit} leads</p><button className="mini mt-3" onClick={() => upgrade(plan)}>Choose</button></div>)}
          </div>
          <form onSubmit={createCampaign} className="grid gap-3 rounded-lg border border-slate-200 p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <select className="input" value={campaign.channel} onChange={(e) => setCampaign({ ...campaign, channel: e.target.value })}><option>WhatsApp</option><option>Email</option><option>Instagram</option></select>
              <input className="input" value={campaign.scheduledFor} onChange={(e) => setCampaign({ ...campaign, scheduledFor: e.target.value })} />
            </div>
            <input className="input" value={campaign.title} onChange={(e) => setCampaign({ ...campaign, title: e.target.value })} />
            <button className="btn"><Megaphone size={16} /> Schedule Campaign</button>
          </form>
          <div className="space-y-2">
            {automation.social?.map((campaign) => <div key={campaign.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"><span>{campaign.channel}: {campaign.title}</span><Pill>{campaign.status}</Pill></div>)}
          </div>
        </div>
      </Section>
      <Section title="AI Business Assistant" icon={Bot}>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['quote', 'Auto-generate quotations'],
            ['reply', 'Smart buyer reply'],
            ['title', 'Listing title writer'],
            ['tags', 'Tag recommender'],
            ['chatbot', 'Chatbot answer']
          ].map(([type, item]) => <button key={type} className="data-card text-left text-sm text-slate-700" onClick={() => runAssistant(type)}>{item}</button>)}
        </div>
      </Section>
      <Section title="Referral & Affiliate System" icon={Megaphone}>
        <div className="grid gap-3 sm:grid-cols-3">
          <button className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left text-emerald-700" onClick={() => loadReferrals('Refer and earn')}><strong>Refer and earn</strong><p className="text-sm">{money(500)} reward</p></button>
          <button className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-left text-amber-700" onClick={() => loadReferrals('Vendor referral reward')}><strong>Vendor rewards</strong><p className="text-sm">{money(1500)} credit</p></button>
          <button className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left text-blue-700" onClick={() => loadReferrals('User referral discount')}><strong>User discounts</strong><p className="text-sm">{money(250)} coupon</p></button>
        </div>
      </Section>
    </div>
  );
}

function Admin({ admin, refresh, notify }) {
  async function approve(id, approved) {
    await api.patch(`/admin/vendors/${id}/approval`, { approved, reason: approved ? 'Your profile is approved and live' : 'Please complete KYC documents' });
    await refresh();
    notify(approved ? 'Vendor approved.' : 'Vendor rejected.');
  }

  async function blockUser(id, blocked) {
    await api.patch(`/admin/users/${id}/block`, { blocked });
    await refresh();
    notify(blocked ? 'User blocked.' : 'User unblocked.');
  }
  return (
    <div className="space-y-5">
      <Section title="Admin Dashboard" icon={ShieldCheck}>
        <div className="grid gap-4 md:grid-cols-4">
          <Stat icon={Users} label="Users" value={admin.users?.length || 0} />
          <Stat icon={BriefcaseBusiness} label="Vendors" value={admin.vendors?.length || 0} />
          <Stat icon={Bell} label="Leads" value={admin.leads?.length || 0} />
          <Stat icon={WalletCards} label="Plans" value={admin.revenue?.length || 0} />
        </div>
      </Section>
      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Vendor Approval & KYC" icon={BadgeCheck}>
          <div className="space-y-3">
            {admin.vendors?.map((vendor) => <div key={vendor.id} className="data-card"><div className="flex justify-between gap-3"><strong>{vendor.name}</strong><Pill tone={vendor.approved ? 'green' : 'amber'}>{vendor.approved ? 'approved' : 'pending'}</Pill></div><p className="muted">KYC: {vendor.kycStatus}</p><div className="mt-3 toolbar"><button className="mini" onClick={() => approve(vendor.id, true)}>Approve</button><button className="mini" onClick={() => approve(vendor.id, false)}>Reject</button></div></div>)}
          </div>
        </Section>
        <Section title="Fraud, Content & Activity Logs" icon={LockKeyhole}>
          <div className="space-y-3">
            {admin.activityLogs?.map((log) => <div key={log.id} className="soft-card text-sm"><div className="flex justify-between gap-3"><strong>{log.actor}</strong><Pill tone={log.risk === 'low' ? 'green' : 'amber'}>{log.risk}</Pill></div><p className="text-slate-600">{log.action}</p></div>)}
            <div className="rounded-lg border border-slate-200 p-3 text-sm text-slate-600">Categories: {admin.categories?.join(', ')}</div>
            <div className="rounded-lg border border-slate-200 p-3 text-sm text-slate-600">Locations: {admin.locations?.slice(0, 8).join(', ')}</div>
          </div>
        </Section>
        <Section title="User Management" icon={Users}>
          <div className="space-y-3">
            {admin.users?.map((user) => <div key={user.id} className="data-card"><div className="flex flex-wrap justify-between gap-3"><div><strong>{user.name}</strong><p className="muted">{user.email || user.phone} - {user.role}</p></div><Pill tone={user.blocked ? 'red' : user.verified ? 'green' : 'amber'}>{user.blocked ? 'blocked' : user.verified ? 'verified' : 'pending OTP'}</Pill></div><button className="mini mt-3" onClick={() => blockUser(user.id, !user.blocked)}>{user.blocked ? 'Unblock' : 'Block'}</button></div>)}
          </div>
        </Section>
      </div>
    </div>
  );
}

function SuperAdmin({ admin, refresh, notify }) {
  const [config, setConfig] = useState({ leadDistributionLimit: admin.config?.leadDistributionLimit || 5, profileLockThreshold: admin.config?.profileLockThreshold || 80, fakeLeadRefund: admin.config?.fakeLeadRefund ?? true });

  useEffect(() => {
    setConfig({ leadDistributionLimit: admin.config?.leadDistributionLimit || 5, profileLockThreshold: admin.config?.profileLockThreshold || 80, fakeLeadRefund: admin.config?.fakeLeadRefund ?? true });
  }, [admin.config]);

  async function saveConfig(event) {
    event.preventDefault();
    await api.post('/admin/config', { ...config, leadDistributionLimit: Number(config.leadDistributionLimit), profileLockThreshold: Number(config.profileLockThreshold) });
    await refresh();
    notify('Platform configuration saved.');
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Section title="Roles & Permissions" icon={UserCog}>
        <div className="grid gap-2 sm:grid-cols-2">
          {admin.config?.roles?.map((role) => <div key={role} className="soft-card text-sm font-medium text-slate-700">{role}</div>)}
        </div>
      </Section>
      <Section title="Platform Configuration" icon={Globe2}>
        <form onSubmit={saveConfig} className="mb-4 grid gap-3">
          <input className="input" type="number" placeholder="Lead distribution limit" value={config.leadDistributionLimit} onChange={(e) => setConfig({ ...config, leadDistributionLimit: e.target.value })} />
          <input className="input" type="number" placeholder="Profile lock threshold" value={config.profileLockThreshold} onChange={(e) => setConfig({ ...config, profileLockThreshold: e.target.value })} />
          <label className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm"><input type="checkbox" checked={config.fakeLeadRefund} onChange={(e) => setConfig({ ...config, fakeLeadRefund: e.target.checked })} /> Fake lead refund</label>
          <button className="btn">Save Configuration</button>
        </form>
        <div className="space-y-3 text-sm text-slate-700">
          <p className="soft-card">WhatsApp API: {admin.config?.whatsappApi}</p>
          <p className="soft-card">Payment gateway: {admin.config?.paymentGateway}</p>
          <p className="soft-card">Lead distribution limit: {admin.config?.leadDistributionLimit}</p>
          <p className="soft-card">Fake lead refund: {String(admin.config?.fakeLeadRefund)}</p>
          <p className="soft-card">Profile lock threshold: {admin.config?.profileLockThreshold}%</p>
        </div>
      </Section>
    </div>
  );
}

function App() {
  const [active, setActive] = useState('overview');
  const [state, setState] = useState({ dashboard: null, businesses: [], leads: [], listings: [], automation: {}, subscriptions: [], admin: {} });
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [notice, setNotice] = useState(null);

  function notify(message, type = 'success') {
    setNotice({ message, type });
  }

  async function load() {
    const [dashboard, businesses, leads, listings, automation, subscriptions, admin] = await Promise.all([
      api.get('/dashboard'), api.get('/businesses'), api.get('/leads'), api.get('/listings'), api.get('/automation'), api.get('/subscriptions'), api.get('/admin')
    ]);
    setState({ dashboard: dashboard.data, businesses: businesses.data, leads: leads.data, listings: listings.data, automation: automation.data, subscriptions: subscriptions.data, admin: admin.data });
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const screen = useMemo(() => {
    if (active === 'customer') return <Customer businesses={state.businesses} leads={state.leads} refresh={load} session={session} notify={notify} />;
    if (active === 'vendor') return <Vendor businesses={state.businesses} listings={state.listings} leads={state.leads} refresh={load} notify={notify} />;
    if (active === 'automation') return <Automation automation={state.automation} subscriptions={state.subscriptions} refresh={load} notify={notify} />;
    if (active === 'admin') return <Admin admin={state.admin} refresh={load} notify={notify} />;
    if (active === 'super') return <SuperAdmin admin={state.admin} refresh={load} notify={notify} />;
    return <Overview data={state.dashboard} />;
  }, [active, state, session]);

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-mint text-white"><BriefcaseBusiness /></span>
          <div><h1 className="text-lg font-semibold tracking-tight">MarketFlow</h1><p className="text-xs text-slate-500">B2B lead marketplace</p></div>
        </div>
        <div className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900">
          <strong>SmartRank enabled</strong>
          <p className="mt-1 leading-5">Search, leads, approvals, campaigns, OTP, and seller tools are connected to the API.</p>
        </div>
        <nav className="mt-8 space-y-2">
          {navItems.map(([id, Icon, label]) => <button key={id} onClick={() => setActive(id)} className={`nav ${active === id ? 'nav-active' : ''}`}><Icon size={18} /> {label}</button>)}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="app-header">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-sm font-medium text-mint">Live workspace</p><h1 className="text-2xl font-semibold tracking-tight text-ink">{navItems.find(([id]) => id === active)?.[2]}</h1></div>
            <div className="toolbar">
              {session?.otpVerified && <Pill tone="green">{session.user.role} verified</Pill>}
              <div className="flex flex-wrap gap-2 lg:hidden">{navItems.map(([id, Icon]) => <button key={id} className={`icon ${active === id ? 'icon-active' : ''}`} onClick={() => setActive(id)}><Icon size={18} /></button>)}</div>
            </div>
          </div>
        </header>
        <div className="p-4 lg:p-8">
          <Notice notice={notice} onClear={() => setNotice(null)} />
          <AuthPanel session={session} setSession={setSession} notify={notify} />
          {loading ? <div className="rounded-lg bg-white p-8 text-center shadow-soft">Loading modules...</div> : screen}
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
