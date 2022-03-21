import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';
import { authenticate } from '../../../endpoints/app/auth/auth';
import { getTokenAndRefreshToken } from '../../../utils/persist.login';
import { createGame, joinGame } from '../../../endpoints/app/games/tictactoe';

const Configurator = ({ app, onSelected, context, ...props }) => {
    const goHome = () => {
        if (context) {
            onSelected(null);
        } else {
            props.history.push('/');
        }
    }

    const enableOnline = async (mode) => {

        const create = async (payload) => {
            return await createGame(payload);
        }

        const join = async (id) => {
            return await joinGame(id);
        }

        if (!getTokenAndRefreshToken()['accessToken'] && !getTokenAndRefreshToken()['refreshToken']) {
            const auth = await authenticate();

            if (auth?.accessToken) {
                if (mode === 'MP-JOIN') await join('test');
                if (mode === 'MP-CREATE') await create({});

                onSelected(mode);
            }
        } else {
            if (mode === 'MP-JOIN') await join('test');
            if (mode === 'MP-CREATE') await create({});

            onSelected(mode);
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
                            <button className='btn' onClick={() => enableOnline('AI')}>Play with computer</button>
                            <button className='btn' onClick={() => enableOnline('MP')}>Play with friend</button>
                        </>
                    )
            }

            <button className='btn btn-danger' onClick={() => goHome()}>Go home</button>
        </div >
    </div >)
}

const mapStateToProps = ({ app }) => ({ app });
export default _.compose(connect(mapStateToProps), withRouter)(Configurator);