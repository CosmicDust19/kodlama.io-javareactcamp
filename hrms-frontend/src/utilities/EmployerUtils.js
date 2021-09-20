export const employerStatuses = ["Sign Up Approval", "Update Approval", "Verified", "Rejected"]

export const employerStatusOptions = employerStatuses.map((status, index) => ({
    key: index,
    text: status,
    value: status,
}));

export const getEmployerColor = (employer) => {
    if (employer.rejected === null && employer.verified === false)
        return "rgba(0,94,255,0.1)"
    else if (employer.rejected === true)
        return "rgba(255,0,0,0.1)"
    else if (employer.updateVerified === false)
        return "rgba(253,93,2,0.1)"
    else if (employer.verified === true)
        return "rgba(27,252,3,0.1)"
    else
        return "rgba(255,255,255,0.1)"
}

export const getFilteredEmployers = (employers, filters) => {
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