import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Signup.css";

const Signup = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        password: "",

        role: "student"

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

            const res = await API.post("/register", formData);

            alert(res.data.message);

            navigate("/login");

        }

        catch (error) {

            alert(error.response.data.message);

        }

    }

    return (

        <div className="signup-container">

            <form
                className="signup-form"
                onSubmit={handleSubmit}
            >

                <h2>Create Account</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />

                <select
                    name="role"
                    onChange={handleChange}
                    value={formData.role}
                >

                    <option value="student">Student</option>

                    <option value="instructor">Instructor</option>

                </select>

                <button>

                    Sign Up

                </button>

                <p>

                    Already have an account?

                    <Link to="/login">

                        Login

                    </Link>

                </p>

            </form>

        </div>

    );

};

export default Signup;