import React, { useContext, useEffect, useState } from 'react';
import Grid from './Grid';
import { connect } from 'react-redux';
import { SocketContext } from '../../../utils/socket';
import { checkPossibleMarker, checkWin } from '../Core/engine';
import { setSelectedApp } from '../../../actions/app.actions';
import { store } from '../../../index'

const OnlineGame = ({ app, userApp, ...props }) => {
    const socket = useContext(SocketContext);
    const [player, setPlayerInfo] = useState({ sid: socket?.id });
    const [concurrentPlayerUsername, setConcurrentPlayerUsername] = useState(null);
    const [turn, setTurn] = useState('');
    const [aiPointTrigger, setAiPointTrigger] = useState(null);
    const [roomId, setRoomId] = useState('');

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

    const [endGame, setEndGame] = useState(false);

    useEffect(() => {
        const win = checkWin(point);
        const playerInfo = Object.keys(user)?.filter(client => client != socket?.id)[0];

        if (win) {
            setEndGame(true);
            let scoreMe = app?.selected_game?.score?.me || 0;
            let scoreAi = app?.selected_game?.score?.ai || 0;
            if (win[0] === socket?.id) {
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

            if (win[0] === playerInfo) {
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

    const [user, setUser] = useState({
        [socket?.id]: 'X',
        null: 'O'
    });

    useEffect(() => {
        socket.on('room-info', (data) => {
            setPlayerInfo(data);
            if (data?.roomId) {
                setRoomId(data?.roomId);
            }
            if (data.sids.length > 1) {
                const adverseId = data?.sids?.filter(client => client != socket?.id);
                socket.emit('concurrentInfo', {concurentSocketId: adverseId, username: userApp?.username })
                setUser({
                    [socket?.id]: 'X',
                    [adverseId]: 'O'
                })
            }
        });

        socket.on('concurrentInfo', (data) => {
            setConcurrentPlayerUsername(data?.username)
        })

        socket.on('on-turn', (data) => setTurn(data?.sid))

        socket.on('on-marker', (data) => {
            if (data?.from !== socket?.id) {
                setTurn(data?.from)
                setAiPointTrigger(data?.marker)

                if (aiPointTrigger) {
                    const row = document.querySelector(`div[data-point="${aiPointTrigger}"]`);
                    row.click(e => handleSetCaseOther({ point: aiPointTrigger, player: player[0], aiPlay: true, event: { ...e } }));
                }
            }
        })

        socket.on('on-game-ready', (data) => { setTurn(data?.sid) })

        socket.on('on-game-restart', () => {
            restartGame()
        })

        socket.on('on-leave-room', () => {
            setConcurrentPlayerUsername(null)
            props.dispatch(setSelectedApp({
                payload: {
                    ...app?.selected_game,
                    score: {
                        me: 0,
                        ai: 0
                    }
                }
            }))
            restartGame();
        })
    }, [])

    const handleMarkerOtherPlayer = (turn, point, aiPlay, ev) => {
        console.log(ev?.classList)
        if (turn !== socket?.id && aiPlay) {
            if (!ev?.classList?.contains('fill')) {
                ev.innerHTML = `<span class="pointer">${user[turn]}</span>`;
                ev?.classList.add('fill');
                setPoint(_point => ({ ..._point, [point]: turn }));
                socket.emit('on-marker', { marker: point, socket: { id: turn }, roomId });
            }
        }
    }

    const handleMarker = (turn, point, aiPlay, ev) => {
        console.log(roomId)
        if (!endGame) {
            console.log(store?.getState())
            if (ev?.currentTarget && turn === socket?.id) {
                if (!ev?.currentTarget?.classList?.contains('fill')) {
                    ev.currentTarget.innerHTML = `<span class="pointer">${user[turn]}</span>`;
                    ev.currentTarget.classList.add('fill');
                    setPoint(_point => ({ ..._point, [point]: turn }));
                    socket.emit('on-marker', { marker: point, socket: { id: turn }, roomId });
                }
            }
        }
    }

    const restartGame = () => {
        const row = document.querySelectorAll(`div.tictactoe-game-grid-row-cel`);

        for (let r of row) {
            r.innerHTML = '';
            r.classList.remove('fill');
        }
        setEndGame(false);
        setPoint(initialPoint);
    }

    const handleSetCase = (payload) => {
        !endGame && handleMarker(turn, payload?.point, payload?.aiPlay, payload?.event);
    }

    const handleSetCaseOther = (payload) => {
        !endGame && handleMarkerOtherPlayer(turn, payload?.point, payload?.aiPlay, payload?.event);
    }


    return (<Grid
        onClick={handleSetCase}
        onClickPlayer={handleSetCaseOther}
        aiPointTrigger={aiPointTrigger}
        endGame={endGame}
        onRestart={restartGame}
        player={{ name: concurrentPlayerUsername }}
        roomId={roomId}
        turn={turn} />)
}

const mapStateToProps = ({ userApp, app }) => ({ userApp, app });
const mapDispatchToProps = dispatch => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(OnlineGame);