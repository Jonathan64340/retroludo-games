import { instance as axios } from '../../axios/axios_custom';

export const createGame = (payload) => {
    return axios
        .post(`${process.env.REACT_APP_HOSTNAME}/api/v1/createGame`, { ...payload })
        .then(({ data }) => data)
        .catch(err => new Error(err));
}

export const joinGame = (id) => {
    return axios
        .get(`${process.env.REACT_APP_HOSTNAME}/api/v1/joinGame?id=${id}`)
        .then(({ data }) => data)
        .catch(err => new Error(err));
}

export const countPlayers = () => {
    return axios    
        .get(`${process.env.REACT_APP_HOSTNAME}/api/v1/countPlayers`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}