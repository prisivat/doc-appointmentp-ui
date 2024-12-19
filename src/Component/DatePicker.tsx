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

const DatePicker = ({ setDate, listOfTime }: Props) => {
  const nav = useNavigate();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState("")
  const [patientName, setPatientName] = useState("");
  const [edit, setEdit] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const userName = useSelector((state: RootState) => state.user.userName);
  const hospName = useSelector((state: RootState) => state.user.hospitalName);
  const docName = useSelector((state: RootState) => state.user.docName);
  const specialist = useSelector((state: RootState) => state.user.specialist);
  const location = useSelector((state: RootState) => state.user.location);
  const bookingId = useSelector((state: RootState) => state.user.bookingId);


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

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const currentDate = moment();
    const dateRange: any = [];

    for (let i = 1; i <= 7; i++) {
      dateRange.push(moment(currentDate).add(i, 'days').format('YYYY-MM-DD'));
    }

    setDates(dateRange);
    if (bookingId != "" && bookingId != undefined) {
      const fetchFilterValues = async () => {
        try {
          const response = await fetch(`https://easymedurl-50022251973.development.catalystappsail.in/appointment/scheduler-appointments/${bookingId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            const errorMessage = await response.text(); // Use response.json() if server returns JSON
            toast.error(errorMessage);
            setIsLoading(false);
          } else {
            const data = await response.json();
            setEdit(true);
            setPatientName(data?.patientName);
            setGender(data?.gender);
            setPhoneNumber(data?.phoneNumber);
            setAge(data?.age);
            setIsLoading(false);
          }
        } catch (error) {
          toast.error('Error making POST request:');
          setIsLoading(false);
        }
      }
      fetchFilterValues();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleDateClick = (date: any) => {
    setSelectedDate(date);
    setDate(date);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (docName == "" || hospName == "" || specialist == "" || location == "" || patientName == "" || age == "" || gender == "" || phoneNumber == "" || selectedDate == "" || selectedTime == "") {
      setIsLoading(false);
      toast.error("Please Fill all fields")
      return;
    }
    if (phoneNumber.length != 10) {
      setIsLoading(false);
      toast.error("Incorrect Mobile Number")
      return;
    }
    if (bookingId != "" && bookingId != undefined) { 
      
      const body = {
        "userName": userName, "docName": docName, "hospitalName": hospName,
        "specialist": specialist, "location": location, "patientName": patientName, "age": age, "gender": gender, "phoneNumber": phoneNumber,
        "date": selectedDate, "time": selectedTime, "bookingId": bookingId
      }
      try {
        const response = await fetch('https://easymedurl-50022251973.development.catalystappsail.in/appointment/reschedule-booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
          setIsLoading(false);
        } else {
          const message = await response.text(); // Use response.json() if server returns JSON
          toast.success(message)
          setIsLoading(false);
          nav("/")
        }

      } catch (error) {
        toast.error('Error making POST request:');
      }
      setIsLoading(false);
    } else {
      const body = {
        "userName": userName, "docName": docName, "hospitalName": hospName,
        "specialist": specialist, "location": location, "patientName": patientName, "age": age, "gender": gender, "phoneNumber": phoneNumber,
        "date": selectedDate, "time": selectedTime
      }
      try {
        const response = await fetch('https://easymedurl-50022251973.development.catalystappsail.in/appointment/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);
          setIsLoading(false);
        } else {
          const message = await response.text(); // Use response.json() if server returns JSON
          toast.success(message)
          setIsLoading(false);
          nav("/")
        }

      } catch (error) {
        toast.error('Error making POST request:');
      }
    }
  }



  return (
    <div className="date-picker">
      {isLoading ? <><div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.8)', // Adds a white overlay
        backdropFilter: 'blur(10px)', // Adjust the blur intensity
        zIndex: 1,
      }}></div><Loader /> </> : <div>Content goes here!</div>}
      <h2 style={{ margin: "0.5rem" }}>{moment(selectedDate).format('MMMM YYYY')}</h2>
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
        {listOfTime?.map((time: any) => (
          <button className={`date-item ${time === selectedTime ? 'selected' : ''}`}
            onClick={() => { setSelectedTime(time); }}>{time}</button>
        ))}
      </div>

      <Grid xs={6} sx={{ display: "flex", flexWrap: "wrap", alignContent: "center", alignItems: "center", marginLeft: "25%" }}>
        <Grid xs={6}>Patient Name:</Grid><Grid xs={6}><TextField value={patientName} disabled={edit ? true : false} type='text' onChange={(e: any) => setPatientName(e.target.value)} sx={{ minWidth: "100%" }} /></Grid>
        <Grid xs={6}>Patient Age:</Grid><Grid xs={6} ><TextField value={age} disabled={edit ? true : false} type='number' onChange={(e: any) => setAge(e.target.value)} sx={{ minWidth: "100%" }} /></Grid>
        <Grid xs={6}>Patient Gender:</Grid><Grid xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gender}
              label="Age"
              disabled={edit ? true : false}
              onChange={(event: any) => { setGender(event.target.value as string) }}
            >
              <MenuItem value={"female"}>Female</MenuItem>
              <MenuItem value={"male"}>Male</MenuItem>
              <MenuItem value={"nil"}>Prefer not to Mention</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={6}> Mobile Number:</Grid><Grid xs={6}><TextField value={phoneNumber} disabled={edit ? true : false} type='number' sx={{ minWidth: "100%" }} onChange={(e: any) => setPhoneNumber(e.target.value)} /><br /></Grid>
      </Grid>
      <button className="book-appointment" onClick={handleSubmit}>Book an Appointment</button>
    </div>
  );
};

export default DatePicker;
