import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaUserShield,
  FaLock,
  FaHandshake,
  FaAward,
} from "react-icons/fa6";
import { FaEnvelope, FaWhatsapp } from "react-icons/fa";

import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/Logo.jpeg";
import { useState } from "react";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-lg font-bold">Stay Updated with Vyora</h3>
              <p className="text-sm text-gray-400 mt-1">Get the latest business trends and vendor updates.</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-md gap-2">
              <div className="relative flex-1">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-green-500/20 transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-white hover:bg-green-600 transition shrink-0"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 text-sm text-center lg:text-left shrink-0">✓ Subscribed successfully!</p>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-b border-gray-800 bg-gray-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center gap-3 justify-center">
              <FaUserShield className="text-[#22C55E] text-xl" />
              <div className="text-left">
                <p className="text-white text-sm font-semibold">Verified Vendors</p>
                <p className="text-gray-400 text-xs">Trusted businesses</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <FaLock className="text-[#22C55E] text-xl" />
              <div className="text-left">
                <p className="text-white text-sm font-semibold">Secure Platform</p>
                <p className="text-gray-400 text-xs">Data protection</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <FaHandshake className="text-[#22C55E] text-xl" />
              <div className="text-left">
                <p className="text-white text-sm font-semibold">Easy Connect</p>
                <p className="text-gray-400 text-xs">Direct vendor reach</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <FaAward className="text-[#22C55E] text-xl" />
              <div className="text-left">
                <p className="text-white text-sm font-semibold">Best Match</p>
                <p className="text-gray-400 text-xs">Smart discovery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img src={Logo} alt="logo" className="w-32 h-20 rounded-2xl object-cover" />
          </div>
          <p className="text-sm leading-7 text-gray-400 max-w-sm">
            India's trusted B2B marketplace for business services. Find verified vendors, compare services, and grow your business with Vyora.
          </p>
          {/* WhatsApp Contact */}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600/20 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-600/30 transition border border-green-600/30"
          >
            <FaWhatsapp size={16} />
            Chat on WhatsApp
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">Quick Links</h3>
          <div className="flex flex-col gap-3 text-sm">
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/about')}>About Us</button>
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/contact')}>Contact Us</button>
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/search')}>Search Services</button>
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/categories')}>Categories</button>
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/faq')}>FAQ</button>
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/insight')}>Insights</button>
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/help')}>Help Center</button>
          </div>
        </div>

        {/* Buyer / Seller Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">For Buyers & Sellers</h3>
          <div className="flex flex-col gap-3 text-sm">
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/instant-hire')}>Post Requirement</button>
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/top-rated-businesses')}>Top Rated Businesses</button>
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/trending-services')}>Trending Services</button>
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/compare-businesses')}>Compare Businesses</button>
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/signup')}>Register as Vendor</button>
            <button className="hover:text-green-400 transition-all text-left" onClick={() => navigate('/search')}>Find Services</button>
          </div>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">Contact Us</h3>
          <div className="space-y-3 text-sm text-gray-400">
            <p>support@vyora.in</p>
            <p>+91 98765 43210</p>
            <p>Odisha, India</p>
          </div>

          {/* Social Icons */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button className="w-11 h-11 rounded-2xl bg-gray-800 hover:bg-green-500 transition-all flex items-center justify-center text-lg text-white">
              <Link to="https://www.facebook.com/" target="_blank"><FaFacebookF /></Link>
            </button>
            <button className="w-11 h-11 rounded-2xl bg-gray-800 hover:bg-green-500 transition-all flex items-center justify-center text-lg text-white">
              <Link to="https://www.instagram.com/" target="_blank"><FaInstagram /></Link>
            </button>
            <button className="w-11 h-11 rounded-2xl bg-gray-800 hover:bg-green-500 transition-all flex items-center justify-center text-lg text-white">
              <Link to="https://www.linkedin.com/" target="_blank"><FaLinkedinIn /></Link>
            </button>
            <button className="w-11 h-11 rounded-2xl bg-gray-800 hover:bg-green-500 transition-all flex items-center justify-center text-lg text-white">
              <Link to="https://x.com/" target="_blank"><FaXTwitter /></Link>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 text-center md:text-left">
          <p>© 2026 Vyora. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button className="hover:text-green-400 transition-all" onClick={() => navigate('/privacy-policy')}>
              Privacy Policy
            </button>
            <button className="hover:text-green-400 transition-all" onClick={() => navigate('/terms')}>
              Terms & Conditions
            </button>
            <button className="hover:text-green-400 transition-all" onClick={() => navigate('/faq')}>
              FAQ
            </button>
            <button className="hover:text-green-400 transition-all" onClick={() => navigate('/help')}>
              Help
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;