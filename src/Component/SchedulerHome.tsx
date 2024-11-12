import React, { useEffect, useState } from 'react';
import SchedulerHeader from './SchedulerHeader';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box, Card, CardContent, Typography, Grid, Select, MenuItem } from '@mui/material';


const SchedulerHome: React.FC = () => {

    const [schedulerDetails, setScedulerDetails] = useState([{}]);
    const [docNameList, setDocNameList] = useState([]);
    const hospitalName = useSelector((state: RootState) => state.user.hospitalName);
    const location = useSelector((state: RootState) => state.user.location);
    const [selectedDocName, setSelectedDocName] = useState('');

    useEffect (() => {
        
        const fetchCall =  async () => {
        try {
            // const body = {hospitalName: hospitalName, location: location, date: new Date()};
            var date = new Date().toISOString().split('T')[0];;
            const body = {hospitalName: "Apollo Hospital", location: "Chennai", date: date};
            const response = await fetch('http://localhost:8082/appointment/scheduler-total-appointments', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
    
            if (!response.ok) {
              const errorMessage = await response.text(); // Use response.json() if server returns JSON
              toast.error(errorMessage);
              
            } else {
                const data = await response.json();
                console.log(data, "data")
                setScedulerDetails(data);
                var docNames: any = [];
                 data.forEach((item:any) => {  // Check if docName exists to avoid null values
                        docNames.push(item.docName);
                    
                });
                const uniqueNames = docNames.filter((name:any, index:any) => docNames.indexOf(name) === index);
                setDocNameList(uniqueNames);
                console.log(uniqueNames,"uniqueNames")
            }
    
          } catch (error) {
            toast.error('Error making POST request:');
          }
        }
        fetchCall();
    },[])

    const handleFilterChange = async (event:any) => {
        const selected = event.target.value;
        setSelectedDocName(selected);
        setScedulerDetails([])
        try {
            const body = {hospitalName: "Apollo Hospital", location: "Chennai", docName: selected};
            const response = await fetch('http://localhost:8082/appointment/scheduler-filter', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
    
            if (!response.ok) {
              const errorMessage = await response.text(); // Use response.json() if server returns JSON
              toast.error(errorMessage);
              
            } else {
                const data = await response.json();
                setScedulerDetails(data);
            }
    
          } catch (error) {
            toast.error('Error making POST request:');
          }
        // fetchBookingsByDocName(selected); // Fetch filtered data
    };

    return(
        <>
        <SchedulerHeader/>
        <Grid container xs={12} style={{paddingTop : "35rem", display: "flex"}}>
            <Grid item xs={12} sx={{  left: 0, display: "flex", flexDirection: "row", justifyContent:"flex-end", marginRight: "2rem", position: "fixed"}}>
            <Select
                value={selectedDocName}
                onChange={handleFilterChange}
                displayEmpty
                sx={{ marginBottom: 2, minWidth: 200, background: "white" }}
            >
                <MenuItem value="">All Doctors</MenuItem>
                {docNameList.map((docName) => (
                    <MenuItem key={docName} value={docName}>
                        {docName}
                    </MenuItem>
                ))}
            </Select>
            </Grid>
            <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: "wrap", marginTop: "1rem" }}>
        
            {schedulerDetails.map((booking: any) => (
                <Card key={booking.bookingId} sx={{ maxWidth: 400, margin: 2, padding: 2, borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Booking ID: {booking.bookingId}
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Typography variant="body2"><strong>Doctor:</strong> {booking.docName}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2"><strong>Specialist:</strong> {booking.specialist}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2"><strong>Hospital:</strong> {booking.hospitalName}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2"><strong>Location:</strong> {booking.location}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2"><strong>Patient:</strong> {booking.patientName}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2"><strong>Age:</strong> {booking.age}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2"><strong>Gender:</strong> {booking.gender}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2"><strong>Phone:</strong> {booking.phoneNumber}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2"><strong>Date:</strong> {booking.date}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2"><strong>Time:</strong> {booking.time}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
        </Box>
        </Grid>
        </Grid>
        </>
    )
}

export default SchedulerHome;