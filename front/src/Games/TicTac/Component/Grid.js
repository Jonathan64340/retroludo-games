import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const Grid = ({ onClick, player, aiPointTrigger, endGame, onRestart, app }) => {

    useEffect(() => {

        if (aiPointTrigger) {
            const row = document.querySelector(`div[data-point="${aiPointTrigger}"]`);
            row.click(e => onClick({ point: aiPointTrigger, player, aiPlay: true, event: { ...e } }));
        }

    }, [aiPointTrigger]);

    const restart = () => {
        const row = document.querySelectorAll(`div.tictactoe-game-grid-row-cel`);

        for (let r of row) {
            r.innerHTML = '';
            r.classList.remove('fill');
        }

        onRestart(!endGame);
    }

    return (
        <>
        <div className='score-container'>
            <div className='score-me'>
                <span>You : {app?.selected_game?.score?.me || 0}</span>
            </div>
            <div className='score-ai'>
                <span>Computer : {app?.selected_game?.score?.ai || 0}</span>
            </div>
        </div>
            <div className='tictactoe-game-grid'>
                <div className='tictactoe-game-grid-row'>
                    <div className='tictactoe-game-grid-row-cel' data-point="A1" onClick={(e) => onClick({ point: 'A1', player, event: { ...e }, ...(aiPointTrigger && { aiPlay: true }) })}></div>
                    <div className='tictactoe-game-grid-row-cel' data-point="A2" onClick={(e) => onClick({ point: 'A2', player, event: { ...e }, ...(aiPointTrigger && { aiPlay: true }) })}></div>
                    <div className='tictactoe-game-grid-row-cel' data-point="A3" onClick={(e) => onClick({ point: 'A3', player, event: { ...e }, ...(aiPointTrigger && { aiPlay: true }) })}></div>
                </div>
                <div className='tictactoe-game-grid-row'>
                    <div className='tictactoe-game-grid-row-cel' data-point="B1" onClick={(e) => onClick({ point: 'B1', player, event: { ...e }, ...(aiPointTrigger && { aiPlay: true }) })}></div>
                    <div className='tictactoe-game-grid-row-cel' data-point="B2" onClick={(e) => onClick({ point: 'B2', player, event: { ...e }, ...(aiPointTrigger && { aiPlay: true }) })}></div>
                    <div className='tictactoe-game-grid-row-cel' data-point="B3" onClick={(e) => onClick({ point: 'B3', player, event: { ...e }, ...(aiPointTrigger && { aiPlay: true }) })}></div>
                </div>
                <div className='tictactoe-game-grid-row'>
                    <div className='tictactoe-game-grid-row-cel' data-point="C1" onClick={(e) => onClick({ point: 'C1', player, event: { ...e }, ...(aiPointTrigger && { aiPlay: true }) })}></div>
                    <div className='tictactoe-game-grid-row-cel' data-point="C2" onClick={(e) => onClick({ point: 'C2', player, event: { ...e }, ...(aiPointTrigger && { aiPlay: true }) })}></div>
                    <div className='tictactoe-game-grid-row-cel' data-point="C3" onClick={(e) => onClick({ point: 'C3', player, event: { ...e }, ...(aiPointTrigger && { aiPlay: true }) })}></div>
                </div>
            </div>
            {endGame && <button className='btn btn-light restart-btn' onClick={() => restart()}>Restart</button>}
        </>
    )
}

const mapStateToProps = ({ app, user }) => ({ app, user });
export default connect(mapStateToProps)(Grid);