import { Routes } from "react-router-dom";
import PublicRoutes from "./public.route.jsx";
import AdminRoutes from "./admin.route.jsx";
import VendorRoutes from "./vender.routes.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {PublicRoutes()}
      {AdminRoutes()}
      {VendorRoutes()}
    </Routes>
  );
};

export default AppRoutes;