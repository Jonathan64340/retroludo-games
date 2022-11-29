import {combineReducers} from 'redux';
import { app, userApp } from './app.reducers';
export const reducers = combineReducers({ app, userApp });