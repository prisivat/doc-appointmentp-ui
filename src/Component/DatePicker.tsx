import React, { useState, useEffect } from 'react';
import moment from 'moment';

const DatePicker = () => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    const currentDate = moment();
    const dateRange:any = [];

    // Generate dates ±5 days from the current date
    for (let i = -5; i <= 5; i++) {
      dateRange.push(moment(currentDate).add(i, 'days').format('YYYY-MM-DD'));
    }

    setDates(dateRange);
  }, []);

  const handleDateClick = (date: any) => {
    setSelectedDate(date);
  };

  return (
    <div className="date-picker">
      <h2 style={{margin: "1rem"}}>{moment(selectedDate).format('MMMM YYYY')}</h2>
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
      {/* Example of time slots */}
      <div className="time-slots">
        <button>03.00 pm</button>
        <button>03.30 pm</button>
        <button>04.00 pm</button>
      </div>
      <button className="book-appointment">Book an Appointment</button>
    </div>
  );
};

export default DatePicker;
