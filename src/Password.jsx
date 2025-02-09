import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    const response = await fetch(`http://localhost:5000/users?email=${email}`);
    const data = await response.json();
    if (data.length === 0) {
      alert("Invalid email ID");
    } else {
      const otp = Math.floor(1000 + Math.random() * 9000);
      setGeneratedOtp(otp);
      console.log("Generated OTP:", otp);
      setStep(2);
    }
  };

  const handleOtpSubmit = () => {
    if (parseInt(otp) === generatedOtp) {
      setStep(3);
    } else {
      alert("Incorrect OTP");
    }
  };

  const handlePasswordReset = async () => {
    let errorData = {};
    errorData.password = [];

    const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;

    // Check if password is not blank
    if (!newPassword) {
      errorData.password.push("Password cannot be blank");
    }

    // Check if password meets the criteria
    if (newPassword) {
      if (!passwordRegex.test(newPassword)) {
        errorData.password.push(
          "Password must be 6-15 characters long, include at least one uppercase letter, one lowercase letter, and one number."
        );
      }
    }

    // Set error state if there are any errors
    if (errorData.password.length > 0) {
      setError(errorData);
      return; // Exit the function if there are validation errors
    } else {
      setError({}); // Clear errors if validation passes
    }

    // If no validation errors, proceed with updating the password
    const response = await fetch(`http://localhost:5000/users?email=${email}`);
    const data = await response.json();
    if (data.length > 0) {
      const user = data[0]; // Ensure we are retrieving the user by email

      // Now, patch the user password using their unique ID
      await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      alert("Password reset successful");
      navigate("/");
    } else {
      alert("User not found");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-12">
          {step === 1 && (
            <div className="card mt-5">
              <div className="card-body">
                <h4 className="card-title">Forget Password</h4>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary" onClick={handleEmailSubmit}>
                  Submit
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card mt-5">
              <div className="card-body">
                <h4 className="card-title">Enter OTP</h4>
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">
                    OTP
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary" onClick={handleOtpSubmit}>
                  Verify OTP
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card mt-5">
              <div className="card-body">
                <h4 className="card-title">Reset Password</h4>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {/* Display validation errors */}
                  {error.password && error.password.length > 0 && (
                    <div className="alert alert-danger mt-2">
                      {error.password.map((err, index) => (
                        <p key={index}>{err}</p>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handlePasswordReset}
                >
                  Reset Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
