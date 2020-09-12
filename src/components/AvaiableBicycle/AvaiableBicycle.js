import React, { useState } from "react";
import axios from "axios";

import "./AvaiableBicycle.css";

import Pagination from "./../../additionals/cmpnnts/pagination";

const AvaiableBicycle = ({
  bicycles,
  setBicycles,
  availableBicycles,
  setAvailableBicycles,
  rentedBicycles,
  setRentedBicycles,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bicyclesPerPage] = useState(2);

  const onClickDeleteHendler = async (bicycle) => {
    // Deleting from available bicycles
    let tempBicycle = availableBicycles.find((item) => item.id === bicycle.id);
    let tempBicycles = [...availableBicycles];
    let indexOfTempBicycle = tempBicycles.indexOf(tempBicycle);
    tempBicycles.splice(indexOfTempBicycle, 1);
    setAvailableBicycles(tempBicycles);

    // Deleting form all bicycles
    tempBicycle = bicycles.find((item) => item.id === bicycle.id);
    tempBicycles = [...bicycles];
    indexOfTempBicycle = tempBicycles.indexOf(tempBicycle);
    tempBicycles.splice(indexOfTempBicycle, 1);
    setBicycles(tempBicycles);

    await axios.delete(
      `${process.env.REACT_APP_API_URL}deleteBicycle/${bicycle.id}`
    );
  };

  const onClickRentHandler = async (bicycle) => {
    let step = new Date().getTime();

    let twentyHours = 20 * 60 * 60 * 1000;

    if (bicycle.rentedTime - step >= twentyHours) {
      bicycle.isRentChanged = true;
      bicycle.rentPrice = bicycle.rentPrice / 2;
    }

    bicycle.rented = true;

    // Updating available bicycles
    let tempBicycle = availableBicycles.find((item) => item.id === bicycle.id);
    let tempBicycles = [...availableBicycles];
    let indexOfTempBicycle = tempBicycles.indexOf(tempBicycle);
    tempBicycles.splice(indexOfTempBicycle, 1);
    setAvailableBicycles(tempBicycles);

    // Updating rented bicycles
    tempBicycles = [...rentedBicycles];
    tempBicycles.push(bicycle);
    setRentedBicycles(tempBicycles);

    // Updating all bicycles
    tempBicycles = [...bicycles];
    tempBicycle = bicycles.find((item) => item.id === bicycle.id);
    indexOfTempBicycle = tempBicycles.indexOf(tempBicycle);
    tempBicycles.splice(indexOfTempBicycle, 1, bicycle);
    setBicycles(tempBicycles);

    await axios.put(
      `${process.env.REACT_APP_API_URL}updateBicycle/${bicycle.id}`,
      bicycle
    );

    window.location.reload();
    return false;
  };

  const availableBicyclesCount = () => {
    let count = 0;

    for (let bicycle of bicycles) {
      if (!bicycle.rented) count++;
    }

    return count;
  };

  // Get current bicycles

  const indexOfLastPost = currentPage * bicyclesPerPage;
  const indexOfFirstPost = indexOfLastPost - bicyclesPerPage;

  let currentBicycles = [...availableBicycles];

  currentBicycles = currentBicycles.slice(indexOfFirstPost, indexOfLastPost);

  // Change page

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <div className="row headerAvaiableRow ">
        <div className="col-12">
          <p className="h3">
            <span
              role="img"
              aria-label="bicycleEmoji"
              className="mr-1"
              style={{ fontSize: "25px" }}
            >
              &#128692;
            </span>
            Available bicycles ({availableBicyclesCount()})
          </p>
        </div>
      </div>
      {currentBicycles.length > 0 &&
        currentBicycles.map((bicycle) => (
          <React.Fragment key={bicycle.id}>
            {!bicycle.rented && (
              <div>
                <div className="row bg-white avaiableRow">
                  <div className="col-8">
                    {bicycle.name} / {bicycle.type} / ${bicycle.rentPrice}{" "}
                  </div>
                  <div className="col-2 rentButton">
                    <div className="form-group">
                      <div>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            onClickRentHandler(bicycle);
                          }}
                        >
                          Rent
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-2 deleteButton">
                    <div className="form-group">
                      <div>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            onClickDeleteHendler(bicycle);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      <Pagination
        bicyclesPerPage={bicyclesPerPage}
        totalBicycles={availableBicycles.length}
        paginate={paginate}
      />
    </React.Fragment>
  );
};

export default AvaiableBicycle;
