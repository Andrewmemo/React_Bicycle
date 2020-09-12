import React, { useState } from "react";

const RentedTime = ({ bicycle }) => {
  const [currentTime, setCurrentTime] = useState(1);

  setInterval(() => {
    setCurrentTime(new Date().getTime());
  }, 10);

  let result = bicycle.rentedTime - currentTime;

  let diff = new Date(result - 2 * 60 * 60 * 1000);

  const nextDayCheck = () => (diff > 24 * 60 * 60 * 1000 ? "One day and " : "");

  return (
    <span key={new Date()}>
      {result >= 0
        ? `Rented time: ${nextDayCheck()}${diff.toLocaleTimeString("ru-Ru", {
            timeZone: "Europe/Bucharest",
          })}`
        : "Rented time is over"}
    </span>
  );
};

export default RentedTime;
