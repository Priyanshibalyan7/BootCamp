import { useState } from "react";
import "./Form.css";

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    city: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.gender ||
      !formData.city ||
      !formData.terms
    ) {
      alert("Please fill all fields.");
      return;
    }

    alert("Form Submitted Successfully!");

    console.log(formData);

    setFormData({
      name: "",
      email: "",
      password: "",
      gender: "",
      city: "",
      terms: false,
    });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Registration Form</h2>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="gender">
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
            />
            Male
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
            />
            Female
          </label>
        </div>

        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
        >
          <option value="">Select City</option>
          <option>Delhi</option>
          <option>Mumbai</option>
          <option>Pune</option>
          <option>Jaipur</option>
        </select>

        <label className="terms">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          I accept Terms & Conditions
        </label>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Form;