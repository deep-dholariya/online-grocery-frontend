import React, { useEffect, useState } from "react";
import API from "../api/axios";

function AdminAreaManager() {

  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [countryName, setCountryName] = useState("India");
  const [editingCity, setEditingCity] = useState(null);
  

  const [areaForm, setAreaForm] = useState({
    cityId: "",
    name: "",
    pincode: "",
    deliveryCharge: "",
    minOrderAmount: ""
  });

  const [editingArea, setEditingArea] = useState(null);

  const fetchAreas = async () => {
    try {
      const res = await API.get("/areas/get-areas");
      setCities(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const addCity = async () => {

    if (!cityName.trim()) return alert("Enter city name");

    try {

      if (editingCity) {

        await API.put("/areas/edit-city", {
          cityId: editingCity,
          country: countryName,
          state: stateName,
          city: cityName
        });

      } else {

        await API.post("/areas/add-city", {
          country: countryName,
          state: stateName,
          city: cityName
        });

      }

      setCityName("");
      setStateName("");
      setCountryName("India");
      setEditingCity(null);

      fetchAreas();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const addArea = async () => {

    const { cityId, name, pincode } = areaForm;

    if (!cityId || !name || !pincode) {
      return alert("Fill required fields");
    }

    try {

      await API.post("/areas/add-area", areaForm);

      setAreaForm({
        cityId: "",
        name: "",
        pincode: "",
        deliveryCharge: "",
        minOrderAmount: ""
      });

      fetchAreas();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

const updateArea = async () => {
  try {

    await API.put("/areas/edit-area", {
      ...areaForm,
      areaId: editingArea
    });

    setEditingArea(null);

    setAreaForm({
      cityId: "",
      name: "",
      pincode: "",
      deliveryCharge: "",
      minOrderAmount: ""
    });

    fetchAreas();

  } catch (err) {

    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert("Update failed");
    }

  }
};

  const deleteArea = async (cityId, areaId) => {

    if (!window.confirm("Delete this area?")) return;

    try {

      await API.delete("/areas/delete-area", {
        data: { cityId, areaId }
      });

      fetchAreas();

    } catch (err) {
      alert("Delete failed");
    }
  };

  const deleteCity = async (cityId) => {

    if (!window.confirm("Delete city and all areas?")) return;

    try {

      await API.delete("/areas/delete-city", {
        data: { cityId }
      });

      fetchAreas();

    } catch (err) {
      alert("Delete failed");
    }
  };

  const startEdit = (cityId, area) => {

    setEditingArea(area._id);

    setAreaForm({
      cityId,
      name: area.name,
      pincode: area.pincode,
      deliveryCharge: area.deliveryCharge,
      minOrderAmount: area.minOrderAmount
    });
  };

  const startCityEdit = (city) => {

    setCityName(city.city);
    setStateName(city.state);
    setCountryName(city.country);
    setEditingCity(city._id);

  };

  const cancelEdit = () => {

    setEditingArea(null);
    setEditingCity(null);

    setCityName("");
    setStateName("");
    setCountryName("India");

    setAreaForm({
      cityId: "",
      name: "",
      pincode: "",
      deliveryCharge: "",
      minOrderAmount: ""
    });
  };

  return (
    <div className="max-w-6xl">

      <h1 className="text-2xl font-bold mb-6">Delivery Area Manager</h1>

      <div className="bg-white p-4 rounded shadow mb-6">

        <h2 className="font-semibold mb-3">
          {editingCity ? "Edit City" : "Add City"}
        </h2>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Country"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            className="border p-2 rounded w-48"
          />

          <input
            type="text"
            placeholder="State"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            className="border p-2 rounded w-48"
          />

          <input
            type="text"
            placeholder="City name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="border p-2 rounded w-48"
          />

          <button
            onClick={addCity}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingCity ? "Update City" : "Add City"}
          </button>

          {(editingCity || editingArea) && (
            <button
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}

        </div>

      </div>

      <div className="bg-white p-4 rounded shadow mb-6">

        <h2 className="font-semibold mb-3">
          {editingArea ? "Edit Area" : "Add Area"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

          <select
            value={areaForm.cityId}
            onChange={(e) =>
              setAreaForm({ ...areaForm, cityId: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select City</option>

            {cities.map((c) => (
              <option key={c._id} value={c._id}>
                {c.city}
              </option>
            ))}

          </select>

          <input
            type="text"
            placeholder="Area name"
            value={areaForm.name}
            onChange={(e) =>
              setAreaForm({ ...areaForm, name: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Pincode"
            value={areaForm.pincode}
            onChange={(e) =>
              setAreaForm({ ...areaForm, pincode: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Delivery charge"
            value={areaForm.deliveryCharge}
            onChange={(e) =>
              setAreaForm({ ...areaForm, deliveryCharge: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Min order"
            value={areaForm.minOrderAmount}
            onChange={(e) =>
              setAreaForm({ ...areaForm, minOrderAmount: e.target.value })
            }
            className="border p-2 rounded"
          />

        </div>

        <button
          onClick={editingArea ? updateArea : addArea}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingArea ? "Update Area" : "Add Area"}
        </button>

      </div>

      {cities.map((city) => (

        <div key={city._id} className="bg-white p-4 rounded shadow mb-6">

          <div className="flex justify-between items-center mb-3">

            <h2 className="font-bold text-lg">
              {city.city}, {city.state}, {city.country}
            </h2>

            <div className="flex gap-2">

              <button
                onClick={() => startCityEdit(city)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteCity(city._id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>

          <table className="w-full border">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-2 border">Area</th>
                <th className="p-2 border">Pincode</th>
                <th className="p-2 border">Delivery</th>
                <th className="p-2 border">Min Order</th>
                <th className="p-2 border">Actions</th>
              </tr>

            </thead>

            <tbody>

              {city.areas.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No areas added
                  </td>
                </tr>
              )}

              {city.areas.map((area) => (

                <tr key={area._id}>

                  <td className="border p-2">{area.name}</td>
                  <td className="border p-2">{area.pincode}</td>
                  <td className="border p-2">₹{area.deliveryCharge}</td>
                  <td className="border p-2">₹{area.minOrderAmount}</td>

                  <td className="border p-2 flex gap-2">

                    <button
                      onClick={() => startEdit(city._id, area)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteArea(city._id, area._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      ))}

    </div>
  );
}

export default AdminAreaManager;