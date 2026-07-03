import {
  FaArrowRight,
  FaCalendarDays,
  FaUser,
} from "react-icons/fa6";

const blogData = [
  {
    title: "How AI Automation Is Transforming Modern Businesses",
    description:
      "Discover how AI-powered automation is helping businesses streamline operations and improve productivity.",
    category: "AI Automation",
    author: "BusinessFlow Team",
    date: "15 May 2026",
  },
  {
    title: "Top CRM Solutions For Growing Startups",
    description:
      "Explore modern CRM platforms that help startups manage leads, customer relationships, and sales efficiently.",
    category: "CRM Solutions",
    author: "Admin",
    date: "12 May 2026",
  },
  {
    title: "Why Businesses Need ERP Systems In 2026",
    description:
      "ERP software helps businesses manage inventory, finance, HR, and operations from one platform.",
    category: "ERP Software",
    author: "BusinessFlow Team",
    date: "10 May 2026",
  },
  {
    title: "Smart Inventory Management For Small Businesses",
    description:
      "Learn how digital inventory tools reduce operational costs and improve business efficiency.",
    category: "Inventory",
    author: "Admin",
    date: "08 May 2026",
  },
  {
    title: "Digital Marketing Automation Explained",
    description:
      "Automate campaigns, customer engagement, and lead nurturing using smart marketing tools.",
    category: "Marketing",
    author: "BusinessFlow Team",
    date: "05 May 2026",
  },
  {
    title: "Future Of Business Automation In India",
    description:
      "How Indian businesses are adopting automation and AI to scale operations faster than ever.",
    category: "Business Insights",
    author: "Editorial Team",
    date: "02 May 2026",
  },
];

const Insights = () => {
  return (
    <>
      <div className="bg-white text-gray-900 mt-6">

        {/* HERO SECTION */}
        <section className="px-4 sm:px-6 pb-20">
          <div className="relative 
                          max-w-7xl mx-auto 
                          overflow-hidden 
                          rounded-4xl 
                          min-h-105">

            {/* IMAGE */}
            <img
              src="src/assets/banners.jpg"
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* CONTENT */}
            <div className="relative z-10 
                            flex flex-col items-center justify-center 
                            text-center text-white 
                            min-h-105 px-6">

              <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                Stay Updated With Business Trends
              </h2>

              <p className="mt-6 text-gray-300 text-lg max-w-2xl leading-8">
                Get the latest insights on automation, AI, CRM, ERP,
                and digital business transformation.
              </p>

            </div>
          </div>
        </section>

        {/* FEATURED BLOG */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

          <div className="bg-gray-900
                           rounded-4xl 
                           overflow-hidden 
                           grid lg:grid-cols-2">

            {/* LEFT */}
            <div className="p-10 sm:p-14 
                            flex flex-col justify-center">

              <span className="inline-block w-fit px-4 py-2 
                               rounded-full bg-green-500
                               text-white text-sm 
                                font-medium mb-6">
                Featured Article
              </span>

              <h2 className="text-3xl sm:text-4xl 
                             font-bold
                             text-white 
                             leading-tight">
                The Rise Of AI Automation In Modern Enterprises
              </h2>

              <p className="mt-6 text-gray-300 leading-8 text-lg">
                Businesses are rapidly adopting AI-powered automation
                to improve productivity, customer engagement,
                and operational efficiency.
              </p>

              <div className="flex items-center gap-6 
                             mt-8 text-sm
                              text-gray-400">
                <div className="flex items-center gap-2">
                  <FaUser />
                  <span>BusinessFlow Team</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaCalendarDays />
                  <span>15 May 2026</span>
                </div>
              </div>

              <button className="mt-10 w-fit px-7 py-3 
                                 rounded-2xl bg-green-500
                                  hover:bg-green-600 
                                  transition-all
                                   text-white font-medium 
                                   flex items-center gap-3">
                Read Article
                <FaArrowRight />
              </button>
            </div>

            {/* RIGHT */}
            <div className="bg-gray-100 
                            flex items-center justify-center
                             p-10">

              <div className="text-center">
                <div className=" rounded-3xl bg-green-100 
                                flex items-center justify-center
                                 mx-auto overflow-hidden">

                  <img
                    src="src/assets/Analytics.png"
                    alt="Analytics"
                    className="w-full h-full object-contain"
                  />

                </div>

                <h3 className="mt-10 
                               text-2xl
                               font-bold
                               text-gray-900">
                  AI Business Analytics
                </h3>

                <p className="mt-3 text-gray-600 leading-7">
                  Data-driven insights for smarter automation decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOG GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

          <div className="flex items-center justify-between flex-wrap gap-4 mb-12">

            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Latest Articles
              </h2>
              <p className="text-gray-600 mt-3 leading-7">
                Explore recent business insights and automation trends.
              </p>
            </div>

            <button className="px-6 py-3 
                              rounded-2xl border border-gray-300
                               hover:bg-gray-100 
                               transition-all 
                               font-medium">
              View All
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {blogData.map((blog, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-4xl 
                           overflow-hidden 
                           shadow-sm 
                           hover:shadow-xl 
                           transition-all group"
              >

                {/* IMAGE */}
                <div className="h-52
                              bg-gray-100
                               flex items-center justify-center
                                overflow-hidden">

                  <img
                    src="src/assets/AI.png"
                    alt="Blog"
                    className="w-full h-full object-cover 
                              group-hover:scale-105 
                              transition-transform duration-500"
                  />

                </div>

                {/* CONTENT */}
                <div className="p-7">

                  <span className="inline-block px-4 py-2 
                                   rounded-full
                                   bg-green-100 text-green-700
                                    text-xs font-medium">
                    {blog.category}
                  </span>

                  <h3 className="text-2xl font-bold 
                                 mt-5 leading-tight
                                  group-hover:text-green-600 transition-all">
                    {blog.title}
                  </h3>

                  <p className="mt-4 text-gray-600 leading-7 text-sm">
                    {blog.description}
                  </p>

                  <div className="flex items-center justify-between 
                                  mt-8 text-sm text-gray-500">

                    <div className="flex items-center gap-2">
                      <FaUser />
                      <span>{blog.author}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCalendarDays />
                      <span>{blog.date}</span>
                    </div>
                  </div>

                  <button className="mt-8 
                                    flex items-center gap-3
                                     text-green-600 
                                     font-medium 
                                     hover:gap-4 
                                     transition-all">
                    Read More
                    <FaArrowRight />
                  </button>

                </div>
              </div>
            ))}

          </div>
        </section>

        {/* CTA SECTION */}
        <section className="px-4 sm:px-6 pb-20">

          <div className="max-w-7xl mx-auto
                        bg-gray-900 
                        rounded-4xl 
                        p-10 sm:p-16 
                        text-center text-white">

            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Stay Updated With Business Trends
            </h2>

            <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto leading-8">
              Get the latest insights on automation, AI, CRM, ERP,
              and digital business transformation.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">

              <button className="px-7 py-3 rounded-2xl
                                 bg-green-500
                                 hover:bg-green-600 
                                  transition-all
                                 text-white font-medium">
                Subscribe Now
              </button>

              <button className="px-7 py-3 
                                rounded-2xl border border-gray-700
                               hover:bg-gray-800 
                                transition-all
                                 text-white font-medium">
                Explore Services
              </button>

            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Insights;
