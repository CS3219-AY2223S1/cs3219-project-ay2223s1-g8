import { Outlet, Navigate } from "react-router-dom";
import { hasToken } from "../utils/tokenUtils";

const PrivateRoutes = () => {
  return hasToken() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
