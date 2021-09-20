import {combineReducers} from "redux";
import userReducer from "./reducers/userReducer";
import listingReducer from "./reducers/listingReducer";

const rootReducer = combineReducers({
    user: userReducer,
    listingReducer: listingReducer
})

export default rootReducer;