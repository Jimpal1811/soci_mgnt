import  { useState } from "react";
import { Loader } from "../../utils/Loader";

export default function VisitorTrackingModal({ isOpen, onClose, onSave ,isLoading}) {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    wing: "",
    unit: "",
    date: "",
    time: "",
  });

  const [error, setError] = useState({
    name: "",
    number: "",
    wing: "",
    unit: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError((prevError) => ({
      ...prevError,
      [name]: false,
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    const newError = {};

    if (!formData.name || !/^[A-Za-z\s]+$/.test(formData.name)) {
      newError.name = "Please enter a valid name";
      formIsValid = false;
    }
    if (!formData.number) {
      newError.number = "Please phone number";
      formIsValid = false;
    }
    if (!formData.wing) {
      newError.wing = "Please enter Wing";
      formIsValid = false;
    }
    if (!formData.wing) {
      newError.wing = "Please enter Wing";
      formIsValid = false;
    }
    if (!formData.unit) {
      newError.unit = "Please enter Unit";
      formIsValid = false;
    }
    if (!formData.date) {
      newError.date = "Please enter Date";
      formIsValid = false;
    }
    if (!formData.time || !/^\d{2}:\d{2}$/.test(formData.time)) {
      newError.time = "Please enter a valid time";
      formIsValid = false;
    }

    setError(newError);
    return formIsValid;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    onSave(formData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      number: "",
      wing: "",
      unit: "",
      date: "",
      time: "",
    });
    setError({
      name: "",
      number: "",
      wing: "",
      unit: "",
      date: "",
      time: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.number &&
      formData.wing &&
      formData.unit &&
      formData.date &&
      formData.time
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-[9999]">
      <div className="bg-white p-[20px] rounded-lg max-w-[410px] w-full">
        <h2 className="text-lg font-semibold mb-4">Add Visitor Details</h2>

        <form onSubmit={handleSave}>
          <div className="mb-[20px]">
            <label className="block mb-2">Visitor Name*</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 mb-1 border rounded-[10px] ${
                error.name ? "border-red-500" : ""
              } focus:outline-none`}
            />
            {error.name && (
              <span className="text-red-500 text-sm">{error.name}</span>
            )}
          </div>
          <div className="mb-[20px]">
            <label className="block mb-2">Visitor Number*</label>
            <input
              type="text"
              name="number"
              placeholder="Enter phone number"
              value={formData.number}
              onChange={handleChange}
              className={`w-full p-2 mb-1 border rounded-[10px] ${
                error.number ? "border-red-500" : ""
              } focus:outline-none`}
            />
            {error.number && (
              <span className="text-red-500 text-sm">{error.number}</span>
            )}
          </div>

          <div className="flex justify-between mb-[20px]">
            <div>
              <label className="block mb-2">Wing*</label>
              <input
                type="text"
                name="wing"
                placeholder="Enter Wing"
                value={formData.wing}
                onChange={handleChange}
                className={`w-[175px] h-[47px] p-2 mb-1 border rounded-[10px] ${
                  error.wing ? "border-red-500" : ""
                } focus:outline-none bg-transparent`}
              />
              {error.wing && (
                <span className="text-red-500 text-sm">{error.wing}</span>
              )}
            </div>

            <div>
              <label className="block mb-2">Unit*</label>
              <input
                type="text"
                name="unit"
                placeholder="Enter Unit"
                value={formData.unit}
                onChange={handleChange}
                className={`w-[175px] h-[47px] p-2 mb-1 border rounded-[10px] ${
                  error.unit ? "border-red-500" : ""
                } focus:outline-none`}
              />
              {error.unit && (
                <span className="text-red-500 text-sm">{error.unit}</span>
              )}
            </div>
          </div>
          <div className="flex justify-between mb-[20px]">
            <div>
              <label className="block mb-2">Date*</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-[175px] h-[47px] p-2 mb-1 border rounded-[10px] ${
                  error.date ? "border-red-500" : ""
                } focus:outline-none`}
              />
              {error.date && (
                <span className="text-red-500 text-sm">{error.date}</span>
              )}
            </div>
            <div>
              <label className="block mb-2">Time*</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-[175px] h-[47px] p-2 mb-1 border rounded-[10px] ${
                  error.time ? "border-red-500" : ""
                } focus:outline-none`}
              />
              {error.time && (
                <span className="text-red-500 text-sm">{error.time}</span>
              )}
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="w-[175px] py-[13.5px] px-[58.5px] border rounded-[10px] leading-[27px] font-medium text-[18px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`w-[175px] px-4 py-3 text-md font-medium text-black rounded-[10px] transition-all duration-300
        ${
          isFormValid()
            ? "bg-gradient-to-r from-[rgba(254,81,46,1)] to-[rgba(240,150,25,1)] hover:opacity-90 text-white"
            : "bg-[#F6F8FB] text-black"
        }`}
            >
            {isLoading ? <Loader/>
              : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
