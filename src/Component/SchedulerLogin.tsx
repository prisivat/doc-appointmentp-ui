import { Grid, FormControl, Select, MenuItem, Autocomplete, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import SchedulerHeader from './SchedulerHeader';
import { hospitalDetails } from '../userSlice';
import { useDispatch } from 'react-redux';
import logo from "../assets/logo.png"
import userSlice, { schedulerDetails, userDetails } from "../userSlice"




const SchedulerLogin: React.FC = () => {


  const [locationDetails, setLocationDetails] = useState<string[]>([]);
  const [locationSelected, setLocationSelected] = useState<any>("");
  const [hospitalNameFilterList, setHospitalNameFilterList] = useState([]);
  const [hospitalName, setHospitalName] = useState("")
  const [schedulerPassword, setSchedulerPassword] = useState("")
  const [enterOTP, setEnterOTP] = useState(false);
  const [otpValue, setOtpValue] = useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch();
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



  const handleOptVerify = async (e: any) => {
    setIsLoading(true);
    if (otpValue == "") {
      setIsLoading(false);
      toast.error("Please enter OTP")
    } else {
      var body = { hospitalName: hospitalName, location: locationSelected, otp: otpValue }
      dispatch(schedulerDetails({
              schedulerName: hospitalName.replace(" ", "") + locationSelected
            }));
      try {
        const response = await fetch('https://easymedurl-50022251973.development.catalystappsail.in/api/scheduler/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
          if (errorMessage == "OTP has Expired.") {
            setEnterOTP(false)
            setIsLoading(false);
          } else if (errorMessage == "OTP is Invalid.") {
            setOtpValue("");
            setIsLoading(false);
          }
        } else {
          setEnterOTP(false)
          dispatch(hospitalDetails({
            hospitalName: hospitalName,
            location: locationSelected
          }));
          setIsLoading(false);
          navigate("/schedulerHome")
        }

        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        setIsLoading(false);
        toast.error('Error making POST request:');
      }
    }
  }

  useEffect(() => {
    setIsLoading(true);
    const fetchDetails = async () => {
      try {
        const response = await fetch('https://easymedurl-50022251973.development.catalystappsail.in/hospital/locations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setLocationDetails(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error('Error making POST request:');
      }
    }
    fetchDetails()
  }, [])


  useEffect(() => {
    setIsLoading(true);
    var location = locationSelected;
    const fetchFilterValues = async () => {
      try {
        const response = await fetch(`https://easymedurl-50022251973.development.catalystappsail.in/hospital/filterDtls/${location}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          setIsLoading(false);
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          setLocationSelected("");
          toast.error("We are working on this location. Please try other locations");
        } else {
          setIsLoading(false);
          const data = await response.json();
          setHospitalNameFilterList(data?.hospitalName);
        }
      } catch (error) {
        setIsLoading(false);
        toast.error('Error making POST request:');
      }
    }
    if (locationSelected != "") {
      fetchFilterValues();
    }

  }, [locationSelected])

  const handleInitiateOTP = async () => {
    setIsLoading(true);
    if (schedulerPassword == "") {
      setIsLoading(false);
      toast.error("Please Enter Password")
      return;
    }

    var body = { hospitalName: hospitalName, location: locationSelected, password: schedulerPassword }
    try {
      const response = await fetch(`https://easymedurl-50022251973.development.catalystappsail.in/api/scheduler/scheduler-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        setIsLoading(false);
        const errorMessage = await response.text();
        toast.error(errorMessage);
      } else {
        setIsLoading(false);
        const errorMessage = await response.text();
        if (errorMessage == "Scheduler not found") {
          toast.error("Scheduler not found");
        } else if (errorMessage.includes("Password is incorrect")) {
          toast.error("Password is incorrect");
        } else {
          setEnterOTP(true);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Error making POST request:');
    }
  }



  return (
    <div>
      {isLoading ? <><div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.8)', // Adds a white overlay
        backdropFilter: 'blur(10px)', // Adjust the blur intensity
        zIndex: 1,
      }}></div><Loader /> </> : <div>
      <SchedulerHeader />
      <div className="login-container"  >
        <header className="login-header">
          <img style={{ width: "5rem" }} src={logo} alt="logo" />
          <h1 className="hospital-name">{enterOTP ? "Enter OTP":  "Log In"}</h1>
        </header>
        <div className="login-box"></div>
        {enterOTP ? (
          <div style={{ display: "flex", alignItems: "stretch", flexDirection: "column" }}><div className="input-group">
            <label htmlFor="text">OTP sent to your Registered Email</label>
            <TextField
              type="text"
              id="otp"
              name="otp"
              value={otpValue}
              onChange={(e) => { setOtpValue(e.target.value) }}
              required
              style={{ background: "#a0c8dc",  }} />
               <Button sx={{ border: "2px solid black", marginLeft: "40%", marginTop: "2%" }} onClick={handleOptVerify}>Verify OTP</Button>
          </div>
           </div>

        ) : (
          <Grid sx={{ display: "flex", alignItems: "stretch", flexDirection: "column" }}>
            <b>Location:</b>

            <FormControl sx={{ m: 1, minWidth: "100%" }}>
              <Select
                value={locationSelected}
                onChange={(e: any) => { setLocationSelected(e.target.value) }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {locationDetails?.map((val: any) => (
                  <MenuItem value={val}>{val}</MenuItem>
                ))}
              </Select>

            </FormControl>



            {locationSelected != "" && (

              <>

                <Grid sx={{ marginTop: "1rem", display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}><b>Hospital Name :</b>
                  <Autocomplete
                    id="combo-box-demo"
                    options={hospitalNameFilterList}
                    getOptionLabel={(option: any) => option}
                    sx={{ width: "100%", background: "white", marginTop: "1rem", }}
                    value={hospitalName}
                    onChange={(event, newValue: any) => setHospitalName(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select hospitals"
                        variant="outlined"
                      />
                    )}
                  />
                  <div className="input-group">
                    <label style={{ marginTop: "10px" }} htmlFor="text">Password:</label>
                    <TextField
                      type="password"
                      id="otp"
                      name="otp"
                      value={schedulerPassword}
                      onChange={(e) => { setSchedulerPassword(e.target.value) }}
                      required
                      style={{ background: "white", height: "3rem", marginTop: "5px" , width: "100% !important"}} />
                  </div>
                </Grid></>
            )}

            <Button sx={{ background: "#067492 !important", color: "white", marginTop: "1rem" }} onClick={handleInitiateOTP} >Log In</Button>
          </Grid>
        )
        }
      </div>
      </div>}
    </div>
  )
}

export default SchedulerLogin;