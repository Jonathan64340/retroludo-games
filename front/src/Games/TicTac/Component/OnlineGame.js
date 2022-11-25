import React, { useContext, useEffect } from 'react';
import Grid from './Grid';
import { connect } from 'react-redux';
import { SocketContext } from '../../../utils/socket';

const OnlineGame = ({ user }) => {
    const socket = useContext(SocketContext);

    useEffect(() => {

        socket.on('room-info', (data) => console.log(data.message));

        // return () => {
        //     socketEvent.off()
        // }
    }, [])


    return (<Grid onClick={() => { }} />)
}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(OnlineGame);