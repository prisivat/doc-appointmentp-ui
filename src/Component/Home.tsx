import React, { useEffect, useState } from 'react';
import './login.css';
import { toast } from 'react-toastify';
import Headers from './Header'
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { HospitalDetails } from './HospitalDetails';
import Chatbot from './Chatbot';
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
  const [hospDtlsByLoc, setHospDtlsByLoc] = useState<any>([]);
  const [spltNameList, setSpltNameList] = useState<any>({})
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

  const handleLocationSelect = (e: any) => {
    setValue(e);
    setSelectedLocation(e)
  }

  useEffect(() => {
    setIsLoading(true);
    const fetchHospitalDtls = async () => {
      try {
        const response = await fetch('https://easymedurl-50022251973.development.catalystappsail.in/hospital/hospitalDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          setIsLoading(false);
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
        }
        const value = await response.json()
        setHospDtlsByLoc(value);
        setIsLoading(false);

      } catch (error) {
        setIsLoading(false);
        toast.error('Error making POST request:');
      }
    }
    fetchHospitalDtls()
  }, [])

  const handleSearchLocation = async (e: any) => {
    setIsLoading(true);
    if (selectedLocation.length == 0) {
      toast.warning("Please select location")
      setIsLoading(false);
    } else {
      try {
        const response = await fetch('https://easymedurl-50022251973.development.catalystappsail.in/hospital/hospitalDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
        }
        const value = await response.json()
        setHospDtlsByLoc(value);
        setIsLoading(false);

      } catch (error) {
        toast.error('Error making POST request:');
        setIsLoading(false);
      }

    }
  }


  return (
    <>
      <div style={bodyStyle}>
        <div >


          <Headers />
          {/* {  showLocation ?  (
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
      ) : ( */}
          {/* <Chatbot/> */}
          <HospitalDetails hospDtlsByLoc={hospDtlsByLoc} spltNameList={spltNameList} locationList={locationDetails} />
            
<Chatbot/>
          {/* )} */}
        </div>
      </div>
    </>
  )
}

export default Home;