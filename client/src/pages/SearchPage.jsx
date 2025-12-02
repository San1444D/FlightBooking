import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosHelper";
import { useDispatch, useSelector } from "react-redux";
import { setTicketBookingDate } from "../slicers/AuthSlice";

const SearchPage = () => {
  const [error, setError] = useState("");
  const [checkBox, setCheckBox] = useState(false);
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDate = useSelector((state) => state.auth.user);

  const [Flights, setFlights] = useState([]);
  const fetchFlights = async () => {
    if (checkBox) {
      if (
        departure !== "" &&
        destination !== "" &&
        departureDate &&
        returnDate
      ) {
        const date = new Date();
        const date1 = new Date(departureDate);
        const date2 = new Date(returnDate);
        if (date1 > date && date2 > date1) {
          setError("");
          await api.get("/flight/fetch-flights").then((response) => {
            setFlights(response.data);
            console.log(response.data);
          });
        } else {
          setError("Please check the dates");
        }
      } else {
        setError("Please fill all the inputs");
      }
    } else {
      if (departure !== "" && destination !== "" && departureDate) {
        const date = new Date();
        const date1 = new Date(departureDate);
        if (date1 >= date) {
          setError("");
          await api.get("/flight/fetch-flights").then((response) => {
            setFlights(response.data);
            console.log(response.data);
          });
        } else {
          setError("Please check the dates");
        }
      } else {
        setError("Please fill all the inputs");
      }
    }
  };

  const userId = userDate?._id || userDate?.id;

  const handleTicketBooking = async (id, origin, destination) => {
    if (userId) {
      if (origin === departure) {
        dispatch(setTicketBookingDate(departureDate));
        navigate(`/book-flight/${id}`);
      } else if (destination === departure) {
        dispatch(setTicketBookingDate(returnDate));
        navigate(`/book-flight/${id}`);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-page ">
      <div className="flex flex-col gap-4">
        <div className="mt-10 px-10">
          <h1 className="">
            Embark on an Extraordinary Flight Booking Adventure!
          </h1>
          <p className="text-lg">
            Unleash your travel desires and book extraordinary Flight journeys
            that will transport you to unforgettable destinations, igniting a
            sense of adventure like never before.
          </p>
        </div>

        <div className="mx-2 p-4  bg-white/10 backdrop-blur-2xl rounded-2xl border-4 border-white/20 mb-4">
          {/* <h3>Journey details</h3> */}
          <div className="mb-2 text-lg  ">
            <input
              className="accent-blue-500 rounded-2xl "
              type="checkbox"
              id="flexSwitchCheckDefault"
              value=""
              onChange={(e) => setCheckBox(e.target.checked)}
            />
            <label className="mx-2 top-0" htmlFor="flexSwitchCheckDefault">
              Return journey
            </label>
          </div>
          <div className="flex gap-2 items-center text-lg ">
            <div className=" relative">
              <select
                className="bg-white  rounded-lg p-4 mr-4 pt-6 "
                aria-label=".form-select-sm example"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Chennai">Chennai</option>
                <option value="Banglore">Banglore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Indore">Indore</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
                <option value="Trivendrum">Trivendrum</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Kolkata">Kolkata</option>
                <option value="varanasi">varanasi</option>
                <option value="Jaipur">Jaipur</option>
              </select>
              <label htmlFor="floatingSelect " className="absolute top-0 text-sm left-2">
                Departure City
              </label>
            </div>
            <div className="relative ">
              <select
                className="bg-white rounded-lg p-4 mr-4 pt-6"
                aria-label=".form-select-sm example"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Chennai">Chennai</option>
                <option value="Banglore">Banglore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Indore">Indore</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
                <option value="Trivendrum">Trivendrum</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Kolkata">Kolkata</option>
                <option value="varanasi">varanasi</option>
                <option value="Jaipur">Jaipur</option>
              </select>
              <label htmlFor="floatingSelect" className="absolute top-0 text-sm left-2" >Destination City</label>
            </div>
            <div className="relative ">
              <input
                type="date"
                className="bg-white rounded-lg p-4 mr-4 pt-6"
                id="floatingInputstartDate"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
              <label htmlFor="floatingInputstartDate" className="absolute top-0 text-sm left-2">Journey date</label>
            </div>
            {checkBox ? (
              <div className="relative">
                <input
                  type="date"
                  className="bg-white rounded-lg p-4 mr-4 pt-6"
                  id="floatingInputreturnDate"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
                <label htmlFor="floatingInputreturnDate" className="absolute top-0 text-sm left-2">Return date</label>
              </div>
            ) : (
              ""
            )}
            <div>
              <button className="btn ml-10" onClick={fetchFlights}>
                Search
              </button>
            </div>
          </div>
          <p>{error}</p>
        </div>

        {Flights.length > 0 ? (
          <>
            {Flights.filter(
              (Flight) =>
                Flight.origin === departure &&
                Flight.destination === destination
            ).length > 0 ? (
              <>
                <div className="p-2  ">
                  <h1 className="text-black">Available Flights</h1>

                  <div className="Flights">
                    {checkBox ? (
                      <>
                        {Flights.filter(
                          (Flight) =>
                            (Flight.origin === departure &&
                              Flight.destination === destination) ||
                            (Flight.origin === destination &&
                              Flight.destination === departure)
                        ).map((Flight) => {
                          return (
                            <div className="Flight" key={Flight._id}>
                              <div>
                                <p>
                                  {" "}
                                  <b>{Flight.flightName}</b>
                                </p>
                                <p>
                                  <b>Flight Number:</b> {Flight.flightId}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <b>Start :</b> {Flight.origin}
                                </p>
                                <p>
                                  <b>Departure Time:</b> {Flight.departureTime}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <b>Destination :</b> {Flight.destination}
                                </p>
                                <p>
                                  <b>Arrival Time:</b> {Flight.arrivalTime}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <b>Starting Price:</b> {Flight.basePrice}
                                </p>
                                <p>
                                  <b>Available Seats:</b> {Flight.totalSeats}
                                </p>
                              </div>
                              <button
                                className="button btn btn-primary"
                                onClick={() =>
                                  handleTicketBooking(
                                    Flight._id,
                                    Flight.origin,
                                    Flight.destination
                                  )
                                }
                              >
                                Book Now
                              </button>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        {Flights.filter(
                          (Flight) =>
                            Flight.origin === departure &&
                            Flight.destination === destination
                        ).map((Flight) => {
                          return (
                            <div className="Flight">
                              <div>
                                <p>
                                  {" "}
                                  <b>{Flight.flightName}</b>
                                </p>
                                <p>
                                  <b>Flight Number:</b> {Flight.flightId}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <b>Start :</b> {Flight.origin}
                                </p>
                                <p>
                                  <b>Departure Time:</b> {Flight.departureTime}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <b>Destination :</b> {Flight.destination}
                                </p>
                                <p>
                                  <b>Arrival Time:</b> {Flight.arrivalTime}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <b>Starting Price:</b> {Flight.basePrice}
                                </p>
                                <p>
                                  <b>Available Seats:</b> {Flight.totalSeats}
                                </p>
                              </div>
                              <button
                                className="button btn btn-primary"
                                onClick={() =>
                                  handleTicketBooking(
                                    Flight._id,
                                    Flight.origin,
                                    Flight.destination
                                  )
                                }
                              >
                                Book Now
                              </button>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="availableFlightsContainer">
                  <h1> No Flights</h1>
                </div>
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      {/* <section id="about" className="section-about  p-4">
        <div className="container">
          <h2 className="section-title">About Us</h2>
          <p className="section-description">
            &nbsp; &nbsp;&nbsp; &nbsp; Welcome to our Flight ticket booking app,
            where we are dedicated to providing you with an exceptional travel
            experience from start to finish. Whether you're embarking on a daily
            commute, planning an exciting cross-country adventure, or seeking a
            leisurely scenic route, our app offers an extensive selection of
            Flight options to cater to your unique travel preferences.
          </p>
          <p className="section-description">
            &nbsp; &nbsp;&nbsp; &nbsp; We understand the importance of
            convenience and efficiency in your travel plans. Our user-friendly
            interface allows you to effortlessly browse through a wide range of
            Flight schedules, compare fares, and choose the most suitable
            seating options. With just a few taps, you can secure your Flight
            tickets and be one step closer to your desired destination. Our
            intuitive booking process enables you to customize your travel
            preferences, such as selecting specific departure times, opting for
            a window seat, or accommodating any special requirements.
          </p>
          <p className="section-description">
            &nbsp; &nbsp;&nbsp; &nbsp; With our Flight ticket booking app, you
            can embrace the joy of exploring new destinations, immerse yourself
            in breathtaking scenery, and create cherished memories along the
            way. Start your journey today and let us be your trusted companion
            in making your Flight travel dreams a reality. Experience the
            convenience, reliability, and comfort that our app offers, and
            embark on unforgettable Flight adventures with confidence.
          </p>

          <span>
            <h5>2023 SB FlightConnect - &copy; All rights reserved</h5>
          </span>
        </div>
      </section> */}
    </div>
  );
};

export default SearchPage;
