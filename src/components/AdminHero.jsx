import React, { useEffect, useState } from "react";
import API from "../api/axios";

function AdminHero() {
  const DEFAULT_HEADER = "Fresh And Organic Products For You";
  const DEFAULT_DESCRIPTION =
    "This Website Is Designed To Provide Fresh Organic Products Easily.";

  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);

  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);

  const [leftPreview, setLeftPreview] = useState(null);
  const [rightPreview, setRightPreview] = useState(null);

  /* ================= FETCH HERO ================= */
  const fetchHero = async () => {
    try {
      setFetchLoading(true);
      const res = await API.get("/hero");

      if (res.data) {
        setHero(res.data);
        setHeader(res.data.header);
        setDescription(res.data.description);
      }
    } catch (err) {
      console.error(err);
      setHeader(DEFAULT_HEADER);
      setDescription(DEFAULT_DESCRIPTION);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  /* ================= CLEANUP BLOB URL ================= */
  useEffect(() => {
    return () => {
      if (leftPreview?.startsWith("blob:"))
        URL.revokeObjectURL(leftPreview);
      if (rightPreview?.startsWith("blob:"))
        URL.revokeObjectURL(rightPreview);
    };
  }, [leftPreview, rightPreview]);

  /* ================= SAVE HERO ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!header || !description) {
      alert("Header and Description required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("header", header);
      formData.append("description", description);
      if (leftImage) formData.append("leftImage", leftImage);
      if (rightImage) formData.append("rightImage", rightImage);

      await API.post("/hero", formData);

      setLeftImage(null);
      setRightImage(null);
      setLeftPreview(null);
      setRightPreview(null);

      fetchHero();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving hero");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HEADER GREEN WORD ================= */
  const renderHeaderWithGreenWord = (text) => {
    const words = text?.split(" ") || [];
    return words.map((word, index) => (
      <span key={index} className={index === 2 ? "text-green-600" : ""}>
        {word + " "}
      </span>
    ));
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Admin Hero Section
      </h2>

      {fetchLoading && (
        <div className="text-green-600 font-medium mb-4">
          Loading hero...
        </div>
      )}

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        {/* Header */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Header
          </label>
          <input
            type="text"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT IMAGE */}
          <div className="border rounded-lg p-4 text-center">
            <p className="font-medium mb-3">Left Image</p>

            <img
              src={
                leftPreview ||
                hero?.leftImage ||
                "https://via.placeholder.com/150"
              }
              alt="Left"
              className="w-full h-32 object-contain mb-3"
            />

            <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setLeftImage(file);
                  setLeftPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          {/* RIGHT IMAGE */}
          <div className="border rounded-lg p-4 text-center">
            <p className="font-medium mb-3">Right Image</p>

            <img
              src={
                rightPreview ||
                hero?.rightImage ||
                "https://via.placeholder.com/150"
              }
              alt="Right"
              className="w-full h-32 object-contain mb-3"
            />

            <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setRightImage(file);
                  setRightPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : hero
            ? "Update Hero"
            : "Add Hero"}
        </button>
      </form>

      {/* ================= PREVIEW ================= */}
      <div className="mt-10 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          Live Preview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <img
            src={
              leftPreview ||
              hero?.leftImage ||
              "https://via.placeholder.com/150"
            }
            alt="Left"
            className="w-full h-40 object-contain"
          />

          <div>
            <h4 className="text-lg font-bold">
              {renderHeaderWithGreenWord(header)}
            </h4>
            <p className="text-gray-600 mt-2">{description}</p>
          </div>

          <img
            src={
              rightPreview ||
              hero?.rightImage ||
              "https://via.placeholder.com/150"
            }
            alt="Right"
            className="w-full h-40 object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminHero;