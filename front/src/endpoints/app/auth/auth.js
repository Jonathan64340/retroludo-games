import { getTokenAndRefreshToken } from '../../../utils/persist.login';
import { instance as axios } from '../../axios/axios_custom';

export const authenticate = () => {
    return axios
        .post(`${process.env.REACT_APP_HOSTNAME}/api/v1/auth/authenticate`)
        .then(({ data }) => data)
        .catch(err => new Error(err));
}

export const refreshToken = ({ token }) => {
    return axios
        .post(`${process.env.REACT_APP_HOSTNAME}/api/v1/auth/refreshToken`, { token })
        .then(({ data }) => data)
        .catch(err => new Error(err));
}