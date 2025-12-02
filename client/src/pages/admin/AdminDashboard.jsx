import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../axiosHelper";

const AdminDash = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [bookingCount, setbookingCount] = useState(0);
  const [flightsCount, setFlightsCount] = useState(0);
  const fetchData = async () => {
    await api.get("/admin/fetch-users").then((response) => {
      setUserCount(response.data.length - 1);
      setUsers(
        response.data.filter((user) => user.approval === "not-approved")
      );
    });
    await api.get("/flight/fetch-bookings").then((response) => {
      setbookingCount(response.data.length);
    });
    await api.get("/flight/fetch-flights").then((response) => {
      setFlightsCount(response.data.length);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveRequest = async (id) => {
    try {
      await api.post("/admin/approve-operator", { id }).then((response) => {
        toast.success("Operator approved!!");
        fetchData();
      });
    } catch (err) {
      toast.error("Operator approval failed");
      console.log("Approval error: ", err);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await api.post("/admin/reject-operator", { id }).then((response) => {
        toast.success("Operator rejected!!");
        fetchData();
      });
    } catch (err) {
      toast.error("Operator reject failed");
      console.log("Rejection error: ", err);
    }
  };

  return (
    <>
      <div className="page">
        <div className="flex justify-around gap-4 text-center mb-10">
          <div className="bg-white w-2/10 min-w-50  p-4 inline-flex flex-col gap-2 justify-around shadow-2xl rounded-md">
            <h4 className="text-xl font-semibold">Users</h4>
            <p> {userCount} </p>
            <button
              className="btn"
              onClick={() => navigate("/admin/all-users")}
            >
              View all
            </button>
          </div>
          <div className="bg-white w-2/10 min-w-50  p-4 inline-flex flex-col gap-2 justify-around shadow-2xl rounded-md">
            <h4 className="text-xl font-semibold">Bookings</h4>
            <p> {bookingCount} </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/all-bookings")}
            >
              View all
            </button>
          </div>
          <div className="bg-white w-2/10 min-w-50  p-4 inline-flex flex-col gap-2 justify-around shadow-2xl rounded-md">
            <h4 className="text-xl font-semibold">Flights</h4>
            <p> {flightsCount} </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/all-flights")}
            >
              View all
            </button>
          </div>
        </div>
        <div className="bg-white p-4 shadow-2xl max-w-270 rounded-md">
          <h3 className="text-2xl text-blue-800 mb-2">New Operator Applications</h3>
          <div className="min-h-50 max-h-100 border border-black/10 rounded-md p-4 overflow-y-scroll grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.length === 0 ? (
              <p className="text-center">No new requests..</p>
            ) : (
              <>
                {users.map((user) => {
                  return (
                    <div className="user" key={user._id}>
                      <span>
                        <b>Operator name: </b> {user.username}
                      </span>
                      <span>
                        <b>Operator email: </b> {user.email}
                      </span>
                      <div className="inline-flex justify-between px-4 my-2">
                        <button
                          className="btn bg-emerald-400 hover:bg-emerald-600 "
                          onClick={() => approveRequest(user._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn bg-red-400 hover:bg-red-500"
                          onClick={() => rejectRequest(user._id)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDash;
