import React, { useState } from "react";
import axios from "axios";

import "./RentedBicycle.css";

import Pagination from "./../../additionals/cmpnnts/pagination";
import RentedTime from "./../../additionals/cmpnnts/rentedTime";

const RentedBicycle = ({
  bicycles,
  setBicycles,
  availableBicycles,
  setAvailableBicycles,
  rentedBicycles,
  setRentedBicycles,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bicyclesPerPage] = useState(2);

  // Get current bicycles

  const indexOfLastPost = currentPage * bicyclesPerPage;
  const indexOfFirstPost = indexOfLastPost - bicyclesPerPage;

  let currentBicycles = [...rentedBicycles];

  currentBicycles = currentBicycles.slice(indexOfFirstPost, indexOfLastPost);

  // Change page

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const onClickCancelRentHandler = async (bicycle) => {
    if (bicycle.isRentChanged) {
      bicycle.isRentChanged = false;
      bicycle.rentPrice = bicycle.rentPrice * 2;
    }

    bicycle.rented = false;

    // Updating available bicycles
    let tempBicycle = rentedBicycles.find((item) => item.id === bicycle.id);
    let tempBicycles = [...rentedBicycles];
    let indexOfTempBicycle = tempBicycles.indexOf(tempBicycle);
    tempBicycles.splice(indexOfTempBicycle, 1);
    setRentedBicycles(tempBicycles);

    // Updating rented bicycles
    tempBicycles = [...availableBicycles];
    tempBicycles.push(bicycle);
    setAvailableBicycles(tempBicycles);

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
  };

  const totalRentedPrice = () => {
    let total = 0;

    for (let bicycle of rentedBicycles) {
      total += +bicycle.rentPrice;
    }

    return total;
  };

  const checkForPriceChange = (bicycle) => {
    return bicycle.isRentChanged ? "( Price was decreased by half )" : "";
  };

  return (
    <React.Fragment>
      <div className="row headerRentedRow">
        <div className="col-12">
          <p className="h3 headerRentedRowP">
            <span
              role="img"
              aria-label="starFace"
              className="mr-1"
              style={{ fontSize: "25px" }}
            >
              &#129321;
            </span>
            Your rent (Total: {totalRentedPrice()}$)
          </p>
        </div>
      </div>
      {currentBicycles.map((bicycle) => (
        <React.Fragment key={bicycle.id}>
          {bicycle.rented && (
            <div className="row bg-white rentedRow">
              <div className="col-lg-10 rentedText">
                {bicycle.name} / {bicycle.type} / {bicycle.rentPrice}{" "}
                {checkForPriceChange(bicycle)} /{" "}
                <RentedTime key={bicycle.id} bicycle={bicycle} />
              </div>
              <div className="col-lg-2 rentedButton">
                <div className="form-group">
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger rentedButton"
                      onClick={() => onClickCancelRentHandler(bicycle)}
                    >
                      Cancel rent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
      <Pagination
        bicyclesPerPage={bicyclesPerPage}
        totalBicycles={rentedBicycles.length}
        paginate={paginate}
      />
    </React.Fragment>
  );
};

export default RentedBicycle;
