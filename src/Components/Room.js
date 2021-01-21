import React, {useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import socketClient from 'socket.io-client'
import Board from "./Board";

const socket = socketClient.io('https://chesstenacles.herokuapp.com/', {transports: ['websocket']})

const Room = () => {
    const black = "black"
    const white = "white"
    const {room} = useParams()
    const [game_fen, setGameFen] = useState(null);
    const [game_id, setGameId] = useState(0)
    const [game_status, setGameStatus] = useState('ok')
    const [orientation, setOrientation] = useState(white)
    const [lastMove, setLastMove] = useState('')
    const [gameOver, setGameOver] = useState(false)
    const checkForPieceColor = (piece) => {
        return piece.startsWith('w') && orientation === white && piece || piece.startsWith('b') && orientation === black && piece
    }
    const move = (sourceSquare, targetSquare) => {
        socket.emit('move', {move: {from: sourceSquare, to: targetSquare, promotion: 'q'}, idx: game_id, room}, ({fen}) => {
            setGameFen(fen)
        })
    }
    const onDropMove = ({ sourceSquare, targetSquare, piece }) => {
        if(checkForPieceColor(piece)){
            move(sourceSquare, targetSquare)
        }
    }
    socket.on('orientation', ({orientation}) => {
        setOrientation(orientation)
    })
    socket.on('game', ({fen, id, status, last_move}) => {
        setGameFen(fen)
        setGameId(id);
        setLastMove(last_move)
        setGameStatus(status)
        if(game_status !== 'ok' && !game_status.startsWith('check')){
            setGameOver(true)
        }
    })
    socket.on('surrender', ({status}) => {
        setGameStatus(status)
        setGameOver(true)
    })
    socket.emit('join', {room}, ({fen, id}) => {
        setGameFen(fen)
        setGameId(id);
    })
    return(
        <div className="game">
            {game_status.startsWith("check") ? <h1 className="check_info">check {game_status.split(" ")[1] === "w" ? white : black}</h1> : null}
            {game_fen && !gameOver ? <Board orientation={orientation} fen={game_fen} onDrop={onDropMove}/>
            : !gameOver ? <h1>Your room name is {room} share it with your friend</h1> : null}
            { gameOver ? <h1>Game over {game_status} wins</h1> : null}
            {gameOver ? <Link style={{textAlign: 'center'}} to="/">Go to home page</Link> : null}
            { game_fen && !gameOver ? <button onClick={() => socket.emit('surrender', {room, orientation})}>Surrender</button> : null}
            {game_fen && !gameOver && lastMove ? <h1>Last Move: {lastMove}</h1> : <h1 style={{visibility: "hidden"}}>Last Move</h1>}
        </div>
    )
}

export default Room