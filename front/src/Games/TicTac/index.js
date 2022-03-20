import React, { useState } from 'react';
import Configurator from './Component/Configurator';
import OfflineGame from './Component/OfflineGame';

const TicTacGame = () => {
    const [contextGame, setContextGame] = useState(null);

    const onSelected = (ctx) => {
        setContextGame(ctx);
    }

    return <div className='tictactoe-game-container'>
        {contextGame === null && <Configurator onSelected={onSelected} />}
        {contextGame === 'AI' && <OfflineGame />}
    </div>
};

export default TicTacGame;