import {filter} from "../initialStates/filterInitial";
import {
    CHANGE_EMPLOYERS_FILTERS, CHANGE_FILTERED_EMPLOYERS,
    CHANGE_FILTERED_JOBADVS,
    CHANGE_JOB_ADVERTS_FILTERS, FILTER_EMPLOYERS,
    FILTER_JOBADVS
} from "../actions/filterActions";

const initialState = {
    filter: filter,
}

export default function filterReducer(state = initialState, {type, payload}) {

    switch (type) {
        case CHANGE_JOB_ADVERTS_FILTERS:
            state.filter.jobAdvertsFilters = payload.jobAdvertsFilters
            return {...state}
        case CHANGE_FILTERED_JOBADVS:
            state.filter.filteredJobAdverts = payload.filteredJobAdverts
            return {...state}
        case FILTER_JOBADVS:
            state.filter.filteredJobAdverts = payload.filteredJobAdverts
            return {...state}
        case CHANGE_EMPLOYERS_FILTERS:
            state.filter.employersFilters = payload.employersFilters
            return {...state}
        case CHANGE_FILTERED_EMPLOYERS:
            state.filter.filteredEmployers = payload.filteredEmployers
            return {...state}
        case FILTER_EMPLOYERS:
            state.filter.filteredEmployers = payload.filteredEmployers
            return {...state}
        default:
            return state
    }
}
