import {
    FaLocationDot,
    FaPhone,
    FaEnvelope,
    FaBolt,
    FaHandshake
} from "react-icons/fa6";

const Contact = () => {
    return (
        <>
            <div className="bg-white text-gray-900">

                {/* Hero Section */}
                <section className="px-4 sm:px-6 py-20">
                    <div className="relative max-w-7xl mx-auto overflow-hidden rounded-4xl">

                        {/* BACKGROUND IMAGE */}
                        <img
                            src="src/assets/banners.jpg"
                            alt="Contact Banner"
                            className="absolute inset-0 h-full w-full object-cover"
                        />

                        {/* DARK OVERLAY */}
                        <div className="absolute inset-0 bg-black/60"></div>

                        {/* CONTENT */}
                        <div className="relative z-10 px-8 py-20 sm:px-16 text-center text-white">

                            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-sm font-medium border border-white/20 mb-6">
                                Contact BusinessFlow
                            </span>

                            <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight max-w-4xl mx-auto">
                                We’d Love To Hear From You
                            </h1>

                            <p className="mt-6 text-gray-300 text-lg leading-8 max-w-2xl mx-auto">
                                Whether you're looking for automation solutions, vendor support,
                                or business services, our team is here to help you grow smarter.
                            </p>

                        </div>
                    </div>
                </section>
                {/* Main Contact Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

                    <div className="grid lg:grid-cols-2 gap-10">

                        {/* Contact Form */}
                        <div className="bg-white border border-gray-200 rounded-4xl p-8 sm:p-10 shadow-sm">

                            <div className="mb-8">
                                <h2 className="text-3xl font-bold">
                                    Send Us a Message
                                </h2>

                                <p className="text-gray-600 mt-3 leading-7">
                                    Fill out the form and our team will get back to you shortly.
                                </p>
                            </div>

                            <form className="space-y-6">

                                <div className="grid sm:grid-cols-2 gap-6">

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-2">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-green-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-2">
                                            Phone Number
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter phone number"
                                            className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-green-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-green-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Service Interested In
                                    </label>

                                    <select className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-green-500 transition-all text-gray-600">

                                        <option>Select Service</option>
                                        <option>CRM Solutions</option>
                                        <option>ERP Software</option>
                                        <option>Inventory Management</option>
                                        <option>AI Automation</option>
                                        <option>Marketing Tools</option>

                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Message
                                    </label>

                                    <textarea
                                        rows="5"
                                        placeholder="Tell us about your business requirement..."
                                        className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:border-green-500 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-2xl bg-gray-900 hover:bg-black transition-all text-white font-medium"
                                >
                                    Submit Requirement
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">

                            {/* Info Card */}
                            <div className="bg-gray-50 border border-gray-200 rounded-4xl p-8 sm:p-10">

                                <h2 className="text-3xl font-bold mb-8">
                                    Contact Information
                                </h2>

                                <div className="space-y-7">

                                    <div className="flex items-start gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                                            <FaLocationDot />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                Office Address
                                            </h3>

                                            <p className="text-gray-600 mt-2 leading-7">
                                                Sambalpur, Odisha, India
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                                            <FaPhone />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                Phone Number
                                            </h3>

                                            <p className="text-gray-600 mt-2 leading-7">
                                                +91 98765 43210
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                                            <FaEnvelope />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                Email Address
                                            </h3>

                                            <p className="text-gray-600 mt-2 leading-7">
                                                support@businessflow.com
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Support Cards */}
                            <div className="grid sm:grid-cols-2 gap-6">

                                <div className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm">

                                    <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-2xl mb-5">
                                        <FaBolt />
                                    </div>

                                    <h3 className="text-xl font-semibold mb-3">
                                        Fast Support
                                    </h3>

                                    <p className="text-gray-600 leading-7 text-sm">
                                        Get quick assistance from our dedicated support team.
                                    </p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm">

                                    <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-2xl mb-5">
                                        <FaHandshake />
                                    </div>

                                    <h3 className="text-xl font-semibold mb-3">
                                        Vendor Assistance
                                    </h3>

                                    <p className="text-gray-600 leading-7 text-sm">
                                        Connect with trusted vendors and business partners.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-4 sm:px-6 pb-20">

                    <div className="max-w-7xl mx-auto bg-gray-900 rounded-4xl p-10 sm:p-16 text-center text-white">

                        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                            Let’s Build Smarter Businesses Together
                        </h2>

                        <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto leading-8">
                            BusinessFlow helps companies automate operations,
                            improve efficiency, and scale digitally.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mt-10">

                            <button className="px-7 py-3 rounded-2xl bg-green-500 hover:bg-green-600 transition-all text-white font-medium">
                                Get Started
                            </button>

                            <button className="px-7 py-3 rounded-2xl border border-gray-700 hover:bg-gray-800 transition-all text-white font-medium">
                                Explore Services
                            </button>

                        </div>
                    </div>
                </section>
            </div>

        </>
    );
};

export default Contact;



