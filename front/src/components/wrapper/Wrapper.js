import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import { setSelectedApp } from '../../actions/app.actions';
import { SocketContext } from '../../utils/socket';

const Wrapper = ({ children, onChangeUsername, app, userApp, ...props }) => {
    const [username, setUsername] = useState('');
    const socket = useContext(SocketContext);

    useEffect(() => {
        const usernameFromLocalStorage = window.localStorage.getItem('username')?.substring(0, 15)

        if (usernameFromLocalStorage) {
            setUsername(usernameFromLocalStorage)
            onChangeUsername(usernameFromLocalStorage)
        }
        
    }, [])

    const handleChange = (e) => {
        setUsernameDebounce(e?.target?.value.trim()?.substring(0, 15))
    }

    const setUsernameDebounce =
        _.debounce((value) => {
            setUsername(value)
            onChangeUsername(value)
            window.localStorage.setItem('username', value)
        }, 0)

    const handleQuit = () => {
        console.log(userApp)
        props.dispatch(setSelectedApp({ payload: { in_game: false }}));
        socket.emit('leave-room', { roomId: userApp?.roomId })
        window.history.go(-1)
    }

    return <div className='wrapper' {...props}>
        <div className='information-user-container'>
            <div>
                {app?.selected_game?.in_game && username ? <button className={'btn btn-danger'} onClick={handleQuit}>Quit</button> : <input
                    type={'text'}
                    placeholder={'Set a username'}
                    value={username}
                    maxLength="15"
                    onChange={handleChange}
                    className={'input-clear'}
                />}
            </div>
        </div>
        {children}
    </div>
}

const mapDispatchToProps = dispatch => ({ dispatch })
const mapStateToProps = ({ userApp }) => ({ userApp })
export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);