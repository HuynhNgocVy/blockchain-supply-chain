'use client';
import { createContext, useEffect, useState } from 'react';
import Web3Modal from "web3modal"
import { ethers } from "ethers"

import tracking from "./Traceability.json"

const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const ConreactABI = tracking.abi

const fetchContract = (signerOrProvider) => new ethers.Contract(ContractAddress, ConreactABI, signerOrProvider)

export const TrackingContext = createContext()

export const TrackingProvider = ({ children }) => {
    const DappName = "Product Tracking Dapp"
    const [ currentUser, setCurrentUser ] = useState("")

      
    useEffect(() => {
        const connect = async () => {
            const provider = new ethers.providers.JsonRpcProvider()
            const contract = fetchContract(provider)
            // Lắng nghe sự kiện ShipmentCreated từ contract
            contract.on("ShipmentCreated", (manufacturer, destination, source, productId, productName, timestamp, status) => {
                console.log("Shipment created:", {
                    manufacturer,
                    destination,
                    source,
                    productId,
                    productName,
                    timestamp: parseInt(timestamp),
                    status
                });
                // Thực hiện xử lý khi có sự kiện ShipmentCreated được gửi từ contract
            });
            contract.on("QualityChecked", (verifier, productId, destination, source, timestamp, status) => {
                console.log("QualityChecked:", {
                    verifier,
                    productId,
                    status,
                    timestamp: parseInt(timestamp)
                });
                // Thực hiện xử lý khi có sự kiện ShipmentCreated được gửi từ contract
            });
            contract.on("ShipmentInTransit", (supplier, productId, destination, source, timestamp, status) => {
                console.log("ShipmentInTransit:", {
                    supplier,
                    productId,
                    destination,
                    source,
                    status,
                    timestamp: parseInt(timestamp)
                });
                // Thực hiện xử lý khi có sự kiện ShipmentCreated được gửi từ contract
            });
            contract.on("ShipmentCancelled", (supplier, productId, timestamp, status) => {
                console.log("ShipmentCancelled:", {
                    supplier,
                    productId,
                    destination,
                    source,
                    status,
                    timestamp: parseInt(timestamp)
                });
                // Thực hiện xử lý khi có sự kiện ShipmentCreated được gửi từ contract
            });
            contract.on("ShipmentDelivered", (supplier, productId, destination, source, timestamp, deliveryTime, status) => {
                console.log("ShipmentDelivered:", {
                    supplier,
                    productId,
                    destination,
                    source,
                    status,
                    deliveryTime: parseInt(deliveryTime),
                    timestamp: parseInt(timestamp)
                });
                // Thực hiện xử lý khi có sự kiện ShipmentCreated được gửi từ contract
            });
        };
    
        connect();
    }, []);

    const createShipment = async (items) => {
        const { destination, source, productId, productName, timestamp } = items 
        console.log(destination, source, productId, productName, timestamp)
        
        try {
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()

            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            const contract = fetchContract(signer)
            const createItem = await contract.createShipment(
                destination,
                source,
                productId,
                productName,
                new Date(timestamp).getTime()
            )
            await createItem.wait()
        } catch (error) {
            console.log("Some want wrong", error)
        }
    }  
    const getAllShipment = async () => {
        try {
       
            const provider = new ethers.providers.JsonRpcProvider()
            const contract = fetchContract(provider)
            const shipments = await contract.getAllTransactions()
            const allShipments = shipments.map(shipment => ({
                destination: shipment.destination,
                source: shipment.source,
                timestamp: shipment.timestamp.toNumber(),
                status: shipment.status,
                productId: shipment.productId,
                productName: shipment.productName
            }))
            return allShipments

        } catch (err) {
            console.log("Error getting shipment")
        }
    }

    const getShipment = async (productId) => {
        try {
            if(!window.ethereum) return "Install MetaMask"
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            })
            const provider = new ethers.providers.JsonRpcProvider()
            const contract = fetchContract(provider)
            const shipment = await contract.getShipment(productId)

            const SingleShiplent = {
                destination: shipment[0],
                source: shipment[1],
                productId: shipment[2],
                productName: shipment[3],
                deliveryTime: shipment[4].toNumber(),
                timestamp: shipment[4].toNumber(),
                status: shipment[6],
                // price: ethers.utils.formatEther(shipment[5].toString()),
            }
            return SingleShiplent
        } catch (error) {
            console.log("Error no shipment")
        }
    }

    const checkQuality = async (getProduct) => {
        const { productId, destination, source, timestamp } = getProduct

        try {
            if(!window.ethereum) return "Install MetaMask"
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            })
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            const contract = fetchContract(signer)
            
            const shipment = await contract.checkQuality(
                accounts[0],
                productId,
                destination, 
                source,
                new Date(timestamp).getTime()
            )
            shipment.wait()
            console.log(shipment)
        } catch (error) {
            console.log("Error no shipment", error)
        }
    }
    
    const startShipment = async (getProduct) => {
        const { productId, destination, source, timestamp } = getProduct

        try {
            if(!window.ethereum) return "Install MetaMask"
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            })
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            const contract = fetchContract(signer)
            
            const shipment = await contract.startShipment(
                accounts[0],
                productId,
                destination, 
                source,
                new Date(timestamp).getTime()
            )
            shipment.wait()
            console.log(shipment)
        } catch (error) {
            console.log("Error no shipment", error)
        }
    }
    const completeShipment = async (completeShip) => {
        const { productId, timestamp, destination, source, } = completeShip;
        try {
            if(!window.ethereum) return "Install MetaMask"
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            })

            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            const contract = fetchContract(signer)

            const transaction = await contract.completeShipment(
                accounts[0],
                productId,
                destination, 
                source,
                new Date(timestamp).getTime()
            )
            transaction.wait()
            console.log(transaction)
        } catch(error) {
            console.log("Wrong completeShipment")
        }
    }
    //CHECK WALLET
    const checkIfWalletConnected = async () => {
        try {
            if(!window.ethereum) return "Install MetaMask"
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            })
            if(accounts.length) {
                setCurrentUser(accounts[0])
            } else {
                return "no account"
            }
        } catch (error) {
            return " not connected"
        }
    }
    //conect wallet function
    const connectWallet = async () => {
        try {
            if(!window.ethereum) return "Install MetaMask"
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            })
            setCurrentUser(accounts[0])
        } catch(error) {
            return "Something want wrong"
        }
    }
    // const getShipmentsCount = async () => {
    //     try {
    //         if(!window.ethereum) return "Install MetaMask"

    //         const accounts = await window.ethereum.request({
    //             method: "eth_accounts"
    //         })

    //         const provider = new ethers.providers.JsonRpcProvider()
    //         const contract = fetchContract(provider)
    //         const shipmentsCount = await contract.getShipmentsCount(accounts[0])
    //         return shipmentsCount.toNumber()
    //     } catch(error) {
    //         console.log("Error get shipment count")
    //     }
    // }
    useEffect(() => {
        checkIfWalletConnected()
    }, [])
    return (
        <TrackingContext.Provider
            value={{
                connectWallet,
                createShipment,
                getAllShipment,
                completeShipment,
                getShipment,
                startShipment,
                // getShipmentsCount,
                checkQuality,
                DappName,
                currentUser
            }}
        >
            { children }    
        </TrackingContext.Provider>
    )
}