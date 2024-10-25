import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import { Button, TextField } from "@mui/material";
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import Headers from './Header';
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Navigate, useNavigate } from "react-router-dom";


const ResetPassword = () => {

    const [user, setUser] = useState({"token": "", "password": "", "confirmPassword": ""})
    const navigate = useNavigate();

    const handleSubmit = async() => {
        if(user.password != user.confirmPassword){
            toast.error("Password are not same")
        } else if(user.password == "" || user.confirmPassword == "" || user.token == ""){
            toast.error("Please fill all fields")
        }else{
        var body = {token: user.token, password: user.password}
        try {
            const response = await fetch('http://localhost:8082/api/patient/reset-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
        
            if (!response.ok) {
                const errorMessage = await response.text(); // Use response.json() if server returns JSON
                toast.error(errorMessage);
            } else if(response.ok){
                toast.success("Password Reset Success")
                navigate("/")
            }
        
            // const data = await response.json();
            // console.log(data);
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
                <h1 className="hospital-name">Reset Password</h1>
            </header>
            <div className="login-box">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="firstName">Token</label>
                        <TextField
                            type="text"
                            id="token"
                            name="token"
                            value={user.token}
                            onChange={(e:any) => {setUser((prev:any) => ({
                                ...prev,
                                token: e.target.value,
                            }))}}
                            required
                            style={{background: "#a0c8dc"}}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">New Password</label>
                        <TextField
                            type="password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={(e:any) => {setUser((prev:any) => ({
                                ...prev,
                                password: e.target.value,
                            }))}}
                            required
                            style={{background: "#a0c8dc"}}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Confirm Password</label>
                        <TextField
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={user.confirmPassword}
                            onChange={(e:any) => {setUser((prev:any) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                            }))}}                          
                              required
                            style={{background: "#a0c8dc"}}
                        />
                    </div>
                    
                    <Button sx={{border: "2px solid black", marginLeft: "40%"}}  onClick={handleSubmit}>Register</Button>
                </form>
            </div>
           
        </div>
        </>
    )
}
export default ResetPassword;