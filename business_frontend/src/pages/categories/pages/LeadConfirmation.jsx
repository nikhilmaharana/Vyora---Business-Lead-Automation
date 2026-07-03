import { Link, useLocation } from "react-router-dom";

const LeadConfirmation = () => {

  const location = useLocation();

  const data = location.state;

  // Safety Check
  if (!data) {
    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-10 rounded-2xl shadow-md text-center">

          <h1 className="text-4xl font-bold text-red-500 mb-6">
            No Booking Data Found
          </h1>

          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Back to Services
          </Link>

        </div>

      </div>

    );
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-10">

      <div className="bg-white p-10 rounded-2xl shadow-md max-w-2xl w-full">

        <h1 className="text-5xl font-bold text-green-600 mb-8 text-center">
          Booking Confirmed
        </h1>

        <div className="space-y-4 text-lg">

          <p>
            <span className="font-bold">Name:</span> {data.name}
          </p>

          <p>
            <span className="font-bold">Phone:</span> {data.phone}
          </p>

          <p>
            <span className="font-bold">Address:</span> {data.address}
          </p>

          <p>
            <span className="font-bold">Service Date:</span> {data.date}
          </p>

        </div>

        <div className="mt-10 text-center">

          <Link
            to="/products"
            className="bg-gray-800 hover:bg-green-600 text-white hover:text-white px-6 py-3 rounded-xl"
          >
            Back to Services
          </Link>

        </div>

      </div>

    </div>
  );
};

export default LeadConfirmation;