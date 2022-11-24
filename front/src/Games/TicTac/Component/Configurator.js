import React from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';
import { authenticate } from '../../../endpoints/app/auth/auth';
import { getTokenAndRefreshToken, persistTokenAndRefreshToken } from '../../../utils/persist.login';
import { createGame, joinGame } from '../../../endpoints/app/games/tictactoe';
import { socket } from '../../../utils/socket';
import { setUserApp } from '../../../actions/app.actions';

const Configurator = ({ app, user, onSelected, context, ...props }) => {
    const { search } = useLocation();
    
    const goHome = () => {
        if (context) {
            onSelected(null);
        } else {
            props.history.push('/');
        }
    }

    const enableOnline = async (mode) => {

        const create = async () => {
            socket.emit('create', { socket: { id: socket.id } })
            const onCreate = socket.on('on-create', (data) => {
                onSelected(mode);
                console.log(data)
                props.dispatch(setUserApp({ ...user, currentRoomId: data?.roomId }));
                onCreate.off();
            });
        }

        const join = async () => {
            const query = new URLSearchParams(search);
            const id = query.get('roomId');
            console.log(id)

            socket.emit('join', { roomId: 1, socket: { id: socket.id } })
            const onJoin = socket.on('on-join', (data) => {
                onSelected(mode);
                console.log(data)
                props.dispatch(setUserApp({ ...user, currentRoomId: data?.roomId }));
                onJoin.off();
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
                            <button className='btn' onClick={() => onSelected('MP')}>Play with friend</button>
                        </>
                    )
            }

            <button className='btn btn-danger' onClick={() => goHome()}>Go home</button>
        </div >
    </div >)
}

const mapStateToProps = ({ app, user }) => ({ app, user });
export default _.compose(connect(mapStateToProps), withRouter)(Configurator);