import { Outlet, Navigate } from "react-router-dom";
import { hasToken } from "../utils/tokenUtils";

const PublicRoutes = () => {
  return !hasToken() ? <Outlet /> : <Navigate to="/match" />;
};

export default PublicRoutes;
