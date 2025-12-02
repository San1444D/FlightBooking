import { useEffect, useState } from "react";
import api from "../../axiosHelper";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    await api
      .get("/admin/fetch-users")
      .then((response) => {
        // console.log(response.data)
        setUsers(response.data);
      })
      .catch((err) => {
        console.log("fetech users error: ", err);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="page">
        <h2 className="text-2xl font-semibold text-blue-600">All Users</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 p-4">
          {users
            .filter((user) => user.userType === "customer")
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

        <h2 className="text-2xl font-semibold text-blue-600 ">
          Flight Operators
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 p-4">
          {users
            .filter((user) => user.userType === "operator")
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
