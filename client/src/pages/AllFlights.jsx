import api from "../axiosHelper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllFlights = () => {
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  const fetchFlights = async () => {
    await api.get("/flight/fetch-flights").then((response) => {
      setFlights(response.data);
      console.log(response.data);
    });
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div className="page">
      <h1 className="text-2xl font-semibold text-blue-600">All Flights</h1>

      <div className="m-2 p-2 grid grid-cols-2 gap-4 items-center ">
        {flights.map((Flight) => {
          return (
            <div className="shadow-2xs bg-white  border border-black/20  rounded-md p-4 px-8 mx-auto min-w-120 " key={Flight._id}>
              <p>
                <b>id:</b> {Flight._id}
              </p>
              <span>
                <p>
                  <b>Flight Id:</b> {Flight.flightId}
                </p>
                <p>
                  <b>Flight name:</b> {Flight.flightName}
                </p>
              </span>
              <span>
                <p>
                  <b>Starting station:</b> {Flight.origin}
                </p>
                <p>
                  <b>Departure time:</b> {Flight.departureTime}
                </p>
              </span>
              <span>
                <p>
                  <b>Destination:</b> {Flight.destination}
                </p>
                <p>
                  <b>Arrival time:</b> {Flight.arrivalTime}
                </p>
              </span>
              <span>
                <p>
                  <b>Base price:</b> {Flight.basePrice}
                </p>
                <p>
                  <b>Total seats:</b> {Flight.totalSeats}
                </p>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllFlights;
