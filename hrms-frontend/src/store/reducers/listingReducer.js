import {listingProps} from "../initialStates/listingInitial";
import {
    CHANGE_EMPLOYERS_FILTERS, CHANGE_FILTERED_EMPLOYERS, CHANGE_FILTERED_JOB_ADVS, CHANGE_JOB_ADVERTS_FILTERS
} from "../actions/listingActions";

const initialState = {
    listingProps: listingProps,
}

export default function listingReducer(state = initialState, {type, payload}) {

    switch (type) {
        case CHANGE_JOB_ADVERTS_FILTERS:
            return {
                ...state,
                listingProps: {
                    ...state.listingProps,
                    jobAdverts: {
                        ...state.listingProps.jobAdverts,
                        filters: {...payload.filters}
                    }
                }
            }
        case CHANGE_FILTERED_JOB_ADVS:
            return {
                ...state,
                listingProps: {
                    ...state.listingProps,
                    jobAdverts: {
                        ...state.listingProps.jobAdverts,
                        filteredJobAdverts: [...payload.filteredJobAdverts],
                        firstFilter: payload.firstFilter === true,
                        lastSynced: payload.synced === true ? new Date().getTime() : state.listingProps.jobAdverts.lastSynced
                    }
                }
            }
        case CHANGE_EMPLOYERS_FILTERS:
            return {
                ...state,
                listingProps: {
                    ...state.listingProps,
                    employers: {
                        ...state.listingProps.employers,
                        filters: {...payload.filters}
                    }
                }
            }
        case CHANGE_FILTERED_EMPLOYERS:
            return {
                ...state,
                listingProps: {
                    ...state.listingProps,
                    employers: {
                        ...state.listingProps.employers,
                        filteredEmployers: [...payload.filteredEmployers],
                        firstFilter: payload.firstFilter === true,
                        lastSynced: payload.synced === true ? new Date().getTime() : state.listingProps.employers.lastSynced
                    }
                }
            }
        default:
            return state
    }

}
