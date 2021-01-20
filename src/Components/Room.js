import React, {useState} from 'react'
import {useParams} from 'react-router-dom'
import socketClient from 'socket.io-client'
import Board from "./Board";

const socket = socketClient.io('https://chesstenacles.herokuapp.com/', {transports: ['websocket']})

const Room = () => {
    const {room} = useParams()
    const [game_fen, setGameFen] = useState(null);
    const [game_id, setGameId] = useState(0)
    const [game_status, setGameStatus] = useState('ok')
    const [orientation, setOrientation] = useState('white')
    const [gameOver, setGameOver] = useState(false)
    const onDropMove = ({ sourceSquare, targetSquare, piece }) => {
        if(piece.startsWith('w') && orientation === 'white' || piece.startsWith('b') && orientation === 'black'){
            socket.emit('move', {move: {from: sourceSquare, to: targetSquare, promotion: 'q'}, idx: game_id, room}, ({fen}) => {
                setGameFen(fen)
            })
        }
    }
    socket.on('orientation', ({orientation}) => {
        setOrientation(orientation)
    })
    socket.on('game', ({fen, id, status}) => {
        setGameFen(fen)
        setGameId(id);
        setGameStatus(status)
        if(game_status !== 'ok' && !game_status.startsWith('check')){
            setGameOver(true)
        }
    })
    socket.emit('join', {room}, ({fen, id}) => {
        setGameFen(fen)
        setGameId(id);
    })
    return(
        <div>
            {game_status.startsWith("check") ? <h1>check {game_status.split(" ")[1] === "w" ? "white" : "black"}</h1> : null}
            {game_fen && !gameOver ? <Board orientation={orientation} fen={game_fen} onDrop={onDropMove}/>
            : <h1><a href="#" onClick={() => navigator.clipboard.writeText(window.location)}>Copy link</a> and share with your friend</h1>}
            {gameOver ? <h1>Game over {game_status}</h1> : null}
        </div>
    )
}

export default Room