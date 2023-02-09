import React from 'react'
import { useNavigate } from "react-router-dom";
import styles from '../styles';
import { logo, heroImg } from '../assets'

const PageContainer = (Component, title, description) => () => {
    const navigate = useNavigate();
    return (
        <div className={styles.hocContainer}>
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
            <img src={heroImg} alt='hero' className='flex flex-1 w-full xl:h-full' />
        </div>
    )
}

export default PageContainer
