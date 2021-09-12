import {filter} from "../initialStates/filterInitial";
import {
    CHANGE_EMPLOYERS_FILTERS, CHANGE_FILTERED_EMPLOYERS,
    CHANGE_FILTERED_JOB_ADVS, CHANGE_JOB_ADVERTS_FILTERS
} from "../actions/filterActions";

const initialState = {
    filter: filter,
}

export default function filterReducer(state = initialState, {type, payload}) {

    switch (type) {
        case CHANGE_JOB_ADVERTS_FILTERS:
            return {...state, filter: {...state.filter, jobAdvertsFilters: {...payload.jobAdvertsFilters}}}
        case CHANGE_FILTERED_JOB_ADVS:
            return {...state, filter: {...state.filter, filteredJobAdverts: [...payload.filteredJobAdverts]}}
        case CHANGE_EMPLOYERS_FILTERS:
            return {...state, filter: {...state.filter, employersFilters: {...payload.employersFilters}}}
        case CHANGE_FILTERED_EMPLOYERS:
            return {...state, filter: {...state.filter, filteredEmployers: [...payload.filteredEmployers]}}
        default:
            return state
    }

}
