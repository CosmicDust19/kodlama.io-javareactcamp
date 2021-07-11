export const filter = {
    jobAdvertsFilters: {
        cityIds: [],
        positionIds: [],
        employerIds: [],
        workTimes: [],
        workModels: [],
        minSalaryLessThan: "",
        maxSalaryLessThan: "",
        minSalaryMoreThan: "",
        maxSalaryMoreThan: "",
        applicationDeadLineBefore: "",
        applicationDeadLineAfter: "",
        today: false,
        thisWeek: false,
        pending: "",
        verification: "",
        activation: ""
    },
    filteredJobAdverts: [],
    employersFilters: {
        pending: "",
        verification: "",
    },
    filteredEmployers: [],
}

export default filter;
