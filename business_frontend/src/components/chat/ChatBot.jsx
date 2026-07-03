import { useState, useEffect, useRef } from "react";
import Icon from "../common/Icon";

const quickReplies = [
  { text: "Find a service", icon: "search" },
  { text: "Compare businesses", icon: "compare_arrows" },
  { text: "Post a requirement", icon: "assignment" },
  { text: "Talk to support", icon: "headset_mic" },
  { text: "View trending services", icon: "local_fire_department" },
  { text: "Vendor registration", icon: "storefront" },
];

const faqAnswers = {
  "find a service": "You can search for services using our search bar at the top, or browse categories from the Categories page. We have 500+ verified businesses across multiple categories.",
  "compare businesses": "You can select up to 3 businesses and compare their ratings, pricing, services, and verification status side by side. Visit the Compare page to get started.",
  "post a requirement": "Go to Instant Hire from the navigation menu. Fill in your requirement details, and we'll match you with suitable vendors who will reach out to you.",
  "talk to support": "You can reach our support team at support@vyora.in or call us at +91 98765 43210. We're available 24/7 to assist you.",
  "view trending services": "Visit our Trending Services page to see what services are currently in high demand. You can find vendors for those services directly.",
  "vendor registration": "Vendors can register by visiting the Sign Up page and selecting 'Business Owner' role, or contact us directly for featured listings.",
};

const defaultResponses = [
  "I'd be happy to help you find the right service! What are you looking for?",
  "Thanks for reaching out! Let me assist you with finding trusted businesses near you.",
  "We have a wide range of verified service providers. Tell me more about your requirement!",
  "You can browse categories, search for specific services, or post a requirement directly.",
  "Our platform makes it easy to discover, compare, and connect with local businesses.",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "👋 Hello! Welcome to Vyora. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", text }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleQuickReply = (reply) => {
    setMessages((prev) => [...prev, { type: "user", text: reply.text }]);
    const answer = faqAnswers[reply.text.toLowerCase()];
    if (answer) {
      addBotMessage(answer);
    } else {
      addBotMessage("Let me connect you with the right information. Could you tell me more about what you need?");
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { type: "user", text }]);
    setInput("");

    const lowercase = text.toLowerCase();
    let response = null;

    if (lowercase.includes("hi") || lowercase.includes("hello") || lowercase.includes("hey")) {
      response = "Hello! 👋 How can I assist you with finding businesses or services today?";
    } else if (lowercase.includes("price") || lowercase.includes("cost") || lowercase.includes("budget")) {
      response = "Our businesses offer various pricing ranges. You can filter by budget in the Search page to find services that match your budget. Typically, prices range from ₹5,000 to ₹5,00,000+ depending on the service.";
    } else if (lowercase.includes("verified") || lowercase.includes("trust") || lowercase.includes("authentic")) {
      response = "Yes! We have verified businesses with trust badges. Look for the ✅ Verified badge on business cards. These businesses have completed our verification process.";
    } else if (lowercase.includes("contact") || lowercase.includes("support") || lowercase.includes("help")) {
      response = "You can reach our support team at support@vyora.in or call +91 98765 43210. For urgent queries, use the WhatsApp button available on business profiles.";
    } else if (lowercase.includes("refund") || lowercase.includes("cancel") || lowercase.includes("return")) {
      response = "For refund and cancellation policies, please contact the specific business directly as policies vary. If you need assistance, our support team can help mediate.";
    } else if (lowercase.includes("register") || lowercase.includes("vendor") || lowercase.includes("sell")) {
      response = "Want to list your business on Vyora? Great! Sign up as a Business Owner and you can start listing your services, receive leads, and grow your business online.";
    } else if (lowercase.includes("review") || lowercase.includes("rating")) {
      response = "You can view ratings and reviews on each business profile page. Ratings are based on customer feedback and help you make informed decisions.";
    } else if (lowercase.includes("location") || lowercase.includes("near") || lowercase.includes("city")) {
      response = "You can search by city, area, or use the 'Near Me' feature to find businesses in your location. We cover multiple cities across India.";
    } else if (lowercase.includes("thank")) {
      response = "You're welcome! 😊 Is there anything else I can help you with? Feel free to browse our categories or search for specific services.";
    } else {
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    addBotMessage(response);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl transition-all duration-300 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 scale-90"
            : "bg-[#22C55E] hover:bg-green-600 hover:scale-110"
        }`}
        aria-label="Chat with us"
      >
        {isOpen ? (
          <Icon name="close" size={24} className="text-white" />
        ) : (
          <span className="relative">
            <Icon name="chat" size={24} className="text-white" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-400 animate-ping" />
          </span>
        )}
      </button>

      {/* Chat Window - positioned relative to viewport with max-height constraint */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="fixed bottom-0 right-0 left-auto z-[100] w-[380px] max-w-[calc(100vw-24px)] rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl overflow-hidden animate-slide-up"
          style={{
            maxHeight: "calc(100vh - 100px)",
            bottom: "80px",
            right: "20px",
            left: "auto"
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#111827] to-[#1a2332] p-4 text-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E] flex-shrink-0">
                <Icon name="smart_toy" size={22} className="text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm">Vyora Assistant</h3>
                <p className="text-[11px] text-gray-300 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Online
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto rounded-lg bg-white/10 p-1.5 hover:bg-white/20 transition flex-shrink-0"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[320px] overflow-y-auto p-4 bg-[#F9FAFB] space-y-3" style={{ maxHeight: "calc(100vh - 320px)" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.type === "user"
                      ? "bg-[#22C55E] text-white rounded-br-md"
                      : "bg-white border border-[#E5E7EB] text-[#1F2937] rounded-bl-md shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white border border-[#E5E7EB] px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 bg-[#F9FAFB] flex-shrink-0">
              <p className="text-[11px] text-gray-400 mb-2 font-medium">Quick Help</p>
              <div className="flex flex-wrap gap-1.5">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(reply)}
                    className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E5E7EB] px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:border-[#22C55E] hover:text-[#22C55E] hover:bg-green-50 transition"
                  >
                    <Icon name={reply.icon} size={13} />
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-[#E5E7EB] p-3 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-sm outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-green-100"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E] text-white hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Icon name="send" size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </>
  );
};

export default ChatBot;