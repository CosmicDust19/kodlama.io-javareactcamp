export const CHANGE_JOB_ADVERTS_FILTERS = "CHANGE_FILTER"
export const CHANGE_FILTERED_JOB_ADVS = "CHANGE_FILTERED_JOB_ADVS"
export const CHANGE_EMPLOYERS_FILTERS = "CHANGE_EMPLOYERS_FILTERS"
export const CHANGE_FILTERED_EMPLOYERS = "CHANGE_FILTERED_EMPLOYERS"

export function changeJobAdvertsFilters(jobAdvertsFilters) {
    return {
        type: CHANGE_JOB_ADVERTS_FILTERS,
        payload: {jobAdvertsFilters: jobAdvertsFilters}
    }
}

export function changeFilteredJobAdverts(filteredJobAdverts) {
    return {
        type: CHANGE_FILTERED_JOB_ADVS,
        payload: {filteredJobAdverts}
    }
}

export function changeEmployersFilters(employersFilters) {
    return {
        type: CHANGE_EMPLOYERS_FILTERS,
        payload: {employersFilters}
    }
}

export function changeFilteredEmployers(filteredEmployers) {
    return {
        type: CHANGE_FILTERED_EMPLOYERS,
        payload: {filteredEmployers}
    }
}
