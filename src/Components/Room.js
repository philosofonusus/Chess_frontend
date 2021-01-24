import React, {useState, useEffect} from 'react'
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
    const [squareStyles, setSquareStyles] = useState()
    const [orientation, setOrientation] = useState(white)
    const [lastMove, setLastMove] = useState('')
    const [selectedSquare, setSelectedSquare] = useState('')
    const [gameOver, setGameOver] = useState(false)

    useEffect(() => {
        setSquareStyles({[lastMove.from]: { backgroundColor: "rgba(255, 255, 0, 0.4)" }, [lastMove.to]: { backgroundColor: "rgba(255, 255, 0, 0.4)" }, [selectedSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" }})
    }, [lastMove, selectedSquare])

    const checkForPieceColor = (piece) => {
        return piece.startsWith('w') && orientation === white && piece || piece.startsWith('b') && orientation === black && piece
    }
    const move = (sourceSquare, targetSquare) => {
        socket.emit('move', {move: {from: sourceSquare, to: targetSquare, promotion: 'q'}, idx: game_id, room})
    }
    const onSquareClick = square => {
        setSelectedSquare(square)
        if(selectedSquare && document.querySelector(`[data-squareid=${selectedSquare}]`).firstElementChild.firstElementChild?.dataset?.testid.startsWith(orientation[0])){
            move(selectedSquare, square)
            setSelectedSquare('')
        }
    }
    const onDropMove = ({ sourceSquare, targetSquare, piece }) => {
        if(sourceSquare === targetSquare) return
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
        if(last_move){
            setLastMove(last_move)
        }
        setGameStatus(status)
        if(game_status !== 'check' && game_status !== 'ok'){
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
            {game_fen && !gameOver && game_status.startsWith("check") ? <h1 className="info">Check {game_status.split(" ")[1] === "w" ? white : black}</h1> : <h1 style={{visibility: 'hidden'}}>Check</h1>}
            {game_fen && !gameOver ? <Board squareStyles={squareStyles} onSquareClick={onSquareClick} orientation={orientation} fen={game_fen} onDrop={onDropMove}/>
            : !gameOver ? <h1>Your room name is <span style={{textDecoration: 'underline'}}>{room}</span></h1> : null}
            { gameOver ? <h1>Game over {game_status} wins</h1> : null}
            { gameOver ? <Link style={{textAlign: 'center'}} to="/">Go to home page</Link> : null}
            { game_fen && !gameOver ? <button onClick={() => socket.emit('surrender', {room, orientation})}>Surrender</button> : null}
            { lastMove ? <h1>{`${lastMove.color === 'w' ? white : black} ${lastMove.from} to ${lastMove.to}`}</h1> : null}
        </div>
    )
}

export default Room