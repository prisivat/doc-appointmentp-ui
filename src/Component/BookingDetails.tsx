import React, { useEffect, useState } from "react";
import { Avatar, Grid, styled } from "@mui/material";
import Headers from './Header';
import { useSelector } from "react-redux";
import { RootState } from "../store";
import moment from 'moment';
import './login.css';
import DatePicker from "./DatePicker";
import { toast } from "react-toastify";



const BookingDetails = () => {
  const hospName = useSelector((state: RootState) => state.user.hospitalName);
  const docName = useSelector((state: RootState) => state.user.docName);
  const specalist = useSelector((state: RootState) => state.user.specialist);
  const cost = useSelector((state: RootState) => state.user.cost);
  const location = useSelector((state: RootState) => state.user.location);
  const bookingId = useSelector((state: RootState) => state.user.bookingId);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeList, setTimeList] = useState<any>(["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]);
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
    getBookingTime();
  }, [selectedDate])

  const getBookingTime = async () => {
    setIsLoading(true);
    const body = { location: location, hospitalName: hospName, specialist: specalist, docName: docName, date: selectedDate };
    try {
      const response = await fetch('https://easymedurl-50022251973.development.catalystappsail.in/appointment/booked/time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Use response.json() if server returns JSON
        // toast.error(errorMessage);
        setIsLoading(false);
      } else {
        // setEnterOTP(true);
        setIsLoading(false);
      }

      const data = await response.json();
      if (data.length == 0) {
        setTimeList(["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"])

      } else {
        var finalTIme = timeList.filter((item: any) => !data.includes(item));
        setTimeList(finalTIme);
      }
    } catch (error) {
      toast.error('Error making POST request:');
    }
  }

  return (
    <div><Headers />

      <Grid container xs={12} sx={{
        minWidth: "80rem", background: "white", minHeight: "30rem !important", marginTop: "10rem", display: "flex", justifyContent: "center",
        alignItems: "flex-start", alignContent: "flex-start"
      }}>
        <Grid item xs={12} sx={{
          marginTop: "1rem", marginLeft: "2rem", marginRight: "2rem",
          background: "#256f83", fontSize: "40px", fontWeight: "bold", maxHeight: "3rem", display: "flex", alignItems: "center", justifyContent: "center", color: "white"
        }}>
          {hospName}
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1rem" }}>
          <Grid sx={{ display: "flex", alignItems: "center" }}><Avatar sx={{ marginRight: "10px" }} /> {docName}</Grid> <br />
          <Grid ><b>COST:</b> {cost}Rs.</Grid>
        </Grid>
        <Grid item xs={12} sx={{ marginLeft: "1rem", marginRight: "1rem", display: "flex", justifyContent: "center", maxHeight: "15rem !important", overflow: "scroll" }}>
          <DatePicker listOfTime={timeList} setDate={setSelectedDate} />
        </Grid>
      </Grid>
    </div >
  )
}
export default BookingDetails; 