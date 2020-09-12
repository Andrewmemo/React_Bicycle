import React, { useState } from "react";
import Joi from "joi-browser";
import axios from "axios";

import idGenerate from "../../additionals/idGenerator";

import "./CreateBicycle.css";
import rentedTimeFunction from "./../../additionals/rentedTimeGenerator";

const CreateBicycle = ({
  bicycle,
  setBicycle,
  bicycles,
  setBicycles,
  availableBicycles,
  setAvailableBicycles,
}) => {
  const [id, setId] = useState(idGenerate());
  const [name, setName] = useState("");
  const [type, setType] = useState("Road");
  const [rentPrice, setRentPrice] = useState(0);
  const [rented, setRented] = useState(false);
  const [isRentChanged, setIsRentChanged] = useState(false);
  const [rentedTime, setRentedTime] = useState(
    new Date().setTime(
      new Date().getTime() + rentedTimeFunction() * 60 * 60 * 1000
    )
  );

  const [errors, setErrors] = useState({});

  const schema = {
    id: Joi.string().required(),
    name: Joi.string().required().min(5).max(20),
    type: Joi.string(),
    rentPrice: Joi.number().required().min(1).max(99999),
    rented: Joi.boolean().required(),
    rentedTime: Joi.number().required(),
    isRentChanged: Joi.boolean().required(),
  };

  const validate = () => {
    setErrors({});

    setId(idGenerate());

    let bicycle = {
      id,
      name,
      type,
      rentPrice,
      rented,
      rentedTime,
      isRentChanged,
    };

    const result = Joi.validate(bicycle, schema, { abortEarly: false });

    if (!result.error) {
      return null;
    }

    const errors = {};

    for (let item of result.error.details) {
      errors[item.path[0]] = item.message;
    }

    return errors;
  };

  const onClickHandler = async () => {
    const errors = validate();
    if (errors) {
      setErrors(errors);
      return;
    }

    setId(idGenerate());

    let bicycle = {
      id,
      name,
      type,
      rentPrice,
      rented,
      rentedTime,
      isRentChanged,
    };

    let tempBicycles = [...bicycles];
    tempBicycles.push(bicycle);
    setBicycles(tempBicycles);

    tempBicycles = [...availableBicycles];
    tempBicycles.push(bicycle);
    setAvailableBicycles(tempBicycles);

    setBicycle(bicycle);

    await axios.post(`${process.env.REACT_APP_API_URL}createBicycle`, bicycle);

    let bikeNameInput = document.getElementById("BikeName");
    let bikeTypeInput = document.getElementById("BikeType");
    let rentPriceInput = document.getElementById("RentPrice");

    bikeNameInput.value = "";
    bikeTypeInput.value = "Road";
    rentPriceInput.value = null;

    setName("");
    setType("Road");
    setRentPrice(0);
    setRented(false);
    setRentedTime(
      new Date().setTime(
        new Date().getTime() + rentedTimeFunction() * 60 * 60 * 1000
      )
    );
    setIsRentChanged(false);
  };

  return (
    <React.Fragment>
      <div className="row headerCreateRow">
        <div className="col-12">
          <p className="h3 headerCreateRowP">
            <span
              role="img"
              aria-label="moneyFace"
              className="mr-1"
              style={{ fontSize: "25px" }}
            >
              &#129297;
            </span>
            Create new rent
          </p>
        </div>
      </div>
      <div className="row inputCreateRow">
        <div className="col-lg-4">
          <div className="form-group">
            <label htmlFor="BikeName">Bike name</label>
            <input
              onChange={(event) => setName(event.target.value)}
              type="text"
              className="form-control inputCreate"
              id="BikeName"
              placeholder="Ex. Cannondale S6"
            ></input>
            {errors.name && (
              <div className="alert alert-danger rentAlert">{errors.name}</div>
            )}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="form-group">
            <label htmlFor="BikeType">Bike type</label>
            <select
              onChange={(event) => setType(event.target.value)}
              className="form-control form-control-lg"
              id="BikeType"
            >
              <option defaultValue>Road</option>
              <option>Mountain</option>
              <option>Hybrid</option>
              <option>Cyclocross</option>
            </select>
          </div>
        </div>
        <div className="col-lg-2">
          <div className="form-group">
            <label htmlFor="RentPrice">Rent Price</label>
            <input
              onChange={(event) => setRentPrice(event.target.value)}
              type="text"
              className="form-control inputCreate"
              id="RentPrice"
              placeholder="15.00"
            ></input>
            {errors.rentPrice && (
              <div className="alert alert-danger rentAlert">
                {errors.rentPrice}
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-2 createButton">
          <div className="form-group">
            <label htmlFor="RentPrice"> </label>
            <div>
              <button
                onClick={onClickHandler}
                type="button"
                className="btn btn-success createButton"
              >
                Submit rent
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreateBicycle;
