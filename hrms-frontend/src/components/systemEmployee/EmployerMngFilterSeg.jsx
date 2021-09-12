import {Button, Dropdown, Segment} from "semantic-ui-react";
import SDropdown from "../../utilities/customFormControls/SDropdown";
import {employerStatusOptions, getFilteredEmployers} from "../../utilities/EmployerUtils";
import {defDropdownStyle} from "../../utilities/Utils";
import React, {useState} from "react";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {changeEmployersFilters, changeFilteredEmployers} from "../../store/actions/filterActions";
import EmployerService from "../../services/employerService";

function EmployerMngFilterSeg({employers}) {

    const employerService = new EmployerService();

    const dispatch = useDispatch();

    const filters = useSelector(state => state?.filter.filter.employersFilters)

    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {statuses: filters.statuses, employerId: filters.employerId}
    });

    let key = 0
    let employerOption
    const employerCompanyNameOption = employers.map((employer) => ({
        key: key++,
        text: employer.companyName,
        value: employer.id,
    }));

    const employerEmailOption = employers.map((employer) => ({
        key: key++,
        text: employer.email,
        value: employer.id,
    }));

    const employersWebsiteOption = employers.map((employer) => ({
        key: key++,
        text: employer.website,
        value: employer.id,
    }));

    const employersPhoneOption = employers.map((employer) => ({
        key: key++,
        text: employer.phoneNumber,
        value: employer.id,
    }));

    employerOption = employerCompanyNameOption
        .concat(employersPhoneOption)
        .concat(employerEmailOption)
        .concat(employersWebsiteOption)


    const changeStatusFilter = (value) => {
        if (value.length !== 0) formik.values.employerId = 0
        formik.setFieldValue("statuses", value);
        formik.values.statuses = value
        handleFilter()
    }

    const search = (value) => {
        if (value !== 0) formik.values.statuses = []
        formik.setFieldValue("employerId", value);
        formik.values.employerId = value
        handleFilter()
    }

    const handleReset = () => {
        formik.setValues({statuses: [], employerId: 0})
        formik.values = {statuses: [], employerId: 0}
        handleFilter()
    }

    const handleFilter = () => {
        setLoading(true)
        dispatch(changeEmployersFilters(formik.values))
        employerService.getAll().then(r => {
            const filteredEmployers = getFilteredEmployers(r.data.data, formik.values)
            dispatch(changeFilteredEmployers(filteredEmployers))
        }).finally(() => setLoading(false))
    }

    return (
        <Segment basic textAlign={"center"} loading={loading}>
            <Dropdown placeholder="Search" search className="icon" selectOnBlur={false} button labeled
                      icon="search" options={employerOption} value={formik.values.employerId} basic
                      style={{borderRadius: 5, height: 38, width: 196, marginLeft: 4}}
                      onChange={(event, data) => search(data.value)}/>
            {formik.values.employerId === 0 ? null : <Button icon="x" circular onClick={() => search(0)}/>}
            <SDropdown name={"statuses"} placeholder="Statuses" options={employerStatusOptions} formik={formik}
                       onChange={(event, data) => changeStatusFilter(data.value)}
                       style={{...defDropdownStyle}}/>
            <Button icon="sync" circular onClick={handleReset} content={"Reset & Sync"} primary compact/>
        </Segment>
    )
}

export default EmployerMngFilterSeg;