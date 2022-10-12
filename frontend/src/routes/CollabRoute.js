import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { matchSelector } from "../stores/match/match.slice";

const CollabRoute = () => {
  const { matchId } = useSelector(matchSelector);
  return matchId !== null && matchId !== "" ? <Outlet /> : <Navigate to="/match" />;
};

export default CollabRoute;
