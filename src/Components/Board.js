import React from 'react'
import Chessboard from "chessboardjsx";

const Board = (props) => {
    return(
        <Chessboard
            width={window.innerWidth < 400 ? 320 : 560}
            position={props.fen}
            orientation={props.orientation}
            onDrop={props.onDrop}
        />
    )
}

export default Board