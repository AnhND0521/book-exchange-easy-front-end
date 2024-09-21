import React, { useState } from "react";
import Calendar from "react-calendar";
import './calendar.css'
export default function EventCalendar(props) {
  const { activeDate, setActiveDate } = props;
  return (
    <div className="w-full">
      <Calendar
        className="w-full bg-white text-center nunito-font px-5 pt-3 pb-5  rounded-xl shadow-md"
        tileClassName={({ date, view }) => {
          // Add a custom class for the current date
          if (date.getDate() === activeDate.getDate() && date.getMonth() === activeDate.getMonth() && view === "month") {
            return "normal highlight";
          } else {
            return "normal";
          }
        }}
        onChange={(date) => setActiveDate(date)}
      />
    </div>
  );
}
