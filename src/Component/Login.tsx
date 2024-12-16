import React, { useState } from 'react';
import './login.css'; // Importing the CSS file
import logo from "../assets/logo.png"
import { Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import Headers from './Header';
import { useSelector, useDispatch } from 'react-redux';
import userSlice, { userDetails } from "../userSlice"
import { useAppSelector } from '../reduxHooks';
import { useNavigate } from "react-router-dom";


// Define the state interface for the form
interface LoginFormState {
  otp: unknown;
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormState>({ username: '', password: '', otp: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotUserName, setShowForgotUserName] = useState(false);
  const [showToken, setShowToken] = useState(false)
  const [forgotPassword, setForgotPassword] = useState({ email: "", userName: "" })
  const [forgotUserEmail, setForgotUserEmail] = useState("");
  const [resetPassword, setResetPassword] = useState({ token: "", password: "", confirmPassword: "" })
  const dispatch = useDispatch();
  const [enterOTP, setEnterOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const Loader = () => (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '1.5em',
      color: '#333',
      zIndex: 1
    }}>
      Loading...
    </div>
  );

  const navigate = useNavigate();


  const backendCall = async () => {
    setIsLoading(true);
    if (formData.password == "" || formData.username == "") {
      setIsLoading(false);
      toast.error(formData.username == "" ? "User Name is Mandatory" : "Passowrd is Mandatory")
    } else {
      setIsLoading(false);
      var body = { userName: formData.username, password: formData.password }
      dispatch(userDetails({
        userName: formData.username
      }));
      try {
        const response = await fetch('http://localhost:9000/api/patient/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          setIsLoading(false);
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
        } else {
          setIsLoading(false);
          setEnterOTP(true);
        }

        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        setIsLoading(false);
        toast.error('Error making POST request:');
      }
    }

  }

  // if (loading) return <p>Loading...</p>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission (e.g., API call)
  };

  const handleOptVerify = async (e: any) => {
    setIsLoading(true);
    if (formData.otp == "") {
      setIsLoading(false);
      toast.error("Please enter OTP")
    } else {
      setIsLoading(false);
      var body = { userName: formData.username, otp: formData.otp }
      dispatch(userDetails({
        userName: formData.username
      }));
      try {
        const response = await fetch('http://localhost:9000/api/patient/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          setIsLoading(false);
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
          if (errorMessage == "OTP has Expired.") {
            setEnterOTP(false)
          } else if (errorMessage == "OTP is Invalid.") {
            setFormData({ ...formData, otp: "" });
          }
        } else {
          setIsLoading(false);
          navigate("/");
        }

        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        setIsLoading(false);
        toast.error('Error making POST request:');
      }
    }
  }
  const handleRegister = () => {
    navigate("/register")
  }

  const handleForgotPasswordEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:9000/api/patient/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotPassword),
      });

      if (!response.ok) {
        setIsLoading(false);
        const errorMessage = await response.text(); // Use response.json() if server returns JSON
        toast.error(errorMessage);
        // if(errorMessage == "OTP has Expired." ){
        //     setEnterOTP(false)
        // } else if(errorMessage == "OTP is Invalid."){
        //     setFormData({ ...formData, otp: "" });
        //     }
      } else {
        setIsLoading(false);
        const message = await response.text(); // Use response.json() if server returns JSON
        toast.success("Token sent to your email")
        setShowToken(true);
        setShowForgotPassword(false);
        setShowForgotUserName(false);
        var val = await response.json()
        // navigate("/");
      }

      // const data = await response.json();
      // console.log(data);
    } catch (error) {
      setIsLoading(false);
      toast.error('Error making POST request:');
    }



  }


  const handleResetPassword = async () => {
    setIsLoading(true);
    if (resetPassword.confirmPassword == resetPassword.password) {
      const data = { token: resetPassword.token, newPassword: resetPassword.password }
      try {
        const response = await fetch('http://localhost:9000/api/patient/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          setIsLoading(false);
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
          // if(errorMessage == "OTP has Expired." ){
          //     setEnterOTP(false)
          // } else if(errorMessage == "OTP is Invalid."){
          //     setFormData({ ...formData, otp: "" });
          //     }
        } else {
          setIsLoading(false);
          const message = await response.text(); // Use response.json() if server returns JSON
          toast.success("Password Reset Successfull")
          setShowToken(false);
          setShowForgotPassword(false);
          setShowForgotUserName(false);
          var val = await response.json()
          navigate("/login");
        }

        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        setIsLoading(false);
        toast.error('Error making POST request:');
      }
    } else {
      setIsLoading(false);
      toast.error("Password and Confirm Password are not same")
    }
  }


  const handleForgotUserNameEmail = async () => {
    setIsLoading(true);
    const data = { "email": forgotUserEmail }
    try {
      const response = await fetch('http://localhost:9000/api/patient/forgot-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setIsLoading(false);
        const errorMessage = await response.text(); // Use response.json() if server returns JSON
        toast.error(errorMessage);
        // if(errorMessage == "OTP has Expired." ){
        //     setEnterOTP(false)
        // } else if(errorMessage == "OTP is Invalid."){
        //     setFormData({ ...formData, otp: "" });
        //     }
      } else {
        setIsLoading(false);
        const message = await response.text(); // Use response.json() if server returns JSON
        toast.success("Password Reset Successfull")
        setShowToken(false);
        setShowForgotPassword(false);
        setShowForgotUserName(false);
        var val = await response.json()
        navigate("/login");
      }

      // const data = await response.json();
      // console.log(data);
    } catch (error) {
      setIsLoading(false);
      toast.error('Error making POST request:');
    }
  }
  return (
    <>
      <Headers />
      <div className="login-container" >
        <header className="login-header">
          <img style={{ width: "5rem" }} src={logo} alt="logo" />
          <h1 className="hospital-name">{!enterOTP && !showForgotPassword
            && !showForgotUserName && !showToken ? "Login" : !enterOTP && showForgotPassword ? "Forgot Password" :
            !enterOTP && showToken ? "Enter Token" : enterOTP ? "Enter OTP" : "Forgot UserName"}</h1>
        </header>
        <div className="login-box">
          {!enterOTP ? (
            <>
              {!showForgotPassword && !showForgotUserName && !showToken ? (<>
                <form onSubmit={handleSubmit}>

                  <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <TextField
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      style={{ background: "#a0c8dc" }} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <TextField
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      style={{ background: "#a0c8dc" }} />
                  </div>
                  <Button sx={{ border: "2px solid black", marginLeft: "40%" }} onClick={backendCall}>Login</Button><br />
                  New User ? <Button onClick={handleRegister}>Register</Button>
                </form><Button onClick={() => { setShowForgotUserName(true); setShowForgotPassword(false) }} sx={{ display: "block", marginTop: "10px", textAlign: "center", color: "#007bff" }} >Forgot UserName?</Button>
                <Button onClick={() => { setShowForgotUserName(false); setShowForgotPassword(true) }} sx={{ display: "block", marginTop: "10px", textAlign: "center", color: "#007bff" }}>Forgot Password?</Button></>
              )
                :
                (showForgotPassword ? (
                  <div className="input-group"><label>Email:</label>
                    <TextField
                      type="email"
                      id="email"
                      name="email"
                      defaultValue={forgotPassword.email}
                      onChange={(e: any) => {
                        setForgotPassword((prevVal) => ({
                          ...prevVal,
                          email: e.target.value,
                        }))
                      }}
                      required
                      style={{ background: "#a0c8dc", marginBottom: "0.5rem" }} />
                    <label>User Name:</label>
                    <TextField
                      type="email"
                      id="email"
                      name="email"
                      defaultValue={forgotPassword.userName}
                      onChange={(e: any) => {
                        setForgotPassword((prevVal) => ({
                          ...prevVal,
                          userName: e.target.value,
                        }))
                      }}
                      required
                      style={{ background: "#a0c8dc", }} />
                    <Button sx={{ border: "2px solid black", marginLeft: "40%", marginTop: "1rem" }} onClick={handleForgotPasswordEmail}>Send Mail</Button>
                  </div>
                ) : (showToken ? (
                  <div>
                    <div className="input-group">
                      <label>Token:</label>
                      <TextField
                        type="text"
                        id="text"
                        name="text"
                        defaultValue={resetPassword.token}
                        onChange={(e: any) => {
                          setResetPassword((prevVal) => ({
                            ...prevVal,
                            token: e.target.value,
                          }))
                        }}
                        required
                        style={{ background: "#a0c8dc" }} /><br />
                      <label>Password:</label>
                      <TextField
                        type="password"
                        id="password"
                        name="password"
                        defaultValue={resetPassword.password}
                        onChange={(e: any) => {
                          setResetPassword((prevVal) => ({
                            ...prevVal,
                            password: e.target.value,
                          }))
                        }}
                        required
                        style={{ background: "#a0c8dc" }} /><br />
                      <label>Confirm Password:</label>
                      <TextField
                        type="password"
                        id="password"
                        name="password"
                        defaultValue={resetPassword.confirmPassword}
                        onChange={(e: any) => {
                          setResetPassword((prevVal) => ({
                            ...prevVal,
                            confirmPassword: e.target.value,
                          }))
                        }}
                        required
                        style={{ background: "#a0c8dc" }} />
                      <Button sx={{ border: "2px solid black", marginLeft: "40%" }} onClick={handleResetPassword}>Reset Password</Button>
                    </div></div>
                ) : (
                  <div>
                    <div className="input-group">
                      <label htmlFor="username">Email:</label>
                      <TextField
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={forgotUserEmail}
                        onChange={(e: any) => { setForgotUserEmail(e.target.value) }}
                        style={{ background: "#a0c8dc", maxHeight: "2rem" }} />
                    </div>

                    <Button sx={{ border: "2px solid black", marginLeft: "30%" }} onClick={handleForgotUserNameEmail}>Send UserName</Button>
                  </div>
                )
                )

                )}
            </>
          ) : (
            <div><div className="input-group">
              <label htmlFor="text">OTP sent to your Registered Email</label>
              <TextField
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                required
                style={{ background: "#a0c8dc" }} />
            </div>
              <Button sx={{ border: "2px solid black", marginLeft: "40%" }} onClick={handleOptVerify}>Verify OTP</Button></div>
          )}
        </div>
        <footer className="login-footer">
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Contact Us</a>
        </footer>
        <button className="help-button">Need Help?</button>
      </div>
    </>
  );
};

export default LoginPage;



