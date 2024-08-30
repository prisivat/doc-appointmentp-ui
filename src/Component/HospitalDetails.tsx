import { Autocomplete, CardHeader, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { toast } from 'react-toastify';
import Model from './Model';
import BookingDetails from './BookingDetails';
import { useNavigate, } from "react-router-dom";
import { hospitalDetails, userDetails } from "../userSlice"
import { useAppSelector } from '../reduxHooks';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from '@mui/material';




interface Prop {
  hospDtlsByLoc: any;
  spltNameList: any;
  locationList: any;
}
export const HospitalDetails = ({ hospDtlsByLoc, spltNameList, locationList }: Prop) => {
  const [locationSelected, setLocationSelected] = useState<any>("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [localHospitalDetails, setLocalHospitalDetails] = useState(hospDtlsByLoc);
  const [specalistFilterList, setSpecalistFilterList] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [hospName, setHospName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();



  useEffect(() => {
    setLocalHospitalDetails(hospDtlsByLoc)
  }, [hospDtlsByLoc])


  async function handleFilter(): Promise<void> {
    if (selectedLocation == "") {
      setLocalHospitalDetails(hospDtlsByLoc)
    } else {
      console.log(selectedLocation);
      var val = selectedLocation?.split(",");
      var value = hospDtlsByLoc;
      setLocalHospitalDetails(filterData(value, val[1], val[0]))
    }
  }
  const handleReset = () => {
    setSelectedLocation("")
    setLocalHospitalDetails(hospDtlsByLoc)
  }


  const filterData = (data: any, location: string, specialization: string) => {
    return Object.keys(data)
      .filter((loc) => loc === location) // Filter by location
      .reduce((result: any, loc) => {
        const filteredHospitals = data[loc].map((hospital: any) => {
          const filteredSpecialists = hospital.specalist.filter(
            (specialist: any) => specialist.spclName === specialization
          );
          if (filteredSpecialists.length > 0) {
            return {
              ...hospital,
              specalist: filteredSpecialists,
            };
          }
          return null;
        }).filter((hospital: any) => hospital !== null);

        if (filteredHospitals.length > 0) {
          result[loc] = filteredHospitals;
        }
        return result;
      }, {});
  };



  function handleContactDetails(val: any): void {
    setOpenModel(true);
    setHospName(val);

  }

  useEffect (() => {
    var location = locationSelected;
    const fetchFilterValues = async () => {
      try {
        const response = await fetch(`http://localhost:8082/hospital/filterDtls/${location}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
        const data = await response.json();
        setSpecalistFilterList(data);
      } catch (error) {
        console.error('Error making POST request:', error);
      }
    }
    if(locationSelected != ""){
    fetchFilterValues();
    }

  },[locationSelected])

  function handleBookAppointment(docName: any, time: any, hospitalName: any, location: any): void {
    dispatch(hospitalDetails({
      docName: docName,
      time: time,
      hospitalName: hospitalName,
      location: location
    }));
    navigate("/bookAppointment")
  }

  const handleLocationChange =(e:any) => {
    setLocationSelected(e.target.value)
  }

  return (
    <Grid container xs={12} sx={{
      minWidth: "95rem !important", display: "flex", marginLeft: "5% !important",
      justifyContent: "space-around", flexWrap: "nowrap", marginTop: "8rem",
    }} spacing={2}>
      <Grid item xs={6} sx={{ maxHeight: "30rem", overflowY: "scroll" }} >
        {localHospitalDetails!=undefined && localHospitalDetails.length != 0 && localHospitalDetails?.map((city: any) => (
          <div >
            {city?.hospitalDetails?.map((hospital: any, hospitalIndex: number) => (
              <div >
                <Typography sx={{ fontSize: "1.5rem !important", color: "black" }} color="text.primary" gutterBottom>
                  <b>{hospital?.name}</b>
                </Typography>
                {hospital?.specalist && hospital.specalist?.map((specalistVal: any) => (
                            <div>
                              {specalistVal?.doctorsList[0]?.docNameAndAvblTime.map((docName: any) => (

                <Card sx={{ margin: "10px" }}>

                  <CardContent>
                    <Grid container xs={12}>
                      <Grid xs={6}>
                        <Grid xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start"}}>
                        <Avatar/>
                                  <span style={{marginLeft: "1rem"}}>{docName?.docName} </span>
                        </Grid>
                        <div style={{fontSize: "14px" , color: "black", margin: "1rem", display: "flex", alignItems: "center", justifyContent: "space-around" }}>  
                          <Typography sx={{
                                                        fontSize: ".8rem", border: "1px solid #3d3d81",
                                                        borderRadius: "2px", background: "#e6f9ff", padding: "5px", maxWidth: "6rem",  
                                                    }} color="text.secondary">
                                                        {specalistVal.spclName}
                                                    </Typography>

                        <div style={{ fontSize: "14px", color: "black", }}><b>Location: </b>{city.location}</div>
                        </div>
                        </Grid>
                      <Grid xs={6} sx={{ borderLeft: "2px solid black", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ marginBottom: "5px" }}>Monday to Sunday (09:00 To 20:00) </div>
                        <Button onClick={() => handleContactDetails(hospital.name)} sx={{ background: "#067492 !important", color: "white", marginBottom: "5px" }} >Contact Hospital</Button>
                        <Button onClick={() => handleBookAppointment(docName?.docName, docName?.availableTime, hospital?.name, city)} sx={{ background: "#067492 !important", color: "white", marginBottom: "5px" }} >Book Appointment</Button>
                        {openModel && (
                          <Model hospitalDetails={hospName} opeModel={openModel} setOpeModel={setOpenModel} />
                        )}

                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                ))}
               
              </div>
            ))}
              </div>
            ))}
          </div>

        ))} 
      </Grid>
      <Grid item xs={4} sx={{ marginRight: "5rem", marginBottom: "5rem" }}>
        <div style={{ background: "white", height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          Location: 

          <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={locationSelected}
          onChange={handleLocationChange}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {locationList?.map((val: any) => (
          <MenuItem value={val}>{val}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {locationSelected != "" && (
       
            <><div>Cost :
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={locationSelected}
                  onChange={handleFilter}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {locationList?.map((val: any) => (
                    <MenuItem value={val}>{val}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>Hospital Name :
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={locationSelected}
                  onChange={handleFilter}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {locationList?.map((val: any) => (
                    <MenuItem value={val}>{val}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div><div>Specalist :
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    value={locationSelected}
                    onChange={handleFilter}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {locationList?.map((val: any) => (
                      <MenuItem value={val}>{val}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div></>
      )}


          {/* <FormControl sx={{ m: 1, minWidth: 340 }}>
            <InputLabel htmlFor="grouped-native-select">Select Specalist</InputLabel>
            <Select
              native
              value={selectedLocation}
              onChange={(e: any) => { handleLocationFilterChange(e) }}
              id="grouped-native-select"
              label="Grouping"
              sx={{ maxWidth: 340 }}
            >
              <option aria-label="None" value="" >None</option>
              {Object.keys(spltNameList).map((city: any, cityIndex: any) => (
                <optgroup label={city} key={cityIndex}>
                  {spltNameList[city].map((hospital: any, hospitalIndex: number) => (
                    <option key={hospitalIndex} value={hospital + "," + city}>
                      {hospital}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </FormControl> */}
          {/* 
 
<FormControl sx={{ m: 1, minWidth: 340 }}>
      <InputLabel id="grouped-multi-select-label">Select Specalist</InputLabel>
      <Select
        labelId="grouped-multi-select-label"
        id="grouped-multi-select"
        multiple
        value={selectedLocation}
        onChange={(e:any) => {handleChange(e)}}
        sx={{maxWidth: 340}}
        renderValue={(selected) => (selected as string[]).join(', ')}
      >
        {Object.keys(spltNameList).map((city: string, cityIndex: number) => (
          <React.Fragment key={cityIndex}>
            <MenuItem disabled>{city}</MenuItem>
            {spltNameList[city].map((hospital: string, hospitalIndex: number) => (
              <MenuItem key={hospitalIndex} value={hospital}>
                <Checkbox
                  checked={selectedLocation.indexOf(hospital) > -1}
                  onChange={(event) => handleCheckChange(event, hospital)}
                />
                <ListItemText primary={hospital} />
              </MenuItem>
            ))}
          </React.Fragment>
        ))}
      </Select>
    </FormControl>  */}
          <Button sx={{ background: "#067492 !important", color: "white", marginBottom: "5px" }} onClick={handleReset} >RESET</Button>
          <Button sx={{ background: "#067492 !important", color: "white", marginBottom: "5px" }} onClick={handleFilter} >FILTER</Button>
        </div>
      </Grid>

    </Grid>
  )
}

