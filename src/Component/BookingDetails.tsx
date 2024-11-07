import React, { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
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
    const [selectedDate,setSelectedDate] = useState(new Date());
    const [timeList, setTimeList] = useState<any>(["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]);
 
    useEffect(() => {
        getBookingTime();
        },[selectedDate])

    const getBookingTime = async() => {
        const body ={location: location, hospitalName: hospName, specialist: specalist, docName: docName, date: selectedDate};
        try {
            const response = await fetch('http://localhost:8082/appointment/booked/time', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
        
            if (!response.ok) {
                const errorMessage = await response.text(); // Use response.json() if server returns JSON
                // toast.error(errorMessage);
            } else{
                // setEnterOTP(true);
            }
        
            const data = await response.json();
            if(data.length == 0){
                setTimeList(["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"])
                
            } else{
                var finalTIme = timeList.filter((item:any)=> !data.includes(item));
                setTimeList(finalTIme);
            }
          } catch (error) {
            toast.error('Error making POST request:');
          }
    }

    return (
        <div><Headers />

            <Grid container xs={12} sx={{ minWidth: "80rem", background: "white", minHeight: "30rem !important", marginTop: "10rem", display: "flex", justifyContent: "center", 
              alignItems: "flex-start",  alignContent: "flex-start" }}>
                <Grid item xs={12} sx={{
                    marginTop: "1rem", marginLeft: "2rem", marginRight: "2rem",
                    background: "#256f83", fontSize: "40px", fontWeight: "bold", maxHeight: "3rem", display: "flex", alignItems: "center", justifyContent: "center", color: "white"
                }}>
                    {hospName}
                </Grid>
                <Grid item xs={12} sx={{display: "flex", flexDirection: "column", alignItems: "center", margin: "1rem"}}>
                    <Grid sx={{display: "flex", alignItems: "center"}}><Avatar sx={{marginRight: "10px"}}/> {docName}</Grid> <br/>
                    <Grid ><b>COST:</b> {cost}Rs.</Grid>
                </Grid>
                <Grid item xs={12} sx={{  marginLeft: "1rem", marginRight: "1rem", display: "flex", justifyContent: "center", maxHeight: "15rem !important", overflow: "scroll"}}>
                <DatePicker listOfTime = {timeList} setDate={setSelectedDate}/>
            </Grid>
        </Grid>
            </div >
    )
}
export default BookingDetails; 