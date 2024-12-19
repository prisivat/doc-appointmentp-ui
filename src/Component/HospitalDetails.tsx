import { Autocomplete, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import Model from './Model';
import { useNavigate, } from "react-router-dom";
import { hospitalDetails, userDetails } from "../userSlice"
import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from '@mui/material';
import { RootState } from '../store';





interface Prop {
  hospDtlsByLoc: any;
  spltNameList: any;
  locationList: any;
}
export const HospitalDetails = ({ hospDtlsByLoc, spltNameList, locationList }: Prop) => {
  const [locationSelected, setLocationSelected] = useState<any>("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [localHospitalDetails, setLocalHospitalDetails] = useState(hospDtlsByLoc);
  const [hospitalNameFilterList, setHospitalNameFilterList] = useState([]);
  const [specalistFilterList, setSpecialistFilterList] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [hospName, setHospName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [costFilter, setCostFilter] = useState(10);
  const [filterValues, setFilterValues] = useState({ hospitalName: [], cost: "5000", specialist: [], location: "" })
  const userName = useSelector((state: RootState) => state.user.userName);
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
  const handleSliderChange = (e: any) => {
    setCostFilter(e.target.value);
  };

  useEffect(() => {
    setLocalHospitalDetails(hospDtlsByLoc)
  }, [hospDtlsByLoc])


  async function handleFilter(): Promise<void> {
    setIsLoading(true);
    if (locationSelected == "") {
      setIsLoading(false);
      toast.error("Please select Location");
    // } else if ((filterValues.specialist.length == 0 || filterValues.hospitalName.length == 0) && locationSelected != "") {
    //   setIsLoading(false);
    //   toast.error("Please Select both Speaclist and Hospital Name")
    } 
    else {

      var final: any = {};
      final.cost = parseInt(filterValues.cost)
      final.hospitalName = filterValues.hospitalName
      final.location = locationSelected
      final.specialist = filterValues.specialist

      try {
        const response = await fetch('https://easymedurl-50022251973.development.catalystappsail.in/hospital/filteredDtls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(final),
        });

        if (!response.ok) {
          setIsLoading(false);
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
        } else {
          setIsLoading(false);
          var val = await response.json()
          setLocalHospitalDetails([val])
        }

        // const data = await response.json();
        // console.log(data);
      } catch (error) {
        setIsLoading(false);
        toast.error('Error making POST request:');
      }

    }

  }
  const handleReset = () => {
    setSelectedLocation("")
    setLocalHospitalDetails(hospDtlsByLoc)
    setFilterValues({ hospitalName: [], cost: "5000", specialist: [], location: "" })
  }


  const filterData = (data: any, location: string, specialization: string) => {
    return Object.keys(data)
      .filter((loc) => loc === location) // Filter by location
      .reduce((result: any, loc) => {
        const filteredHospitals = data[loc].map((hospital: any) => {
          const filteredSpecialists = hospital.specialist.filter(
            (specialist: any) => specialist.spclName === specialization
          );
          if (filteredSpecialists.length > 0) {
            return {
              ...hospital,
              specialist: filteredSpecialists,
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

  const handleLocSelect = (e: any) => {
    setIsLoading(true);
    const loc = e.target.value;
    setLocationSelected(e.target.value)
    var location = loc;
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
          setSpecialistFilterList(data?.specialist);
        }
      } catch (error) {
        setIsLoading(false);
        toast.error('Error making POST request:');
      }
    }
    if (locationSelected != "") {
      fetchFilterValues();
    }

  }

  function handleBookAppointment(docName: any, cost: any, hospitalName: any, location: any, specialist: any): void {
    setIsLoading(true);
    if (userName == undefined || userName == null || userName == "") {
      toast.error("Please Login to Book Appointment")
      setIsLoading(false);
    } else {
      dispatch(hospitalDetails({
        docName: docName,
        cost: cost,
        hospitalName: hospitalName,
        location: location,
        specialist: specialist
      }));
      setIsLoading(false);
      navigate("/bookAppointment")
    }
  }

  const handleLocationChange = (e: any) => {
    setLocationSelected(e.target.value)
  }

  return (
    <Grid container xs={12} sx={{
      minWidth: "95rem !important", display: "flex", marginLeft: "5% !important",
      justifyContent: "space-around", flexWrap: "nowrap", marginTop: "8rem",
    }} spacing={2}>
      <Grid item xs={6} sx={{ maxHeight: "30rem", overflowY: "scroll" }} >
        {localHospitalDetails != undefined && localHospitalDetails?.map((city: any) => (
          <div >
            {city?.hospitalDetails?.map((hospital: any, hospitalIndex: number) => (
              <div >
                <Typography sx={{ fontSize: "1.5rem !important", color: "black" }} color="text.primary" gutterBottom>
                  <b>{hospital?.name}</b>
                </Typography>
                {hospital?.specialist && hospital.specialist?.map((specalistVal: any) => (
                  <div>
                    {specalistVal?.doctorsList[0]?.docNameAndAvblTime.map((docName: any) => (

                      <Card sx={{ margin: "10px" }}>

                        <CardContent>
                          <Grid container xs={12}>
                            <Grid xs={6}>
                              <Grid xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                                <Avatar />
                                <span style={{ marginLeft: "1rem" }}>{docName?.docName} </span>
                              </Grid>
                              <div style={{ fontSize: "14px", color: "black", margin: "1rem", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
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
                              <Tooltip title={userName == undefined || userName == null || userName == "" ? "Please Login to Book Appointment" : " Book Appointment"}>
                                <Button
                                  onClick={() => handleBookAppointment(docName?.docName, docName?.cost, hospital?.name, city?.location, specalistVal.spclName)}
                                  sx={{ background: "#067492 !important", color: "white", marginBottom: "5px" }} >Book Appointment</Button>
                              </Tooltip>
                              {openModel && (
                                <Model title={hospName} opeModel={openModel} setOpeModel={setOpenModel} isHospDtls={true} iscalendar={false} />
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
        <div style={{
          background: "white", height: "100%", display: "flex", padding: "2rem",
          alignItems: "stretch", flexDirection: "column", justifyContent: "center"
        }}>
          Location:

          <FormControl sx={{ m: 1, minWidth: 120, marginTop: "1rem" }}>
            <InputLabel id="location-label">Select Location</InputLabel>
            <Select
              value={locationSelected}
              onChange={handleLocSelect}
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

            <>

              <div style={{ marginTop: "5px" }}>Hospital Name :
                <Autocomplete
                  multiple
                  id="combo-box-demo"
                  options={hospitalNameFilterList}
                  getOptionLabel={(option: any) => option}
                  sx={{ width: "100%", background: "white", marginTop: "1rem" }}
                  value={filterValues.hospitalName}
                  onChange={(e, value: any) => {
                    setFilterValues((val) => ({
                      ...val,
                      hospitalName: value
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select hospitals"
                      variant="outlined"
                    />
                  )}
                />
              </div><div style={{ marginTop: "10px" }}>Specalist :
                <Autocomplete
                  multiple
                  id="combo-box-demo"
                  options={specalistFilterList}
                  getOptionLabel={(option: any) => option}
                  sx={{ width: "100%", background: "white", marginTop: "1rem" }}
                  value={filterValues.specialist}
                  onChange={(e: any, value: any) => {
                    setFilterValues((val) => ({
                      ...val,
                      specialist: value
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select locations"
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <div style={{ marginTop: "15px" }}>Cost :
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="500"
                  value={filterValues.cost}
                  onChange={(e) => {
                    setFilterValues((val) => ({
                      ...val,
                      cost: e.target.value
                    }));
                  }}
                /> {filterValues.cost}
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
          <Button sx={{ background: "#067492 !important", color: "white", marginBottom: "5px", marginTop: "2rem" }} onClick={handleReset} >RESET</Button>
          <Button sx={{ background: "#067492 !important", color: "white", marginBottom: "5px" }} onClick={handleFilter} >FILTER</Button>
        </div>
      </Grid>

    </Grid>
  )
}

