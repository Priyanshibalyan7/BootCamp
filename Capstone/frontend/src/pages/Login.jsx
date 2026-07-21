import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../Context/AuthContext";
import "./Login.css";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({

        email: "",

        password: ""

    });

    function handleChange(e) {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            const res = await API.post("/login", formData);

            login(res.data.user, res.data.token);

            if (res.data.user.role === "student") {

                navigate("/student/dashboard");

            }

            else if (res.data.user.role === "instructor") {

                navigate("/instructor/dashboard");

            }

            else {

                navigate("/admin/dashboard");

            }

        }

        catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                error.message ||
                "Login failed"
            );

        }

    }

    return (

        <div className="login-container">

            <form
                className="login-form"
                onSubmit={handleSubmit}
            >

                <h2>Login</h2>

                <input

                    type="email"

                    name="email"

                    placeholder="Enter Email"

                    onChange={handleChange}

                />

                <input

                    type="password"

                    name="password"

                    placeholder="Enter Password"

                    onChange={handleChange}

                />

                <button>

                    Login

                </button>

                <p>

                    Don't have an account?

                    <Link to="/signup">

                        Signup

                    </Link>

                </p>

            </form>

        </div>

    );

};

export default Login;