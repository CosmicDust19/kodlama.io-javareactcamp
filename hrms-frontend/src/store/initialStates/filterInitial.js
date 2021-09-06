export const filter = {
    jobAdvertsFilters: {
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
        deadLineBefore: "",
        deadLineAfter: "",
        today: false,
        thisWeek: false
    },
    filteredJobAdverts: [],
    employersFilters: {
        statuses: [],
        employerId: 0
    },
    filteredEmployers: [],
}

export default filter;
