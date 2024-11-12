import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Avatar, Grid } from "@mui/material";
import { schedulerDetails, userDetails } from "../userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SchedulerHeader = () => {
  const schedulerName = useSelector((state: RootState) => state.user.schedulerName);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(schedulerDetails({
      schedulerName: null
    }));
  }
  const handleHome =() => {
    navigate("/schedulerHome")
  }

  const handleSignUp =() => {
    navigate("/schedulerSignIn")
  }
  const handleLogin =() => {
    navigate("/schedulerLogin")
  }
  const handleUserHome =() => {
    navigate("/")
  }

  return (
    <Grid container className="navbar" sx={{position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "white",
      zIndex: 1000, // Ensure header stays on top
      padding: "1rem 0", // Add some padding for spacing
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",}}>

      <Grid item xs={3}>
        <div style={{ color: "#0799c1", fontSize: "50px", marginRight: "100px" }}>
          <b>EasyMed</b>
        </div>
      </Grid>
      <Grid item xs={7} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <ul className="nav-links">
          <li><button onClick={handleHome}  className="Header-button">Home</button></li>
        </ul>
        <ul className="nav-links">
          <li><button onClick={handleUserHome}  className="Header-button">User Home</button></li>
        </ul>
        {schedulerName == "" || schedulerName == null? (
          <>
            <div className="login-btn">
            <button onClick={handleLogin}  className="Header-button">Login</button>
            </div>


            <div style={{marginLeft:"1.5rem"}}>
            <button onClick={handleSignUp}  className="Header-button">Sign Up</button>
            </div>
          </>
        ) :
          (
            <>
            
            <div className="login-btn">
              <button onClick={handleLogOut}>Log out</button>
            </div>
            
          </>
          )}
      </Grid>
      <Grid xs={2} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{ right: 0, display: "flex", alignItems: "center" }}>
          {schedulerName != null && schedulerName != "" ? schedulerName : "Unknown User"}<Avatar sx={{ marginLeft: "10px", marginRight: "10px" }} /> 
        </div>
      </Grid>

    </Grid>
  )
}

export default SchedulerHeader;