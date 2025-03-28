import { AuthContext } from "../context/auth-context";
import { Navigate } from "react-router-dom";
import { useContext } from "react";

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    return user ? <Navigate to="/courses" /> : children;
};

export default ProtectedRoute;
