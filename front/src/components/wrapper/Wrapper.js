import React, { useContext } from 'react';
import { SocketContext } from '../../utils/socket';

const Wrapper = ({ children, ...props }) => {
    const socket = useContext(SocketContext);

    return <div className='wrapper' {...props}>
        {socket?.id && <div className='information-user-container'>
            <span>{socket?.id}</span>
        </div>}
        {children}
    </div>
}

export default Wrapper;