import { Route } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminVendors from "../pages/admin/AdminVendors";
import AdminLeads from "../pages/admin/AdminLeads";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminVendorRegistrations from "../pages/admin/AdminVendorRegistrations";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminBusinesses from "../pages/admin/AdminBusinesses";
import AdminFakeData from "../pages/admin/AdminFakeData";
import AdminReports from "../pages/admin/AdminReports";
import AdminReviews from "../pages/admin/AdminReviews";
import AdminVerifications from "../pages/admin/AdminVerifications";

const AdminRoutes = () => {
  return (
    <>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/vendors" element={<AdminVendors />} />
      <Route path="/admin/leads" element={<AdminLeads />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/vendor-registrations" element={<AdminVendorRegistrations />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/admin/businesses" element={<AdminBusinesses />} />
      <Route path="/admin/fake-data" element={<AdminFakeData />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/reviews" element={<AdminReviews />} />
      <Route path="/admin/verifications" element={<AdminVerifications />} />
    </>
  );
};

export default AdminRoutes;
