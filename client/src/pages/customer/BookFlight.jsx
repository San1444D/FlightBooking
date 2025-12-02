import { useEffect, useState } from "react";
import api from "../../axiosHelper";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const BookFlight = () => {
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.user);
  const [flightName, setFlightName] = useState("");
  const [flightId, setFlightId] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [StartCity, setStartCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [startTime, setStartTime] = useState();

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [coachType, setCoachType] = useState("");
  const ticketBookingDate = useSelector(
    (state) => state.auth.ticketBookingDate
  );
  const [journeyDate, setJourneyDate] = useState(ticketBookingDate);

  const [numberOfPassengers, setNumberOfPassengers] = useState(0);
  const [passengerDetails, setPassengerDetails] = useState([]);

  const [totalPrice, setTotalPrice] = useState(0);
  const price = {
    economy: 1,
    "premium-economy": 2,
    business: 3,
    "first-class": 4,
  };

  const fetchFlightData = async () => {
    await api.get(`/flight/fetch-flight/${id}`).then((response) => {
      setFlightName(response.data.flightName);
      setFlightId(response.data.flightId);
      setBasePrice(Number(response.data.basePrice) || 0); // ensure numeric basePrice
      setStartCity(response.data.origin);
      setDestinationCity(response.data.destination);
      setStartTime(response.data.departureTime);
    });
  };
  // keep passenger details array in sync with numberOfPassengers
  useEffect(() => {
    const num = Number(numberOfPassengers) || 0;
    setPassengerDetails((prev) => {
      const next = prev.slice(0, num);
      while (next.length < num) next.push({ name: "", age: "" });
      return next;
    });
  }, [numberOfPassengers]);

  useEffect(() => {
    fetchFlightData();
  }, []);

  const handlePassengerChange = (event) => {
    const value = parseInt(event.target.value);
    setNumberOfPassengers(value);
  };

  const handlePassengerDetailsChange = (index, key, value) => {
    setPassengerDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index] = { ...updatedDetails[index], [key]: value };
      return updatedDetails;
    });
  };

  useEffect(() => {
    // compute factor safely and avoid NaN
    const factor = price[coachType] ?? 0;
    const num = Number(numberOfPassengers) || 0;
    const total = factor * basePrice * num;
    setTotalPrice(total);
  }, [numberOfPassengers, coachType, basePrice]);
  const navigate = useNavigate();

  const bookFlight = async () => {
    const inputs = {
      user: userData?._id || userData?.id,
      flight: id,
      flightName,
      flightId,
      departure: StartCity,
      journeyTime: startTime,
      destination: destinationCity,
      email,
      mobile,
      passengers: passengerDetails,
      totalPrice,
      journeyDate,
      seatClass: coachType,
    };

    await api
      .post("/customer/book-ticket", inputs)
      .then((response) => {
        toast.success("booking successful");
        navigate("/bookings");
      })
      .catch((err) => {
        toast.error("Booking failed!!");
        console.log("Booking failed", err);
      });
  };

  return (
    <div className="page">
      <div className="p-6 mt-10 flex flex-col gap-2 w-6/8 mx-auto bg-white rounded-2xl shadow-2xs border-2 border-black/20">
      <h2 className="text-2xl text-center font-semibold text-blue-600">Book ticket</h2>
        <span className="inline-flex justify-between  gap-4">
          <p>
            <b>Flight Name: </b> {flightName}
          </p>
          <p className="w-50">
            <b>Flight No: </b> {flightId}
          </p>
        </span>
          <p>
            <b>Base price: </b> {basePrice}
          </p>

        <span className="inline-flex gap-10">
          <div className="relative grow mb-3 ">
            <input
              type="email"
              className="px-4 py-2 w-full text-md border-2 border-gray-300/80 rounded-xl peer"
              id="floatingInputemail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="floatingInputemail"
              className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4  scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
            >
              Email
            </label>
          </div>
          <div className="relative mb-3">
            <input
              type="number" minLength={10} maxLength={10}
              className="px-4 py-2 w-full min-w-70 text-md border-2 border-gray-300/80 rounded-xl peer"
              id="floatingInputmobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <label
              htmlFor="floatingInputmobile"
              className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4  scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
            >
              Mobile
            </label>
          </div>
        </span>
        <span className="inline-flex gap-6 justify-between items-center">
          <div className="relative h-[67.2px]">
            <div className="form-floating h-[67.2px] mb-3">
              <input
                type="number"
                className="border-2 h-full border-black/20 rounded-md px-4 p-2"
                id="floatingInputreturnDate"
                value={numberOfPassengers}
                onChange={handlePassengerChange}
              />
              <label
                htmlFor="floatingInputreturnDate"
                className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4  scale-90 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
              >
                No of passengers
              </label>
            </div>
          </div>
          <div className="relative ">
            <input
              type="date"
              className="bg-white rounded-lg p-4 pt-6 border-2 border-black/20 w-full"
              id="floatingInputreturnDate"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
            />
            <label
              htmlFor="floatingInputreturnDate"
              className="absolute top-0 text-sm left-2"
            >
              Journey date
            </label>
          </div>
          <div className="relative border-2 border-black/20 rounded-lg h-fit">
            <select
              className="bg-white rounded-lg p-4 pt-6"
              defaultValue=""
              aria-label=".form-select-sm example"
              value={coachType}
              onChange={(e) => setCoachType(e.target.value)}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="economy">Economy class</option>
              <option value="premium-economy">Premium Economy</option>
              <option value="business">Business class</option>
              <option value="first-class">First class</option>
            </select>
            <label
              htmlFor="floatingSelect"
              className="absolute top-0 text-sm left-2"
            >
              Seat Class
            </label>
          </div>
        </span>

        <div className="new-passengers">
          {Array.from({ length: numberOfPassengers }).map((_, index) => (
            <div className="new-passenger" key={index}>
              <h4>Passenger {index + 1}</h4>
              <div className="new-passenger-inputs">
                <div className="relative mb-3">
                  <input
                    type="text"
                    className="px-4 py-2 w-full text-md border-2 border-gray-300/80 rounded-xl peer"
                    id="floatingInputpassengerName"
                    value={passengerDetails[index]?.name || ""}
                    onChange={(event) =>
                      handlePassengerDetailsChange(
                        index,
                        "name",
                        event.target.value || ""
                      )
                    }
                  />
                  <label
                    htmlFor="floatingInputpassengerName"
                    className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4  scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
                  >
                    Name
                  </label>
                </div>
                <div className="relative mb-3">
                  <input
                    type="number"
                    className="px-4 py-2 w-full text-md border-2 border-gray-300/80 rounded-xl peer"
                    id="floatingInputpassengerAge"
                    value={passengerDetails[index]?.age || ""}
                    onChange={(event) =>
                      handlePassengerDetailsChange(
                        index,
                        "age",
                        Number(event.target.value) || ""
                      )
                    }
                  />
                  <label
                    htmlFor="floatingInputpassengerAge"
                    className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4  scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
                  >
                    Age
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h6>
          <b>Total price</b>: {totalPrice}
        </h6>
        <button className="btn col-span-3 w-2/8 mx-auto" onClick={bookFlight}>
          Book now
        </button>
      </div>
    </div>
  );
};
export default BookFlight;
