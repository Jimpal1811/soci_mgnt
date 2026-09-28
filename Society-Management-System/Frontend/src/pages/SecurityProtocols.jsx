import React, { useEffect, useState } from 'react'
import {  FaCalendarAlt, FaClock } from 'react-icons/fa'
import {
  CreateProtocol,
  DeleteProtocol,
  GetProtocols,
  UpdateProtocol
} from '../services/securityProtocol'
import { toast } from 'react-hot-toast'
import eye from '../assets/images/eye.svg'
import edit from '../assets/images/edit.svg'
import trash from '../assets/images/trash.svg'
import { IoMdClose } from 'react-icons/io'
import calendar from '../assets/images/calendar.svg'
import clock from '../assets/images/clock.svg'
import { Loader } from '../utils/Loader'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function SecurityProtocols () {
  const [protocols, setProtocols] = useState([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [currentProtocol, setCurrentProtocol] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [newProtocol, setNewProtocol] = useState({
    title: '',
    description: '',
    date: '',
    time: ''
  })

  const handleCreate = () => {
    setIsCreateOpen(true)
    setNewProtocol({ title: '', description: '', date: '', time: '' })
  }

  const handleDateChange = date => {
    setNewProtocol({
      ...newProtocol,
      date: date ? date.toISOString().split('T')[0] : ''
    })
    setIsOpen(false)
  }

  const handleImageClick = () => {
    setIsOpen(true)
  }

  const handleEdit = protocol => {
    setIsEditOpen(true)
    setCurrentProtocol(protocol)
    setNewProtocol({ ...protocol })
  }

  const handleView = protocol => {
    setIsViewOpen(true)
    setCurrentProtocol(protocol)
  }

  const handleDelete = protocol => {
    setIsDeleteOpen(true)
    setCurrentProtocol(protocol)
  }

  // create new security protocol
  const handleSave = async () => {
    try {
      const data = {
        title: newProtocol.title,
        description: newProtocol.description
      }
      setIsLoading(true)
      const response = await CreateProtocol(data)
      setIsCreateOpen(false)
      fetchProtocols()
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
      setNewProtocol({
        title: '',
        description: '',
        date: '',
        time: ''
      })
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const id = currentProtocol._id
      setProtocols(protocols.filter(p => p._id !== id))
      const response = await DeleteProtocol(id)
      toast.success(response.data.message)
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setCurrentProtocol(null)
      setIsDeleteOpen(false)
    }
  }

  // const checkFormFilled = protocol => {
  //   if (isCreateOpen) {
  //     return protocol.title.trim() !== '' && protocol.description.trim() !== ''
  //   }
  //   return (
  //     protocol.title.trim() !== '' &&
  //     protocol.description.trim() !== '' &&
  //     protocol.date.trim() !== '' &&
  //     protocol.time.trim() !== ''
  //   )
  // }

  // const handleProtocolChange = (field, value) => {
  //   const updatedProtocol = { ...newProtocol, [field]: value }
  //   setNewProtocol(updatedProtocol)
  //   setIsFormFilled(checkFormFilled(updatedProtocol))
  // }

  // get all security protocols
  const fetchProtocols = async () => {
    try {
      setIsLoading(true)
      const response = await GetProtocols()
      setProtocols(response.data.Protocol)
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProtocols()
  }, [])

  const handleUpdate = async () => {
    console.log(newProtocol)
    try {
      setIsLoading(true)
      const id = newProtocol._id
      const response = await UpdateProtocol(id, newProtocol)
      setIsEditOpen(false)
      fetchProtocols()
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
      setNewProtocol({
        title: '',
        description: '',
        date: '',
        time: ''
      })
    }
  }

  const convertTo24HourFormat = timeString => {
    const [time, modifier] = timeString.split(' ')
    let [hours, minutes] = time.split(':')

    hours = parseInt(hours)

    if (modifier === 'AM' && hours === 12) {
      hours = 0
    } else if (modifier === 'PM' && hours !== 12) {
      hours += 12
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`
  }

  const formattedTime = newProtocol.time
    ? convertTo24HourFormat(newProtocol.time)
    : ''
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const isPM = hour >= 12;
      const formattedHour = hour % 12 || 12; // Convert hour to 12-hour format
      const formattedTime = `${formattedHour}:${minutes} ${isPM ? 'PM' : 'AM'}`;
      return formattedTime;
    };

    const handleTimeChange = (e) => {
      const timeValue = e.target.value;
      setNewProtocol({
        ...newProtocol,
        time: timeValue
      });
    };
  

  const isdataFilled =
    newProtocol.title &&
    newProtocol.description &&
    newProtocol.title.trim() !== '' &&
    newProtocol.description.trim() !== ''

  return (
    <div className='p-4 sm:p-6  bg-white rounded-lg security-protocel-table min'>
      <div className='flex justify-between  items-center mb-6 max-sm:flex-col'>
        <h1 className='text-[20px] font-semibold text-black-800 max-xl:mb-0 max-sm:mb-[15px]'>
          Security Protocols
        </h1>
        <button
          onClick={handleCreate}
          className='px-4  h-[51px]  bg-gradient-to-r from-[rgba(254,81,46,1)] to-[rgba(240,150,25,1)]  text-white rounded-[10px] hover:opacity-90 flex items-center gap-2'
        >
          Create Protocol
        </button>
      </div>

      <div className='relative bg-white rounded-lg shadow-sm'>
        {/* Loader */}
        {isLoading && (
          <div className='absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10'>
            <Loader />
          </div>
        )}

        {/* Table */}
        <div className='overflow-y-auto pr-[8px] max-h-[43rem] custom-scrollbar overflow-x-auto'>
          <table className='min-w-full table-auto border-collapse'>
            <thead className='bg-indigo-50 border-b border-gray-200 h-[61px]'>
              <tr>
                <th className='px-6 py-4 text-left text-[14px] font-semibold text-[#202224] rounded-tl-[15px]'>
                  Title
                </th>
                <th className='px-6 py-4 text-left text-[14px] font-semibold text-[#202224]'>
                  Description
                </th>
                <th className='px-12 py-4 text-right text-[14px] font-semibold text-[#202224]'>
                  Date
                </th>
                <th className='px-12 py-4 text-right text-[14px] font-semibold text-[#202224]'>
                  Time
                </th>
                <th className='px-16 py-4 text-right text-[14px] font-semibold text-[#202224] rounded-tr-[15px]'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-100'>
              {protocols.length > 0 ? (
                protocols.map(protocol => (
                  <tr
                    key={protocol._id}
                    className='transition-colors duration-200 text-[#4F4F4F]'
                  >
                    <td className='px-6 py-4 text-base font-medium'>
                      {protocol.title}
                    </td>
                    <td className='px-6 py-6 line-clamp-1 max-w-[400px] max-h-[50px] text-base font-medium'>
                      {protocol.description}
                    </td>
                    <td className='px-4 py-4 text-base text-right font-medium'>
                      {new Date(protocol.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className='px-4 py-4 text-base text-right'>
                      <span className='inline-flex justify-center items-center px-2 py-1 bg-gray-100 rounded-full w-[92px] h-[34px] font-medium'>
                        {protocol.time}
                      </span>
                    </td>
                    <td className='px-4 py-4 text-right'>
                      <div className='flex items-center justify-end gap-3'>
                        <button
                          onClick={() => handleEdit(protocol)}
                          className='flex items-center ml-[10px] justify-center w-10 h-10 text-blue-500 transition-transform transform bg-gray-100 rounded-md'
                        >
                          <img src={edit} alt='Edit' />
                        </button>
                        <button
                          onClick={() => handleView(protocol)}
                          className='flex items-center justify-center w-10 h-10 text-green-500 transition-transform transform bg-gray-100 rounded-md'
                        >
                          <img src={eye} alt='View' />
                        </button>
                        <button
                          onClick={() => handleDelete(protocol)}
                          className='flex items-center justify-center w-10 h-10 text-red-500 transition-transform transform bg-gray-100 rounded-md'
                        >
                          <img src={trash} alt='Delete' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='5' className='text-center py-4 text-gray-500'>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(isCreateOpen || isEditOpen) && (
        <div className='fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-[9999] '>
          <div className='bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-[410px] max-w-md'>
            <div className='flex justify-between items-center mb-[10px]'>
              <h2 className='text-[20px] sm:text-2xl font-bold text-gray-800'>
                {isCreateOpen ? 'Security Protocol' : 'Edit Protocol'}
              </h2>
              <button
                onClick={() => {
                  setIsCreateOpen(false)
                  setIsEditOpen(false)
                }}
                className='text-gray-600 hover:text-gray-800'
              ></button>
            </div>
            <div className='border-b border-[#F4F4F4] mb-[20px]'></div>
            <form className='space-y-4 sm:space-y-6'>
              <div>
                <label className='block text-sm font-medium text-black-700 mb-1'>
                  Title
                </label>
                <input
                  type='text'
                  value={newProtocol.title}
                  onChange={e =>
                    setNewProtocol({ ...newProtocol, title: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                  placeholder='Enter title'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-black-700 mb-1'>
                  Description
                </label>
                <textarea
                  value={newProtocol.description}
                  onChange={e =>
                    setNewProtocol({
                      ...newProtocol,
                      description: e.target.value
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                  rows='2'
                  placeholder='Enter description'
                />
              </div>

              {/* Date and Time inputs */}
              {isEditOpen && (
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-black-700 mb-1'>
                      Date
                    </label>
                    <div className='relative'>
                      <DatePicker
                        type='date'
                        selected={
                          newProtocol?.date ? new Date(newProtocol?.date) : null
                        }
                        open={isOpen}
                        onChange={handleDateChange}
                        onClickOutside={() => setIsOpen(false)}
                        className='w-full px-3 py-2 pl-3 text-sm border border-gray-300 rounded-md focus:outline-none'
                        dateFormat='yyyy-MM-dd'
                        placeholderText='Select Date'
                        defaultValue={
                          newProtocol?.date
                            ? new Date(newProtocol?.date)
                                .toISOString()
                                .split('T')[0]
                            : ''
                        }
                        minDate={new Date()}
                      />
                      <img
                        src={calendar}
                        alt='calendar icon'
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer'
                        onClick={handleImageClick}
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-black-700 mb-1'>
                      Time
                    </label>
                    <div className='relative'>
                      <input
                        type="time"
                        value={newProtocol.time}
                        onChange={handleTimeChange}
                        placeholder="hh:mm AM/PM"
                        className="w-full px-3 py-2 pl-3 border border-gray-300 rounded-md focus:outline-none"
                      />
                      {/* <img
                        src={clock}
                        alt=''
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      /> */}
                    </div>
                  </div>
                </div>
              )}

              <div className='flex justify-center gap-3 mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setIsCreateOpen(false)
                    setIsEditOpen(false)
                  }}
                  className='w-full px-4 py-3 text-md font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={isEditOpen ? handleUpdate : handleSave}
                  className={`w-full px-4 py-3 text-md font-medium text-[#202224] rounded-lg hover:opacity-90 ${
                    isdataFilled
                      ? 'bg-custom-gradient text-white hover:opacity-90'
                      : 'bg-[#F6F8FB] cursor-not-allowed'
                  }`}
                  disabled={!isdataFilled}
                >
                  {isLoading ? <Loader /> : isCreateOpen ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-[9999]'>
          <div className='bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-[410px]'>
            <div className='flex justify-between items-center mb-[10px]'>
              <h2 className='text-[20px] font-semibold text-gray-800'>
                View Security Protocol
              </h2>
              <button
                onClick={() => setIsViewOpen(false)}
                className='text-gray-600 hover:text-gray-800'
              >
                <IoMdClose size={24} className='text-black' />
              </button>
            </div>
            <div className='border-b border-[#F4F4F4] mb-[20px]'></div>
            <div className='space-y-4  p-2 rounded-md'>
              <div>
                <h3 className='font-normal text-[#A7A7A7] text-[16px]'>
                  Title
                </h3>
                <p className='mt-1 text-lg font-normal text-gray-900'>
                  {currentProtocol.title}
                </p>
              </div>
              <div>
                <h3 className='font-normal text-[#A7A7A7] text-[16px]'>
                  Description
                </h3>
                <p className='mt-1 text-md text-black-700'>
                  {currentProtocol.description}
                </p>
              </div>
              <div className='flex flex-col sm:flex-row'>
                <div className='mb-2 sm:mb-0 mr-[30px]'>
                  <h3 className='font-normal text-[#A7A7A7] text-[16px]'>
                    Date
                  </h3>
                  <p className='mt-1 text-md text-black-700 flex items-center'>
                    {' '}
                    {new Date(currentProtocol.date).toLocaleDateString(
                      'en-GB',
                      {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }
                    )}
                  </p>
                </div>
                <div>
                  <h3 className='font-normal text-[#A7A7A7] text-[16px]'>
                    Time
                  </h3>
                  <p className='mt-1 text-md text-black-700 flex items-center'>
                    {' '}
                    {currentProtocol.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-[9999]'>
          <div className='bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-md'>
            <div className='flex justify-between items-center mb-[10px]'>
              <h2 className='text-2xl font-semibold text-gray-800'>
                Delete Protocol ?
              </h2>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className='text-gray-600 hover:text-gray-800'
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <div className='border-b border-[#F4F4F4] mb-[20px]'></div>

            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete this protocol?
            </p>

            <div className='flex justify-center gap-3 mt-6'>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className='w-full px-4 py-3 text-md font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className='w-full px-4 py-3 text-md font-medium text-white bg-red-500 rounded-md hover:opacity-90'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SecurityProtocols
