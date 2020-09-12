import React, { useState, useEffect } from "react";
import axios from "axios";

import CreateBicycle from "../CreateBicycle/CreateBicycle.js";
import RentedBicycle from "../RentedBicycle/RentedBicycle.js";
import AvaiableBicycle from "../AvaiableBicycle/AvaiableBicycle.js";
import rentedTime from "./../../additionals/rentedTimeGenerator";

import "./Bicycles.css";

const Bicycles = () => {
  const [bicycles, setBicycles] = useState([]);
  const [availableBicycles, setAvailableBicycles] = useState([]);
  const [rentedBicycles, setRentedBicycles] = useState([]);
  const [bicycle, setBicycle] = useState({
    name: "",
    type: "Road",
    rentPrice: "null",
    rented: false,
    rentedTime: rentedTime(),
    isRentChanged: false,
  });

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(
        process.env.REACT_APP_API_URL + "allBicycles"
      );

      setBicycles(data);

      setAvailableBicycles(data.filter((item) => !item.rented));
      setRentedBicycles(data.filter((item) => item.rented));
    }

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <div className="container">
        <p className="h1 headerBicycle">Awesome Bike Rental</p>
        <CreateBicycle
          bicycle={bicycle}
          setBicycle={setBicycle}
          bicycles={bicycles}
          setBicycles={setBicycles}
          availableBicycles={availableBicycles}
          setAvailableBicycles={setAvailableBicycles}
        />
        <RentedBicycle
          bicycles={bicycles}
          setBicycles={setBicycles}
          availableBicycles={availableBicycles}
          setAvailableBicycles={setAvailableBicycles}
          rentedBicycles={rentedBicycles}
          setRentedBicycles={setRentedBicycles}
        />
        <AvaiableBicycle
          bicycles={bicycles}
          setBicycles={setBicycles}
          availableBicycles={availableBicycles}
          setAvailableBicycles={setAvailableBicycles}
          rentedBicycles={rentedBicycles}
          setRentedBicycles={setRentedBicycles}
        />
      </div>
    </React.Fragment>
  );
};

export default Bicycles;
