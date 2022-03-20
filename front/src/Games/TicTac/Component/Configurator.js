import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';

const Configurator = ({ app, onSelected, ...props }) => {
    const goHome = () => {
        props?.history?.push('/');
    }

    return (<div className='tictactoe-game-container-configurator'>
        <div className='tictactoe-game-container-configurator-header'>
            <img src={`${app?.base_url}/${app?.selected_game?.icon}`} alt={app?.selected_game?.title} className='tictactoe-game-container-configurator-header-picture' />
            <span>{app?.selected_game?.title}</span>
        </div>
        <div className='tictactoe-game-container-configurator-content'>
            <button className='btn' onClick={() => onSelected('AI')}>Play with computer</button>
            <button className='btn' onClick={() => onSelected('MP')}>Play with friend</button>
            <button className='btn btn-danger' onClick={() => goHome()}>Go home</button>
        </div>
    </div>)
}

const mapStateToProps = ({ app }) => ({ app });
export default _.compose(connect(mapStateToProps), withRouter)(Configurator);