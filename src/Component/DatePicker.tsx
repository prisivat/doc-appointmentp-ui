import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Dropdown } from '@mui/base';
import { toast } from 'react-toastify';
import { useNavigate, } from "react-router-dom";


interface Props {
  setDate: any;
  listOfTime: any;
}
const DatePicker = ({setDate, listOfTime}: Props) => {
  const nav = useNavigate();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState("")
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const userName = useSelector((state: RootState) => state.user.userName);
  const hospName = useSelector((state: RootState) => state.user.hospitalName);
  const docName = useSelector((state: RootState) => state.user.docName);
  const specialist = useSelector((state: RootState) => state.user.specialist);
  const location = useSelector((state: RootState) => state.user.location);



  useEffect(() => {
    const currentDate = moment();
    const dateRange:any = [];

    for (let i = 1; i <= 7; i++) {
      dateRange.push(moment(currentDate).add(i, 'days').format('YYYY-MM-DD'));
    }

    setDates(dateRange);
  }, []);

  const handleDateClick = (date: any) => {
    setSelectedDate(date);
    setDate(date);
  };

  const handleSubmit = async() => {
    
    if(docName == "" || hospName == "" || specialist =="" || location == "" || patientName == "" || age == "" || gender == "" || phoneNumber == "" || selectedDate == "" || selectedTime == ""){
      toast.error("Please Fill all fields")
      return;
    }
    if(phoneNumber.length != 10){
      toast.error("Incorrect Mobile Number")
      return;
    }
    const body = {"userName" : userName, "docName" : docName, "hospitalName" : hospName,
      "specialist" : specialist, "location" : location, "patientName" : patientName, "age" : age, "gender" : gender, "phoneNumber" : phoneNumber,
      "date" : selectedDate, "time" : selectedTime
      }
        try {
            const response = await fetch('http://localhost:8082/appointment/booking', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
        
            if (!response.ok) {
                const errorMessage = await response.text(); // Use response.json() if server returns JSON
                toast.error(errorMessage);
            } else{
              const message = await response.text(); // Use response.json() if server returns JSON
              toast.success(message)
              nav("/")
            }
           
          } catch (error) {
            toast.error('Error making POST request:');
          }
        }



  return (
    <div className="date-picker">
      <h2 style={{margin: "0.5rem"}}>{moment(selectedDate).format('MMMM YYYY')}</h2>
      <div className="dates">
        {dates.map((date) => (
          <div
            key={date}
            className={`date-item ${date === selectedDate ? 'selected' : ''}`}
            onClick={() => handleDateClick(date)}
          >
            <span>{moment(date).format('ddd')}</span>
            <span>{moment(date).format('DD')}</span>
          </div>
        ))}
      </div>
      <div className="time-slots">
        {listOfTime?.map((time:any) => (
           <button className={`date-item ${time === selectedTime ? 'selected' : ''}`}
           onClick={() => {setSelectedTime(time); }}>{time}</button>
        ))}
      </div>

<Grid xs={6} sx={{display: "flex", flexWrap: "wrap", alignContent: "center", alignItems: "center", marginLeft: "25%"}}>
      <Grid xs={6}>Patient Name:</Grid><Grid  xs={6}><TextField type='text' onChange={(e:any) => setPatientName(e.target.value)} sx={{minWidth:"100%"}}/></Grid>
      <Grid xs={6}>Patient Age:</Grid><Grid  xs={6} ><TextField type='number' onChange={(e:any) => setAge(e.target.value)} sx={{minWidth:"100%"}}/></Grid>
      <Grid  xs={6}>Patient Gender:</Grid><Grid  xs={6}>
      <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={gender}
    label="Age"
    onChange={(event:any) => {setGender(event.target.value as string)}}
  >
    <MenuItem value={"female"}>Female</MenuItem>
    <MenuItem value={"male"}>Male</MenuItem>
    <MenuItem value={"nil"}>Prefer not to Mention</MenuItem>
  </Select>
</FormControl>
</Grid>

     <Grid  xs={6}> Mobile Number:</Grid><Grid  xs={6}><TextField type='number' sx={{minWidth:"100%"}} onChange={(e:any) => setPhoneNumber(e.target.value)}/><br/></Grid>
      </Grid>
      <button className="book-appointment" onClick={handleSubmit}>Book an Appointment</button>
    </div>
  );
};

export default DatePicker;
