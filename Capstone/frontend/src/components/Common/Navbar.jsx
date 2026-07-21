import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import "./Navbar.css";

const Navbar = () => {

    const { user, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    function handleLogout() {

        logout();

        navigate("/login");

    }

    return (

        <nav className="navbar">

            <div className="logo">

                <Link to="/">EduVerse</Link>

            </div>

            <ul className="nav-links">

                <li>
                    <Link to="/">Home</Link>
                </li>

                <li>
                    <Link to="/courses">Courses</Link>
                </li>

                <li>
                    <Link to="/about">About</Link>
                </li>

                <li>
                    <Link to="/contact">Contact</Link>
                </li>

            </ul>

            <div className="nav-buttons">

                {!user ? (

                    <>
                        <Link to="/login">
                            <button className="login-btn">
                                Login
                            </button>
                        </Link>

                        <Link to="/signup">
                            <button className="signup-btn">
                                Sign Up
                            </button>
                        </Link>
                    </>

                ) : (

                    <>
                        <span className="welcome-text">
                            Welcome, {user.name}
                        </span>

                        {user.role === "student" && (
                            <Link to="/student/dashboard">
                                <button className="dashboard-btn">
                                    Dashboard
                                </button>
                            </Link>
                        )}

                        {user.role === "instructor" && (
                            <Link to="/instructor/dashboard">
                                <button className="dashboard-btn">
                                    Dashboard
                                </button>
                            </Link>
                        )}

                        {user.role === "admin" && (
                            <Link to="/admin/dashboard">
                                <button className="dashboard-btn">
                                    Dashboard
                                </button>
                            </Link>
                        )}

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </>

                )}

            </div>

        </nav>

    );

};

export default Navbar;