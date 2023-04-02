import React, { useEffect, useState } from 'react';
import PageContainer from './PageContainer';
import { useStateContext } from "../context";
import { useNavigate } from 'react-router-dom';
import { CustomButton, InputField } from '../components';

const Home = () => {

  const { walletAddress, contract, setShowAlert, gameState, setErrorMessage } = useStateContext()
  const [playerName, setPlayerName] = useState('')
  const navigate = useNavigate()

  const handleClick = async () => {
    try {
      const isPlayer = await contract.isPlayer(walletAddress);
      if (!isPlayer) {
        await contract.registerPlayer(playerName, playerName, { gasLimit: 500000 });

        setShowAlert({ status: true, type: "info", message: `${playerName} is being created` })

        setTimeout(() => {
          navigate('/create-battle')
        }, 8000);
      }
    } catch (error) {
      setErrorMessage(error)
    }
  }

  useEffect(() => {
    const checkRedirect = async () => {
      const isPlayer = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      if (isPlayer && playerTokenExists) {
        navigate('/create-battle');
      }
    }

    if (contract) checkRedirect()
  }, [contract])

  useEffect(() => {
    if (gameState.activeBattle) {
      navigate(`battle/${gameState.activeBattle.name}`)
    }
  }, [gameState])

  return (
    (
      <div className="flex flex-col">
        <InputField
          label="Name"
          placeHolder="Enter your player name"
          value={playerName}
          handleValueChange={setPlayerName}
        />

        <CustomButton
          title="Register"
          handleClick={handleClick}
          restStyles="mt-6"
        />
      </div>
    )
  )
};

export default PageContainer(Home,
  <>Welcome to Avax Gods <br /> a Web3 NFT card game</>,
  <>Connect to your wallet to start playing the ultimate Battle Card Game</>);