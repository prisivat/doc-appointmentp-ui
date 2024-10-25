import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([
    {
      title: 'Meeting with John',
      start: new Date(2024, 8, 23, 14, 0),
      end: new Date(2024, 8, 23, 15, 0),
      desc: 'Discuss project progress'
    },
    {
      title: 'Doctor Appointment',
      start: new Date(2024, 8, 24, 11, 30),
      end: new Date(2024, 8, 24, 12, 30),
      desc: 'Routine checkup'
    },
  ]);

  const handleSelectEvent = (event:any) => {
    alert(`Event: ${event.title}\nDescription: ${event.desc}`);
  };

  return (
    <div>
      <h2>My Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent} // Event click handler
      />
    </div>
  );
};

export default MyCalendar;
