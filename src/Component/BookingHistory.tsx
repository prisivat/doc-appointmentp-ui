import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import MyCalendar from './MyCalendar';


function BookingHistory() {
    const userName = useSelector((state: RootState) => state.user.userName);
    let firstDaty = 1;
    const [event, setEvent] = useState<any>([{ title: "AZUL +5", start: "09-09-2024" },
    ])

    function getDate(date:any) {
        const today = new Date();
        const year = today.getFullYear().toString();
        let month = (today.getMonth() + 1).toString();
      
        if (month.length === 1) {
          month = "0" + month;
        }
      
        return date.replace("YEAR", year).replace("MONTH", month);
      }



    useEffect (() => {
        var val  = getDate("YEAR-MONTH-24")
        console.log(val,"val")
        setEvent([{ title: "AZUL +5", start: val }])
        const bookingHistory = async () => {
        try {
            const response = await fetch('http://localhost:8082/appointment/booking-history', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({userName: userName }),
            });
        
            if (!response.ok) {
                const errorMessage = await response.text(); // Use response.json() if server returns JSON
                toast.error(errorMessage);
            } else{
              var val = await response.json()
                // setLocalHospitalDetails([val])
            }
        
            // const data = await response.json();
            // console.log(data);
          } catch (error) {
            toast.error('Error making POST request:');
          }
        }
        bookingHistory();
    },[])
  return (
    <div style={{marginTop: "10rem"}}>BookingHistory
    <MyCalendar/>
        {/* <FullCalendar
        defaultView="dayGridMonth"
        firstDay={firstDaty}
        locale="es"
        header={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        themeSystem="Simplex"
        // plugins={[dayGridPlugin]}
        events={event}
      /> */}
    </div>
  )
}


export default BookingHistory
