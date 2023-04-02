import React, { useEffect, useState } from 'react';
import PageContainer from './PageContainer';
import { CustomButton, InputField } from '../components';
import { useNavigate } from 'react-router-dom';
import styles from '../styles';
import { useStateContext } from '../context';

const JoinBattle = () => {
  const navigate = useNavigate()
  const { gameState, setBattleName, walletAddress, contract, setShowAlert } = useStateContext()

  useEffect(() => {
    if (gameState?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameState.activeBattle.name}`)
    }
  }, [gameState])

  const handleClick = async (battle) => {
    setBattleName(battle.name)

    try {
      await contract.joinBattle(battle.name, { gasLimit: 200000 })

      setShowAlert({ status: true, type: "success", message: `Joining ${battle.name}` })
    } catch (error) {
      console.log("Error joining battle", error);
    }
  }

  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>

      <div className={styles.joinContainer}>
        {gameState.pendingBattles?.length ? (gameState.pendingBattles.filter((battle) => !battle.players.includes(walletAddress)).map(
          (battle, index) => (<div key={battle.name} className={styles.flexBetween}>
            <p className={styles.joinBattleTitle}>
              {index}. {battle.name}
            </p>
            <CustomButton title="Join" handleClick={() => handleClick(battle)} />
          </div>)
        )) : <p></p>}
      </div>

      <p className={styles.infoText} onClick={() => navigate('/create-battle')}>
        Or create a new battle
      </p>
    </>
  )
};

export default PageContainer(JoinBattle,
  <>Join <br /> a existing battle</>,
  <>Join already existing battles</>,
);