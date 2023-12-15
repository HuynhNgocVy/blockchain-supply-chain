import React, { useEffect, useState } from 'react'

function Profile({ openProfile, setOpenProfile, currentUser, getShipmentsCount }) {
  const [ count, setCount ] = useState()
  // useEffect(() => {
  //   const getShipmentData = getShipmentsCount()
  //   return async () => {
  //     const data = await getShipmentData;
  //     setCount(data)
  //   }
  // }, [])
  return openProfile ? (
    <div>Profile</div>
  ) : (
    ""
  )
}

export default Profile