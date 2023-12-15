import React from 'react'

function Table({ setCreateShipmentModal, allShipmentsdata }) {
  const convertTime = (time) => {
    const newTime = new Date(time)
    const dateTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(newTime)
    return dateTime
  }
  console.log("allShipmentsdata", allShipmentsdata)
  return (
    <div className='max-w-screen-xl mx-auto px-4 md:px-8'>
      <div className='items-start justify-between md:flex'>
        <div className='max-w-lg'>
          <h3 className='text-gray-800 text-xl font-bold'>Create Tracking</h3>
          <p className='text-gray-600 mt-2'>Lorem fkshfdsjhfjs</p>
        </div>
        <div className='mt-3 md:mt-0'>
          <p onClick={() => setCreateShipmentModal(true)} 
            className='inline-block px-4 py-2 text-white duration-500 font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 md:text-sm rounded-lg md:inline-flex'>
                Add Tracking
          </p>
        </div>
      </div>
      <div className='mt-12 shadow-sm border rounded-lg overflow-x-auto'>
        <table className='w-full table-auto text-sm text-left'>
          <thead className='bg-gray-50 text-gray-600 font-medium border-b'>
            <tr>
              <th className='px-6 py-3'>Product Id</th>
              <th className='px-6 py-3'>Product Name</th>
              <th className='px-6 py-3'>Destination</th>
              <th className='px-6 py-3'>Source</th>
              <th className='px-6 py-3'>Timestamp</th>
              <th className='px-6 py-3'>Delivery Time</th>
              <th className='px-6 py-3'>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-600 divide-y'>
            {allShipmentsdata?.map((shipment, idx) => (
              <tr key={idx}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {shipment.productId}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {shipment.productName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {shipment.destination}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {shipment.source}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {convertTime(shipment.timestamp)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {shipment.deliveryTime}
                </td>
              
                <td className='px-6 py-4 whitespace-nowrap'>
                  {shipment.status == 0 ? "MANUFACTURED" : 
                    shipment.status ==  1 ? "QUALITY_CHECKED":
                    shipment.status ==  2 ? "IN_TRANSIT":
                    shipment.status ==  3 ? "DELIVERED": "CANCELLED"
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table