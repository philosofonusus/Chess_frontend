import React from 'react'
import Chessboard from "chessboardjsx";

const Board = (props) => {
    const width = window.innerWidth > 560 ? 560 : 320
    return(
        <Chessboard
            width={width}
            position={props.fen}
            orientation={props.orientation}
            onDrop={props.onDrop}
        />
    )
}

export default Board