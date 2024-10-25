import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Avatar, Grid } from "@mui/material";
import { userDetails } from "../userSlice";
import { useDispatch } from "react-redux";

const Headers = () => {
  const userName = useSelector((state: RootState) => state.user.userName);
  const dispatch = useDispatch();
  const handleLogOut = () => {
    dispatch(userDetails({
      userName: null
    }));
  }

  return (
    <Grid container className="navbar">

      <Grid item xs={3}>
        <div style={{ color: "#0799c1", fontSize: "50px", marginRight: "100px" }}>
          <b>EasyMed</b>
        </div>
      </Grid>
      <Grid item xs={7} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <ul className="nav-links">
          <li><a href="/" >Home</a></li>
        </ul>
        <ul className="nav-links">
          <li><a href="#" >First Aid</a></li>
        </ul>
        <ul className="nav-links">
          <li><a href="#" >Contact Us</a></li>
        </ul>
        {userName == "" ? (
          <>
            <div className="login-btn">
              <a href="/login">Login</a>
            </div>


            <div className="login-btn">
              <a href="/register">Sign Up</a>
            </div>
          </>
        ) :
          (
            <>
            <div className="login-btn">
            <a href="/bookingHistory">Booking History</a>
            </div>
            <div className="login-btn">
              <button onClick={handleLogOut}>Log out</button>
            </div>
            
          </>
          )}
      </Grid>
      <Grid xs={2} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{ right: 0, display: "flex", alignItems: "center" }}>
          {userName != null && userName != "" ? userName : "Unknown User"}<Avatar sx={{ marginLeft: "10px", marginRight: "10px" }} /> 
        </div>
      </Grid>

    </Grid>
  )
}

export default Headers;