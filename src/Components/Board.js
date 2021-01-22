import React from 'react'
import Chessboard from "chessboardjsx";

const Board = (props) => {
    const width = window.innerWidth < 400 ? window.innerWidth < 320 ? 280 : 320 : 560
    return(
        <Chessboard
            width={window}
            position={props.fen}
            orientation={props.orientation}
            onDrop={props.onDrop}
        />
    )
}

export default Board