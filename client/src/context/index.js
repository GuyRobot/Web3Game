import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Web3Modal from "web3modal"
import { ethers } from "ethers";
import { ABI, CONTRACT_ADDRESS } from "../contract";

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {

    const navigate = useNavigate();

    const [walletAddress, setWalletAddress] = useState('');
    const [contract, setContract] = useState('');
    const [provider, setProvider] = useState('');


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
            const connection = web3Model.connect();
            const newProvider = ethers.providers.Web3Provider(connection);
            const signer = newProvider.getSigner();
            const newContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

            setProvider(newProvider);
            setContract(newContract);
        }

        setContractAndProvider();
    }, [])

    return <StateContext.Provider value={{ contract, provider, walletAddress }}>
        {children}
    </StateContext.Provider>
}

export const useStateContext = () => useContext(StateContext);