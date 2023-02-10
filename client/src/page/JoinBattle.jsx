import React, { useEffect, useState } from 'react';
import PageContainer from './PageContainer';
import { CustomButton, InputField } from '../components';
import { useNavigate } from 'react-router-dom';
import styles from '../styles';

const JoinBattle = () => {
  const navigate = useNavigate()

  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>

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