const About = () => {
    return (
        <>
            <div className="bg-white text-gray-900">

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">

                    <div>
                        <span className="inline-block px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-700 mb-6">
                            Trusted Business Automation Platform
                        </span>

                        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
                            Simplifying Business Operations Through Smart Automation
                        </h1>

                        <p className="mt-6 text-gray-600 text-lg leading-8 max-w-2xl">
                            BusinessFlow helps businesses discover automation tools,
                            streamline workflows, connect with vendors, and manage operations
                            efficiently through modern digital solutions.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-8">
                            <button className="px-6 py-3 rounded-2xl bg-gray-900 text-white font-medium hover:bg-black transition-all">
                                Get Started
                            </button>

                            <button className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all">
                                Explore Services
                            </button>
                        </div>
                    </div>

                    {/* Hero Card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm">
                        <div className="grid grid-cols-2 gap-6">

                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-3xl font-bold">10K+</h2>
                                <p className="text-gray-500 mt-2 text-sm">
                                    Businesses Connected
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-3xl font-bold">500+</h2>
                                <p className="text-gray-500 mt-2 text-sm">
                                    Verified Vendors
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-3xl font-bold">24/7</h2>
                                <p className="text-gray-500 mt-2 text-sm">
                                    Customer Support
                                </p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-3xl font-bold">99%</h2>
                                <p className="text-gray-500 mt-2 text-sm">
                                    Client Satisfaction
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="bg-gray-50 border-y border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">

                        <div>
                            <span className="text-sm font-medium text-green-600 uppercase tracking-wide">
                                About Us
                            </span>

                            <h2 className="text-3xl sm:text-4xl font-bold mt-4 leading-tight">
                                Building Smarter Digital Business Ecosystems
                            </h2>

                            <p className="mt-6 text-gray-600 leading-8 text-lg">
                                Inspired by modern B2B platforms like IndiaMART and Sulekha,
                                BusinessFlow brings businesses, suppliers, and automation
                                providers together on a single intelligent platform.
                            </p>

                            <p className="mt-5 text-gray-600 leading-8 text-lg">
                                Our mission is to help startups, enterprises, and local
                                businesses automate operations, improve productivity, and scale
                                faster using modern digital tools.
                            </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">

                            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl mb-5">
                                    ⚡
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    Fast Automation
                                </h3>

                                <p className="text-gray-600 leading-7 text-sm">
                                    Simplify repetitive workflows using AI-powered automation
                                    systems.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl mb-5">
                                    🤝
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    Vendor Network
                                </h3>

                                <p className="text-gray-600 leading-7 text-sm">
                                    Connect with trusted service providers and business vendors.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl mb-5">
                                    📈
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    Business Growth
                                </h3>
                                <p className="text-gray-600 leading-7 text-sm">
                                    Scale operations efficiently with digital-first management.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl mb-5">
                                    🔒
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    Secure Platform
                                </h3>

                                <p className="text-gray-600 leading-7 text-sm">
                                    Enterprise-grade security for reliable business operations.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">

                    <div className="text-center max-w-3xl mx-auto">
                        <span className="text-sm font-medium text-green-600 uppercase tracking-wide">
                            Why Choose Us
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-bold mt-4">
                            Everything Your Business Needs in One Place
                        </h2>

                        <p className="mt-6 text-gray-600 text-lg leading-8">
                            From vendor discovery to workflow automation, BusinessFlow helps
                            organizations modernize and grow with confidence.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">

                        {[
                            "Smart Vendor Discovery",
                            "AI Automation Tools",
                            "Lead Management Solutions",
                            "Inventory & ERP Support",
                            "CRM & Marketing Integration",
                            "24/7 Customer Assistance",
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-3xl p-7 hover:shadow-lg transition-all"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold mb-5">
                                    {index + 1}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">
                                    {item}
                                </h3>

                                <p className="text-gray-600 leading-7 text-sm">
                                    Helping businesses improve efficiency with scalable digital
                                    solutions.
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                {/* CTA Section */}
                <section className="px-4 sm:px-6 pb-20">
                    <div className="max-w-7xl mx-auto bg-gray-900 rounded-4xl p-10 sm:p-16 text-center text-white">

                        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                            Ready to Automate Your Business?
                        </h2>

                        <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto leading-8">
                            Join thousands of businesses already using BusinessFlow to simplify
                            operations and accelerate growth.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mt-10">
                            <button className="px-7 py-3 rounded-2xl bg-green-500 hover:bg-green-600 transition-all text-white font-medium">
                                Get Started
                            </button>
                            <button className="px-7 py-3 rounded-2xl border border-gray-700 hover:bg-gray-800 transition-all text-white font-medium">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default About
