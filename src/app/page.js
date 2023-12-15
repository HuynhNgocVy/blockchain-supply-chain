'use client';
import {
  CompleteShipment,
  Form,
  GetShipment,
  Navbar,
  Profile,
  Services,
  StartShipment,
  Table } from '@/components';
import QualityChecked from '@/components/QualityChecked';
import { TrackingContext } from '@/context/TrackingContext'
import { useContext, useEffect, useState } from 'react'

export default function Home() {
  const { 
    createShipment,
    getAllShipment,
    completeShipment,
    getShipment,
    startShipment,
    checkQuality,
    getShipmentsCount,
    currentUser } = useContext(TrackingContext)
  const [ createShipmentModal, setCreateShipmentModal ] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [startModal, setStartModal] = useState(false)
  const [qualityModal, setQualityModal] = useState(false)
  const [completeModal, setCompleteModal] = useState(false);
  const [getModel, setGetModel] = useState( false);
  
  //DATA STATE VARIABLE
  const [allShipmentsdata, setallShipmentsdata] = useState();
  
  useEffect(() => {
    const getCampaignsData = getAllShipment()
    return async () => {
      const allData = await getCampaignsData;
      console.log(allData)

      setallShipmentsdata(allData)
    }
  }, [])
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Services
        setOpenProfile={setOpenProfile}
        setCompleteModal={setCompleteModal}
        setGetModel={setGetModel}
        setStartModal={setStartModal}
        setQualityModal = {setQualityModal}
      />
      <Table 
        setCreateShipmentModal={setCreateShipmentModal}
        allShipmentsdata={allShipmentsdata}
      />
      <Form 
        createShipmentModal={createShipmentModal}
        createShipment={createShipment}
        setCreateShipmentModal={setCreateShipmentModal}
      />
      <Profile 
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        currentUser={currentUser}
        getShipmentsCount={getShipmentsCount}
      />
      <CompleteShipment 
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        completeShipment={completeShipment}
      />
      <GetShipment 
        getModel={getModel}
        setGetModel={setGetModel}
        getShipment={getShipment}
      />
      <StartShipment 
        startModal={startModal}
        setStartModal={setStartModal}
        startShipment={startShipment}
      />
      <QualityChecked 
        checkQuality = {checkQuality}
        qualityModal={qualityModal}
        setQualityModal={setQualityModal}
      />
    </main>
  )
}
