import React, { useEffect, useState } from 'react';
import SchedulerHeader from './SchedulerHeader';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box, Card, CardContent, Typography, Grid, Select, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';




const SchedulerHome: React.FC = () => {

  const [schedulerDetails, setScedulerDetails] = useState([{location: "", hospitalName:""}]);
  const [docNameList, setDocNameList] = useState([]);
  const hospitalName = useSelector((state: RootState) => state.user.hospitalName);
  const location = useSelector((state: RootState) => state.user.location);
  const [selectedDocName, setSelectedDocName] = useState('');
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
    const fetchCall = async () => {
      try {

        // const body = {hospitalName: hospitalName, location: location, date: new Date()};
        var date = new Date().toISOString().split('T')[0];;
        const body = { hospitalName: "Apollo Hospital", location: "Chennai", date: date };
        const response = await fetch('http://localhost:9000/appointment/scheduler-total-appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          setIsLoading(false);
          const errorMessage = await response.text(); // Use response.json() if server returns JSON
          toast.error(errorMessage);

        } else {
          setIsLoading(false);
          const data = await response.json();
          console.log(data, "data")
          setScedulerDetails(data);
          var docNames: any = [];
          data.forEach((item: any) => {  // Check if docName exists to avoid null values
            docNames.push(item.docName);

          });
          const uniqueNames = docNames.filter((name: any, index: any) => docNames.indexOf(name) === index);
          setDocNameList(uniqueNames);
          console.log(uniqueNames, "uniqueNames")
        }

      } catch (error) {
        setIsLoading(false);
        toast.error('Error making POST request:');
      }
    }
    fetchCall();
  }, [])

  const handleFilterChange = async (event: any) => {
    setIsLoading(true);
    const selected = event.target.value;
    setSelectedDocName(selected);
    setScedulerDetails([])
    try {
      const body = { hospitalName: schedulerDetails[0].hospitalName, location: schedulerDetails[0].location, docName: selected == "" ? "ALL" : selected };
      const response = await fetch('http://localhost:9000/appointment/scheduler-filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        setIsLoading(false);
        const errorMessage = await response.text(); // Use response.json() if server returns JSON
        toast.error(errorMessage);

      } else {
        setIsLoading(false);
        const data = await response.json();
        setScedulerDetails(data);
      }

    } catch (error) {
      setIsLoading(false);
      toast.error('Error making POST request:');
    }
    // fetchBookingsByDocName(selected); // Fetch filtered data
  };

  const handleDateSelect = async (newValue: any) => {
    setIsLoading(true);
    try {
      const formattedDate = newValue ? dayjs(newValue).format('YYYY-MM-DD') : '';
      setSelectedDocName("")
      const body = { hospitalName: schedulerDetails[0].hospitalName, location:  schedulerDetails[0].location, date: formattedDate };
      const response = await fetch('http://localhost:9000/appointment/scheduler-appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        setIsLoading(false);
        const errorMessage = await response.text(); // Use response.json() if server returns JSON
        toast.error(errorMessage);

      } else {
        setIsLoading(false);
        const data = await response.json();
        setScedulerDetails(data);
      }

    } catch (error) {
      setIsLoading(false);
      toast.error('Error making POST request:');
    }
  }


  const bodyStyle = {
    margin: 0,
    padding: 0,
    fontFamily: 'Arial, sans-serif',
    display: 'flex',

    height: '100vh',
  };

  return (
    <>
      <div style={bodyStyle}>
        <SchedulerHeader />
        <Grid container xs={12} style={{ display: "flex", paddingTop: "100px" }}>
          <Grid item xs={12} sx={{ right: 0, display: "flex", flexDirection: "row", justifyContent: "flex-end", marginRight: "2rem", position: "fixed" }}>
            <Select
              value={selectedDocName}
              onChange={handleFilterChange}
              displayEmpty
              sx={{ minWidth: 200, background: "white", marginRight: "1rem" }}
            >
              <MenuItem value="">All Doctors</MenuItem>
              {docNameList.map((docName) => (
                <MenuItem key={docName} value={docName}>
                  {docName}
                </MenuItem>
              ))}
            </Select>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="Basic date picker" onChange={handleDateSelect} sx={{ background: "white" }} />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "3rem", maxHeight: "90%", overflowY: schedulerDetails.length == 0 ? "none" : "scroll" }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: "wrap", marginTop: "1rem" }}>

              {schedulerDetails.length == 0 && (
                <div style={{ background: "white" }}>No Appointment Booked for selected Date</div>
              )}
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
      </div>
    </>
  )
}

export default SchedulerHome;