import { useEffect, useState } from "react";
import api from "../../axiosHelper";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FlightAdmin = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.user);

  // const [userDetails, setUserDetails] = useState();
  const [bookingCount, setbookingCount] = useState(0);
  const [flightsCount, setFlightsCount] = useState(0);

  // const fetchUserData = async () => {
  //   try {
  //     const id = userData?._id || userData?.id;
  //     await api.get(`/admin/fetch-user/${id}`).then((response) => {
  //       setUserDetails(response.data);
  //       console.log("", response.data);
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const fetchData = async () => {
    await api.get("/flight/fetch-bookings").then((response) => {
      setbookingCount(
        response.data.filter(
          (booking) => booking.flightName === userData.username
        ).length
      );
    });
    await api.get("/flight/fetch-flights").then((response) => {
      setFlightsCount(
        response.data.filter(
          (booking) => booking.flightName === userData.username
        ).length
      );
    });
  };
  // Run when userData becomes available
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!mounted) return;
      // await fetchUserData();
      await fetchData();
    };
    if (userData?.["_id"] || userData?.username) {
      run();
    }
    return () => {
      mounted = false;
    };
  }, [userData]);

  return (
    <div className="flightAdmin-page">
      <h1>Flight admin</h1>
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
          ) : userData.approval === "rejected" ? (
            <div className="notApproved-box">
              <h3>Application Rejected!!</h3>
              <p>
                We are sorry to inform you that your application has been
                rejected!!
              </p>
            </div>
          ) : userData.approval === "approved" ? (
            <div className="admin-page-cards">
              <div className="card admin-card transactions-card">
                <h4>Bookings</h4>
                <p> {bookingCount} </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/flight-bookings")}
                >
                  View all
                </button>
              </div>

              <div className="card admin-card deposits-card">
                <h4>Flights</h4>
                <p> {flightsCount} </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/flights")}
                >
                  View all
                </button>
              </div>

              <div className="card admin-card loans-card">
                <h4>New Flight</h4>
                <p> (new route) </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/new-flight")}
                >
                  Add now
                </button>
              </div>
            </div>
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

export default FlightAdmin;
