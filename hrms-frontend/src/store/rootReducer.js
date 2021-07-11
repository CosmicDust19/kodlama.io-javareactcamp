import {combineReducers} from "redux";
import userReducer from "./reducers/userReducer";
import filterReducer from "./reducers/filterReducer";

const rootReducer = combineReducers({
    user: userReducer,
    filter: filterReducer
})

export default rootReducer;