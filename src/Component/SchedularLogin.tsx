import React, { useEffect, useState } from 'react';
import './login.css'; // Importing the CSS file
import logo from "../assets/logo.png"
import { Autocomplete, Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import Headers from './Header';
import { useSelector, useDispatch } from 'react-redux';
import userSlice, { userDetails } from "../userSlice"
import { useAppSelector } from '../reduxHooks';
import { useNavigate } from "react-router-dom";
import SchedularHeader from './SchedularHeader';


// Define the state interface for the form
interface LoginFormState {
  otp: unknown;
  schedularName: string;
  password: string;
}

const SchedularLogin: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormState>({ schedularName: '', password: '', otp: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotUserName, setShowForgotUserName] = useState(false);
  const [showToken, setShowToken] = useState(false)
  const [forgotPassword, setForgotPassword] = useState({ email: "", schedularName: "" })
  const [forgotUserEmail, setForgotUserEmail] = useState("");
  const [resetPassword, setResetPassword] = useState({ token: "", password: "", confirmPassword: "" })
  const dispatch = useDispatch();
  const [enterOTP, setEnterOTP] = useState(false);
  const [registerSchedular, setRegisterSchedular] = useState(false);

  const navigate = useNavigate();


  const backendCall = async () => {
    if (formData.password == "" || formData.schedularName == "") {
      toast.error(formData.schedularName == "" ? "User Name is Mandatory" : "Passowrd is Mandatory")
    } else {
      var body = { schedularName: formData.schedularName, password: formData.password }
      dispatch(userDetails({
        schedularName: formData.schedularName
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
        } else {
          setEnterOTP(true);
        }

        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        toast.error('Error making POST request:');
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
  };

  const handleOptVerify = async (e: any) => {
    if (formData.otp == "") {
      toast.error("Please enter OTP")
    } else {
      var body = { schedularName: formData.schedularName, otp: formData.otp }
      dispatch(userDetails({
        schedularName: formData.schedularName
      }));
      try {
        const response = await fetch('http://localhost:8082//api/scheduler/verify-otp', {
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
          navigate("/");
        }

        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        toast.error('Error making POST request:');
      }
    }
  }
  const handleRegister = () => {
setRegisterSchedular(true)
  }

  const handleForgotPasswordEmail = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/patient/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotPassword),
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Use response.json() if server returns JSON
        toast.error(errorMessage);
        // if(errorMessage == "OTP has Expired." ){
        //     setEnterOTP(false)
        // } else if(errorMessage == "OTP is Invalid."){
        //     setFormData({ ...formData, otp: "" });
        //     }
      } else {
        const message = await response.text(); // Use response.json() if server returns JSON
        toast.success("Token sent to your email")
        setShowToken(true);
        setShowForgotPassword(false);
        setShowForgotUserName(false);
        var val = await response.json()
        // navigate("/");
      }

      // const data = await response.json();
      // console.log(data);
    } catch (error) {
      toast.error('Error making POST request:');
    }



  }


  const handleResetPassword = async () => {
    if (resetPassword.confirmPassword == resetPassword.password) {
      const data = { token: resetPassword.token, newPassword: resetPassword.password }
      try {
        const response = await fetch('http://localhost:8082/api/patient/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
          // if(errorMessage == "OTP has Expired." ){
          //     setEnterOTP(false)
          // } else if(errorMessage == "OTP is Invalid."){
          //     setFormData({ ...formData, otp: "" });
          //     }
        } else {
          const message = await response.text(); // Use response.json() if server returns JSON
          toast.success("Password Reset Successfull")
          setShowToken(false);
          setShowForgotPassword(false);
          setShowForgotUserName(false);
          var val = await response.json()
          navigate("/login");
        }

        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        toast.error('Error making POST request:');
      }
    } else {
      toast.error("Password and Confirm Password are not same")
    }
  }


  const handleForgotUserNameEmail = async () => {
    const data = { "email": forgotUserEmail }
    try {
      const response = await fetch('http://localhost:8082/api/patient/forgot-schedularName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Use response.json() if server returns JSON
        toast.error(errorMessage);
        // if(errorMessage == "OTP has Expired." ){
        //     setEnterOTP(false)
        // } else if(errorMessage == "OTP is Invalid."){
        //     setFormData({ ...formData, otp: "" });
        //     }
      } else {
        const message = await response.text(); // Use response.json() if server returns JSON
        toast.success("Password Reset Successfull")
        setShowToken(false);
        setShowForgotPassword(false);
        setShowForgotUserName(false);
        var val = await response.json()
        navigate("/login");
      }

      // const data = await response.json();
      // console.log(data);
    } catch (error) {
      toast.error('Error making POST request:');
    }
  }

  ////

  const [locationDetails, setLocationDetails] = useState<string[]>([]);
  const [locationSelected, setLocationSelected] = useState<any>("");
  const [hospitalNameFilterList, setHospitalNameFilterList] = useState([]);
  const [hospitalName, setHospitalName] = useState("")




  useEffect(() => {
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
        const response = await fetch(`http://localhost:8082/hospital/filterDtls/${location}`, {
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
      <SchedularHeader />
      <div className="login-container" >
        <header className="login-header">
          <img style={{ width: "5rem" }} src={logo} alt="logo" />
          <h1 className="hospital-name">{!enterOTP ? "Login" : "Enter OTP"}</h1>
        </header>
        <div className="login-box">

          {registerSchedular ? (
            <>
             {/* schedularName - autoPopulate, Enter Password */}
            </>
          ) : enterOTP ? (
            <>
              {/* opt */}
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
                <Button sx={{ border: "2px solid black", marginLeft: "40%" }} onClick={handleOptVerify}>Verify OTP</Button></div>
            </>
          ) : (
            <>
              

               {/* //location, Hospital */}



               <div>
                Location:

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

                    <div>Hospital Name :
                      <Autocomplete
                        id="combo-box-demo"
                        options={hospitalNameFilterList}
                        getOptionLabel={(option: any) => option}
                        sx={{ width: 300, background: "white" }}
                        value={hospitalName}
                        onChange={(event, newValue:any) => setHospitalName(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select hospitals"
                            variant="outlined"
                          />
                        )}
                      />
                    </div></>
                )}

                <Button onClick={handleRegister} >Create Schedular</Button>
              </div>

            </>
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

export default SchedularLogin;



