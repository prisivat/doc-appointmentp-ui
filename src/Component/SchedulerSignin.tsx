import React, { useEffect, useState } from 'react';
import './login.css'; // Importing the CSS file
import logo from "../assets/logo.png"
import { Autocomplete, Button, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import Headers from './Header';
import { useSelector, useDispatch } from 'react-redux';
import userSlice, { schedulerDetails, userDetails } from "../userSlice"
import { useAppSelector } from '../reduxHooks';
import { useNavigate } from "react-router-dom";
import SchedulerHeader from './SchedulerHeader';
import { Password } from '@mui/icons-material';


// Define the state interface for the form
interface LoginFormState {
  otp: unknown;
  schedulerName: string;
  password: string;
}

const SchedulerSignIn: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormState>({ schedulerName: '', password: '', otp: "" });
  const dispatch = useDispatch();
  const [enterOTP, setEnterOTP] = useState(false);
  const [registerScheduler, setRegisterScheduler] = useState(false);
  const [otpValue, setOtpValue] = useState("")
  const [schedulerName, setSchedulerName] = useState("")
  const [schedulerPassword, setSchedulerPassword] = useState("")
  const navigate = useNavigate();
  const [locationDetails, setLocationDetails] = useState<string[]>([]);
  const [locationSelected, setLocationSelected] = useState<any>("");
  const [hospitalNameFilterList, setHospitalNameFilterList] = useState([]);
  const [hospitalName, setHospitalName] = useState("")
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


  const handleRegisterScheduler = async () => {
    setIsLoading(true);
    if (schedulerPassword == "") {
      setIsLoading(false);
      toast.error("Please enter Password")
    } else {
      var body = { hospitalName: hospitalName, location: locationSelected, otp: otpValue, password: schedulerPassword }
      setSchedulerName(hospitalName + locationSelected)
      dispatch(schedulerDetails({
        schedulerName: hospitalName.replace(" ", "") + locationSelected
      }));
      try {
        const response = await fetch('http://localhost:9000/api/scheduler/save-scheduler', {
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
          setRegisterScheduler(false)
          setEnterOTP(false)
          toast.success("Scheduler Registered Successfully.")

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

  const handleOptVerify = async (e: any) => {
    setIsLoading(true);
    if (otpValue == "") {
      toast.error("Please enter OTP")
    } else {
      var body = { hospitalName: hospitalName, location: locationSelected, otp: otpValue }
      setSchedulerName(hospitalName + locationSelected)
      dispatch(userDetails({
        schedulerName: hospitalName + locationSelected
      }));
      try {
        const response = await fetch('http://localhost:9000/api/scheduler/verify-otp', {
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
          } else if (errorMessage == "OTP is Invalid.") {
            setFormData({ ...formData, otp: "" });
          }
        } else {
          setRegisterScheduler(true)
          setEnterOTP(false)
        }

        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        toast.error('Error making POST request:');
      }
    }
  }
  const handleRegister = async () => {

    setEnterOTP(true)
    var data = { "hospitalName": hospitalName, "location": locationSelected }
    try {
      const response = await fetch('http://localhost:9000/api/scheduler/register-scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        if (errorMessage == "Scheduler already there for this hospital, Please Login") {
          navigate("/schedulerLogin")
        } // Use response.json() if server returns JSON
        toast.error(errorMessage);
        // if(errorMessage == "OTP has Expired." ){
        //     setEnterOTP(false)
        // } else if(errorMessage == "OTP is Invalid."){
        //     setFormData({ ...formData, otp: "" });
        //     }
      } else {
        const message = await response.text(); // Use response.json() if server returns JSON
        toast.success("OTP sent to the Hospital Email")

      }

      // const data = await response.json();
      // console.log(data);
    } catch (error) {
      toast.error('Error making POST request:');
    }
  }



  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch('http://localhost:9000/hospital/locations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setLocationDetails(data);
      } catch (error) {
        toast.error('Error making POST request:');
      }
    }
    fetchDetails()
  }, [])

  useEffect(() => {
    var location = locationSelected;
    const fetchFilterValues = async () => {
      try {
        const response = await fetch(`http://localhost:9000/hospital/filterDtls/${location}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          setLocationSelected("");
          toast.error("We are working on this location. Please try other locations");
        } else {
          const data = await response.json();
          setHospitalNameFilterList(data?.hospitalName);
        }
      } catch (error) {
        toast.error('Error making POST request:');
      }
    }
    if (locationSelected != "") {
      fetchFilterValues();
    }

  }, [locationSelected])

  return (
    <>
      <SchedulerHeader />
      <div className="login-container" >
        <header className="login-header">
          <img style={{ width: "5rem" }} src={logo} alt="logo" />
          <h1 className="hospital-name">{enterOTP ? "Enter OTP": registerScheduler? "Sign In" : "Log In"}</h1>
        </header>
        <div className="login-box">

          {registerScheduler ? (
            <>
              {/* schedulerName - autoPopulate, Enter Password */}
              <div style={{ display: "flex", alignItems: "stretch", flexDirection: "column" }}>
                <div className="input-group">
                <label htmlFor="text">Scheduler Name</label>
                <TextField
                  type="text"
                  id="otp"
                  name="otp"
                  value={schedulerName}
                  disabled={true}
                  required
                  style={{ background: "#a0c8dc" }} />
              </div> 
                <div className="input-group">
                  <label htmlFor="text">Password</label>
                  <TextField
                    type="password"
                    id="otp"
                    name="otp"
                    value={schedulerPassword}
                    onChange={(e) => { setSchedulerPassword(e.target.value) }}
                    required
                    style={{ background: "#a0c8dc" }} />
                </div>
                <Button sx={{ border: "2px solid black", marginLeft: "40%" }} onClick={handleRegisterScheduler}> Register Scheduler</Button></div>

            </>
          ) : enterOTP ? (
            <>
              {/* opt */}
              <div style={{ display: "flex", alignItems: "stretch", flexDirection: "column" }}><div className="input-group">
                <label htmlFor="text">OTP sent to your Registered Email</label>
                <TextField
                  type="text"
                  id="otp"
                  name="otp"
                  value={otpValue}
                  onChange={(e) => { setOtpValue(e.target.value) }}
                  required
                  style={{ background: "#a0c8dc" }} />
                   <Button sx={{ border: "2px solid black", marginLeft: "30%", marginTop: "5%" }} onClick={handleOptVerify}>Verify OTP</Button>
              </div>
               </div>
            </>
          ) : (
            <>


              {/* //location, Hospital */}



              <Grid sx={{ marginTop: "1rem", display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
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
                        sx={{ width: 300, background: "white", marginTop: "1rem", }}
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
                    </Grid></>
                )}

                <Button sx={{ background: "#067492 !important", color: "white", marginTop: "1rem" }} onClick={handleRegister} >Create Scheduler</Button>
              </Grid>

            </>
          )}


        </div>

      </div>
    </>
  );
};

export default SchedulerSignIn;



