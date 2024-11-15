import { Grid, FormControl, Select, MenuItem, Autocomplete, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import SchedulerHeader from './SchedulerHeader';
import { hospitalDetails } from '../userSlice';
import { useDispatch } from 'react-redux';



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
      try {
        const response = await fetch('http://localhost:8082/api/scheduler/verify-otp', {
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
        const response = await fetch('http://localhost:8082/hospital/locations', {
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
        const response = await fetch(`http://localhost:8082/hospital/filterDtls/${location}`, {
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
      const response = await fetch(`http://localhost:8082/api/scheduler/scheduler-login`, {
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
        } else if (errorMessage == "Password is incorrect") {
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
      <SchedulerHeader />
      <div className="login-container" >
        {enterOTP ? (
          <div style={{ display: "flex", alignItems: "stretch" }}><div className="input-group">
            <label htmlFor="text">OTP sent to your Registered Email</label>
            <TextField
              type="text"
              id="otp"
              name="otp"
              value={otpValue}
              onChange={(e) => { setOtpValue(e.target.value) }}
              required
              style={{ background: "#a0c8dc", height: "2rem" }} />
          </div>
            <Button sx={{ border: "2px solid black", marginLeft: "40%" }} onClick={handleOptVerify}>Verify OTP</Button></div>

        ) : (
          <Grid sx={{ display: "flex", alignItems: "stretch", flexDirection: "column" }}>
            <b>Location:</b>

            <FormControl sx={{ m: 1, minWidth: 120 }}>
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
                      style={{ background: "white", height: "3rem", marginTop: "5px" }} />
                  </div>
                </Grid></>
            )}

            <Button sx={{ background: "#067492 !important", color: "white", marginTop: "1rem" }} onClick={handleInitiateOTP} >Log In</Button>
          </Grid>
        )
        }
      </div>
    </div>
  )
}

export default SchedulerLogin;