import { SET_SELECTED_APP } from "../constants/app.constants"

const initialState = {
    base_url: "http://localhost:3000"
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