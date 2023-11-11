"use client";

import moment from "moment";
import React, { useState, useEffect } from "react";

const LiveClock: React.FC<{ format?: string }> = ({ format }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => {
      clearInterval(intervalId); // Cleanup when the component unmounts
    };
  }, []);

  const formattedDateTime = currentDateTime.toLocaleString(); // Format the date and time

  return <>{moment(formattedDateTime).format(format)}</>;
};

export default LiveClock;
