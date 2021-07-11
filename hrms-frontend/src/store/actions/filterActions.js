export const CHANGE_JOB_ADVERTS_FILTERS = "CHANGE_FILTER"
export const CHANGE_FILTERED_JOBADVS = "CHANGE_FILTERED_JOBADVS"
export const FILTER_JOBADVS = "FILTER_JOBADVS"
export const CHANGE_EMPLOYERS_FILTERS = "CHANGE_EMPLOYERS_FILTERS"
export const CHANGE_FILTERED_EMPLOYERS = "CHANGE_FILTERED_EMPLOYERS"
export const FILTER_EMPLOYERS = "FILTER_EMPLOYERS"


export function changeJobAdvertsFilters(jobAdvertsFilters) {
    return {
        type: CHANGE_JOB_ADVERTS_FILTERS,
        payload: {jobAdvertsFilters: jobAdvertsFilters}
    }
}

export function changeFilteredJobAdverts(filteredJobAdverts) {
    return {
        type: CHANGE_FILTERED_JOBADVS,
        payload: {filteredJobAdverts}
    }
}

export function filterJobAdverts(jobAdverts, filters) {

    let filteredJobAdverts = [...jobAdverts]
    let temp
    if (filters.cityIds.length > 0) {
        temp = []
        filters.cityIds.forEach((cityId) => {
            let filtered = filteredJobAdverts.filter((jobAdvertisement) => jobAdvertisement.city.id === cityId)
            temp = temp.concat(filtered)
        })
        filteredJobAdverts = temp
    }
    if (filters.positionIds.length > 0) {
        temp = []
        filters.positionIds.forEach((positionId) => {
            let filtered = filteredJobAdverts.filter((jobAdvertisement) => jobAdvertisement.position.id === positionId)
            temp = temp.concat(filtered)
        })
        filteredJobAdverts = temp
    }
    if (filters.employerIds.length > 0) {
        temp = []
        filters.employerIds.forEach((employerId) => {
            let filtered = filteredJobAdverts.filter((jobAdvertisement) => jobAdvertisement.employer.id === employerId)
            temp = temp.concat(filtered)
        })
        filteredJobAdverts = temp
    }
    if (filters.workModels.length > 0) {
        temp = []
        filters.workModels.forEach((workModel) => {
            let filtered = filteredJobAdverts.filter((jobAdvertisement) => jobAdvertisement.workModel === workModel)
            temp = temp.concat(filtered)
        })
        filteredJobAdverts = temp
    }
    if (filters.workTimes.length > 0) {
        temp = []
        filters.workTimes.forEach((workTime) => {
            let filtered = filteredJobAdverts.filter((jobAdvertisement) => jobAdvertisement.workTime === workTime)
            temp = temp.concat(filtered)
        })
        filteredJobAdverts = temp
    }
    if (filters.today || filters.thisWeek) {
        if (filters.today) filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) => {
            const today = new Date()
            const creationDate = new Date(jobAdvertisement.createdAt)
            return (today.getTime() - creationDate.getTime() < 86500000) && (today.getDay() === creationDate.getDay())
        })
        else filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) => new Date().getTime() - new Date(jobAdvertisement.createdAt).getTime() < 605000000)
    }
    if (filters.minSalaryMoreThan && filters.minSalaryMoreThan !== 0)
        filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) => {
            if (!jobAdvertisement.minSalary) return false
            else return jobAdvertisement.minSalary > filters.minSalaryMoreThan
        })
    if (filters.minSalaryLessThan && filters.minSalaryLessThan !== 0)
        filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) => {
            if (!jobAdvertisement.minSalary) return false
            else return jobAdvertisement.minSalary < filters.minSalaryLessThan
        })
    if (filters.maxSalaryMoreThan && filters.maxSalaryMoreThan !== 0)
        filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) => {
            if (!jobAdvertisement.maxSalary) return false
            else return jobAdvertisement.maxSalary > filters.maxSalaryMoreThan
        })
    if (filters.maxSalaryLessThan && filters.maxSalaryLessThan !== 0)
        filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) => {
            if (!jobAdvertisement.maxSalary) return false
            else return jobAdvertisement.maxSalary < filters.maxSalaryLessThan
        })
    if (filters.applicationDeadLineBefore)
        filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
            new Date(jobAdvertisement.applicationDeadline).getTime() < new Date(filters.applicationDeadLineBefore).getTime())
    if (filters.applicationDeadLineAfter)
        filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
            new Date(jobAdvertisement.applicationDeadline).getTime() > new Date(filters.applicationDeadLineAfter).getTime())
    if (filters.pending && filters.pending.length > 0) {
        if (filters.pending === "releaseApproval") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
                jobAdvertisement.systemRejectionStatus === null && jobAdvertisement.systemVerificationStatus === false)
        }
        /*else if (jobAdvertsFilters.pending === "updateApproval") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) => {
                return jobAdvertisement.updateVerificationStatus === false
            })
        }*/
    }
    if (filters.verification && filters.verification.length > 0) {
        if (filters.verification === "verified") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
                jobAdvertisement.systemVerificationStatus === true)
        }
        else if (filters.verification === "rejected") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
                jobAdvertisement.systemRejectionStatus === true)
        }
    }
    if (filters.activation && filters.activation.length > 0)
        if (filters.activation === "active") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
                jobAdvertisement.activationStatus === true)
        }
        else if (filters.activation === "inactive") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
                jobAdvertisement.activationStatus === false)
        } else if (filters.activation === "expired") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
                new Date(jobAdvertisement.applicationDeadline).getTime() < new Date().getTime())
        }

    return {
        type: FILTER_JOBADVS,
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

export function filterEmployers(employers, filters) {

    let filteredEmployers = [...employers]
    if (filters.employerId > 0){
        const index = filteredEmployers.findIndex((employer) => employer.id === filters.employerId)
        filteredEmployers = [filteredEmployers[index]]
        return {
            type: FILTER_EMPLOYERS,
            payload: {filteredEmployers}
        }
    }
    if (filters.pending && filters.pending.length > 0) {
        if (filters.pending === "signUpApproval") {
            filteredEmployers = filteredEmployers.filter((employer) =>
                employer.systemRejectionStatus === null && employer.systemVerificationStatus === false)
        }
        /*else if (jobAdvertsFilters.pending === "updateApproval") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) => {
                return jobAdvertisement.updateVerificationStatus === false
            })
        }*/
    }
    if (filters.verification && filters.verification.length > 0) {
        if (filters.verification === "verified") {
            filteredEmployers = filteredEmployers.filter((employer) =>
                employer.systemVerificationStatus === true)
        }
        else if (filters.verification === "rejected") {
            filteredEmployers = filteredEmployers.filter((employer) =>
                employer.systemRejectionStatus === true)
        }
    }

    return {
        type: FILTER_EMPLOYERS,
        payload: {filteredEmployers}
    }
}