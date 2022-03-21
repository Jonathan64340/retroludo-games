import React, { useState } from 'react';
import Configurator from './Component/Configurator';
import OfflineGame from './Component/OfflineGame';
import OnlineGame from './Component/OnlineGame';

const TicTacGame = () => {
    const [contextGame, setContextGame] = useState(null);

    const onSelected = (ctx) => {
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

export default TicTacGame;