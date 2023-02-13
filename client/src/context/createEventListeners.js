import { ethers } from "ethers"
import { ABI } from "../contract"
import { playAudio, sparcle } from '../utils/animation.js';
import { defenseSound } from "../assets"

const addNewEvent = (eventFilter, provider, cb) => {
    provider.removeListener(eventFilter) // Prevent duplicate listener

    provider.on(eventFilter, (logs) => {
        const parsedLog = (new ethers.utils.Interface(ABI)).parseLog(logs)

        cb(parsedLog)
    })
}

const getCoords = (ele) => {
    const { left, top, width, height } = ele.current.getBoudingClientRect()
    return {
        pageX: left + width / 2,
        pageY: top + height / 2
    }
}

export const createEventListeners = ({ navigate, contract, provider, walletAddress, setShowAlert, setTriggerUpdateGame, player1Ref, player2Ref }) => {
    console.log("contract", contract);
    const newPlayerEventFilter = contract.filters.NewPlayer();

    addNewEvent(newPlayerEventFilter, provider, ({ args }) => {
        if (walletAddress === args.owner) {
            setShowAlert({ status: true, type: "success", message: "Player has been created" })
        }
    })

    const newBattleEventFilter = contract.filters.NewBattle();
    addNewEvent(newBattleEventFilter, provider, ({ args }) => {
        if (walletAddress.toLowerCase() === args.player1.toLowerCase()
            || walletAddress.toLowerCase() === args.player2.toLowerCase()) {
            navigate(`battle/${args.battleName}`)
        }

        setTriggerUpdateGame((prev) => prev + 1)
    })

    const newGameTokenEventFilter = contract.filters.NewGameToken()
    addNewEvent(newGameTokenEventFilter, provider, ({ args }) => {
        if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
            setShowAlert({ status: true, type: "success", message: "Player game token has been sucessfully generated" })
        }

        navigate('/create-battle')
    })

    const battleMoveEventFilter = contract.filters.BattleMove()
    addNewEvent(battleMoveEventFilter, provider, ({ args }) => {
        console.log("Battle move event", args);
    })

    const roundEndedEventFilter = contract.filters.RoundEnded()
    addNewEvent(roundEndedEventFilter, provider, ({ args }) => {
        for (let index = 0; index < args.damagedPlayers.length; index++) {
            const damagedPlayer = args.damagedPlayers[index];
            if (!damagedPlayer.startWith("0x00")) {
                if (damagedPlayer === walletAddress) {
                    sparcle(getCoords(player1Ref))
                } else {
                    sparcle(getCoords(player2Ref))
                }
            } else {
                playAudio(defenseSound)
            }
        }

        setTriggerUpdateGame((prev) => prev + 1)
    })

    const battleEndedEventFilter = contract.filters.BattleEnded();
    addNewEvent(battleEndedEventFilter, provider, ({ args }) => {
        if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
            setShowAlert({ status: true, type: 'success', message: 'You won!' });
        } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
            setShowAlert({ status: true, type: 'failure', message: 'You lost!' });
        }

        navigate('/create-battle');
    });
}