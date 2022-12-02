import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { gameList, gameRoutes } from './Games';
import { connect } from 'react-redux';
import notFoundPage from './pages/not-found/not-found.page';
import { setSelectedApp, setUserApp } from './actions/app.actions';
import Wrapper from './components/wrapper/Wrapper';
import { socket, SocketContext } from './utils/socket';
import { countPlayers } from './endpoints/app/games/tictactoe';
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(faUser);

const App = ({ app, userApp, ...props }) => {
    const [context, setContext] = useState(null);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        countPlayers()
            .then(data => setPlayers(data));

        socket.on('on-update-players', (data) => {
            setPlayers(data)
        });

        socket.on('disconnect', () => {
            alert('Your are lost connection! Go to the main menu');
            window.location.href = '/'
        })

        return () => {
            socket.off('on-update-players')
        }
    }, [])

    const DisplayGame = ({ replaceUrlBy, history }) => {

        // Hack to can push history outside a Router
        if (replaceUrlBy) {
            history?.push(context?.path);
            setContext(null);
        }

        const goTo = (payload) => {
            if (payload?.path) {
                props.dispatch(setSelectedApp({ payload: { ...payload } }));
                setContext({ ...payload });
            }
        }

        return (
            <>
                {
                    gameList.map((game, index) => (
                        <div className='card-container' key={index} onClick={() => goTo({ ...game })}>
                            <div className='icon-online-player'>
                                <FontAwesomeIcon icon={"user"} className='icon-online-player-svg' />
                                <span className='player-count'>{players[game?.code]}</span>
                            </div>
                            <img src={`${app?.base_url}/${game.icon}`} alt={game?.title} className='card-container-icon' />
                            <span className='card-container-title'>{game?.title}</span>
                        </div>
                    ))
                }
            </>
        )
    }

    const handleChangeUsername = (username) => {
        props.dispatch(setUserApp({ payload: { username } }))
    }

    return <div className='app-container'>
        <SocketContext.Provider value={socket}>
            <Wrapper onChangeUsername={handleChangeUsername} app={app}>
                <Router>
                    <Switch>
                        <Route path="/" exact render={(props) => (
                            <DisplayGame {...props} replaceUrlBy={context} />
                        )} />
                        {
                            gameRoutes.map((game, index) => (
                                <Route path={game?.path} exact={game?.exact} component={game?.component} key={index} />
                            ))
                        }
                        <Route path="*" component={notFoundPage} />
                    </Switch>
                </Router>
            </Wrapper>
        </SocketContext.Provider>
    </div>
};

const mapStateToProps = ({ app, userApp }) => ({ app, userApp });
const mapDispatchToProps = dispatch => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(App);