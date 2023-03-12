import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3Modal from "web3modal"
import { ethers } from "ethers";
import { ABI, CONTRACT_ADDRESS } from "../contract";
import { createEventListeners } from "./createEventListeners";
import { GetParams } from "../utils/onboard";

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {

    const navigate = useNavigate();

    const [walletAddress, setWalletAddress] = useState('');
    const [contract, setContract] = useState('');
    const [provider, setProvider] = useState('');
    const [showAlert, setShowAlert] = useState({ status: false, type: "info", message: '' })
    const [battleName, setBattleName] = useState('');
    const [gameState, setGameState] = useState({ players: [], pendingBattles: [], activeBattle: null })
    const [triggerUpdateGame, setTriggerUpdateGame] = useState(0) // Change it to trigger update game state
    const [battleGround, setBattleGround] = useState('bg-astral')
    const [step, setStep] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')

    const player1Ref = useRef()
    const player2Ref = useRef()

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
            createEventListeners({ navigate, contract, provider, walletAddress, setShowAlert, setTriggerUpdateGame, player1Ref, player2Ref, updateCurrentWalletAddress })
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

            setGameState({ players: pendingBattles, pendingBattles: pendingBattles.slice(1), activeBattle })
        }

        fetchGameData()
    }, [contract, triggerUpdateGame])

    // Battle ground
    useEffect(() => {
        const battleGround = localStorage.getItem('battleGround')
        if (battleGround) {
            setBattleGround(battleGround)
        } else {
            localStorage.setItem("battleGround", battleGround)
        }
    }, [])

    // Reset onboard params
    useEffect(() => {
        const resetParams = async () => {
            const currentStep = await GetParams()

            setStep(currentStep.step)
        }

        resetParams()

        window?.ethereum?.on("chainChanged", () => resetParams())
        window?.ethereum?.on("accountsChanged", () => resetParams())
    }, [])

    //* Handle error messages
    useEffect(() => {
        if (errorMessage) {
            const parsedErrorMessage = errorMessage?.reason?.slice('execution reverted: '.length).slice(0, -1);

            if (parsedErrorMessage) {
                setShowAlert({
                    status: true,
                    type: 'failure',
                    message: parsedErrorMessage,
                });
            }
        }
    }, [errorMessage]);

    return (<StateContext.Provider value={{ contract, provider, walletAddress, showAlert, setShowAlert, battleName, setBattleName, gameState, battleGround, setBattleGround, errorMessage, setErrorMessage, player1Ref, player2Ref }}>
        {children}
    </StateContext.Provider>)
}

export const useStateContext = () => useContext(StateContext);