export const CHANGE_JOB_ADVERTS_FILTERS = "CHANGE_FILTER"
export const CHANGE_FILTERED_JOB_ADVS = "CHANGE_FILTERED_JOB_ADVS"
export const CHANGE_JOB_ADVERT = "CHANGE_JOB_ADVERT"
export const CHANGE_JOB_ADV_VERIFICATION = "CHANGE_JOB_ADV_VERIFICATION"
export const CHANGE_EMPLOYERS_FILTERS = "CHANGE_EMPLOYERS_FILTERS"
export const CHANGE_FILTERED_EMPLOYERS = "CHANGE_FILTERED_EMPLOYERS"
export const CHANGE_EMPLOYER = "CHANGE_EMPLOYER"

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

export function changeJobAdvert(jobAdvId, jobAdvert) {
    return {
        type: CHANGE_JOB_ADVERT,
        payload: {jobAdvId, jobAdvert}
    }
}

export function changeJobAdvVerification(jobAdvId, status) {
    return {
        type: CHANGE_JOB_ADV_VERIFICATION,
        payload: {jobAdvId, status}
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

export function changeEmployer(emplId, employer) {
    return {
        type: CHANGE_EMPLOYER,
        payload: {emplId, employer}
    }
}
