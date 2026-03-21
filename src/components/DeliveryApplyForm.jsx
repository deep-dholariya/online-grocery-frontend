import React, { useEffect, useState } from "react";
import API from "../api/axios";

function DeliveryApplyForm({ refresh }) {

const [data, setData] = useState([]);

const [country, setCountry] = useState("");
const [state, setState] = useState("");
const [cityId, setCityId] = useState("");
const [areaId, setAreaId] = useState("");

useEffect(() => {
fetchAreas();
}, []);

const fetchAreas = async () => {
try {
const res = await API.get("/areas/get-areas");
setData(res.data.data || []);
} catch (error) {
console.log(error);
}
};

/* COUNTRY LIST */
const countries = [...new Set(data.map((d) => d.country))];

/* STATE LIST */
const states = [
...new Set(data.filter((d) => d.country === country).map((d) => d.state))
];

/* CITY LIST */
const cities = data.filter(
(d) => d.country === country && d.state === state
);

/* AREA LIST */
const areas =
data.find((d) => d._id === cityId)?.areas || [];

const submit = async () => {


if (!areaId) {
  alert("Area required");
  return;
}

try {

  await API.post("/delivery-boy/apply", {
    areas: [areaId]
  });

  alert("Application sent");

  refresh();

} catch (error) {

  alert(error.response?.data?.message);

}


};

return ( <div className="max-w-md mx-auto mt-20 bg-white shadow p-6 rounded">
  <h2 className="text-xl font-bold mb-4 text-center">
    Apply for Delivery Boy
  </h2>

  {/* COUNTRY */}
  <select
    value={country}
    onChange={(e) => {
      setCountry(e.target.value);
      setState("");
      setCityId("");
      setAreaId("");
    }}
    className="border w-full p-2 mb-3 rounded"
  >
    <option value="">Select Country</option>
    {countries.map((c) => (
      <option key={c} value={c}>
        {c}
      </option>
    ))}
  </select>

  {/* STATE */}
  <select
    value={state}
    onChange={(e) => {
      setState(e.target.value);
      setCityId("");
      setAreaId("");
    }}
    className="border w-full p-2 mb-3 rounded"
  >
    <option value="">Select State</option>
    {states.map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>

  {/* CITY */}
  <select
    value={cityId}
    onChange={(e) => {
      setCityId(e.target.value);
      setAreaId("");
    }}
    className="border w-full p-2 mb-3 rounded"
  >
    <option value="">Select City</option>
    {cities.map((c) => (
      <option key={c._id} value={c._id}>
        {c.city}
      </option>
    ))}
  </select>

  {/* AREA */}
  <select
    value={areaId}
    onChange={(e) => setAreaId(e.target.value)}
    className="border w-full p-2 mb-4 rounded"
  >
    <option value="">Select Area</option>
    {areas.map((a) => (
      <option key={a._id} value={a._id}>
        {a.name} ({a.pincode})
      </option>
    ))}
  </select>

  <button
    onClick={submit}
    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
  >
    Apply
  </button>

</div>
);
}

export default DeliveryApplyForm;
