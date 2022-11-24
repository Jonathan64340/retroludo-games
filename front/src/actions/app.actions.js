import { SET_SELECTED_APP, SET_USER } from "../constants/app.constants";

const setSelectedApp = (payload) => ({
    type: SET_SELECTED_APP,
    ...payload
});

const setUserApp = (payload) => ({
    type: SET_USER,
    ...payload
})

export { setSelectedApp, setUserApp };