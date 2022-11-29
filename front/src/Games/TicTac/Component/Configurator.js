import React, { useContext, useEffect } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';
import { authenticate } from '../../../endpoints/app/auth/auth';
import { getTokenAndRefreshToken, persistTokenAndRefreshToken } from '../../../utils/persist.login';
import { SocketContext } from '../../../utils/socket';
import { setUserApp } from '../../../actions/app.actions';

const Configurator = ({ app, userApp, onSelected, context, ...props }) => {
    const { search } = useLocation();
    const socket = useContext(SocketContext);

    useEffect(() => {
        const onError = socket.on('on-join-error', ({ message }) => {
            alert(message)
        })

        const query = new URLSearchParams(search);
        const roomId = query.get('roomId');

        if (roomId) {
            join(roomId)
        }

        return () => {
            onError.off()
        }

    }, [])

    const goHome = () => {
        if (context) {
            onSelected(null);
        } else {
            props.history.push('/');
        }
    }

    const join = async (roomId) => {
        if (roomId) {
            socket.emit('join', { roomId, username: userApp?.username })
            socket.on('on-join', (data) => {
                onSelected('MP-JOIN');
                console.log(data)
                props.dispatch(setUserApp({ ...userApp, roomId }));
            });
        } else {
            socket.emit('join', { username: userApp?.username })
            socket.on('on-join', (data) => {
                onSelected('MP-JOIN');
                console.log(data)
                props.dispatch(setUserApp({ ...userApp, roomId: data.roomId }));
            });
        }
    }

    const enableOnline = async (mode) => {

        const create = async () => {
            socket.emit('create', { username: userApp?.username })
            socket.on('on-create', (data) => {
                onSelected(mode);
                props.dispatch(setUserApp({ ...userApp, roomId: data?.roomId }));
            });
        }


        if (!getTokenAndRefreshToken()['accessToken']) {
            const auth = await authenticate();

            persistTokenAndRefreshToken(auth.accessToken, auth.refreshToken);

            if (auth?.accessToken) {
                if (mode === 'MP-JOIN') await join();
                if (mode === 'MP-CREATE') await create();

                // onSelected(mode);
            }
        } else {
            if (mode === 'MP-JOIN') await join();
            if (mode === 'MP-CREATE') await create();

            // onSelected(mode);
        }
    }

    return (<div className='tictactoe-game-container-configurator'>
        <div className='tictactoe-game-container-configurator-header'>
            <img src={`${app?.base_url}/${app?.selected_game?.icon}`} alt={app?.selected_game?.title} className='tictactoe-game-container-configurator-header-picture' />
            <span>{app?.selected_game?.title}</span>
        </div>
        <div className='tictactoe-game-container-configurator-content'>
            {
                context === 'MP' ?
                    (
                        <>
                            <button className='btn' onClick={() => enableOnline('MP-JOIN')}>Join party</button>
                            <button className='btn' onClick={() => enableOnline('MP-CREATE')}>Create party</button></>
                    ) :
                    (
                        <>
                            <button className='btn' onClick={() => onSelected('AI')}>Play with computer</button>
                            <button className='btn' disabled={!userApp?.username} onClick={() => onSelected('MP')}>Play with friend</button>
                        </>
                    )
            }

            <button className='btn btn-danger' onClick={() => goHome()}>Go home</button>
        </div >
    </div >)
}

const mapStateToProps = ({ app, userApp }) => ({ app, userApp });
export default _.compose(connect(mapStateToProps), withRouter)(Configurator);