import React from 'react';
import PageContainer from './PageContainer';
import { useStateContext } from "../context";

const Home = () => {

  const { walletAddress, contract } = useStateContext()

  return (
    walletAddress && (
      <div className="flex flex-col">
        <CustomInput
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