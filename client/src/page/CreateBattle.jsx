import React, { useEffect, useState } from 'react';
import PageContainer from './PageContainer';
import { CustomButton, InputField, GameLoad } from '../components';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import styles from '../styles';

const CreateBattle = () => {
  const navigate = useNavigate()
  const { contract, battleName, setBattleName, gameState } = useStateContext()
  const [waitGame, setWaitGame] = useState(false);

  const handleClick = async () => {
    if (!battleName || !battleName.trim()) return;
    try {
      await contract.CreateBattle(battleName)
      setWaitGame(true);
    } catch (error) {
      console.log("Error create battle", error);
    }
  }

  useEffect(() => {
    if (gameState?.activeBattle?.battleStatus === 0) {
      setWaitGame(true)
    }
  }, [gameState])

  return (
    <>
      ({waitGame && <GameLoad />})

      <div className="flex flex-col mb-5">
        <InputField
          label="Battle"
          placeHolder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />

        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />
      </div>
      <p className={styles.infoText} onClick={() => navigate('/join-battle')}>
        Or join already existing battles
      </p>
    </>
  )
};

export default PageContainer(CreateBattle,
  <>Create <br /> a new battle</>,
  <>Create your own battle and wait for others to join</>);