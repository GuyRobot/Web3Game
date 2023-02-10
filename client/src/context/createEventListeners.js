import { ethers } from "ethers"
import { ABI } from "../contract"

const addNewEvent = (eventFilter, provider, cb) => {
    provider.removeListener(eventFilter) // Prevent duplicate listener

    provider.on(eventFilter, (logs) => {
        const parsedLog = (new ethers.utils.Interface(ABI)).parseLog(logs)

        cb(parsedLog)
    })
}

export const createEventListeners = ({ navigate, contract, provider, walletAddress, setShowAlert }) => {
    const newPlayerEventFilter = contract.filters.NewPlayer();

    addNewEvent(newPlayerEventFilter, provider, ({ args }) => {
        if (walletAddress === args.owner) {
            setShowAlert({ status: true, type: "success", message: "Player has been created" })
        }
    })
}