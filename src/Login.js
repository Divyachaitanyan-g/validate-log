import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Usercontext } from "./Usercontext";
function Login(props) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [dirty, setDirty] = useState({ email: false, password: false });
  let [error, setError] = useState({ email: [], password: [] });
  let [message, setMessage] = useState("");

  //global declaration of user state
  let Context = useContext(Usercontext);

  const navigate = useNavigate();
  let validate = () => {
    let errorData = {};
    errorData.email = [];
    if (!email) {
      errorData.email.push("email cannot be blank");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email) {
      if (!emailRegex.test(email)) {
        errorData.email.push("enter valid email ");
      }
    }

    errorData.password = [];
    if (!password) {
      errorData.password.push("password cannot be blank");
    }
    const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;

    if (password) {
      if (!passwordRegex.test(password)) {
        errorData.password.push("enter valid password ");
      }
    }
    setError(errorData);
  };

  useEffect(validate, [email, password]);

  let onloginclick = async () => {
    let dirtyData = dirty;
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData);
    validate();
    if (isvalid()) {
      let response = await fetch(
        `http://localhost:5000/users?email=${email}&password=${password}`,
        { method: "GET" }
      );
      if (response.ok) {
        let responsebody = await response.json();
        if (responsebody.length > 0) {
          //current user ddetails
          Context.setUser({
            ...Context.user,
            isLogin: true,
            CurrentUsername: responsebody[0].fullName,
            CurrentUserid: responsebody[0].id,
          });
          navigate("/Dashboard");
        } else {
          setMessage(<span className="text-danger">Invalid Login</span>);
        }
      }
    }
  };
  let isvalid = () => {
    let valid = true;
    for (let control in error) {
      if (error[control].length > 0) valid = false;
    }
    return valid;
  };

  return (
    <div className="row">
      <div className="col-lg-5 col-md-7 mx-auto">
        <div className="card border-success shadow-lg my-2">
          <div className="card-header border-bottom border-success">
            <h4
              style={{ fontSize: "28px" }}
              className="text-success text-center"
            >
              SIGN IN
            </h4>
          </div>

          <div className="card-body border-bottom border-success">
            {/*email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                onBlur={() => {
                  setDirty({ ...dirty, email: true });
                  validate();
                }}
              />
              <div className="text-danger">
                {dirty["email"] && error["email"][0] ? error["email"] : ""}
              </div>
            </div>
            {/*email ends*/}

            {/*password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                onBlur={() => {
                  setDirty({ ...dirty, password: true });
                  validate();
                }}
              />
              <div className="text-danger">
                {dirty["password"] && error["password"][0]
                  ? error["password"]
                  : ""}
              </div>
            </div>
            {/*password ends */}
          </div>
          {/* Submit button and message */}
          <div className="card-footer border-top border-success shadow-lg">
            <div className="m-1">{message}</div>
            <button
              className="btn btn-success m-2"
              style={{ float: "right" }}
              onClick={onloginclick}
            >
              Login
            </button>
            {/* Forgot Password Link */}
            <Link
              to="/forgot-password"
              className="text-muted"
              style={{ float: "left", fontSize: "13px" }}
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
