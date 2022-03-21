import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './sass/app.scss';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducers } from './reducers/reducers';

export const store = createStore(reducers);

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));