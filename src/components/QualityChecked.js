import React, { useState } from 'react'

function QualityChecked({ qualityModal, setQualityModal, checkQuality}) {
  const [ getProduct, setGetProduct] = useState({
    productId: "",
    timestamp: ""
  })
  const startShipping = () => {
    checkQuality(getProduct)
  }
  return qualityModal ? (
    <div className='fixed inset-0 z-10 overflow-y-auto'>
      <div className='fixed inset-0 w-full h-full bg-black opacity-40'
        onClick={() => setQualityModal(false)}></div>
      <div className='flex items-center min-h-screen px-4 py-8'>
        <div className='relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg'>
          <div className='flex justify-end'>
            <button className='p-2 text-gray-400 rounded-md hover:bg-gray-100'
              onClick={() => setQualityModal(false)}
            >
              X
            </button>
          </div>
          <div className='max-w-sm mx-auto py-3 space-y-3 text-center'>
            <h4 className='text-lg font-medium text-gray-800'>
              Quality shipment
            </h4>
            <p className='text-[15px] text-gray-600'>
              fdsjfdsljgdsjglfg
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className='relative mt-3'>
                <input 
                  type='text'
                  placeholder='Product Id'
                  className='w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg'
                  onChange={(e) => setGetProduct({
                    ...getProduct,
                    productId: e.target.value
                  })}
                />
                </div>
                <div className='relative mt-3'>
                <input 
                  placeholder='destination'
                  className='w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg'
                  onChange={(e) => setGetProduct({
                    ...getProduct,
                    destination: e.target.value
                  })}
                />
              </div>
              <div className='relative mt-3'>
                <input 
                  placeholder='source'
                  className='w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg'
                  onChange={(e) => setGetProduct({
                    ...getProduct,
                    source: e.target.value
                  })}
                />
              </div>
                <div className='relative mt-3'>
                <input 
                  type='date'
                  placeholder='timestamp'
                  className='w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg'
                  onChange={(e) => setGetProduct({
                    ...getProduct,
                    timestamp: e.target.value
                  })}
                />
              </div>
                <button onClick={() => startShipping()}
                  className='block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg ring-offset-2 ring-indigo-600 focus:ring-2'
                >Get Details</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : ""
}

export default QualityChecked