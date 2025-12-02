import api from "../../axiosHelper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const FlightBookings = () => {
  const userData = useSelector((state) => state.auth.user);

  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    await api.get("/flight/fetch-bookings").then((response) => {
      setBookings(response.data.reverse());
    });
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelTicket = async (id) => {
    await api.put(`/customer/cancel-ticket/${id}`).then((response) => {
      toast.success("Ticket cancelled!!");
      fetchBookings();
    });
  };

  return (
    <div className="page">
      {userData ? (
        <>
          {userData.approval === "not-approved" ? (
            <div className="notApproved-box">
              <h3>Approval Required!!</h3>
              <p>
                Your application is under processing. It needs an approval from
                the administrator. Kindly please be patience!!
              </p>
            </div>
          ) : userData.approval === "approved" ? (
            <>
              <h1 className="text-2xl text-blue-600 font-semibold">Bookings</h1>

              <div className="p-2 m-2 grid grid-cols-2 gap-2">
                {bookings
                  .filter((booking) => booking.flightName === userData.username)
                  .map((booking) => {
                    return (
                      <div
                        className="border-2 border-black/20 max-w-200 p-4 gap-2 rounded-xl bg-white shadow-2xl text-blue-900"
                        key={booking._id}
                      >
                        <p>
                          <b>Booking ID:</b> {booking._id}
                        </p>
                        <div className="grid grid-cols-2 gap-1 mb-2">
                          <p>
                            <b>Mobile:</b> {booking.mobile}
                          </p>
                          <p>
                            <b>Email:</b> {booking.email}
                          </p>

                          <p>
                            <b>Flight Id:</b> {booking.flightId}
                          </p>
                          <p>
                            <b>Flight name:</b> {booking.flightName}
                          </p>

                          <p>
                            <b>On-boarding:</b> {booking.departure}
                          </p>
                          <p>
                            <b>Destination:</b> {booking.destination}
                          </p>

                          <span className="col-span-2">
                            <div>
                              <p>
                                <b>Passengers:</b>
                              </p>
                              <ol className="pl-8 list-decimal">
                                {booking.passengers.map((passenger, i) => {
                                  return (
                                    <li key={i}>
                                      <p>
                                        <b>Name:</b> {passenger.name},{" "}
                                        <b>Age:</b> {passenger.age}
                                      </p>
                                    </li>
                                  );
                                })}
                              </ol>
                            </div>
                            {booking.bookingStatus === "confirmed" ? (
                              <p>
                                <b>Seats:</b> {booking.seats}
                              </p>
                            ) : (
                              ""
                            )}
                          </span>

                          <p>
                            <b>Booking date:</b>{" "}
                            {booking.bookingDate.slice(0, 10)}
                          </p>
                          <p>
                            <b>Journey date:</b>{" "}
                            {booking.journeyDate.slice(0, 10)}
                          </p>

                          <p>
                            <b>Journey Time:</b> {booking.journeyTime}
                          </p>
                          <p>
                            <b>Total price:</b> {booking.totalPrice}
                          </p>

                          {booking.bookingStatus === "cancelled" ? (
                            <p className="text-red-500">
                              <b>Booking status:</b> {booking.bookingStatus}
                            </p>
                          ) : (
                            <p>
                              <b>Booking status:</b> {booking.bookingStatus}
                            </p>
                          )}
                          {booking.bookingStatus === "confirmed" ? (
                            <div className="inline-flex justify-end">
                              <button
                                className="btn mt-2 bg-red-400 hover:bg-600 "
                                onClick={() => cancelTicket(booking._id)}
                              >
                                Cancel Ticket
                              </button>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default FlightBookings;
