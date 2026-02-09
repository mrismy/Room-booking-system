import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
    title: string;
    subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleSignIn = () => {
        navigate("/login");
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <div className="header-brand">
                    <h1 className="header-title">{title}</h1>
                    {subtitle && <p className="header-subtitle">{subtitle}</p>}
                </div>
            </div>

            <nav className="header-nav">
                <Link to="/rooms" className="nav-link">
                    Rooms
                </Link>
                <Link to="/bookings" className="nav-link">
                    Bookings
                </Link>
            </nav>

            <div className="header-right">
                {user ? (
                    <div className="user-profile">
                        <div className="user-avatar">
                            {user.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{user}</span>
                        <button
                            onClick={handleLogout}
                            className="btn btn-logout"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleSignIn}
                        className="btn btn-primary btn-signin"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
