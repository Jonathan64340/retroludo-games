import React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const NotFound = ({ ...props }) => {

    const goBack = () => {
        props?.history?.push('/');
    }
    return (
        <div className='not-found-container'>
            <span>Not found sorry</span>
            <button className="btn btn-light" onClick={() => goBack()}><FontAwesomeIcon icon={faChevronLeft} className="animation-shake" />&nbsp;back</button>
        </div>
    )
}

export default withRouter(NotFound)