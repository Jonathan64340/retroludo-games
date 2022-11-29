import React, { useState } from 'react';
import Configurator from './Component/Configurator';
import OfflineGame from './Component/OfflineGame';
import OnlineGame from './Component/OnlineGame';
import { connect } from 'react-redux';
import { setSelectedApp } from '../../actions/app.actions';

const TicTacGame = ({ app, ...props}) => {
    const [contextGame, setContextGame] = useState(null);

    const onSelected = (ctx) => {
        if (ctx === 'AI' || ctx === 'MP-JOIN' || ctx === 'MP-CREATE') {
            props.dispatch(setSelectedApp({ payload: {
                in_game: true
            }}))
        }
        setContextGame(ctx);
    }

    return <div className='tictactoe-game-container'>
        {contextGame === null && <Configurator onSelected={onSelected} />}
        {contextGame === 'AI' && <OfflineGame />}
        {contextGame === 'MP' && <Configurator onSelected={onSelected} context={contextGame} />}
        {contextGame === 'MP-JOIN' && <OnlineGame />}
        {contextGame === 'MP-CREATE' && <OnlineGame />}
    </div>
};

const mapStateToProps = ({ app }) => ({ app })
const mapDispatchToProps = dispatch => ({ dispatch })
export default connect(mapStateToProps, mapDispatchToProps)(TicTacGame);