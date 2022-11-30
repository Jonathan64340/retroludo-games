import { SET_SELECTED_APP, SET_USER } from "../constants/app.constants"

const initialState = {
    base_url: process.env.REACT_APP_BASE_URL
}

export const app = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_APP:
            return {
                ...state,
                selected_game: { ...action?.payload }
            }

        default: return {
            ...state
        }
    }
}

export const userApp = (state = {}, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                ...action.payload
            }
        default: return {
            ...state
        }
    }
}