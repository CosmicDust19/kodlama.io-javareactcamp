import {userProps} from "../initialStates/userProps";
import {LOGIN, SIGN_OUT} from "../actions/userActions";

const initialState = {
    userProps: userProps
}

export default function userReducer(state = initialState, {type, payload}) {

    switch (type){
        case LOGIN:
            state.userProps.user = payload.user
            state.userProps.userType = payload.userType
            state.userProps.loggedIn = true
            return {...state}
        case SIGN_OUT:
            state.userProps.user = null
            state.userProps.userType = null
            state.userProps.loggedIn = false
            return {...state}
        default:
            return state

    }
}