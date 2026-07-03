import { Route } from "react-router-dom";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorListings from "../pages/vendor/VendorListings";
import VendorLeads from "../pages/vendor/VendorLeads";
import VendorSettings from "../pages/vendor/VendorSettings";
import VendorProducts from "../pages/vendor/VendorProducts";
import VendorRegistration from "../pages/vendor/VendorRegistration";
import VendorVerification from "../pages/vendor/VendorVerification";

const VendorRoutes = () => {
  return (
    <>
      <Route path="/vendor/dashboard" element={<VendorDashboard />} />
      <Route path="/vendor/listings" element={<VendorListings />} />
      <Route path="/vendor/leads" element={<VendorLeads />} />
      <Route path="/vendor/settings" element={<VendorSettings />} />
      <Route path="/vendor/products" element={<VendorProducts />} />
      <Route path="/vendor/register" element={<VendorRegistration />} />
      <Route path="/vendor/verification" element={<VendorVerification />} />
    </>
  );
};

export default VendorRoutes;
