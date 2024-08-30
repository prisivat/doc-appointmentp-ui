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



const BookingDetails = () => {
    const hospName = useSelector((state: RootState) => state.user.hospitalName);
    const docName = useSelector((state: RootState) => state.user.docName);
    const availableTime = useSelector((state: RootState) => state.user.time);
    const location = useSelector((state: RootState) => state.user.location);
 
    return (
        <div><Headers />

            <Grid container xs={12} sx={{ minWidth: "80rem", background: "white", minHeight: "30rem !important", marginTop: "5rem", display: "flex", justifyContent: "center", 
              alignItems: "flex-start",  alignContent: "flex-start" }}>
                <Grid item xs={12} sx={{
                    marginTop: "1rem", marginLeft: "2rem", marginRight: "2rem",
                    background: "#256f83", fontSize: "40px", fontWeight: "bold", maxHeight: "3rem", display: "flex", alignItems: "center", justifyContent: "center", color: "white"
                }}>
                    {hospName}
                </Grid>
                <Grid item xs={12} sx={{display: "flex", flexDirection: "column", alignItems: "center", margin: "1rem"}}>
                    <Grid sx={{display: "flex", alignItems: "center"}}><Avatar sx={{marginRight: "10px"}}/> {docName}</Grid> <br/>
                    <Grid ><b>COST:</b> 500 Rs.</Grid>
                </Grid>
                <Grid item xs={12} sx={{  marginLeft: "1rem", marginRight: "1rem", display: "flex", justifyContent: "center", }}>
                <DatePicker/>
            </Grid>
        </Grid>
            </div >
    )
}
export default BookingDetails; 