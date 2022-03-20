import { SET_SELECTED_APP } from "../constants/app.constants";

const setSelectedApp = (payload) => ({
    type: SET_SELECTED_APP,
    ...payload
});

export { setSelectedApp };