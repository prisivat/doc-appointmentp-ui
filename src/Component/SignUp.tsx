import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import { Button, TextField } from "@mui/material";
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import Headers from './Header';
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";




const container = {
    height: "10rem", backgroundColor: "gray",
    border: "2px solid black", borderRadius: "10px", display: "flex", flexDirection: "column",
    justifyContent: "space-around", alignItems: "center"
}




const SignUp = () => {
    const [email, setEmail] = useState("");
    const [user, setUser] = useState({ "firstName": "", "lastName": "", "phoneNumber": "", "email": "", "password": "" })
    const userName = useSelector((state: RootState) => state.user.userName);
    const [isLoading, setIsLoading] = useState(false);
      const navigate = useNavigate();
    

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


    console.log(userName, "useNameSign")

    const handleFirstNameChange = (e: any) => {
        setUser((prevVal) => ({
            ...prevVal,
            firstName: e.target.value,
        }));
    }

    const handleLastNameChange = (e: any) => {
        setUser((prevVal) => ({
            ...prevVal,
            lastName: e.target.value,
        }));
    }
    const handlePhoneNumber = (e: any) => {
        setUser((prevVal) => ({
            ...prevVal,
            phoneNumber: e.target.value,
        }));
    }
    const handleEmailChange = (e: any) => {
        setUser((prevVal) => ({
            ...prevVal,
            email: e.target.value,
        }));
    }
    const handlePasswordChange = (e: any) => {
        setUser((prevVal) => ({
            ...prevVal,
            password: e.target.value,
        }));
    }

    const handleSubmit = async () => {
        if (user.password == "" || user.email == "") {
            toast.error("Please fill all the Fields")
        } else {
            try {
                const response = await fetch('https://easymedurl-50022251973.development.catalystappsail.in/api/patient/sign-up', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                });


                if (!response.ok) {
                    var errorMessage = await response.text(); // Use response.json() if server returns JSON
                     toast.error(errorMessage);
                } else {
                    navigate("/login")
                    toast.success("Registered Successfully!!!")
                }

            } catch (error) {
                toast.error('Error making POST request:');
            }
        }
    }

    return (
        <>
            <Headers />
            <div className="login-container" >
                <header className="login-header">
                    <img style={{ width: "5rem" }} src={logo} alt="logo" />
                    <h1 className="hospital-name">Register</h1>
                </header>
                <div className="login-box">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="firstName">First Name</label>
                            <TextField
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleFirstNameChange}
                                required
                                style={{ background: "#a0c8dc" }}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName">Last Name</label>
                            <TextField
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleLastNameChange}
                                required
                                style={{ background: "#a0c8dc" }}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <TextField
                                type="phone"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={user.phoneNumber}
                                onChange={handlePhoneNumber}
                                required
                                style={{ background: "#a0c8dc" }}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email Id</label>
                            <TextField
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleEmailChange}
                                required
                                style={{ background: "#a0c8dc" }}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <TextField
                                type="password"
                                id="password"
                                name="password"
                                value={user.password}
                                onChange={handlePasswordChange}
                                required
                                style={{ background: "#a0c8dc" }}
                            />
                        </div>
                        <Button sx={{ border: "2px solid black", marginLeft: "40%" }} onClick={handleSubmit}>Register</Button>
                    </form>
                </div>
               
            </div>
        </>
    )
}
export default SignUp;