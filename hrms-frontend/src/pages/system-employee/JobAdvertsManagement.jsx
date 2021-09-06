import React, {useEffect, useState} from "react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {Accordion, Button, Card, Checkbox, Dropdown, Grid, Header, Icon, Loader, Menu, Pagination, Segment, Table} from "semantic-ui-react";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {changeFilteredJobAdverts, changeJobAdvertsFilters} from "../../store/actions/filterActions"
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import EmployerService from "../../services/employerService";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";
import {changePropInList, defCheckBoxStyle, filterJobAdverts, handleCatch, initialJobAdvFilters} from "../../utilities/Utils";
import SDropdown from "../../utilities/customFormControls/SDropdown";
import SInfoLabel from "../../utilities/customFormControls/SInfoLabel";
import SInput from "../../utilities/customFormControls/SInput";

export default function JobAdvertsManagement() {

    const jobAdvertisementService = new JobAdvertisementService();

    const workTimes = ["Part Time", "Full Time"]
    const workModels = ["Remote", "Office", "Hybrid", "Seasonal", "Internship", "Freelance"]
    const statuses = ["Release Approval", "Update Approval", "Verified", "Rejected", "Active", "Inactive", "Expired"]

    const dispatch = useDispatch();
    const filters = useSelector(state => state?.filter.filter.jobAdvertsFilters)
    const history = useHistory();
    const userProps = useSelector(state => state?.user.userProps)
    const initialFilters = initialJobAdvFilters

    const [filteredJobAdverts, setFilteredJobAdverts] = useState(useSelector(state => state?.filter.filter.filteredJobAdverts));
    const [filterOpen, setFilterOpen] = useState(false);
    const [noAdvFound, setNoAdvFound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobAdvertsPerPage, setJobAdvertsPerPage] = useState(20);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [jobAdvertisements, setJobAdvertisements] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        const cityService = new CityService();
        const positionService = new PositionService();
        const employerService = new EmployerService();
        const jobAdvertisementService = new JobAdvertisementService();
        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        employerService.getAll().then((result) => setEmployers(result.data.data));
        jobAdvertisementService.getAll().then((result) => {
            setJobAdvertisements(result.data.data)
            if (filteredJobAdverts.length === 0) setFilteredJobAdverts(result.data.data)
        });
    }, [filteredJobAdverts]);

    const indexOfLastJobAdvert = currentPage * jobAdvertsPerPage
    const indexOfFirstJobAdvert = indexOfLastJobAdvert - jobAdvertsPerPage
    const currentJobAdverts = filteredJobAdverts.slice(indexOfFirstJobAdvert, indexOfLastJobAdvert)

    const advertsLoading = jobAdvertisements.length === 0

    const cityOption = cities.map((city, index) => ({
        key: index,
        text: city.name,
        value: city.id,
    }));

    const positionOption = positions.map((position, index) => ({
        key: index,
        text: position.title,
        value: position.id,
    }));

    const employerOption = employers.map((employer, index) => ({
        key: index,
        text: employer.companyName,
        value: employer.id,
    }));

    const workTimeOption = workTimes.map((workTime, index) => ({
        key: index,
        text: workTime,
        value: workTime,
    }));

    const workModelOption = workModels.map((workModel, index) => ({
        key: index,
        text: workModel,
        value: workModel,
    }));

    const statusOption = statuses.map((status, index) => ({
        key: index,
        text: status,
        value: status,
    }));

    const formik = useFormik({
        initialValues: {
            cityIds: filters.cityIds,
            positionIds: filters.positionIds,
            employerIds: filters.employerIds,
            workTimes: filters.workTimes,
            workModels: filters.workModels,
            statuses: filters.statuses,
            minSalaryLessThan: filters.minSalaryLessThan,
            maxSalaryLessThan: filters.maxSalaryLessThan,
            minSalaryMoreThan: filters.minSalaryMoreThan,
            maxSalaryMoreThan: filters.maxSalaryMoreThan,
            deadLineBefore: filters.deadLineBefore,
            deadLineAfter: filters.deadLineAfter,
            today: filters.today,
            thisWeek: filters.thisWeek
        }
    });

    const getRemainedDays = (jobAdvertisement) => {
        const remainedDays = Math.floor((new Date(jobAdvertisement.deadline).getTime() - new Date().getTime()) / 86400000) + 1
        if (remainedDays <= 0)
            return <font style={{color: "rgba(123,12,219,0.96)"}}>Expired</font>
        else if (remainedDays === 1)
            return <font style={{color: "rgba(239,9,36,0.96)"}}>Last&nbsp;&nbsp;1&nbsp;&nbsp;day</font>
        else if (remainedDays <= 3)
            return <font style={{color: "rgba(255,86,0,0.96)"}}>Last&nbsp;&nbsp;{remainedDays}&nbsp;&nbsp;days</font>
        return <font>Last&nbsp;&nbsp;{remainedDays}&nbsp;&nbsp;days</font>
    }

    const getRowColor = (jobAdvert) => {
        if (jobAdvert.rejected === null && jobAdvert.verified === false)
            return "rgba(30,113,253,0.1)"
        else if (jobAdvert.rejected === true)
            return "rgba(255,30,30,0.1)"
        else if (jobAdvert.updateVerified === false)
            return "rgba(255,131,30,0.1)"
        else if (Math.floor((new Date(jobAdvert.deadline).getTime() - new Date().getTime()) / 86400000) + 1 <= 0)
            return "rgba(214,30,255,0.1)"
        else if (jobAdvert.active === false)
            return "rgba(80,49,39,0.1)"
        else if (jobAdvert.verified === true)
            return "rgba(27,252,3,0.1)"
        else
            return "rgba(255,255,255,0.1)"
    }

    const changeVerification = (jobAdvert, status) =>
        jobAdvertisementService.updateVerification(jobAdvert.id, status)
            .then(r => syncJobAdvert(r.data.data, status ? "Verified" : "Rejected"))
            .catch(handleCatch)

    const verifyUpdate = (jobAdvert) =>
        jobAdvertisementService.applyChanges(jobAdvert.id)
            .then(r => syncJobAdvert(r.data.data, "Update verified"))
            .catch(handleCatch)

    const syncJobAdvert = (jobAdvert, msg) => {
        const newFilteredJobAdverts = changePropInList(jobAdvert.id, jobAdvert, filteredJobAdverts)
        dispatch(changeFilteredJobAdverts(newFilteredJobAdverts))
        setJobAdvertisements(changePropInList(jobAdvert.id, jobAdvert, jobAdvertisements))
        setRefresh(!refresh)
        toast(msg)
    }

    const handleInfoClick = id => {
        history.push(`/jobAdverts/${id}`);
        window.scrollTo(0, 20)
    };

    const changeFilter = (fieldName, value) => {
        if (fieldName === "today" && value === true) formik.setFieldValue("thisWeek", false);
        else if (fieldName === "thisWeek" && value === true) formik.setFieldValue("today", false);
        formik.setFieldValue(fieldName, value);
    }

    const handleJobAdvPerPageMenuClick = (number) => {
        if (number === jobAdvertsPerPage) return
        setCurrentPage(1)
        setJobAdvertsPerPage(number)
    }

    const handlePaginationChange = (e, {activePage}) => setCurrentPage(activePage)

    const resetFilters = () => {
        formik.setValues(initialFilters)
        formik.values = initialFilters
        handleFilter()
    }

    const handleFilter = () => {
        dispatch(changeJobAdvertsFilters(formik.values))
        const filteredJobAdverts = filterJobAdverts(jobAdvertisements, formik.values)
        dispatch(changeFilteredJobAdverts(filteredJobAdverts));
        setFilteredJobAdverts(filteredJobAdverts)
        setNoAdvFound(filteredJobAdverts.length === 0)
        setCurrentPage(1)
    }

    const applyFiltersClick = () => {
        setLoading(true)
        setTimeout(() => {
            handleFilter()
            setLoading(false)
        }, 300)
    }

    const resetFiltersClick = () => {
        setLoading(true);
        setTimeout(() => {
            resetFilters()
            setLoading(false);
        }, 300)
    }

    function filtersSegment() {
        return (
            <div>
                <Accordion>
                    <Accordion.Title onClick={() => setFilterOpen(!filterOpen)}>
                        <Card fluid raised style={{height: 35, marginBottom: -15}}>
                            <Button basic animated="vertical" fluid color={"blue"} loading={loading}
                                    disabled={advertsLoading} active>
                                <Button.Content visible><Icon name="filter"/>Filter</Button.Content>
                                <Button.Content hidden><Icon name={filterOpen ? 'angle double up' : 'angle double down'}/></Button.Content>
                            </Button>
                        </Card>
                    </Accordion.Title>
                    <Accordion.Content active={filterOpen}>
                        <Segment style={{borderRadius: 0}} disabled={advertsLoading} raised textAlign={"center"} padded>
                            <Grid padded celled={"internally"} stackable>
                                <Grid.Column width={8}>
                                    <SDropdown name={"cityIds"} placeholder="Cities" options={cityOption} formik={formik}/>
                                    <SDropdown name={"positionIds"} placeholder="Positions" options={positionOption} formik={formik}/>
                                    <SDropdown name={"employerIds"} placeholder="Employers" options={employerOption} formik={formik}/>
                                    <SDropdown name={"workModels"} placeholder="Work models" options={workModelOption} formik={formik}/>
                                    <SDropdown name={"workTimes"} placeholder="Work times" options={workTimeOption} formik={formik}/>
                                    <SDropdown name={"statuses"} placeholder="Statuses" options={statusOption} formik={formik}/>
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Header size="tiny" disabled={advertsLoading} content={"Minimum Salary"}/>
                                    <SInput name="minSalaryMoreThan" placeholder="More than" type="number" icon={"dollar sign"}
                                            formik={formik}/>
                                    <SInput name="minSalaryLessThan" placeholder="Less than" type="number" icon={"dollar sign"}
                                            formik={formik}/>
                                    <Header size="tiny" disabled={advertsLoading} content={"Maximum Salary"}/>
                                    <SInput name="maxSalaryMoreThan" placeholder="More than" type="number" icon={"dollar sign"}
                                            formik={formik}/>
                                    <SInput name="maxSalaryLessThan" placeholder="Less than" type="number" icon={"dollar sign"}
                                            formik={formik}/>
                                    <Header/>
                                    <Checkbox label='Today' checked={formik.values.today} style={defCheckBoxStyle}
                                              disabled={advertsLoading} onChange={() => changeFilter("today", !formik.values.today)}/>
                                    <Checkbox label='This Week' checked={formik.values.thisWeek} style={defCheckBoxStyle}
                                              disabled={advertsLoading} onChange={() => changeFilter("thisWeek", !formik.values.thisWeek)}/>
                                    <Header size="tiny" disabled={advertsLoading} content={"Application Deadline"}/>
                                    <font style={{fontStyle: "italic"}}>Before</font>&nbsp;&nbsp;&nbsp;
                                    <SInput name="deadLineBefore" placeholder="Before" type="date" formik={formik} style={{}}/>
                                    <Header style={{marginTop: 0}}/>
                                    <font style={{fontStyle: "italic", marginLeft: 8}}>After</font>&nbsp;&nbsp;&nbsp;
                                    <SInput name="deadLineAfter" placeholder="After" type="date" formik={formik}
                                            style={{marginBottom: 20}}/>
                                </Grid.Column>
                            </Grid>
                        </Segment>
                        <Grid stackable padded={"vertically"}>
                            <Grid.Column width="10">
                                <Button basic animated="fade" fluid color={"green"} loading={loading} style={{borderRadius: 0}}
                                        disabled={advertsLoading || loading} active onClick={applyFiltersClick}>
                                    <Button.Content visible>Apply Filters</Button.Content>
                                    <Button.Content hidden><Icon name='filter'/></Button.Content>
                                </Button>
                            </Grid.Column>
                            <Grid.Column width="6">
                                <Button animated="fade" basic fluid color={"grey"} loading={loading} style={{borderRadius: 0}}
                                        disabled={advertsLoading || loading} active onClick={resetFiltersClick}>
                                    <Button.Content visible>Reset Filters</Button.Content>
                                    <Button.Content hidden><Icon name='sync alternate'/></Button.Content>
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Accordion.Content>
                </Accordion>
            </div>
        )
    }

    function listJobAdvertisements(currentJobAdvertisements) {
        if (noAdvFound) return <Header style={{marginTop: "2em", marginLeft: "2em"}}
                                       content={<font className={"handWriting"}>No results were found</font>}/>

        return (
            <Table style={{borderRadius: 0}}>
                <Table.Body>
                    {currentJobAdvertisements.map(jobAdvert => (
                        <Table.Row style={{backgroundColor: getRowColor(jobAdvert)}} key={jobAdvert.id}>
                            <Table.Cell content={jobAdvert.employer.companyName}/>
                            <Table.Cell content={jobAdvert.position.title}/>
                            <Table.Cell content={jobAdvert.city.name}/>
                            <Table.Cell content={getRemainedDays(jobAdvert)}/>
                            <Table.Cell textAlign={"center"} verticalAlign={"middle"}>
                                <SInfoLabel content={<div><Icon name="bullhorn" color="blue"/>Release Approval</div>}
                                            visible={jobAdvert.verified === false && jobAdvert.rejected === null}
                                            backgroundColor={"rgba(0,94,255,0.1)"}/>
                                <SInfoLabel content={<div><Icon name="redo alternate" color="orange"/>Update Approval</div>}
                                            visible={jobAdvert.updateVerified === false} backgroundColor={"rgba(255,113,0,0.1)"}/>
                                <SInfoLabel content={<div><Icon name="check circle outline" color="green"/>Verified</div>}
                                            visible={jobAdvert.verified === true} backgroundColor={"rgba(58,255,0,0.1)"}/>
                                <SInfoLabel content={<div><Icon name="ban" color="red"/>Rejected</div>}
                                            visible={jobAdvert.rejected === true} backgroundColor={"rgba(226,14,14,0.1)"}/>
                                <SInfoLabel content={<div><Icon name="checkmark" color="green"/>Active</div>}
                                            visible={jobAdvert.active === true} backgroundColor={"rgba(57,255,0,0.1)"}/>
                                <SInfoLabel content={<div><Icon name="minus circle" color="brown"/>Inactive</div>}
                                            visible={jobAdvert.active === false} backgroundColor={"rgba(76,16,11,0.1)"}/>
                                <SInfoLabel content={<div><Icon name="user plus" color="blue"/>Sign Up Approval</div>}
                                            visible={jobAdvert.employer?.verified === false && jobAdvert.employer?.rejected === null}
                                            backgroundColor={"rgba(0,94,255,0.1)"}/>
                                <SInfoLabel content={<div><Icon name="ban" color="red"/> Employer Rejected</div>}
                                            visible={jobAdvert.employer?.rejected === true} backgroundColor={"rgba(226,14,14,0.1)"}/>
                            </Table.Cell>
                            <Table.Cell>
                                <Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>} simple labeled fluid>
                                    <Dropdown.Menu
                                        style={{marginTop: 0, marginLeft: -6, backgroundColor: "rgba(250,250,250, 0.85)", borderRadius: 5}}>
                                        {jobAdvert.updateVerified === false ?
                                            <Dropdown.Item
                                                onClick={() => verifyUpdate(jobAdvert)}>
                                                <Icon name="redo alternate" color="orange"/>Verify Update
                                            </Dropdown.Item> : null}
                                        {jobAdvert.verified === false ?
                                            <Dropdown.Item
                                                onClick={() => changeVerification(jobAdvert, true)}>
                                                <Icon name="check circle outline" color="green"/>Verify
                                            </Dropdown.Item> :
                                            <Dropdown.Item
                                                onClick={() => changeVerification(jobAdvert, false)}>
                                                <Icon name="ban" color="red"/>Cancel Verification
                                            </Dropdown.Item>}
                                        {jobAdvert.verified === false && jobAdvert.rejected === null ?
                                            <Dropdown.Item
                                                onClick={() => changeVerification(jobAdvert, false)}>
                                                <Icon name="ban" color="red"/>Reject
                                            </Dropdown.Item> : null}
                                        <Dropdown.Item
                                            onClick={() => handleInfoClick(jobAdvert.id)}>
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
                <Menu.Item name='5' active={jobAdvertsPerPage === 5} disabled={noAdvFound}
                           onClick={() => handleJobAdvPerPageMenuClick(5)} content={"5"}/>
                <Menu.Item name='10' active={jobAdvertsPerPage === 10} disabled={noAdvFound}
                           onClick={() => handleJobAdvPerPageMenuClick(10)} content={"10"}/>
                <Menu.Item name='20' active={jobAdvertsPerPage === 20} disabled={noAdvFound}
                           onClick={() => handleJobAdvPerPageMenuClick(20)} content={"20"}/>
                <Menu.Item name='50' active={jobAdvertsPerPage === 50} disabled={noAdvFound}
                           onClick={() => handleJobAdvPerPageMenuClick(50)} content={"50"}/>
                <Menu.Item name='100' active={jobAdvertsPerPage === 100} disabled={noAdvFound}
                           onClick={() => handleJobAdvPerPageMenuClick(100)} content={"100"} style={{borderRadius: 0}}/>
            </Menu>
        )
    }

    function paginationBar() {
        return (
            <Pagination
                totalPages={Math.ceil(filteredJobAdverts.length / jobAdvertsPerPage)} onPageChange={handlePaginationChange}
                activePage={currentPage} secondary pointing firstItem={null} lastItem={null} siblingRange={2}
                disabled={filteredJobAdverts.length === 0}
            />
        )
    }

    if (String(userProps.userType) !== "systemEmployee") return <Header content={"Nice Try !"}/>

    return (
        <div>
            {filtersSegment()}
            {advertsLoading ?
                <Loader active inline='centered' size={"big"}/> :
                <div>
                    <Grid padded={"vertically"} textAlign={"center"}>
                        <Grid.Row style={{marginTop: 20}}>
                            {itemsPerPageBar()}
                            {paginationBar()}
                        </Grid.Row>
                    </Grid>
                    {listJobAdvertisements(currentJobAdverts)}
                </div>
            }
        </div>
    );
}
