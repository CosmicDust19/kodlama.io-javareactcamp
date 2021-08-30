import {toast} from "react-toastify";

export const errorPopupStyle = {
    borderRadius: 7, color: "rgb(217,8,8)", backgroundColor: "rgba(255,255,255, 0.7)", marginTop: -1
}

export const infoPopupStyle = {...errorPopupStyle, color: "rgb(0,0,0)"}

export const inputStyle = {marginTop: 10, marginBottom: 10, marginRight: 10, marginLeft: 10}

export const dropdownStyle = {marginTop: 10, marginBottom: 10, marginRight: 10}

export const handleCatch = (error) => {
    const resp = error.response
    console.log(error)
    console.log(resp)
    if (!resp.data) toast.error("An unknown error has occurred")
    if (resp.data.data?.errors) {
        Object.entries(resp.data.data.errors).forEach((prop) => toast.warning(String(prop[1])))
        return
    }
    if (resp.data.message) {
        toast.warning(resp.data.message)
    }
}

export const getValueByFieldName = (object, fieldName) => Object.values(object)[Object.keys(object).indexOf(fieldName)]

export const filterJobAdverts = (jobAdverts, filters) => {
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
            new Date(jobAdvertisement.deadline).getTime() < new Date(filters.applicationDeadLineBefore).getTime())
    if (filters.applicationDeadLineAfter)
        filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
            new Date(jobAdvertisement.deadline).getTime() > new Date(filters.applicationDeadLineAfter).getTime())
    if (filters.pending && filters.pending.length > 0) {
        if (filters.pending === "releaseApproval")
            filteredJobAdverts = filteredJobAdverts.filter(jobAdv => jobAdv.rejected === null && jobAdv.verified === false)
        else if (filters.pending === "updateApproval")
            filteredJobAdverts = filteredJobAdverts.filter(jobAdvertisement => jobAdvertisement.updateVerified === false)
    }
    if (filters.verification && filters.verification.length > 0) {
        if (filters.verification === "verified") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
                jobAdvertisement.verified === true)
        } else if (filters.verification === "rejected") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
                jobAdvertisement.rejected === true)
        }
    }
    if (filters.activation && filters.activation.length > 0)
        if (filters.activation === "active") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
                jobAdvertisement.active === true)
        } else if (filters.activation === "inactive") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
                jobAdvertisement.active === false)
        } else if (filters.activation === "expired") {
            filteredJobAdverts = filteredJobAdverts.filter((jobAdvertisement) =>
                new Date(jobAdvertisement.deadline).getTime() < new Date().getTime())
        }
    return filteredJobAdverts
}