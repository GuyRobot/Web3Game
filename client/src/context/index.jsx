import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3Modal from "web3modal"
import { ethers } from "ethers";
import { ABI, CONTRACT_ADDRESS } from "../contract";
import { createEventListeners } from "./createEventListeners";

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {

    const navigate = useNavigate();

    const [walletAddress, setWalletAddress] = useState('');
    const [contract, setContract] = useState('');
    const [provider, setProvider] = useState('');
    const [showAlert, setShowAlert] = useState({ status: false, type: "info", message: '' })

    const updateCurrentWalletAddress = async () => {
        const accounts = await window?.ethereum?.request({ method: 'eth_requestAccounts' });

        if (accounts) setWalletAddress(accounts[0]);
    }

    useEffect(() => {
        updateCurrentWalletAddress();

        window?.ethereum?.on('accountsChanged', updateCurrentWalletAddress)

        // Set contract and provider
        const setContractAndProvider = async () => {
            const web3Model = new Web3Modal();
            const connection = await web3Model.connect();
            const newProvider = new ethers.providers.Web3Provider(connection);
            const signer = newProvider.getSigner();
            const newContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

            setProvider(newProvider);
            setContract(newContract);
        }

        setContractAndProvider();
    }, [])

    // Show alert
    useEffect(() => {
        if (showAlert?.status) {
            const timer = setTimeout(() => {
                setShowAlert({ status: false, type: "info", message: "" })
            }, [5000]);

            return () => clearTimeout(timer);
        }
    }, [showAlert])

    // Add event listener
    useEffect(() => {
        if (contract) {
            createEventListeners({navigate, contract, provider, walletAddress, setShowAlert})
        }
    }, [contract])

    return (<StateContext.Provider value={{ contract, provider, walletAddress, showAlert, setShowAlert }}>
        {children}
    </StateContext.Provider>)
}

export const useStateContext = () => useContext(StateContext);