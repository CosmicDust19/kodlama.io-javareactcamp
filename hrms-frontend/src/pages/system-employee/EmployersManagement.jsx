import React, {useEffect, useState} from "react";
import {
    Button, Dropdown, Grid, Header, Icon, Loader, Menu, Pagination, Segment,
    Table
} from "semantic-ui-react";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {changeEmployersFilters, changeFilteredEmployers} from "../../store/actions/filterActions"
import EmployerService from "../../services/employerService";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";
import {changePropInList, defDropdownStyle, filterEmployers, handleCatch} from "../../utilities/Utils";
import SInfoLabel from "../../utilities/customFormControls/SInfoLabel";
import SDropdown from "../../utilities/customFormControls/SDropdown";

const employerService = new EmployerService();
export default function EmployersManagement() {

    const statuses = ["Sign Up Approval", "Update Approval", "Verified", "Rejected"]

    const dispatch = useDispatch();
    const filters = useSelector(state => state?.filter.filter.employersFilters)
    const history = useHistory();
    const userProps = useSelector(state => state?.user?.userProps)

    const [filteredEmployers, setFilteredEmployers] = useState(useSelector(state => state?.filter.filter.filteredEmployers));
    const [noEmplFound, setNoEmplFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [employersPerPage, setEmployersPerPage] = useState(20);
    const [employers, setEmployers] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        const employerService = new EmployerService();
        employerService.getAll().then((result) => {
            setEmployers(result.data.data)
            if (filteredEmployers.length === 0) setFilteredEmployers(result.data.data)
        });
    }, [filteredEmployers]);

    const employersLoading = employers.length === 0;

    const indexOfLastEmployer = currentPage * employersPerPage
    const indexOfFirstEmployer = indexOfLastEmployer - employersPerPage
    const currentEmployers = filteredEmployers.slice(indexOfFirstEmployer, indexOfLastEmployer)

    let counter = 0
    let employerOption
    const employerCompanyNameOption = employers.map((employer) => ({
        key: counter++,
        text: employer.companyName,
        value: employer.id,
    }));

    const employerEmailOption = employers.map((employer) => ({
        key: counter++,
        text: employer.email,
        value: employer.id,
    }));

    const employersWebsiteOption = employers.map((employer) => ({
        key: counter++,
        text: employer.website,
        value: employer.id,
    }));

    const employersPhoneOption = employers.map((employer) => ({
        key: counter++,
        text: employer.phoneNumber,
        value: employer.id,
    }));

    employerOption = employerCompanyNameOption
        .concat(employersPhoneOption)
        .concat(employerEmailOption)
        .concat(employersWebsiteOption)

    const statusOption = statuses.map((status, index) => ({
        key: index,
        text: status,
        value: status,
    }));

    const formik = useFormik({
        initialValues: {statuses: filters.statuses, employerId: filters.employerId}
    });

    const getRowColor = (employer) => {
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

    const changeVerification = (employer, status) => {
        employerService.updateVerification(employer.id, status)
            .then(r => syncEmployer(r.data.data, status ? "Verified" : "Rejected"))
            .catch(handleCatch)
    }

    const verifyUpdate = (employer) => {
        employerService.applyChanges(employer.id)
            .then(r => syncEmployer(r.data.data, "Update verified"))
            .catch(handleCatch)
    }

    const syncEmployer = (employer, msg) => {
        const newEmployers = changePropInList(employer.id, employer, filteredEmployers)
        dispatch(changeFilteredEmployers(newEmployers))
        setEmployers(changePropInList(employer.id, employer, employers))
        setRefresh(!refresh)
        toast(msg)
    }

    const handleEmployerInfoClick = id => {
        history.push(`/employers/${id}`);
        window.scrollTo(0, 0)
    };

    const changeStatuses = (value) => {
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

    const handlePagePerEmployerMenuClick = (number) => {
        setCurrentPage(1)
        setEmployersPerPage(number)
    }

    const handlePaginationChange = (e, {activePage}) => setCurrentPage(activePage)

    const handleFilter = () => {
        dispatch(changeEmployersFilters(formik.values))
        const filteredEmployers = filterEmployers(employers, formik.values)
        dispatch(changeFilteredEmployers(filteredEmployers))
        setFilteredEmployers(filteredEmployers)
        setNoEmplFound(filteredEmployers.length === 0)
        setCurrentPage(1)
    }

    function listEmployers(currentEmployers) {
        if (noEmplFound)
            return <Header style={{marginLeft: "2em"}} as="font" className="handWriting" content={"No results found"}/>

        return (
            <Table style={{borderRadius: 0}}>
                <Table.Body>
                    {currentEmployers.map((employer) => (
                        <Table.Row style={{backgroundColor: getRowColor(employer)}} key={employer.id}>
                            <Table.Cell content={employer.companyName}/>
                            <Table.Cell content={employer.phoneNumber}/>
                            <Table.Cell content={employer.email}/>
                            <Table.Cell content={employer.website}/>
                            <Table.Cell textAlign={"center"} verticalAlign={"middle"}>
                                <SInfoLabel content={<div><Icon name="add user" color="blue"/>Sign Up Approval</div>}
                                            visible={employer.verified === false && employer.rejected === null}
                                            backgroundColor={"rgba(0,94,255,0.1)"}/>
                                <SInfoLabel content={<div><Icon name="redo alternate" color="orange"/>Update Approval</div>}
                                            visible={employer.updateVerified === false} backgroundColor={"rgba(255,113,0,0.1)"}/>
                                <SInfoLabel content={<div><Icon name="check circle outline" color="green"/>Verified</div>}
                                            visible={employer.verified === true} backgroundColor={"rgba(58,255,0,0.1)"}/>
                                <SInfoLabel content={<div><Icon name="ban" color="red"/>Rejected</div>}
                                            visible={employer.rejected === true} backgroundColor={"rgba(226,14,14,0.1)"}/>
                            </Table.Cell>
                            <Table.Cell>
                                <Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>} simple labeled fluid>
                                    <Dropdown.Menu
                                        style={{marginTop: 0, marginLeft: -6, backgroundColor: "rgba(250,250,250, 0.7)", borderRadius: 5}}>
                                        {employer.updateVerified === false ?
                                            <Dropdown.Item
                                                onClick={() => verifyUpdate(employer)}>
                                                <Icon name="redo alternate" color="orange"/>Verify Update
                                            </Dropdown.Item> : null}
                                        {employer.verified === false ?
                                            <Dropdown.Item
                                                onClick={() => changeVerification(employer, true)}>
                                                <Icon name="check circle outline" color="green"/>Verify
                                            </Dropdown.Item> :
                                            <Dropdown.Item
                                                onClick={() => changeVerification(employer, false)}>
                                                <Icon name="ban" color="red"/>Cancel Verification
                                            </Dropdown.Item>}
                                        {employer.verified === false && employer.rejected === null ?
                                            <Dropdown.Item
                                                onClick={() => changeVerification(employer, false)}>
                                                <Icon name="ban" color="red"/>Reject
                                            </Dropdown.Item> : null}
                                        <Dropdown.Item
                                            onClick={() => handleEmployerInfoClick(employer.id)}>
                                            <Icon name="info" color="yellow"/>Info
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }

    function itemsPerPageBar() {
        return (
            <Menu pointing compact color={"blue"} secondary style={{marginLeft: 0}}>
                <Menu.Item name='5' active={employersPerPage === 5} disabled={noEmplFound}
                           onClick={() => handlePagePerEmployerMenuClick(5)} content={"5"}/>
                <Menu.Item name='10' active={employersPerPage === 10} disabled={noEmplFound}
                           onClick={() => handlePagePerEmployerMenuClick(10)} content={"10"}/>
                <Menu.Item name='20' active={employersPerPage === 20} disabled={noEmplFound}
                           onClick={() => handlePagePerEmployerMenuClick(20)} content={"20"}/>
                <Menu.Item name='50' active={employersPerPage === 50} disabled={noEmplFound}
                           onClick={() => handlePagePerEmployerMenuClick(50)} content={"50"}/>
                <Menu.Item name='100' active={employersPerPage === 100} disabled={noEmplFound}
                           onClick={() => handlePagePerEmployerMenuClick(100)} content={"100"} style={{borderRadius: 0}}/>
            </Menu>
        )
    }

    function paginationBar() {
        return (
            <Pagination
                totalPages={Math.ceil(filteredEmployers.length / employersPerPage)} onPageChange={handlePaginationChange}
                activePage={currentPage} secondary pointing firstItem={null} lastItem={null} siblingRange={2} disabled={noEmplFound}
            />
        )
    }

    if (String(userProps.userType) !== "systemEmployee") return <Header content={"Nice Try !"}/>

    return (
        <div>
            <Segment basic textAlign={"center"}>
                <Dropdown placeholder="Search" search className="icon" selectOnBlur={false} loading={employersLoading} button labeled
                          icon="search" options={employerOption} value={formik.values.employerId} basic
                          style={{borderRadius: 5, height: 38, width: 196, marginLeft: 4}}
                          onChange={(event, data) => search(data.value)}/>
                {formik.values.employerId === 0 ? null : <Button icon="x" circular onClick={() => search(0)}/>}
                <SDropdown name={"statuses"} placeholder="Statuses" options={statusOption} formik={formik}
                           onChange={(event, data) => changeStatuses(data.value)}
                           style={{...defDropdownStyle}}/>
            </Segment>

            {employersLoading ?
                <Loader active inline='centered' size={"big"}/> :
                <div>
                    <Grid padded={"vertically"} textAlign={"center"}>
                        <Grid.Row>
                            {itemsPerPageBar()}
                            {paginationBar()}
                        </Grid.Row>
                    </Grid>
                    {listEmployers(currentEmployers)}
                </div>}
        </div>
    );
}