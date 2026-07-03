import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BookService = () => {
  const location = useLocation();
  const selectedPackage = location.state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.date
    ) {
      alert("Please fill all fields");
      return;
    }

    navigate("/lead-confirmation", {
      state: {
        ...formData,
        packageName: selectedPackage?.packageName,
        packagePrice: selectedPackage?.packagePrice,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="bg-gray-900 px-8 py-10">
          <h1 className="text-4xl font-bold text-white">
            Book Your Service
          </h1>

          <p className="text-gray-300 mt-2">
            Complete the form below and confirm your booking.
          </p>
        </div>

        <div className="p-8 md:p-10">

          {/* Service Highlights */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">

            <div className="bg-gray-50 rounded-xl p-5 text-center border">
              <h4 className="font-bold text-gray-800">
                Instant Booking
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Quick confirmation process
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 text-center border">
              <h4 className="font-bold text-gray-800">
                Verified Professionals
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Trusted service providers
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 text-center border">
              <h4 className="font-bold text-gray-800">
                Secure Service
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Reliable and safe booking
              </p>
            </div>

          </div>

          {/* Selected Package */}
          <div className="bg-green-50 border-l-4 border-green-600 rounded-2xl p-6 mb-8">
            <h2 className="text-lg text-gray-500 font-medium">
              Selected Package
            </h2>

            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {selectedPackage?.packageName || "No Package Selected"}
            </h3>

            <p className="text-green-600 text-3xl font-bold mt-2">
              {selectedPackage?.packagePrice}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block mb-2 text-gray-800 font-semibold">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="
                  w-full
                  border-2
                  border-gray-200
                  rounded-xl
                  px-4
                  py-4
                  bg-white
                  text-gray-700
                  focus:border-green-600
                  focus:ring-4
                  focus:ring-green-100
                  outline-none
                  transition-all
                "
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-gray-800 font-semibold">
                Phone Number
              </label>

              <input
                type="tel"
                placeholder="Enter your phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="
                  w-full
                  border-2
                  border-gray-200
                  rounded-xl
                  px-4
                  py-4
                  bg-white
                  text-gray-700
                  focus:border-green-600
                  focus:ring-4
                  focus:ring-green-100
                  outline-none
                  transition-all
                "
              />
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 text-gray-800 font-semibold">
                Address
              </label>

              <textarea
                rows="4"
                placeholder="Enter your complete address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="
                  w-full
                  border-2
                  border-gray-200
                  rounded-xl
                  px-4
                  py-4
                  bg-white
                  text-gray-700
                  focus:border-green-600
                  focus:ring-4
                  focus:ring-green-100
                  outline-none
                  transition-all
                  resize-none
                "
              />
            </div>

            {/* Date */}
            <div>
              <label className="block mb-2 text-gray-800 font-semibold">
                Service Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="
                  w-full
                  border-2
                  border-gray-200
                  rounded-xl
                  px-4
                  py-4
                  bg-white
                  text-gray-700
                  focus:border-green-600
                  focus:ring-4
                  focus:ring-green-100
                  outline-none
                  transition-all
                "
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="
                w-full
                bg-green-600
                hover:bg-green-700
                text-white
                py-4
                rounded-xl
                text-lg
                font-semibold
                shadow-lg
                hover:shadow-xl
                transition-all
                duration-300
              "
            >
              Confirm Booking
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BookService;