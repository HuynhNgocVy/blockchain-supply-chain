import React, { useState } from 'react'
import Str1 from '../../public/SVG/Str1'

function GetShipment({ getModel, setGetModel, getShipment }) {
  const [index, setIndex] = useState(0)
  const [ singleShipmentData, setSingleShipmentData] = useState()
  const getShipmentData = async () => {
    const getData = await getShipment(index)
    setSingleShipmentData(getData)
    console.log(getData)
  }
  const convertTime = (time) => {
    const newTime = new Date(time)
    const dateTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(newTime)
    return dateTime
  }
  return getModel ? (
    <div className='fixed inset-0 z-10 overflow-y-auto'>
      <div className='fixed inset-0 w-full h-full bg-black opacity-40'
        onClick={() => setGetModel(false)}
      ></div>
      <div className='flex items-center min-h-screen px-4 py-8'>
        <div className='relative w-full max-w-lg max-auto bg-white rounded-md shadow-lg'>
          <div className='flex justify-end'>
            <button className='p-2 text-gray-400 rounded-md hover:bg-gray-100'>
              <Str1 />
            </button>
          </div>
          <div className='max-w-sm mx-auto py-3 space-y-3 text-center'>
            <h4 className='text-lg font-medium text-gray-800'>
              Product tracking details
            </h4>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className='relative mt-3'>
                <input 
                  placeholder='Product Id'
                  className='w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg'
                  onChange={(e) => setIndex(e.target.value)}
                />
                </div>
                <button onClick={() => getShipmentData()}
                  className='block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg ring-offset-2 ring-indigo-600 focus:ring-2'
                >Get Details</button>
            </form>
            
            {singleShipmentData && (
              <div className='text-left'>
              <p>Distance: {singleShipmentData.productId}</p>
              <p>Price: {singleShipmentData.productName}</p>
              <p>Destination: {singleShipmentData.destination}</p>
              <p>Source: {singleShipmentData.source}</p>
              <p>PickupTime: {convertTime(singleShipmentData.timestamp)}</p>
              <p>Delivery Time: {convertTime(singleShipmentData.deliveryTime)}</p>
              <p>Status: {singleShipmentData.status == 0 ? "MANUFACTURED" : 
                    singleShipmentData.status ==  1 ? "QUALITY_CHECKED":
                    singleShipmentData.status ==  2 ? "IN_TRANSIT":
                    singleShipmentData.status ==  3 ? "DELIVERED": "CANCELLED"
                  }</p>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  )
}

export default GetShipment