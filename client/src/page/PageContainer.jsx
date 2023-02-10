import React from 'react'
import { useNavigate } from "react-router-dom";
import styles from '../styles';
import { logo, heroImg } from '../assets'
import { useStateContext } from '../context';
import { Alert } from '../components';

const PageContainer = (Component, title, description) => () => {
    const navigate = useNavigate();
    const { showAlert } = useStateContext()
    return (
        <div className={styles.hocContainer}>
            {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

            <div className={styles.hocContentBox}>
                <img src={logo} alt='logo' className={styles.hocLogo} onClick={() => navigate('/')} />
                <div className={styles.hocBodyWrapper}>
                    <div className='flex flex-row w-full'>
                        <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
                    </div>
                    <p className={`${styles.normalText} my-10`}>{description}</p>
                    <Component />
                </div>
                <p className={`${styles.footerText}`}>@Copyright 2023, Avax Gds</p>
            </div>

            <div className='flex flex-1'>
                <img src={heroImg} alt='hero' className='w-full xl:h-full object-cover' />
            </div>
        </div>
    )
}

export default PageContainer
