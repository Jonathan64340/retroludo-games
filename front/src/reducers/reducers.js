import {combineReducers} from 'redux';
import { app, user } from './app.reducers';
export const reducers = combineReducers({ app, user });