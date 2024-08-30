import React, { useState } from 'react';
import './login.css'; // Importing the CSS file
import logo from "../assets/logo.png"
import { Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import Headers from './Header';
import { useSelector, useDispatch } from 'react-redux';
import {userDetails} from "../userSlice"
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
    const dispatch = useDispatch();
    const [enterOTP, setEnterOTP] = useState(false);

    const navigate = useNavigate();


    const backendCall = async () => {
        if(formData.password == "" || formData.username == ""){
            toast.error(formData.username == "" ? "User Name is Mandatory" : "Passowrd is Mandatory"  )
        }else{
        var body = {userName: formData.username, password: formData.password}
        dispatch(userDetails({
            userName: formData.username
        }));
            try {
            const response = await fetch('http://localhost:8082/api/patient/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
        
            if (!response.ok) {
                const errorMessage = await response.text(); // Use response.json() if server returns JSON
                toast.error(errorMessage);
            } else{
                setEnterOTP(true);
            }
        
            // const data = await response.json();
            // console.log(data);
          } catch (error) {
            console.error('Error making POST request:', error);
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
        console.log('Form submitted:', formData);
    };

    const handleOptVerify = async (e: any) => {
        if(formData.otp == ""){
            toast.error("Please enter OTP" )
        }else{
        var body = {userName: formData.username, otp: formData.otp}
        dispatch(userDetails({
            userName: formData.username
        }));
            try {
            const response = await fetch('http://localhost:8082/api/patient/verify-otp', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
        
            if (!response.ok) {
                const errorMessage = await response.text(); // Use response.json() if server returns JSON
                toast.error(errorMessage);
                if(errorMessage == "OTP has Expired." ){
                    setEnterOTP(false)
                } else if(errorMessage == "OTP is Invalid."){
                    setFormData({ ...formData, otp: "" });
                    }
            } else{
                navigate("/");
            }
        
            // const data = await response.json();
            // console.log(data);
          } catch (error) {
            console.error('Error making POST request:', error);
          }
        }
    }
    const handleRegister = () =>{
        navigate("/register")
    }

    return (
        <>
           <Headers/>
        <div className="login-container" >
            <header className="login-header">
                <img style = {{width: "5rem"}} src={logo} alt="logo"/>
                <h1 className="hospital-name">LOG IN</h1>
            </header>
            <div className="login-box">
                {!enterOTP? (
                <><form onSubmit={handleSubmit}>
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
                           <Button onClick={backendCall}>Login</Button><br/>
                            New User ? <Button onClick={handleRegister}>Register</Button>
                        </form><a href="#" className="forgot-password">Forgot Password?</a></>
                ) :(
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
                <Button onClick={handleOptVerify}>Verify OTP</Button></div>
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



