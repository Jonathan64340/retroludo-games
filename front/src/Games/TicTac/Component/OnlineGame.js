import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Grid from './Grid';

const OnlineGame = () => {
    const [socket] = useState(io('http://localhost:4000'));

    useEffect(() => {
        socket.on('test', (data) => console.log(data));

        return () => {
            socket.off('test');
        }
    }, [])

    return (<Grid onClick={() => {}}/>)
}

export default OnlineGame;