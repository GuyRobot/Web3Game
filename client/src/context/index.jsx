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
    const [battleName, setBattleName] = useState('');
    const [gameState, setGameState] = useState({players: [], pendingBattles: [], activeBattle: null})

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
            createEventListeners({ navigate, contract, provider, walletAddress, setShowAlert })
        }
    }, [contract])

    // Fetch game data
    useEffect(() => {
        const fetchGameData = async () => {
            const battles = await contract.getAllBattles();
            const pendingBattles = battles.filter((battle) => battle.battleStatus === 0)
            let activeBattle = null;

            battles.forEach(battle => {
                if (battle.players.find((player) => player.toLowerCase() === walletAddress.toLowerCase())) {
                    if (battle.winner.startWith('0x00')) {
                        activeBattle = battle;
                    }
                }
            });

            setGameState({players: pendingBattles, pendingBattles: pendingBattles.slice(1), activeBattle})   
        }

        fetchGameData()
    }, [contract])

    return (<StateContext.Provider value={{ contract, provider, walletAddress, showAlert, setShowAlert, battleName, setBattleName, gameState }}>
        {children}
    </StateContext.Provider>)
}

export const useStateContext = () => useContext(StateContext);