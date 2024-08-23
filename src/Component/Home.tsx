import React, { useEffect, useState } from 'react';
import './login.css';
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import Headers from './Header'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; 
import { HospitalDetails } from './HospitalDetails';

const Home: React.FC = () => {

  const containerStyle = {
    width: '80%',
    maxWidth: '100%',
    minWidth: '80%',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
  };

  const bodyStyle = {
    margin: 0,
    padding: 0,
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const [locationDetails, setLocationDetails] = useState<string[]>([]);
  const [value, setValue] = React.useState<string | null>();
  const [selectedLocation, setSelectedLocation] = useState([]);
  const userName = useSelector((state: RootState) => state.user.userName);
  const [showLocation, setShowLocation] = useState(true);
  const [hospDtlsByLoc, setHospDtlsByLoc] = useState<any>({});
  const [spltNameList, setSpltNameList] = useState<any> ({})
  
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
        console.error('Error making POST request:', error);
      }
    }
    fetchDetails()
  }, [])

  const handleLocationSelect = (e: any) => {
    setValue(e);
    setSelectedLocation(e)
    console.log(e, "newVal")
  }

  const handleSearchLocation = async (e: any) => {
    if(selectedLocation.length == 0){
      toast.warning("Please select location")
    } else{
      try {
        const response = await fetch('http://localhost:8082/hospital/hospitalDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedLocation),
        });
    
        if (!response.ok) {
            const errorMessage = await response.text(); // Use response.json() if server returns JSON
            toast.error(errorMessage);
        }
        const value = await response.json()
        console.log(value,"log")
        setHospDtlsByLoc(value);
    
        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        console.error('Error making POST request:', error);
      }
      getSplDtlsByLoc();
    }
  }

  const getSplDtlsByLoc = async () => {
    try {
      const response = await fetch('http://localhost:8082/hospital/specialistName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedLocation),
      });
  
      if (!response.ok) {
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
      }
      setSpltNameList( await response.json());
      setShowLocation(false)
  
      // const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  }

  return (
    <>
    <div style={bodyStyle}>
      <div >

      
      <Headers />
      {  showLocation ?  (
      <Grid container xs={12} sx={containerStyle}>
        <Autocomplete
          multiple
          id="combo-box-demo"
          options={locationDetails}
          getOptionLabel={(option) => option}
          sx={{ width: 300, background: "white" }}
          value={selectedLocation}
          onChange={(event, newValue) => handleLocationSelect(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select locations"
              variant="outlined"
            />
          )}
        />
        <Button onClick={handleSearchLocation} sx={{background: "#067492 !important", color: "white"}}><ArrowForwardIcon /></Button>
      </Grid>
      ) : (
          <HospitalDetails hospDtlsByLoc={hospDtlsByLoc} spltNameList={spltNameList} locationList={selectedLocation}/>
        
      )}
      </div>
      </div>
    </>
  ) 
}

export default Home;