import {getRemainedDays, months} from "./Utils";

export const workTimes = ["Part Time", "Full Time"]
export const workModels = ["Remote", "Office", "Hybrid", "Seasonal", "Internship", "Freelance"]
export const jobAdvertStatuses = ["Release Approval", "Update Approval", "Verified", "Rejected", "Active", "Inactive", "Expired"]

export const workTimeOptions = workTimes.map((workTime, index) => ({
    key: index,
    text: workTime,
    value: workTime,
}));

export const workModelOptions = workModels.map((workModel, index) => ({
    key: index,
    text: workModel,
    value: workModel,
}));

export const jobAdvertStatusOptions = jobAdvertStatuses.map((status, index) => ({
    key: index,
    text: status,
    value: status,
}));

export const initialJobAdvFilters = {
    cityIds: [], positionIds: [], employerIds: [], workTimes: [], workModels: [], statuses: [],
    minSalaryLessThan: "", maxSalaryLessThan: "", minSalaryMoreThan: "", maxSalaryMoreThan: "",
    openPositionsMin: "", openPositionsMax: "", deadLineBefore: "", deadLineAfter: "",
    today: false, thisWeek: false
}

export const getJobAdvertColor = (jobAdvert, semantic) => {
    if (jobAdvert.rejected === null && jobAdvert.verified === false)
        return semantic ? "blue" : "rgba(30,113,253,0.1)"
    else if (jobAdvert.rejected === true)
        return semantic ? "red" : "rgba(255,30,30,0.1)"
    else if (jobAdvert.updateVerified === false)
        return semantic ? "orange" : "rgba(255,131,30,0.1)"
    else if (Math.floor((new Date(jobAdvert.deadline).getTime() - new Date().getTime()) / 86400000) + 1 <= 0)
        return semantic ? "purple" : "rgba(214,30,255,0.1)"
    else if (jobAdvert.active === false)
        return semantic ? "grey" : "rgba(63,63,63,0.1)"
    else if (jobAdvert.verified === true)
        return semantic ? "green" : "rgba(27,252,3,0.1)"
    else
        return semantic ? undefined : "rgba(255,255,255,0.1)"
}

export const getDeadlineInfo = (deadline) => {
    const remainedDays = getRemainedDays(deadline)
    return `
        ${new Date(deadline).getDate()} 
        ${months[new Date(deadline).getMonth()]} 
        ${new Date(deadline).getFullYear()} | 
        ${remainedDays < 0 ? `Expired (${remainedDays * -1} day${remainedDays === -1 ? "" : "s"})` : `Remained ${remainedDays} day${remainedDays === 1 ? "" : "s"}`}
        `
}

export const getSalaryInfo = (jobAdvert) => {
    if (!jobAdvert || (!jobAdvert.minSalary && !jobAdvert.maxSalary)) {
        return "No Salary Info"
    } else if (!jobAdvert.maxSalary) {
        return `More than ${jobAdvert.minSalary}$`
    } else if (!jobAdvert.minSalary) {
        return `Less than ${jobAdvert.maxSalary}$`
    }
    return `Between ${jobAdvert.minSalary} ~ ${jobAdvert.maxSalary}$`;
}

export const getFilteredJobAdverts = (jobAdverts, filters) => {
    let filteredJobAdverts = jobAdverts

    let temp = []
    filters.cityIds?.forEach(cityId =>
        temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.city.id === cityId))
    )
    if (filters.cityIds?.length > 0) filteredJobAdverts = temp

    temp = []
    filters.positionIds?.forEach(positionId =>
        temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.position.id === positionId))
    )
    if (filters.positionIds?.length > 0) filteredJobAdverts = temp

    temp = []
    filters.employerIds?.forEach(employerId =>
        temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.employer.id === employerId))
    )
    if (filters.employerIds?.length > 0) filteredJobAdverts = temp

    temp = []
    filters.workModels?.forEach(workModel =>
        temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.workModel === workModel))
    )
    if (filters.workModels?.length > 0) filteredJobAdverts = temp

    temp = []
    filters.workTimes?.forEach(
        workTime => temp = temp.concat(filteredJobAdverts.filter(jobAdv => jobAdv.workTime === workTime))
    )
    if (filters.workTimes?.length > 0) filteredJobAdverts = temp

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

    if (filters.openPositionsMin)
        filteredJobAdverts = filteredJobAdverts.filter(jobAdv => jobAdv.openPositions + 1 > filters.openPositionsMin)
    if (filters.openPositionsMax)
        filteredJobAdverts = filteredJobAdverts.filter(jobAdv => jobAdv.openPositions - 1 < filters.openPositionsMax)

    if (filters.today) filteredJobAdverts = filteredJobAdverts.filter(jobAdv => {
        const now = new Date()
        const creationDate = new Date(jobAdv.createdAt)
        return (now.getTime() - creationDate.getTime() < 86500000) && (now.getDay() === creationDate.getDay())
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
