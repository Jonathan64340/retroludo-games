import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { gameList, gameRoutes } from './Games';
import { connect } from 'react-redux';
import notFoundPage from './pages/not-found/not-found.page';
import { setSelectedApp, setUserApp } from './actions/app.actions';
import { io } from 'socket.io-client';

const App = ({ app, user, ...props }) => {
    const [context, setContext] = useState(null);

    useEffect(() => {
        props.dispatch(setUserApp({ payload: { socketIO: io('http://localhost:4000') } }))
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
                            <img src={`${app?.base_url}/${game.icon}`} alt={game?.title} className='card-container-icon' />
                            <span className='card-container-title'>{game?.title}</span>
                        </div>
                    ))
                }
            </>
        )
    }

    return <div className='app-container'>
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
    </div>
};

const mapStateToProps = ({ app, user }) => ({ app, user });
const mapDispatchToProps = dispatch => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(App);