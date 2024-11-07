import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
interface Props {
event:any;
}
const MyCalendar = ({event}:Props) => {
  console.log(event,"event")
  const [events, setEvents] = useState([]);

  useEffect (() => {
    var listOfEvent : any = [];
    event?.forEach((item:any) => {
      listOfEvent.push({
        age : item.age,
        bookingId : item.bookingId,
        dateAndTime : item.dateAndTime,
        docName : item. docName, 
        gender : item.gender, 
        hospitalName : item.hospitalName,
        location : item.location,
        phoneNumber : item.phoneNumber,
        specialist : item.specialist,
        title: 'Appointment Details of ' + item.patientName,
        start: item.dateAndTime,
        end: item.dateAndTime,
      })
  })
  setEvents(listOfEvent);
  })

  const handleSelectEvent = (item:any) => {
    alert(`${item.title}\nage : ${item.age}\nDoctor Name: ${item.docName}\nPatient Gender : ${item.gender}\nHospital Name : ${item.hospitalName}\nLocation : ${item.location}\nPhone Number : ${item.phoneNumber}\nSpecialist : ${item.specialist}`);
  };

  return (
    <div style={{ padding: '20px',}}>
      <div style = {{color: "#3174ad", "fontSize": "xx-large", fontWeight: "bolder", background: "white"}}>Booking History</div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        
        views={{ month: true}} 
        style={{ height: '500px', width: '200%', backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px' }}
        onSelectEvent={handleSelectEvent} // Event click handler
      />
    </div>
  );
};

export default MyCalendar;
