import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const allowedRoutes = {
  admin: [
    "/admin/dashboard",
    "/residentmanagement",
    "/income",
    "/expense",
    "/other-income",
    "/facilitymanagement",
    "/complainttable",
    "/visitorlog",
    "/securityguard",
    "/announcement",
    "/editprofile",
    "/ownerform",
    "/ownerform/edit",
    "/tenantform",
    "/tenantform/edit",
    "/note",
    "/reqtracking",
    "/SecurityProtocols",
  ],
  resident: [
    "/resident/dashboard",
    "/residentowner",
    "/serviceandcomplaint",
    "/residentsecurityprotocol",
  ],
  security: [
    "/visitortracking",
    "/emergencymanagement",
  ],
};

const PrivateRoutes = ({ children }) => {
  const { isAuthenticate, user } = useSelector((store) => store.auth);
  const location = useLocation();

  if (!isAuthenticate || !user) {
    return <Navigate to="/" replace />;
  }

  const role = user?.role;
  const allowed = allowedRoutes[role];

  if (allowed && !allowed.includes(location.pathname)) {
    const fallback =
      role === "admin"
        ? "/admin/dashboard"
        : role === "resident"
        ? "/resident/dashboard"
        : "/visitortracking";

    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoutes;
