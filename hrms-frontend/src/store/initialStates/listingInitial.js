export const listingProps = {
    jobAdverts: {
        lastSynced: new Date().getTime(),
        firstFilter: true,
        filters: {
            cityIds: [],
            positionIds: [],
            employerIds: [],
            workTimes: [],
            workModels: [],
            statuses: [],
            minSalaryLessThan: "",
            maxSalaryLessThan: "",
            minSalaryMoreThan: "",
            maxSalaryMoreThan: "",
            openPositionsMin: "",
            openPositionsMax: "",
            deadLineBefore: "",
            deadLineAfter: "",
            today: false,
            thisWeek: false
        },
        filteredJobAdverts: [],
    },
    employers: {
        lastSynced: new Date().getTime(),
        firstFilter: true,
        filters: {
            statuses: [],
            employerId: ""
        },
        filteredEmployers: [],
    }
}
