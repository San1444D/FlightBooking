import { useEffect, useState } from "react";
import api from "../axiosHelper";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    await api.get("/admin/fetch-users").then((response) => {
      setUsers(response.data);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="all-users-page">
        <h2>All Users</h2>
        <div className="all-users">
          {users
            .filter((user) => user.usertype === "customer")
            .map((user) => {
              return (
                <div className="user" key={user._id}>
                  <p>
                    <b>UserId </b>
                    {user._id}
                  </p>
                  <p>
                    <b>Username </b>
                    {user.username}
                  </p>
                  <p>
                    <b>Email </b>
                    {user.email}
                  </p>
                </div>
              );
            })}
        </div>

        <h2>Flight Operators</h2>
        <div className="all-users">
          {users
            .filter((user) => user.usertype === "operator")
            .map((user) => {
              return (
                <div className="user" key={user._id}>
                  <p>
                    <b>Id </b>
                    {user._id}
                  </p>
                  <p>
                    <b>Flight Name </b>
                    {user.username}
                  </p>
                  <p>
                    <b>Email </b>
                    {user.email}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default AllUsers;
