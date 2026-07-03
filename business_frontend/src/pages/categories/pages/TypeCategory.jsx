import { useNavigate } from "react-router-dom";

const foodCategories = [
  {
    title: "Healthy Choices ",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    items: ["Salads", "Healthy Bowls", "Vegan Meals", "Protein Foods"],
  },
  {
    title: "World Cuisine",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800",
    items: ["Italian", "Chinese", "Japanese", "Mexican"],
  },
  {
    title: "Street Food",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    items: ["Burgers", "Pizza", "Rolls", "Sandwiches"],
  },
  {
    title: "Cafe & Drinks",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    items: ["Coffee", "Milkshakes", "Tea", "Cold Drinks"],
  },
  {
    title: "Desserts",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800",
    items: ["Cakes", "Ice Cream", "Donuts", "Pastries"],
  },
  {
    title: "Night Specials",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800",
    items: ["Late Night", "BBQ", "Mocktails", "Party Meals"],
  },
];

const TypeCatagory = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-200 min-h-screen">
      {/* Banner */}
      <div className="relative w-full h-62.5 md:h-87.5 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600"
          alt="Food Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-bold">
            IT'S ALL ABOUT FOOD
          </h1>

          <p className="text-green-400 text-lg mt-3">
            Discover • Order • Enjoy
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-9 py-9 bg-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Explore Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {foodCategories.map((category, index) => (
            <div
              key={index}
              className="bg-[#1f2937] rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-green-500/20 transition-all duration-300"
            >
              {/* Category Image */}
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-52 object-cover"
              />

              {/* Category Content */}
              <div className="p-5">
                <h3 className="text-2xl font-semibold text-green-400 mb-4">
                  {category.title}
                </h3>

                <div className="space-y-3">
                  {category.items.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => navigate("/products")}
                      className="cursor-pointer text-gray-200 hover:text-green-400 transition border-b border-gray-700 pb-2"
                    >
                      • {item}
                    </div>
                  ))}
                </div>

                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypeCatagory;