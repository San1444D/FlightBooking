import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const HomePage = () => {
  const navigate = useNavigate();
  const userType = useSelector((state) => state.auth.userType);
  console.log(userType);

  useEffect(() => {
    if (userType === "admin") {
      navigate("/admin");
    } else if (userType === "flight-operator") {
      navigate("/flight-admin");
    }
  }, []);

  return (
    <>
      <div className="home-page">
        <div className="self-start ml-5 md:ml-20 text-wrap w-5/8 text-white text-shadow-2xs">
          <p className=" text-6xl font-bold ">
            Embark on an Extraordinary Flight Booking Adventure!
          </p>
          <p className=" font-semibold mt-2 ml-2">
            Unleash sense of travel and book extraordinary Flight journeys will
            transport you to unforgettable distinations, igniting sense of
            adventure like never before.
          </p>
        </div>
        <div className="">
          <button
            className="bg-blue-400 text-white text-xl font-semibold rounded-2xl px-4 py-2 shadow-2xl border-2
           border-white/30 transition duration-100 hover:-translate-y-2 hover:scale-105 active:scale-95"
            onClick={() => {
              navigate("/search");
            }}
          >
            Search Flights ➡️
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
