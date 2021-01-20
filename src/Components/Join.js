import React,{useState} from 'react'
import {Link} from "react-router-dom";

const Join = () => {
    const [room, setRoom] = useState('')
    return(
        <div className="join">
            <h1>
                Join
            </h1>
            <input value={room} type="text" onChange={e => setRoom(e.target.value)}/>
            <Link to={`/room/${room}`}>
                <button>
                    Click to Join
                </button>
            </Link>
        </div>
    )
}
export default Join