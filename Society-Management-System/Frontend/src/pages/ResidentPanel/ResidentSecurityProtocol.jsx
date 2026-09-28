import { useEffect, useState } from 'react'
import { GetProtocols } from '../../services/securityProtocol'
import toast from 'react-hot-toast'
import { Loader } from '../../utils/Loader'

function ResidentSecurityProtocol () {
  const [protocols, setProtocols] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <div>
      <div className='bg-white rounded-xl p-6'>
        <h1 className='text-[20px] font-semibold mb-4 leading-[30px]'>
          Security Protocols
        </h1>
        <div className='overflow-x-auto overflow-y-auto max-h-[50rem] custom-scrollbar'>
          {isLoading ? (
            <div className='flex justify-center items-center w-full h-[200px]'>
              <Loader />
            </div>
          ) : (
            <table className='min-w-full shadow-sm'>
              <thead>
                <tr className='bg-indigo-50 h-[61px] text-[14px]'>
                  <th className='font-medium px-4 py-2 text-left rounded-tl-[15px]'>
                    Title
                  </th>
                  <th className='font-medium px-4 py-2 text-left'>
                    Description
                  </th>
                  <th className='font-medium px-4 py-2 text-center'>Date</th>
                  <th className='font-medium px-4 py-2 rounded-tr-[15px]'>
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className='pr-[10px]'>
                {protocols.length > 0 ? (
                  protocols.map((item, index) => (
                    <tr
                      key={index}
                      className='bg-white font-medium border-b border-gray-100 px-4 py-4 text-[15px] text-[#4F4F4F]'
                    >
                      <td className='px-4 py-4'>{item.title}</td>
                      <td className='px-4 py-4'>{item.description}</td>
                      <td className='px-4 py-4 font-medium text-center'>
                        {new Date(item.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className='py-4 flex justify-center'>
                        <p className='bg-gray-100 py-[5px] text-center w-[92px] h-[34px] text-[16px] rounded-full font-medium'>
                          {item.time}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className='text-center text-gray-500 py-20'>
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResidentSecurityProtocol
