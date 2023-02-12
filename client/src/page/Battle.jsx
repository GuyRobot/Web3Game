import React, { useEffect, useState } from 'react'
import { useStateContext } from '../context'
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, ActionButton, Card, GameInfo, PlayerInfo } from '../components';
import { attack, attackSound, defense, defenseSound, player01 as player01Icon, player02 as player02Icon } from '../assets';
import styles from '../styles';

function Battle() {

    const { contract, gameState, battleGround, walletAddress, showAlert, setShowAlert } = useStateContext()
    const [player1, setPlayer1] = useState({});
    const [player2, setPlayer2] = useState({});
    const { battleName } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getPlayerInfo = async () => {
            try {
                let player1Address = null;
                let player2Address = null;

                if (gameState.activeBattle.players[0].toLowerCase() === walletAddress.toLowerCase()) {
                    player1Address = gameState.activeBattle.players[0]
                    player2Address = gameState.activeBattle.players[1]
                } else {
                    player1Address = gameState.activeBattle.players[1]
                    player2Address = gameState.activeBattle.players[0]
                }

                const p1Token = await contract.getPlayerToken(player1Address)
                const player1 = await contract.getPlayer(player1Address)
                const player2 = await contract.getPlayer(player2Address)

                const p1Att = p1Token.attackStrength.toNumber()
                const p1Def = p1Token.defenseStrength.toNumber()

                const p1Hel = player1.playerHealth.toNumber()
                const p1Ma = player1.playerMana.toNumber()

                const p2Hel = player2.playerHealth.toNumber()
                const p2Ma = player2.playerMana.toNumber()

                setPlayer1({ ...player1, att: p1Att, def: p1Def, health: p1Hel, mana: p1Ma })
                setPlayer2({ ...player2, att: 'X', def: 'X', health: p2Hel, mana: p2Ma })
            } catch (error) {
                console.log("error get player info", error);
            }
        }

        if (contract && gameState.activeBattle) getPlayerInfo()
    }, [contract, gameState, battleName])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!gameState?.activeBattle) navigate('/');
        }, [2000]);

        return () => clearTimeout(timer);
    }, []);

    const makeAMove = () => {

    }

    return (
        <div className={`${styles.flexBetween} ${styles.gameContainer} ${battleGround}`}>
            {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

            <PlayerInfo player={player2} playerIcon={player02Icon} mt />

            <div className={`${styles.flexCenter} flex-col my-10`}>
                <Card
                    card={player2}
                    title={player2?.playerName}
                    cardRef={player2Ref}
                    playerTwo
                />

                <div className="flex items-center flex-row">
                    <ActionButton
                        imgUrl={attack}
                        handleClick={() => makeAMove(1)}
                        restStyles="mr-2 hover:border-yellow-400"
                    />

                    <Card
                        card={player1}
                        title={player1?.playerName}
                        cardRef={player1Ref}
                        restStyles="mt-3"
                    />

                    <ActionButton
                        imgUrl={defense}
                        handleClick={() => makeAMove(2)}
                        restStyles="ml-6 hover:border-red-600"
                    />
                </div>
            </div>

            <PlayerInfo player={player1} playerIcon={player01Icon} />

            <GameInfo />
        </div>
    );
}

export default Battle