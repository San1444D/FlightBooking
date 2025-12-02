import { useEffect, useState } from "react";
import api from "../../axiosHelper";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditFlight = () => {
  const [flightName, setFlightName] = useState("");
  const [flightId, setFlightId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startTime, setStartTime] = useState();
  const [arrivalTime, setArrivalTime] = useState();
  const [totalSeats, setTotalSeats] = useState(0);
  const [basePrice, setBasePrice] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    console.log(startTime);
  }, [startTime]);

  const fetchFlightData = async () => {
    await api.get(`/flight/fetch-flight/${id}`).then((response) => {
      console.log(response.data);
      setFlightName(response.data.flightName);
      setFlightId(response.data.flightId);
      setOrigin(response.data.origin);
      setDestination(response.data.destination);
      setTotalSeats(response.data.totalSeats);
      setBasePrice(response.data.basePrice);

      const timeParts1 = response.data.departureTime.split(":");
      const startT = new Date();
      startT.setHours(parseInt(timeParts1[0], 10));
      startT.setMinutes(parseInt(timeParts1[1], 10));
      const hours1 = String(startT.getHours()).padStart(2, "0");
      const minutes1 = String(startT.getMinutes()).padStart(2, "0");

      setStartTime(`${hours1}:${minutes1}`);

      const timeParts2 = response.data.arrivalTime.split(":");
      const startD = new Date();
      startD.setHours(parseInt(timeParts2[0], 10));
      startD.setMinutes(parseInt(timeParts2[1], 10));
      const hours2 = String(startD.getHours()).padStart(2, "0");
      const minutes2 = String(startD.getMinutes()).padStart(2, "0");

      setArrivalTime(`${hours2}:${minutes2}`);
    });
  };
  useEffect(() => {
    fetchFlightData();
  }, []);

  const handleSubmit = async () => {
    const inputs = {
      _id: id,
      flightName,
      flightId,
      origin,
      destination,
      departureTime: startTime,
      arrivalTime,
      basePrice,
      totalSeats,
    };

    await api
      .put("/flight/update-flight", inputs)
      .then(async (response) => {
        toast.success("Flight updated successfully!!");
        setFlightName("");
        setFlightId("");
        setOrigin("");
        setStartTime("");
        setArrivalTime("");
        setDestination("");
        setBasePrice(0);
        setTotalSeats(0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="  p-4 m-4 mx-auto w-2/3 bg-white border-2 border-black/20 rounded-2xl">
      <h2 className="text-2xl font-semibold text-blue-600 ">Edit Flight</h2>
      <div className="p-4 flex flex-col">
        <span className="inline-flex gap-4">
          <div className="relative grow mb-3">
            <input
              type="text"
              className=" px-4 py-2 w-full text-md border-2 border-gray-300/80 rounded-xl peer"
              id="floatingInputemail"
              value={flightName}
              onChange={(e) => setFlightName(e.target.value)}
              disabled
            />
            <label
              htmlFor="floatingInputemail "
              className="inline-flex  items-center absolute text-sm text-body duration-300 transform
                    -translate-y-4  scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
                    peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
                    peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
                    peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
                    rtl:peer-focus:left-auto start-1"
            >
              Flight Name
            </label>
          </div>
          <div className="relative mb-3">
            <input
              type="text"
              className="px-4 py-2 w-full min-w-70 text-md border-2 border-gray-300/80 rounded-xl peer"
              id="floatingInputmobile"
              value={flightId}
              onChange={(e) => setFlightId(e.target.value)}
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
              Flight Id
            </label>
          </div>
        </span>
        <span className="inline-flex gap-4">
          <div className="relative grow mb-3">
            <select
              className="px-4 py-2 w-full text-md border-2 border-gray-300/80 rounded-xl peer mb-3"
              aria-label=".form-select-sm example"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
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
            <label
              htmlFor="floatingSelect"
              className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4  scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
            >
              {" "}
              Departure City
            </label>
          </div>
          <div className="relative mb-3">
            <input
              type="time"
              className="px-4 py-2 w-full min-w-50 text-md border-2 border-gray-300/80 rounded-xl peer"
              id="floatingInputmobile"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
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
              Departure Time
            </label>
          </div>
        </span>
        <span className="inline-flex gap-4">
          <div className="relative grow mb-3">
            <select
              className="px-4 py-2 w-full text-md border-2 border-gray-300/80 rounded-xl peer"
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
            <label
              htmlFor="floatingSelect"
              className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4  scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
            >
              Destination City
            </label>
          </div>
          <div className="relative  mb-3">
            <input
              type="time"
              className="px-4 py-2 w-full min-w-50 text-md border-2 border-gray-300/80 rounded-xl peer"
              id="floatingInputArrivalTime"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
            <label
              htmlFor="floatingInputArrivalTime"
              className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4  scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
            >
              Arrival time
            </label>
          </div>
        </span>
        <span className="inline-flex gap-4">
          <div className="relative grow mb-3">
            <input
              type="number"
              className="px-4 py-2 w-full text-md border-2 border-gray-300/80 rounded-xl peer"
              id="floatingInpuSeats"
              value={totalSeats}
              onChange={(e) => setTotalSeats(e.target.value)}
            />
            <label
              htmlhtmlFor="floatingInpuSeats"
              className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4  scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
            >
              Total seats
            </label>
          </div>
          <div className="relative grow mb-3">
            <input
              type="number"
              className="px-4 py-2 w-full text-md border-2 border-gray-300/80 rounded-xl peer"
              id="floatingInputBasePrice"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
            <label
              htmlhtmlFor="floatingInputBasePrice"
              className="inline-flex  items-center absolute text-sm text-body duration-300 transform
               -translate-y-4  scale-75 top-2 z-10 origin-left bg-neutral-primary px-2 peer-focus:px-2 
               peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 
               peer-placeholder-shown: peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 
               peer-focus:-translate-y-4 peer-focus:translate-x-2 rtl:peer-focus:translate-x-1/4 
               rtl:peer-focus:left-auto start-1"
            >
              Base price
            </label>
          </div>
        </span>

        <button className="btn px-4 mx-auto w-2/6" onClick={handleSubmit}>
          Update
        </button>
      </div>
    </div>
  );
};

export default EditFlight;
