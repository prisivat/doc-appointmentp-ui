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


interface Prop {
    hospDtlsByLoc: any;
    spltNameList: any;
    locationList: any;
}
export const HospitalDetails = ({ hospDtlsByLoc, spltNameList, locationList }: Prop) => {
    console.log(hospDtlsByLoc, "hospDtlsByLoc")
    console.log(spltNameList, "spltNameList")
    const [selectedLocation, setSelectedLocation] = useState<any>([]);
    const [showSpecalistFilter, setShowSpecalistFilter] = useState(false)
    const [specalistList, setSpecalistList] = useState([])
    const [selectedSpecalist, setSelectedSpecalist] = useState<any>([])
    // const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);
    const [selectedHospitals, setSelectedHospitals] = useState("");
    const[filterBy, setFilterBy] = useState({location: "", specalist:""});
    const[localHospitalDetails, setLocalHospitalDetails] = useState(hospDtlsByLoc);
    const[openModel, setOpenModel] = useState(false);
    const[hospName, setHospName] = useState("");

    useEffect(() => {
        setLocalHospitalDetails(hospDtlsByLoc)
    },[hospDtlsByLoc])

  const handleChange = (event: any) => {
    const value = event.target.value ;
    setSelectedHospitals(value);
  };

//   const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>, hospital: string) => {
//     const isChecked = event.target.checked;
//     setSelectedHospitals((prev) =>
//       isChecked ? [...prev, hospital] : prev.filter((item) => item !== hospital)
//     );
//   };

  async function handleFilter(): Promise<void> {
    console.log(selectedHospitals);
    var val = selectedHospitals?.split(",");
    var value = hospDtlsByLoc;
    setLocalHospitalDetails(filterData(value, val[1], val[0]))
    console.log(localHospitalDetails, "Fitered")
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

    function handleLocationSelection(newValue: any): void {
        setSelectedLocation(newValue)
        setShowSpecalistFilter(true);
        setSpecalistList(spltNameList[newValue]);
    }



    function handleSpecalistSelection(newValue: any[]): void {
        setSelectedSpecalist(newValue)
    }

  function handleContactDetails(val: any): void {
    setOpenModel(true);
    setHospName(val);
    
  }

    return (
        <Grid container xs={12} sx={{
            minWidth: "95rem !important", display: "flex", marginLeft: "5% !important",
            justifyContent: "space-around", flexWrap: "nowrap", marginTop: "8rem",
        }} spacing={2}>
            <Grid item xs={6} sx={{ maxHeight: "30rem", overflowY: "scroll" }} >
                {Object.keys(localHospitalDetails).map((city: any, cityIndex) => (
                    <div key={cityIndex}>
                        {localHospitalDetails[city].map((hospital: any, hospitalIndex: number) => (
                            <div key={hospitalIndex}>
                                

                            <Card sx={{ margin: "10px" }}>

                                <CardContent>
                                    <Grid container xs={12}>
                                        <Grid xs={6}>

                                            <Typography sx={{ fontSize: "1.5rem !important", color: "rgb(7, 153, 193)" }} color="text.primary" gutterBottom>
                                                <b>{hospital.name}</b>
                                            </Typography>
                                            <Grid sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly" }}>
                                                {hospital?.specalist && hospital.specalist.map((specalistVal: any) => (

                                                    <Typography sx={{
                                                        fontSize: ".8rem", marginTop: "2px", border: "1px solid #3d3d81",
                                                        borderRadius: "2px", background: "#e6f9ff", padding: "5px"
                                                    }} color="text.secondary">
                                                        {specalistVal.spclName}
                                                    </Typography>

                                                ))}
                                            </Grid>

                                            <div style={{ fontSize: "14px", color: "black", margin: "1rem" }}><b>Location: </b>{city}</div>
                                        </Grid>
                                        <Grid xs={6} sx={{ borderLeft: "2px solid black", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <div style={{ marginBottom: "5px" }}>Monday to Sunday (09:00 To 20:00) </div>
                                            <Button onClick={() => handleContactDetails(hospital.name)} sx={{ background: "#067492 !important", color: "white", marginBottom: "5px" }} >Contact Hospital</Button>
                                            <Button sx={{ background: "#067492 !important", color: "white", marginBottom: "5px" }} >Book Appointment</Button>
                                            {openModel && (
                                              <Model hospitalDetails={hospName} opeModel={openModel} setOpeModel={setOpenModel}/>
                                              )}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            </div>
                        ))}
                    </div>
              
                ))}
            </Grid>
            <Grid item xs={4} sx={{ marginRight: "5rem", marginBottom: "5rem" }}>
                <div style={{ background: "white", height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <FormControl sx={{ m: 1, minWidth: 340 }}>
      <InputLabel htmlFor="grouped-native-select">Select Specalist</InputLabel>
      <Select
        native
        value={selectedHospitals}
        onChange={(e:any) => {handleChange(e)}}
        id="grouped-native-select"
        label="Grouping"
        sx={{maxWidth: 340}}
      >
        <option aria-label="None" value="" />
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
    </FormControl>              
      {/* 
 
<FormControl sx={{ m: 1, minWidth: 340 }}>
      <InputLabel id="grouped-multi-select-label">Select Specalist</InputLabel>
      <Select
        labelId="grouped-multi-select-label"
        id="grouped-multi-select"
        multiple
        value={selectedHospitals}
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
                  checked={selectedHospitals.indexOf(hospital) > -1}
                  onChange={(event) => handleCheckChange(event, hospital)}
                />
                <ListItemText primary={hospital} />
              </MenuItem>
            ))}
          </React.Fragment>
        ))}
      </Select>
    </FormControl>  */}
                    <Button sx={{ background: "#067492 !important", color: "white", marginBottom: "5px" }} onClick={handleFilter} >FILTER</Button>
                </div>
            </Grid>

        </Grid>
    )
}
