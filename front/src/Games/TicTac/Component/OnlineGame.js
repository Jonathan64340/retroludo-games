import React, { useEffect } from 'react';
import Grid from './Grid';
import { connect } from 'react-redux';
import { socket } from '../../../utils/socket';

const OnlineGame = ({ user }) => {

    useEffect(() => {
        console.log(socket.id)
        socket.on('room-info', (data) => {
            alert('test')
            console.log('data')
        })
    }, [])

    return (<Grid onClick={() => { }} />)
}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(OnlineGame);