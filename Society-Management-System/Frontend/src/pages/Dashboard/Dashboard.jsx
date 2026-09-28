import React, { useEffect, useState } from "react";
import Modal from "../../components/modal/Modal";
import DashboardTable from "../../components/DashboardTable";
import edit from "../../assets/images/edit.svg";
import trash from "../../assets/images/trash.svg";
import icon1 from "../../assets/images/icon-1.png";
import moneyrecive from "../../assets/images/money-recive.png";
import moneysend from "../../assets/images/money-send.png";
import downicon from "../../assets/images/downicon.svg";
import vacate from "../../assets/images/vacate.png";
import { FaSquarePlus } from "react-icons/fa6";
import {
  DeleteImpNumber,
  GetImpNumbers,
} from "../../services/impNumberService";
import toast from "react-hot-toast";
import { GetActivityAnnouncement } from "../../services/announcementService";
import BalanceChart from "../../components/BalanceChart";
import DeleteConfirmationModal from "../../components/modal/DeleteConfirmationModal";
import {
  TotalExpense,
  TotalIncome,
  TotalUnit,
} from "../../services/calculateTotalService";
import { useSelector } from "react-redux";
import { GetMaintenances } from "../../services/maintenanceService";
import { convert24hrTo12hr } from "../../utils/ConvertTime";

