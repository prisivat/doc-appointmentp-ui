import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Avatar, Grid } from "@mui/material";
import { userDetails } from "../userSlice";
import { useDispatch } from "react-redux";
import Model from "./Model";
import { useNavigate } from "react-router-dom";

const styleCommon = {
  background: 'none',
  border: 'none',
  fontSize: 'large',
  onpageshow
}


const Headers = () => {

  const userName = useSelector((state: RootState) => state.user.userName);
  const schedulerName = useSelector((state: RootState) => state.user.schedulerName);
  const dispatch = useDispatch();
  const [body, setBody] = useState<any>();
  const [openModel, setOpenModel] = useState(false);
  const navigate = useNavigate();
  const schedulerPath = (window.location.pathname).includes("scheduler") ? true : false;

  const handleLogOut = () => {
    dispatch(userDetails({
      userName: null
    }));
  }

  const handleBookingHistory = () => {
    navigate("/bookingHistory")
  }

  const handleContact = () => {
    setOpenModel(true);
    const val = <div><div>Mobile : 9834253647/ 648 </div><br /><div>Mail: easyMed@gmail.com</div></div>
    setBody(val)
  }

  const handleSignUp = () => {
    navigate("/register")
  }

  const handleHome = () => {
    navigate("/");
  }

  const handleLogin = () => {
    navigate("/login")
  }

  const handleScheduler = () => {
    dispatch(userDetails({
            userName: ""
          }));
    navigate("/schedulerLogin")
  }

  const handleChatBot = async () => {
    const body = {"query": "what is fever"}
    try {
      const response = await fetch('http://127.0.0.1:5000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(body)
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Use response.json() if server returns JSON
        // toast.error(errorMessage);
      }
      const value = await response.json()
      // setHospDtlsByLoc(value);
      // setIsLoading(false);

    } catch (error) {
      // toast.error('Error making POST request:');
      // setIsLoading(false);
    }
  }
  return (
    <Grid container className="navbar">
      {openModel && (
        <Model body={body} title="EasyMed Contact Details" opeModel={openModel} setOpeModel={setOpenModel} isHospDtls={false} iscalendar={false} />
      )}

      <Grid item xs={3}>
        <div style={{ color: "#0799c1", fontSize: "50px", marginRight: "100px" }}>
          <b>EasyMed</b>
        </div>
      </Grid>
      <Grid item xs={7} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <ul className="nav-links">
          <li><button onClick={handleHome} className="Header-button">Home</button></li>
        </ul>
        <ul className="nav-links">
          <li><button onClick={handleContact} className="Header-button">Contact Us</button></li>
        </ul>
        <ul className="nav-links">
          <li><button onClick={handleScheduler} className="Header-button">Scheduler Login</button></li>
        </ul>
        {userName == "" || userName == null ? (
          <>
            <div style={{ marginRight: "2rem" }}>
              <button onClick={handleLogin} className="Header-button">Login</button>
            </div>


            <div className="login-btn">
              <button onClick={handleSignUp} className="Header-button">Sign Up</button>
            </div>
          </>
        ) :
          (
            <>
              <div style={{ marginRight: "2rem" }}>
                <button onClick={handleBookingHistory} className="Header-button">Booking History</button>
              </div>
              <div className="login-btn">
                <button onClick={handleLogOut} className="Header-button">Log out</button>
              </div>

            </>
          )}
      </Grid>
      <Grid xs={2} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{ right: 0, display: "flex", alignItems: "center" }}>
          {(userName != null && userName != "" && !schedulerPath) ? userName :(schedulerPath && schedulerName != null && schedulerName != "") ? schedulerName : "Unknown User"}<Avatar sx={{ marginLeft: "10px", marginRight: "10px" }} />
        </div>
      </Grid>

    </Grid>
  )
}

export default Headers;