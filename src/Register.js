import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Usercontext } from "./Usercontext";
const Register = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    email: "",
    password: "",
    fullName: "",
    country: "",
    mobile: "",
  });
  let Context = useContext(Usercontext);
  const [countries] = useState([
    { id: 1, country: "Select Country" },
    { id: 2, country: "USA" },
    { id: 3, country: "Canada" },
    { id: 4, country: "India" },
    { id: 5, country: "UK" },
    { id: 6, country: "Australia" },
  ]);

  const [error, setError] = useState({
    email: [],
    password: [],
    fullName: [],
    mobile: [],
    country: [],
  });

  const [dirty, setDirty] = useState({
    email: false,
    password: false,
    fullName: false,
    mobile: false,
    country: false,
  });

  const [message, setMessage] = useState("");

  const validate = () => {
    let errorData = {};

    // Email validation
    errorData.email = [];
    if (!state.email) {
      errorData.email.push("Email can't be blank");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (state.email && !emailRegex.test(state.email)) {
      errorData.email.push("Enter a valid email");
    }

    // Password validation
    errorData.password = [];
    if (!state.password) {
      errorData.password.push("Password can't be blank");
    }
    const validPasswordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;
    if (state.password && !validPasswordRegex.test(state.password)) {
      errorData.password.push(
        "Password should be 6-15 characters long with at least one uppercase letter, one lowercase letter, and one digit "
      );
    }

    // Full name validation
    errorData.fullName = [];
    if (!state.fullName) {
      errorData.fullName.push("Name can't be blank");
    }

    // Country validation
    errorData.country = [];
    if (!state.country || state.country === "Select Country") {
      errorData.country.push("Please select a country");
    }

    // Mobile validation
    errorData.mobile = [];
    if (!state.mobile) {
      errorData.mobile.push("Mobile number can't be blank");
    }

    setError(errorData);
  };
  useEffect(validate, [state]);
  const isValid = () => {
    for (let control in error) {
      if (error[control].length > 0) {
        return false;
      }
    }
    return true;
  };

  const onRegisterClick = async () => {
    let dirtyData = { ...dirty };
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData);
    validate();

    if (isValid()) {
      let response = await fetch("http://localhost:5000/users", {
        method: "POST",
        body: JSON.stringify({
          email: state.email,
          password: state.password,
          fullName: state.fullName,
          mobile: state.mobile,
          country: state.country,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        let responseBody = await response.json();
        console.log(responseBody);
        if (responseBody) {
          // Update context with current user details
          Context.setUser({
            ...Context.user,
            isLogin: true,
            CurrentUsername: responseBody.fullName,
          });
          navigate("/Dashboard");
        } else {
          setMessage(<span className="text-danger">Enter Valid Details</span>);
        }
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card p-4 shadow">
          <h2 className="text-center mb-4">Sign Up</h2>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              className="form-control"
              value={state.fullName}
              name="fullName"
              onChange={(event) =>
                setState({ ...state, fullName: event.target.value })
              }
              onBlur={() => setDirty({ ...dirty, fullName: true })}
            />
            <div className="text-danger">
              {dirty.fullName && error.fullName ? error.fullName : ""}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              value={state.email}
              name="email"
              id="email"
              onChange={(event) =>
                setState({ ...state, email: event.target.value })
              }
              onBlur={() => setDirty({ ...dirty, email: true })}
            />
            <div className="text-danger">
              {dirty.email && error.email[0] ? error.email.join(", ") : ""}
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control"
              value={state.password}
              name="password"
              id="password"
              onChange={(event) =>
                setState({ ...state, password: event.target.value })
              }
              onBlur={() => setDirty({ ...dirty, password: true })}
            />
            <div className="text-danger">
              {dirty.password && error.password ? error.password : ""}
            </div>
          </div>

          {/* Mobile */}
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number:</label>
            <input
              type="tel"
              className="form-control"
              value={state.mobile}
              name="mobile"
              id="mobile"
              onChange={(event) =>
                setState({ ...state, mobile: event.target.value })
              }
              onBlur={() => setDirty({ ...dirty, mobile: true })}
            />
            <div className="text-danger">
              {dirty.mobile && error.mobile ? error.mobile : ""}
            </div>
          </div>

          {/* Country */}
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <select
              className="form-control"
              id="country"
              value={state.country}
              name="country"
              onChange={(event) =>
                setState({ ...state, country: event.target.value })
              }
              onBlur={() => setDirty({ ...dirty, country: true })}
            >
              {countries.map((country) => (
                <option key={country.id} value={country.country}>
                  {country.country}
                </option>
              ))}
            </select>
            <div className="text-danger">
              {dirty.country && error.country ? error.country : ""}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            {message}
            <button
              className="btn btn-primary mt-3 w-100"
              onClick={onRegisterClick}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
