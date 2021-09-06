import {toast} from "react-toastify";

export const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']
export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export const placeholderImageNames = ["elyse", "kristy", "lena", "lindsay", "mark", "matthew", "molly", "patrick", "rachel"]

export const defErrPopupStyle = {borderRadius: 7, color: "rgb(217,8,8)", backgroundColor: "rgba(255,255,255, 0.7)", marginTop: -1}
export const defInfoPopupStyle = {...defErrPopupStyle, color: "rgb(0,0,0)"}
export const defInputStyle = {marginTop: 10, marginBottom: 10, marginRight: 10, marginLeft: 10}
export const defDropdownStyle = {marginTop: 10, marginBottom: 10, marginRight: 10, marginLeft: 10}
export const defCheckBoxStyle = {marginTop: 10, marginBottom: 10, marginRight: 10, marginLeft: 10}

export const initialJobAdvFilters = {
    cityIds: [], positionIds: [], employerIds: [], workTimes: [], workModels: [], statuses: [],
    minSalaryLessThan: "", maxSalaryLessThan: "", minSalaryMoreThan: "", maxSalaryMoreThan: "",
    deadLineBefore: "", deadLineAfter: "", today: false, thisWeek: false
}

export const changePropInList = (propId, newProp, propList) => {
    const index = propList.findIndex(jobAdv => jobAdv.id === propId)
    propList[index] = newProp
    return propList
}

export const getValueByFieldName = (object, fieldName) => Object.values(object)[Object.keys(object).indexOf(fieldName)]

export const getRandomColor = () => colors[Math.floor(Math.random() * 12)]

export const getRandomImg = (size) => `https://semantic-ui.com/images/avatar2/${size}/${placeholderImageNames[Math.floor(Math.random() * 9)]}.png`

export const handleCatch = (error) => {
    const resp = error.response
    console.log(error)
    console.log(resp)
    if (!resp || !resp.data) {
        toast.error("An unknown error has occurred")
        return;
    }
    if (resp.data.data?.errors) {
        Object.entries(resp.data.data.errors).forEach((prop) => toast.warning(String(prop[1])))
        return;
    }
    if (resp.data.message) {
        toast.warning(resp.data.message)
    }
}

export const filterJobAdverts = (jobAdverts, filters) => {
    let filteredJobAdverts = jobAdverts

    let temp = []
    filters.cityIds.forEach(cityId =>
        temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.city.id === cityId))
    )
    if (filters.cityIds.length > 0) filteredJobAdverts = temp

    temp = []
    filters.positionIds.forEach(positionId =>
        temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.position.id === positionId))
    )
    if (filters.positionIds.length > 0) filteredJobAdverts = temp

    temp = []
    filters.employerIds.forEach(employerId =>
        temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.employer.id === employerId))
    )
    if (filters.employerIds.length > 0) filteredJobAdverts = temp

    temp = []
    filters.workModels.forEach(workModel =>
        temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.workModel === workModel))
    )
    if (filters.workModels.length > 0) filteredJobAdverts = temp

    temp = []
    filters.workTimes.forEach(
        workTime => temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.workTime === workTime))
    )
    if (filters.workTimes.length > 0) filteredJobAdverts = temp

    temp = []
    filters.statuses?.forEach(status => {
        switch (status) {
            case "Release Approval" :
                temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.rejected === null && jobAdv.verified === false))
                break;
            case "Update Approval" :
                temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.updateVerified === false))
                break;
            case "Verified" :
                temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.verified === true))
                break;
            case "Rejected" :
                temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.rejected === true))
                break;
            case "Active" :
                temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.active === true))
                break;
            case "Inactive" :
                temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.active === false))
                break;
            case "Expired" :
                temp = temp.concat(filteredJobAdverts.filter(jobAdv => new Date(jobAdv.deadline).getTime() < new Date().getTime()))
                break;
            default :
                break;
        }
    })
    if (filters.statuses?.length > 0) filteredJobAdverts = Array.from(new Set(temp))

    if (filters.today) filteredJobAdverts = filteredJobAdverts.filter(jobAdv => {
        const today = new Date()
        const creationDate = new Date(jobAdv.createdAt)
        return (today.getTime() - creationDate.getTime() < 86500000) && (today.getDay() === creationDate.getDay())
    })
    if (filters.thisWeek)
        filteredJobAdverts = filteredJobAdverts.filter(jobAdv => new Date().getTime() - new Date(jobAdv.createdAt).getTime() < 605000000)

    if (filters.minSalaryMoreThan)
        filteredJobAdverts = filteredJobAdverts.filter(jobAdv => {
            if (!jobAdv.minSalary) return false
            else return jobAdv.minSalary + 1 > filters.minSalaryMoreThan
        })
    if (filters.minSalaryLessThan)
        filteredJobAdverts = filteredJobAdverts.filter(jobAdv => {
            if (!jobAdv.minSalary) return false
            else return jobAdv.minSalary - 1 < filters.minSalaryLessThan
        })
    if (filters.maxSalaryMoreThan)
        filteredJobAdverts = filteredJobAdverts.filter(jobAdv => {
            if (!jobAdv.maxSalary) return false
            else return jobAdv.maxSalary + 1 > filters.maxSalaryMoreThan
        })
    if (filters.maxSalaryLessThan)
        filteredJobAdverts = filteredJobAdverts.filter(jobAdv => {
            if (!jobAdv.maxSalary) return false
            else return jobAdv.maxSalary - 1 < filters.maxSalaryLessThan
        })

    if (filters.deadLineBefore)
        filteredJobAdverts = filteredJobAdverts.filter(jobAdv =>
            new Date(jobAdv.deadline).getTime() < new Date(filters.deadLineBefore).getTime())
    if (filters.deadLineAfter)
        filteredJobAdverts = filteredJobAdverts.filter(jobAdv =>
            new Date(jobAdv.deadline).getTime() > new Date(filters.deadLineAfter).getTime())

    return filteredJobAdverts
}

export const filterEmployers = (employers, filters) => {
    let filteredEmployers = employers

    if (filters.employerId > 0) {
        const index = filteredEmployers.findIndex(employer => employer.id === filters.employerId)
        return index !== -1 ? [filteredEmployers[index]] : []
    }

    let temp = []
    filters.statuses.forEach(status => {
        switch (status) {
            case "Sign Up Approval" :
                temp = temp.concat(filteredEmployers.filter(employer => employer.rejected === null && employer.verified === false))
                break;
            case "Update Approval" :
                temp = temp.concat(filteredEmployers.filter(employer => employer.updateVerified === false))
                break;
            case "Verified" :
                temp = temp.concat(filteredEmployers.filter(employer => employer.verified === true))
                break;
            case "Rejected" :
                temp = temp.concat(filteredEmployers.filter(employer => employer.rejected === true))
                break;
            default :
                break;
        }
    })
    if (filters.statuses.length > 0) filteredEmployers = Array.from(new Set(temp))

    return filteredEmployers
}