const Dashboard = () => {
  const [importantNumbers, setImportantNumbers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [activities, setActivities] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalUnit, setTotalUnit] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Month");
  const [pendingMaintenance, setPendingMaintenance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const role = useSelector((store) => store.auth.user?.role);

  const handleOpenModal = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const openConfirmationModel = (contact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };

  const handleOptionClick = (option) => {
    setSelectedPeriod(option);
    setIsOpen(false);
  };

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleDeleteContact = async () => {
    const updatedContacts = importantNumbers.filter(
      (v) => v._id !== selectedContact._id
    );
    setImportantNumbers(updatedContacts);
    try {
      const response = await DeleteImpNumber(selectedContact._id);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setSelectedContact(null);
    }
  };

  const fetchImportantNumbers = async () => {
    try {
      const response = await GetImpNumbers();
      setImportantNumbers(response.data.ImportantNumber);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchAnnouncement = async () => {
    try {
      const response = await GetActivityAnnouncement();
      setActivities(response.data.Announcement);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // fetch total income-expense calculations
  const fetchTotal = async () => {
    try {
      const response1 = await TotalIncome();
      setTotalAmount(response1.data.totalAmount);
      const response2 = await TotalExpense();
      setTotalExpense(response2.data.totalAmount);
      const response3 = await TotalUnit();
      setTotalUnit(response3.data.UnitTotal);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchImportantNumbers();
    fetchAnnouncement();
    fetchTotal();
    fetchPendingMaintenance();
  }, []);

  const fetchPendingMaintenance = async () => {
    try {
      const response = await GetMaintenances();
      setPendingMaintenance(response.data.Maintenance);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const cardData = [
    {
      title: "Total Balance",
      amount: `₹ ${totalAmount - totalExpense}`,
      bgColor: "rgba(255, 106, 0, 0.5)",
      gradient:
        "linear-gradient(220.5deg, #FF6A00 7.71%, rgba(255, 255, 255, 0) 30.54%)",
      iconBg: "#FF6A00",
      icon: icon1,
    },

    {
      title: "Total Income",
      amount: `₹ ${totalAmount}`,
      bgColor: "rgba(57, 151, 61, 0.5)",
      gradient:
        "linear-gradient(220.5deg, #39973D 7.71%, rgba(255, 255, 255, 0) 30.54%)",
      iconBg: "#39973D",
      icon: moneyrecive,
    },
    {
      title: "Total Expense",
      amount: `₹ ${totalExpense}`,
      bgColor: "rgba(134, 159, 243, 0.5)",
      gradient:
        "linear-gradient(220.5deg, #869FF3 7.71%, rgba(255, 255, 255, 0) 30.54%)",
      iconBg: "#869FF3",
      icon: moneysend,
    },
    {
      title: "Total Unit",
      amount: `${totalUnit}`.padStart(2, "0"),
      bgColor: "rgba(235, 55, 195, 0.5)",
      gradient:
        "linear-gradient(220.5deg, #EB37C3 7.71%, rgba(255, 255, 255, 0) 30.54%)",
      iconBg: "#EB37C3",
      borderRadius: "15px",
      icon: vacate,
    },
  ];

  return (
    <div className="flex max-h-screen bg-gray-100">
      <main className="flex-1">
        <div>
          <div className="grid grid-cols-4 col-span-2 gap-4 mb-6 max-xl:grid-cols-2 max-sm:grid-cols-2 max-2xl:grid-cols-2 relative z-[9] mt-[-10px]">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="flex items-center justify-center relative w-full rounded-[15px]"
              >
                <div
                  style={{
                    borderRight: "1px solid transparent",
                    borderTop: "2px solid transparent",
                  }}
                  className="relative flex flex-col justify-start items-start w-full max-md:flex-col max-md:justify-start max-md:flex max-md:items-start max-sm:flex-col max-sm:justify-start max-sm:flex max-sm:items-start"
                >
                  <div
                    className="w-[7px] h-[52px] mr-[10px] absolute z-[99] top-[50%] rounded-tr-[10px] rounded-br-[10px]"
                    style={{
                      backgroundColor: card.bgColor,
                      transform: "translateY(-50%)",
                    }}
                  />
                  <div className="relative flex flex-col justify-between items-start py-[19px] px-[30px] rounded-[15px] flex-grow bg-white w-full max-sm:pt-[12px] max-sm:pb-[12px] max-md:pt-[12px] max-md:pb-[12px] sm:max-w-full max-sm:max-w-full max-md:col-span-2">
                    <div className="flex justify-between items-center w-full max-sm:flex-col-reverse max-sm:items-start">
                      <div className="flex flex-col items-start max-sm:mt-[15px]">
                        <h6 className="text-gray-700 font-medium text-[16px] leading-2 max-sm:text-[14px] max-md:text-[18px] max-sm:text-nowrap">
                          {card.title}
                        </h6>
                        <h3 className="text-gray-900 font-bold text-[26px] max-sm:text-[20px] max-sm:font-medium max-md:text-[20px] max-lg:text-[20px] max-xl:text-[20px] max-2xl:text-[20px]">
                          {card.amount}
                        </h3>
                      </div>
                      <div className="relative">
                        <div
                          className="rounded-[10px] p-2 opacity-[10%] w-[50px] h-[50px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-sm:w-[40px] max-sm:h-[42px] max-sm:bg-iconColor max-md:w-[40px] max-md:h-[42px] bg-iconColor"
                          style={{
                            backgroundColor: card.iconBg,
                          }}
                        ></div>
                        <div className="relative max-sm:bg-iconColor">
                          <img
                            src={card.icon}
                            alt={`${card.title} icon`}
                            className="w-[32px] h-[32px] max-sm:w-[27px] max-sm:h-[27px]"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="rounded-[15px] transform translate-x-[23%] translate-y-[-5%] max-md:translate-y-[-4%] max-sm:translate-y-[-15%] max-sm:translate-x-[22.5%] max-sm:h-[95px] max-md:h-[80px] h-[95px] max-2xl:h-[88px] max-2xl:translate-y-[-5%] max-2xl:translate-x-[22%]"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: "-2px",
                        bottom: 0,
                        margin: "auto",
                        width: "69%",
                        background: card.gradient,
                        zIndex: -1,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* chart section */}
          <div className="grid grid-cols-12 w-full gap-4 h-full max-xl:grid-cols-6 max-2xl:grid-cols-6">
            <div className="col-span-12 max-md:col-span-12 max-lg:col-span-6 md:col-span-6 rounded-lg ">
              <BalanceChart />
            </div>

            <div className='col-span-12 max-md:col-span-12 lg:col-span-3 max-xl:col-span-3 mt-[-13px] max-2xl:mt-[0]'>
              <div className='bg-white p-[20px] rounded-[15px] h-[360px] w-full'>
                <div className='flex justify-between items-center mb-5'>
                  <h3 className='text-lg font-semibold max-sm:text-[16px] max-mb:text-[18px]'>
                    Important Numbers
                  </h3>
                  {role === "admin" && (
                    <button
                      className="modal bg-custom-gradient py-[8px] px-[10px] rounded-[10px] text-white font-semibold"
                      onClick={handleOpenModal}
                    >
                      <div className="flex justify-center items-center">
                        <div>
                          <FaSquarePlus className="rounded-[6px] mr-1" />
                        </div>
                        <div>Add</div>
                      </div>
                    </button>
                  )}
                </div>
                <form
                  onSubmit={handleFormSubmit}
                  className="max-h-64 overflow-y-auto custom-scrollbar"
                >
                  <ul>
                    {importantNumbers.length > 0 ? (
                      importantNumbers.map((contact) => (
                        <li key={contact._id} className="mb-2 mr-[10px]">
                          <div className="border border-[#F6F8FB] p-2 rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-normal text-[#A7A7A7] text-[13px]">
                                <span className="font-normal text-black">
                                  Name:
                                </span>{" "}
                                {contact.Full_name}
                              </p>
                              <p className="font-normal text-[#A7A7A7] text-[13px]">
                                <span className="font-normal text-black">
                                  Ph Number:
                                </span>{" "}
                                {contact.Phone_Number}
                              </p>
                              <p className="font-normal text-[#A7A7A7] text-[13px]">
                                <span className="font-normal text-black">
                                  Work:
                                </span>{" "}
                                {contact.Work}
                              </p>
                            </div>

                            {role === "admin" && (
                              <div className="flex space-x-2">
                                <img
                                  src={trash}
                                  className="cursor-pointer text-red-500 mr-[3px] bg-[#F6F8FB] w-[40px] h-[40px] p-[10px] rounded-[10px]"
                                  title="Delete"
                                  onClick={() => openConfirmationModel(contact)}
                                />
                                <img
                                  src={edit}
                                  className="cursor-pointer text-blue-500 bg-[#F6F8FB] w-[40px] h-[40px] p-[10px] rounded-[10px]"
                                  onClick={() => handleView(contact)}
                                  title="View"
                                />
                              </div>
                            )}
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="text-center text-[#A7A7A7] py-4">
                        No data found
                      </div>
                    )}
                  </ul>
                  <button type="submit" className="hidden">
                    Submit
                  </button>
                </form>
              </div>
              {isModalOpen && (
                <Modal
                  contact={selectedContact}
                  onClose={handleCloseModal}
                  fetchImportantNumbers={fetchImportantNumbers}
                />
              )}
              {isDeleteModalOpen && (
                <DeleteConfirmationModal
                  isOpen={isDeleteModalOpen}
                  onClose={() => setIsDeleteModalOpen(false)}
                  onDelete={handleDeleteContact}
                  modalName="number"
                />
              )}
            </div>
            <div className='max-md:col-span-12 lg:col-span-3 max-xl:col-span-3 mt-[-13px] max-2xl:mt-[0]'>
              <div className='bg-white p-[20px] rounded-[15px] h-full'>
                <div className='flex justify-between items-center mb-5'>
                  <h3 className='text-lg font-semibold max-sm:text-[16px] max-mb:text-[18px]'>
                    Pending Maintenances
                  </h3>
                  <button className="py-[8px] px-[10px] rounded-[10px] text-[#5678E9] font-semibold text-[14px] leading-[14px]">
                    View all
                  </button>
                </div>
                <ul className="max-h-64 overflow-y-auto pr-[8px]">
                  {pendingMaintenance.length > 0 &&
                  pendingMaintenance.some((v) =>
                    Array.isArray(v?.residentList) &&
                    v.residentList.some((r) => r?.paymentStatus === "pending" && r?.resident)
                  ) ? (
                    pendingMaintenance.map((v) =>
                      Array.isArray(v?.residentList)
                        ? v.residentList.map((r) => {
                            if (r?.paymentStatus !== "pending" || !r?.resident) {
                              return null;
                            }

                            return (
                              <li
                                key={r?._id || `${v?._id || "maintenance"}-${r?.resident?._id || Math.random()}`}
                                className="border-b border-[#F6F8FB] py-2 flex items-center"
                              >
                                <img
                                  src={
                                    r?.resident?.profileImage ||
                                    "https://ui-avatars.com/api/?name=Resident&background=5678E9&color=fff"
                                  }
                                  alt={r?.resident?.Full_name || "Resident"}
                                  className="rounded-full w-10 h-10 mr-3 object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <div className="font-normal">
                                      <p className="font-normal text-[14px]">
                                        {r?.resident?.Full_name || "Unknown Resident"}
                                      </p>
                                      <p className="text-[#A7A7A7] text-[12px]">
                                        {v?.dueDate
                                          ? new Date(v.dueDate).toLocaleDateString("en-GB", {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric",
                                            })
                                          : "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-[#E74C3C] font-bold">
                                        ₹ {v?.maintenanceAmount || 0}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })
                        : []
                    )
                  ) : (
                    <li className="text-center text-[#A7A7A7] py-4">
                      No data found
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* chart section end */}

          <div className="grid grid-cols-8 w-full gap-4 h-full max-xl:grid-cols-6 max-2xl:grid-cols-6 mt-[20px] max-4xl:grid-cols-8">
            <div className="col-span-6 max-md:col-span-12 max-lg:col-span-12 rounded-lg max-xl:col-span-12 max-2xl:col-span-4">
              <DashboardTable />
            </div>
            <div className='col-span-2 max-sm:col-span-12 max-md:col-span-12 max-xl:col-span-12'>
              <div className='bg-[#fff] rounded-[15px] p-[20px] h-[345px] overflow-hidden  mt-[-5px]'>
                <div className='flex justify-between items-center mb-[27px] max-sm:ps-[10px] max-sm:pr-0'>
                  <div className='flex items-center'>
                    <h2 className='text-[18px] text-lg font-semibold max-mb:text-[18px] leading-[27px] max-sm:text-[16px] max-md:text-[18px] max-2xl:text-[18px]'>
                      Upcoming Activity
                    </h2>
                  </div>

                  <div className="relative  mt-[-10px]  ">
                    <button
                      onClick={handleToggleDropdown}
                      className='border border-gray-300 rounded-lg ps-[14px] ml-10  flex justify-between items-center w-[120px] text-[15px] h-[44px] capitalize font-semibold max-3xl:ml-6 max-3xl:mt-[15px] mt-[15px]'
                    >
                      {selectedPeriod}{" "}
                      <img
                        src={downicon}
                        className="mr-[10px] text-[12px] text-[#202224]"
                      />
                    </button>
                    {isOpen && (
                      <div className="absolute z-10 left-[-39px] bg-white rounded-lg shadow-[0px_0px_40px_0px_#0000000D] mt-1 w-[160px] py-[15px]">
                        {[
                          "Select Month",
                          "Last week",
                          "Month",
                          "Last year",
                        ].map((option, index) => (
                          <div
                            key={option}
                            onClick={
                              option === "Select Month"
                                ? null
                                : () => handleOptionClick(option)
                            }
                            className={`flex items-center bg-white cursor-pointer mb-[10px] ps-[15px] ${
                              option === "Select Month"
                                ? "text-gray-400 cursor-not-allowed"
                                : selectedPeriod === option
                                ? "font-semibold text-black"
                                : "text-gray-600"
                            }`}
                          >
                            <input
                              type="radio"
                              name="period"
                              checked={selectedPeriod === option}
                              onChange={() => handleOptionClick(option)}
                              className="custom-radio mr-2"
                              disabled={option === "Select Month"}
                            />
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 max-h-[300px] overflow-y-auto overflow-x-auto custom-scrollbar text-nowrap">
                  {activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <li
                        key={activity._id}
                        className="flex items-center justify-between bg-white py-[12px] px-[15px] rounded-lg  max-sm:px-[5px]"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-[40px] h-[40px] bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold acvtivity">
                            {activity.title[0].toUpperCase()}
                          </div>
                          <div>
                            <p className='text-sm font-semibold  mb-1'>
                              {activity.title}
                            </p>
                            <p className="text-[14px] text-[#A7A7A7]  leading-[19.5px]">
                              {convert24hrTo12hr(activity.time)}
                            </p>
                          </div>
                        </div>

                        <p className="text-[14px] text-[#4F4F4F] leading-4">
                          {new Date(activity.date)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            .replace(/\//g, "-")}
                        </p>
                      </li>
                    ))
                  ) : (
                    <div className="text-center text-[#A7A7A7] py-4">
                      No data found
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
