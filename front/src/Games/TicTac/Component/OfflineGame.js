import React, { useState, useEffect } from 'react';
import { checkPossibleMarker, checkWin, getCaseToWin } from '../Core/engine';
import { withRouter } from 'react-router-dom';
import _ from 'underscore';
import { connect } from 'react-redux';
import { setSelectedApp } from '../../../actions/app.actions';
import Grid from './Grid';

const OfflineGame = ({ app, ...props }) => {
    const [initialPoint] = useState({
        A1: null, A2: null, A3: null,
        B1: null, B2: null, B3: null,
        C1: null, C2: null, C3: null
    });

    const [point, setPoint] = useState({
        A1: null, A2: null, A3: null,
        B1: null, B2: null, B3: null,
        C1: null, C2: null, C3: null
    });

    const [user] = useState({
        me: 'X',
        ai: 'O'
    });

    const [endGame, setEndGame] = useState(false);

    const [player, setPlayer] = useState(null);

    const [aiPointTrigger, setAiPointTrigger] = useState(null);

    // useEffect(() => {
    //     setPlayer(getRandomPlayer());
    // }, []);

    useEffect(() => {
        changeUserRound();

        const win = checkWin(point);
        if (win) {
            setEndGame(true);
            let scoreMe = app?.selected_game?.score?.me || 0;
            let scoreAi = app?.selected_game?.score?.ai || 0;
            if (win[0] === 'me') {
                props?.dispatch(setSelectedApp({
                    payload: {
                        ...app?.selected_game,
                        score: {
                            me: scoreMe + 1,
                            ai: scoreAi
                        }
                    }
                }));
            }

            if (win[0] === 'ai') {
                props?.dispatch(setSelectedApp({
                    payload: {
                        ...app?.selected_game,
                        score: {
                            me: scoreMe,
                            ai: scoreAi + 1
                        }
                    }
                }));
            }
        };

        if (!checkPossibleMarker(point).length) {
            setEndGame(true);
        }
    }, [point]);

    useEffect(() => {
        if (player === 'ai') {
            const __point = getRandomPoint();
            if (!__point) {
                return;
            };

            if (!endGame) {
                setTimeout(() => setAiPointTrigger(__point), _.random(1000));
            }
        } else {
            setAiPointTrigger(null);
        }
    }, [player]);

    const restartGame = () => {
        setEndGame(false);
        setPoint(initialPoint);
    }

    const getRandomPlayer = () => {
        const _player = Object.entries(user);
        const randomPlayer = _.random(_player.length);

        if (_player[randomPlayer]) {
            return _player[randomPlayer].shift();
        }
    }

    const changeUserRound = () => {
        if (player === 'me') {
            setPlayer('ai');
        } else {
            setPlayer('me');
        }
    }

    const getRandomPoint = () => {
        if (player === 'ai') {
            if (checkPossibleMarker(point).length) {
                const pointRandom = _.random(checkPossibleMarker(point).length - 1);
                const possibleMarker = checkPossibleMarker(point);

                if (possibleMarker.length === 0) {
                    setEndGame(true);
                    return;
                }

                let predicted = undefined;

                if (typeof getCaseToWin(point, 'me') !== 'undefined') {
                    predicted = getCaseToWin(point, 'me')[0];
                }


                if (Object.keys(point).indexOf(predicted) !== -1) {
                    let index = 0;
                    for (let i = 0; i < Object.keys(possibleMarker).length; i++) {
                        index = i;
                        if (Object.keys(Object.values(possibleMarker)[i])[0] === Object.keys(point)[Object.keys(point).indexOf(predicted)]) {
                            return Object.keys(possibleMarker[index])[0];
                        }
                    }
                    return Object.keys(possibleMarker[pointRandom])[0];
                } else {
                    return Object.keys(possibleMarker[pointRandom])[0];
                }
            }
        }
    }

    const handleMarker = (player, point, ev, aiPlay) => {
        if (ev?.currentTarget && player === 'me' || ev?.currentTarget && aiPlay) {
            if (!ev?.currentTarget?.classList?.contains('fill')) {
                ev.currentTarget.innerHTML = `<span class="pointer">${user[player]}</span>`;
                ev.currentTarget.classList.add('fill');
                setPoint(_point => ({ ..._point, [point]: player }));
            }
        }
    }

    const handleSetCase = (payload) => {
        handleMarker(payload?.player, payload?.point, payload?.event, payload?.aiPlay);
    }

    return (<Grid onClick={handleSetCase} player={player} aiPointTrigger={aiPointTrigger} endGame={endGame} onRestart={restartGame} />)
}

const mapStateToProps = ({ app }) => ({ app });
const mapDispatchToProps = dispatch => ({ dispatch });
export default _.compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(OfflineGame);