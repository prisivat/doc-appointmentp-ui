import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import { Button, TextField } from "@mui/material";
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import Headers from './Header';
import { useSelector } from "react-redux";
import { RootState } from "../store";



const container = { height: "10rem", backgroundColor: "gray", 
        border: "2px solid black", borderRadius: "10px",     display: "flex",flexDirection: "column", 
        justifyContent: "space-around", alignItems: "center"}




const SignUp = () => {
    const[email, setEmail] = useState("");
    const [user, setUser] = useState({"firstName": "", "lastName": "", "phoneNumber": "", "email": "", "password": ""})

    const userName = useSelector((state: RootState) => state.user.userName);
  

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
        if(user.password == "" || user.email == ""){
            toast.error("Please fill all the Fields")
        }else{
         try {
            const response = await fetch('http://localhost:8082/api/patient/sign-up', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(user),
            });
            
        
            if (!response.ok) {
                var errorMessage = await response.text(); // Use response.json() if server returns JSON
                var val = JSON.parse(errorMessage);
                errorMessage = val && val.email ? val.email : val.phoneNumber ? val.phoneNumber : errorMessage;
                toast.error(errorMessage);
            } else{
                toast.success("Registered Successfully!!!")
            }
        
          } catch (error) {
            toast.error('Error making POST request:');
          }
        }
    }

    return(
        <>
        <Headers/>
        <div className="login-container" >
            <header className="login-header">
                <img style = {{width: "5rem"}} src={logo} alt="logo"/>
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
                            style={{background: "#a0c8dc"}}
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
                            style={{background: "#a0c8dc"}}
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
                            style={{background: "#a0c8dc"}}
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
                            style={{background: "#a0c8dc"}}
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
                            style={{background: "#a0c8dc"}}
                        />
                    </div>
                    <Button sx={{border: "2px solid black", marginLeft: "40%"}}  onClick={handleSubmit}>Register</Button>
                </form>
            </div>
            <footer className="login-footer">
                <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Contact Us</a>
            </footer>
            <button className="help-button">Need Help?</button>
        </div>
        </>
    )
}
export default SignUp;