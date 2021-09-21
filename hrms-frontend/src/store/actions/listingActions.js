export const CHANGE_JOB_ADVERTS_FILTERS = "CHANGE_FILTER"
export const CHANGE_FILTERED_JOB_ADVS = "CHANGE_FILTERED_JOB_ADVS"
export const CHANGE_EMPLOYERS_FILTERS = "CHANGE_EMPLOYERS_FILTERS"
export const CHANGE_FILTERED_EMPLOYERS = "CHANGE_FILTERED_EMPLOYERS"

export function changeJobAdvertsFilters(filters) {
    return {
        type: CHANGE_JOB_ADVERTS_FILTERS,
        payload: {filters}
    }
}

export function changeFilteredJobAdverts(filteredJobAdverts, synced, firstFilter) {
    return {
        type: CHANGE_FILTERED_JOB_ADVS,
        payload: {filteredJobAdverts, synced, firstFilter}
    }
}

export function changeEmployersFilters(filters) {
    return {
        type: CHANGE_EMPLOYERS_FILTERS,
        payload: {filters}
    }
}

export function changeFilteredEmployers(filteredEmployers, synced, firstFilter) {
    return {
        type: CHANGE_FILTERED_EMPLOYERS,
        payload: {filteredEmployers, synced, firstFilter}
    }
}
