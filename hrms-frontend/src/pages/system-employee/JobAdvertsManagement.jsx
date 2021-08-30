import React, {useEffect, useState} from "react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {
    Button, Checkbox, Dropdown, Grid, Header,
    Icon, Input, Label, Loader, Menu, Modal,
    Pagination, Segment, Table
} from "semantic-ui-react";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {
    changeFilteredJobAdverts,
    changeJobAdvert, changeJobAdvertsFilters, filterJobAdverts
} from "../../store/actions/filterActions"
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import EmployerService from "../../services/employerService";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";
import filter from "../../store/initialStates/filterInitial";
import {handleCatch, inputStyle} from "../../utilities/Utils";
import SDropdown from "../../utilities/customFormControls/SDropdown";

const jobAdvertisementService = new JobAdvertisementService();

export default function JobAdvertsManagement() {

    const dispatch = useDispatch();
    const filters = useSelector(state => state?.filter.filter.jobAdvertsFilters)
    const history = useHistory();
    const userProps = useSelector(state => state?.user.userProps)
    const initialFilters = {...filter.jobAdvertsFilters, pending: undefined, verification: undefined, activation: undefined}

    const [filteredJobAdverts, setFilteredJobAdverts] = useState(useSelector(state => state?.filter.filter.filteredJobAdverts));
    const [noAdvFound, setNoAdvFound] = useState(false);
    const [infoPopUpOpen, setInfoPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobAdvertisementsPerPage, setJobAdvertisementsPerPage] = useState(20);
    const [cities, setCities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [workTimes] = useState(["Part Time", "Full Time"]);
    const [workModels] = useState(["Remote", "Office", "Hybrid", "Seasonal", "Internship", "Freelance"]);
    const [jobAdvertisements, setJobAdvertisements] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        const cityService = new CityService();
        const positionService = new PositionService();
        const employerService = new EmployerService();
        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        employerService.getAll().then((result) => setEmployers(result.data.data));
        jobAdvertisementService.getAll().then((result) => {
            setJobAdvertisements(result.data.data)
            if (filteredJobAdverts.length === 0) setFilteredJobAdverts(result.data.data)
        });
    }, [filteredJobAdverts.length]);

    const indexOfLastJobAdvertisement = currentPage * jobAdvertisementsPerPage
    const indexOfFirstJobAdvertisement = indexOfLastJobAdvertisement - jobAdvertisementsPerPage
    const currentJobAdvertisements = filteredJobAdverts.slice(indexOfFirstJobAdvertisement, indexOfLastJobAdvertisement)

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
    }))

    const workModelOption = workModels.map((workModel, index) => ({
        key: index,
        text: workModel,
        value: workModel,
    }))

    const formik = useFormik({
        initialValues: {
            cityIds: filters.cityIds,
            positionIds: filters.positionIds,
            employerIds: filters.employerIds,
            workTimes: filters.workTimes,
            workModels: filters.workModels,
            minSalaryLessThan: filters.minSalaryLessThan,
            maxSalaryLessThan: filters.maxSalaryLessThan,
            minSalaryMoreThan: filters.minSalaryMoreThan,
            maxSalaryMoreThan: filters.maxSalaryMoreThan,
            applicationDeadLineBefore: filters.applicationDeadLineBefore,
            applicationDeadLineAfter: filters.applicationDeadLineAfter,
            today: filters.today,
            thisWeek: filters.thisWeek,
            pending: filters.pending,
            verification: filters.verification,
            activation: filters.activation,
        }
    });

    const refreshComp = () => setRefresh(!refresh);

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

    const getRowColor = (jobAdvertisement) => {
        if ((jobAdvertisement.rejected === null && jobAdvertisement.verified === false)) return "rgba(0,94,255,0.07)"
        else if (jobAdvertisement.rejected) return "rgba(255,0,0,0.07)"
        else if (jobAdvertisement.updateVerified === false) return "rgba(253,110,2,0.1)"
        else if (Math.floor((new Date(jobAdvertisement.deadline).getTime() - new Date().getTime()) / 86400000) + 1 <= 0) return "rgba(200,0,255,0.05)"
        else if (!jobAdvertisement.active) return "rgba(80,49,39,0.07)"
        else if (jobAdvertisement.verified) return "rgba(27,252,3,0.05)"
        else return "rgba(255,255,255,0.1)"
    }

    const changeVerification = (jobAdvert, status) => {
        jobAdvertisementService.updateVerification(jobAdvert.id, status).then(r => {
            dispatch(changeJobAdvert(jobAdvert.id, r.data.data))
            toast("Successful")
            refreshComp()
        }).catch(handleCatch)
    }

    const verifyUpdate = (jobAdvert) => {
        jobAdvertisementService.applyChanges(jobAdvert.id).then(r => {
            dispatch(changeJobAdvert(jobAdvert.id, r.data.data))
            toast("Successful")
            refreshComp()
        }).catch(handleCatch)
    }

    const handleAdvertisementInfoClick = id => {
        history.push(`/jobAdverts/${id}`);
        window.scrollTo(0, 0)
    };

    const handleChangeFilter = (fieldName, value) => {
        if (fieldName === "today" && value === true) formik.setFieldValue("thisWeek", false);
        else if (fieldName === "thisWeek" && value === true) formik.setFieldValue("today", false);
        formik.setFieldValue(fieldName, value);
    }

    const handlePagePerJobAdvMenuClick = (number) => {
        setCurrentPage(1)
        setJobAdvertisementsPerPage(number)
    }

    const handleMenuClick = (activeItem, menuName) => {
        if (activeItem === formik.values.pending) {
            formik.values.pending = ""
            handleChangeFilter(menuName, "")
        } else {
            formik.values.pending = activeItem
            handleChangeFilter(menuName, activeItem)
        }
        dispatch(changeJobAdvertsFilters(formik.values))
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

    function infoPopUp() {
        return (
            <Modal basic onClose={() => setInfoPopUpOpen(false)} onOpen={() => setInfoPopUpOpen(true)}
                   open={infoPopUpOpen} size='small'>

                <Segment placeholder inverted style={{backgroundColor: "rgba(10,10,10,0.5)", borderRadius: 20}}>
                    <Grid padded>
                        <Grid.Row>
                            <Header size={"small"} style={{color: "rgba(185,108,253,0.61)", marginTop: -3}}>
                                <Header.Content>
                                    <Icon name="wait"/> Pending
                                </Header.Content>
                            </Header>&nbsp;:&nbsp;Pending you to
                            &nbsp;<font color="green">verify</font>&nbsp;or
                            &nbsp;<font color="red">reject</font>&nbsp;
                        </Grid.Row>
                        <Grid.Row>
                            <Header size={"small"} style={{color: "rgba(250,212,98,0.73)", marginTop: -3}}>
                                <Header.Content>
                                    <Icon name="check circle outline"/> Verification
                                </Header.Content>
                            </Header>&nbsp;:
                            &nbsp;<font color="green">Verification</font>&nbsp;and
                            &nbsp;<font color="red">rejection</font>&nbsp;status
                        </Grid.Row>
                        <Grid.Row>
                            <Header size={"small"} style={{color: "rgba(252,108,141,0.66)", marginTop: -3}}>
                                <Header.Content>
                                    <Icon name="checkmark"/> Activation
                                </Header.Content>
                            </Header>&nbsp;:&nbsp;Employer has
                            &nbsp;<font color="green">activated</font>&nbsp;-
                            &nbsp;<font color="#8b4513">deactivated</font>&nbsp;or the advertisement has
                            &nbsp;<font color="purple">expired</font>&nbsp;
                        </Grid.Row>
                        <Grid.Row>
                            <Header style={{marginTop: -7}}>
                                <Button basic animated="fade" size="mini" color={"green"} style={{borderRadius: 10}}>
                                    <Button.Content visible>Apply</Button.Content>
                                    <Button.Content hidden><Icon name='filter'
                                                                 style={{marginLeft: 10}}/></Button.Content>
                                </Button>
                            </Header>&nbsp;:&nbsp;Executes the filters<Icon name='filter'/> and syncs job adverts with
                            the database<Icon name='database'/>
                        </Grid.Row>
                        <Grid.Row>
                            <Header style={{marginTop: -7}}>
                                <Button animated="fade" basic size="mini" color="grey" style={{borderRadius: 10}}>
                                    <Button.Content visible>Reset Filters</Button.Content>
                                    <Button.Content hidden><Icon name='sync alternate'
                                                                 style={{marginLeft: 10}}/></Button.Content>
                                </Button>
                            </Header>&nbsp;:&nbsp;Resets<Icon name='sync alternate'/> the filters
                        </Grid.Row>
                        <Grid.Row>
                            <Header size={"small"} style={{color: "rgba(252,0,0,0.87)", marginTop: -3}}>
                                <Header.Content>Tip</Header.Content>
                            </Header>&nbsp;:&nbsp;If you have a problem, you can refresh the page and click the
                            &nbsp;<font color="grey">reset</font>&nbsp;or
                            &nbsp;<font color="green">apply</font>&nbsp;button
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Modal>
        )
    }

    function filtersSegment() {
        return (
            <div>
                <Segment style={{borderRadius: 20}} disabled={advertsLoading} raised vertical textAlign={"center"}>
                    <Label attached={"top right"} style={{marginTop: 5, marginRight: 5}} color="blue" circular
                           onClick={() => setInfoPopUpOpen(true)}>
                        <Icon name="help" style={{marginRight: 0}}/>
                    </Label>
                    <Grid stackable padded={"horizontally"}>
                        <Grid.Column width="6">

                            <Segment basic>
                                <Header size={"small"} textAlign={"center"} style={{color: "rgba(20,23,182,0.63)"}}
                                        content={<div><Icon name="wait"/> Pending</div>}/>
                                <Menu secondary stackable style={{borderRadius: 10}}>
                                    <Menu.Item
                                        active={filters.pending === "releaseApproval"} color={"blue"} style={{borderRadius: 10}}
                                        onClick={() => handleMenuClick("releaseApproval", "pending")}>
                                        <Icon name="bullhorn"/>Release Approval
                                    </Menu.Item>
                                    <Menu.Item
                                        active={filters.pending === "updateApproval"} color={"orange"}
                                        style={{borderRadius: 10}}
                                        onClick={() => handleMenuClick("updateApproval", "pending")}>
                                        <Icon name="redo alternate"/>Update Approval
                                    </Menu.Item>
                                </Menu>
                            </Segment>

                            <Segment basic>
                                <Header size={"small"} textAlign={"center"} style={{color: "rgba(250,180,2,0.73)"}}
                                        content={<div><Icon name="check circle outline"/> Verification</div>}/>
                                <Menu secondary stackable style={{borderRadius: 10}}>
                                    <Menu.Item
                                        active={filters.verification === "verified"} color={"green"} style={{borderRadius: 10}}
                                        onClick={() => handleMenuClick("verified", "verification")}>
                                        <Icon name="check circle outline"/>Verified
                                    </Menu.Item>
                                    <Menu.Item
                                        active={filters.verification === "rejected"} color={"red"} style={{borderRadius: 10}}
                                        onClick={() => handleMenuClick("rejected", "verification")}>
                                        <Icon name="ban"/>Rejected
                                    </Menu.Item>
                                </Menu>
                            </Segment>

                            <Segment basic>
                                <Header size={"small"} textAlign={"center"} style={{color: "rgba(250,2,52,0.66)"}}
                                        content={<div><Icon name="checkmark"/> Activation</div>}/>
                                <Menu secondary stackable style={{borderRadius: 10}}>
                                    <Menu.Item
                                        active={formik.values.activation === "active"} color={"green"} style={{borderRadius: 10}}
                                        onClick={() => handleMenuClick("active", "activation")}>
                                        <Icon name="checkmark"/>Active
                                    </Menu.Item>
                                    <Menu.Item
                                        active={formik.values.activation === "inactive"} color="brown" style={{borderRadius: 10}}
                                        onClick={() => handleMenuClick("inactive", "activation")}>
                                        <Icon name="minus circle"/>Inactive
                                    </Menu.Item>
                                    <Menu.Item
                                        active={formik.values.activation === "expired"} color="purple" style={{borderRadius: 10}}
                                        onClick={() => handleMenuClick("expired", "activation")}>
                                        <Icon name="calendar times"/>Expired
                                    </Menu.Item>
                                </Menu>
                            </Segment>

                        </Grid.Column>
                        <Grid.Column width="10">
                            <SDropdown name={"cityIds"} placeholder="Cities" multiple options={cityOption} formik={formik}/>
                            <SDropdown name={"positionIds"} placeholder="Positions" multiple options={positionOption} formik={formik}/>
                            <SDropdown name={"employerIds"} placeholder="Employers" multiple options={employerOption} formik={formik}/>
                            <SDropdown name={"workModels"} placeholder="Work models" multiple options={workModelOption} formik={formik}/>
                            <SDropdown name={"workTimes"} placeholder="Work times" multiple options={workTimeOption} formik={formik}/>

                            <Grid columns="equal" style={{marginTop: 10}} stackable>
                                <Grid.Column>
                                    <Segment basic>
                                        <Header size="tiny" disabled={advertsLoading}>
                                            Minimum Salary
                                        </Header>
                                        <Input placeholder="More than" value={formik.values.minSalaryMoreThan}
                                               loading={advertsLoading}
                                               name="minSalaryMoreThan" type="number" style={{borderRadius: 10}}
                                               onChange={formik.handleChange} icon={"money bill alternate"}/>
                                        <Input placeholder="Less than" value={formik.values.minSalaryLessThan}
                                               loading={advertsLoading}
                                               name="minSalaryLessThan" type="number"
                                               style={{marginTop: 10, borderRadius: 10}}
                                               onChange={formik.handleChange} icon={"money bill alternate"}/>
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment basic>
                                        <Header size="tiny" disabled={advertsLoading}>
                                            Maximum Salary
                                        </Header>
                                        <Input placeholder="More than" value={formik.values.maxSalaryMoreThan}
                                               loading={advertsLoading}
                                               name="maxSalaryMoreThan" type="number" style={{borderRadius: 10}}
                                               onChange={formik.handleChange} icon={"money bill alternate"}/>
                                        <Input placeholder="Less than" value={formik.values.maxSalaryLessThan}
                                               loading={advertsLoading}
                                               name="maxSalaryLessThan" type="number"
                                               style={{marginTop: 10, borderRadius: 10}}
                                               onChange={formik.handleChange} icon={"money bill alternate"}/>
                                    </Segment>
                                </Grid.Column>
                            </Grid>

                            <Grid columns="equal" style={{marginTop: -20}} stackable>
                                <Grid.Column>
                                    <Checkbox label='Today' checked={formik.values.today} style={inputStyle}
                                              disabled={advertsLoading} onChange={() => {
                                        handleChangeFilter("today", !formik.values.today)
                                    }}/>
                                    <Checkbox label='This Week' checked={formik.values.thisWeek} style={inputStyle}
                                              disabled={advertsLoading} onChange={() => {
                                        handleChangeFilter("thisWeek", !formik.values.thisWeek)
                                    }}/>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment basic>
                                        <Header size="tiny" disabled={advertsLoading} content={"Application Deadline"}/>
                                        <font style={{fontStyle: "italic"}}>Before</font>&nbsp;&nbsp;&nbsp;
                                        <Input placeholder="Before" value={formik.values.applicationDeadLineBefore}
                                               loading={advertsLoading}
                                               name="applicationDeadLineBefore" type="date"
                                               onChange={formik.handleChange}/>
                                        <Header style={{marginTop: 0}}/>
                                        <font
                                            style={{fontStyle: "italic", marginLeft: 8}}>After</font>&nbsp;&nbsp;&nbsp;
                                        <Input placeholder="After" value={formik.values.applicationDeadLineAfter}
                                               loading={advertsLoading}
                                               name="applicationDeadLineAfter" type="date"
                                               style={{marginTop: -4, marginBottom: 15}}
                                               onChange={formik.handleChange}/>
                                    </Segment>
                                </Grid.Column>
                            </Grid>

                        </Grid.Column>
                    </Grid>
                </Segment>
                <Grid padded stackable>
                    <Grid.Column width="10">
                        <Button basic animated="fade" fluid color={"green"} style={{borderRadius: 10}} loading={loading}
                                disabled={advertsLoading || loading} active onClick={() => {
                            setLoading(true)
                            setTimeout(() => {
                                handleFilter()
                                setLoading(false)
                            }, 500)
                        }}>
                            <Button.Content visible>Apply</Button.Content>
                            <Button.Content hidden><Icon name='filter'/></Button.Content>
                        </Button>
                    </Grid.Column>
                    <Grid.Column width="6">
                        <Button animated="fade" basic fluid color={"grey"} style={{borderRadius: 10}} loading={loading}
                                disabled={advertsLoading || loading} active onClick={() => {
                            setLoading(true)
                            setTimeout(() => {
                                resetFilters()
                                setLoading(false)
                            }, 500)
                        }}>
                            <Button.Content visible>Reset Filters</Button.Content>
                            <Button.Content hidden><Icon name='sync alternate'/></Button.Content>
                        </Button>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }

    function listJobAdvertisements(currentJobAdvertisements) {
        if (noAdvFound) return <Header style={{marginTop: "2em", marginLeft: "2em"}}
                                       content={<font class={"handWriting"}>No results were found</font>}/>


        return (
            <Table>
                <Table.Body>
                    {currentJobAdvertisements.map((jobAdvertisement) => (
                        <Table.Row style={{backgroundColor: getRowColor(jobAdvertisement)}} key={jobAdvertisement.id}>
                            <Table.Cell content={jobAdvertisement.employer.companyName}/>
                            <Table.Cell content={jobAdvertisement.position.title}/>
                            <Table.Cell content={jobAdvertisement.city.name}/>
                            <Table.Cell content={getRemainedDays(jobAdvertisement)}/>
                            <Table.Cell textAlign={"center"} verticalAlign={"middle"}>
                                {jobAdvertisement.verified === false && jobAdvertisement.rejected === null ?
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(0,94,255,0.1)"}}>
                                        <Icon name="bullhorn" color="blue"/>Release Approval
                                    </Label> : null}
                                {jobAdvertisement.updateVerified === false ?
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(255,113,0,0.1)"}}>
                                        <Icon name="redo alternate" color="orange"/>Update Approval
                                    </Label> : null}
                                {jobAdvertisement.verified === true ?
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(58,255,0,0.1)"}}>
                                        <Icon name="check circle outline" color="green"/>Verified
                                    </Label> : null}
                                {jobAdvertisement.rejected === true ?
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(226,14,14,0.1)"}}>
                                        <Icon name="ban" color="red"/>Rejected
                                    </Label> : null}
                                {jobAdvertisement.active === true ?
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(57,255,0,0.1)"}}>
                                        <Icon name="checkmark" color="green"/>Active
                                    </Label> :
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(76,16,11,0.1)"}}>
                                        <Icon name="minus circle" color="brown"/>Inactive
                                    </Label>}
                                {jobAdvertisement.employer?.verified === false && jobAdvertisement.employer?.rejected === null ?
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(0,94,255,0.1)"}}>
                                        <Icon name="user plus" color="blue"/>Sign Up Approval
                                    </Label> : null}
                                {jobAdvertisement.employer?.rejected === true ?
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(226,14,14,0.1)"}}>
                                        <Icon name="ban" color="red"/> Employer Rejected
                                    </Label> : null}
                            </Table.Cell>
                            <Table.Cell>
                                <Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>}
                                          simple labeled>
                                    <Dropdown.Menu
                                        style={{
                                            marginTop: 0,
                                            marginLeft: -6,
                                            backgroundColor: "rgba(250,250,250, 0.7)",
                                            borderRadius: 10
                                        }}>
                                        {jobAdvertisement.updateVerified === false ?
                                            <Dropdown.Item
                                                onClick={() => {
                                                    verifyUpdate(jobAdvertisement)
                                                }}>
                                                <Icon name="redo alternate" color="orange"/>Verify Update
                                            </Dropdown.Item> : null}
                                        {jobAdvertisement.verified === false ?
                                            <Dropdown.Item
                                                onClick={() => changeVerification(jobAdvertisement, true)}>
                                                <Icon name="check circle outline" color="green"/>Verify
                                            </Dropdown.Item> :
                                            <Dropdown.Item
                                                onClick={() => changeVerification(jobAdvertisement, false)}>
                                                <Icon name="ban" color="red"/>Cancel Verification
                                            </Dropdown.Item>}
                                        {jobAdvertisement.verified === false && jobAdvertisement.rejected === null ?
                                            <Dropdown.Item
                                                onClick={() => changeVerification(jobAdvertisement, false)}>
                                                <Icon name="ban" color="red"/>Reject
                                            </Dropdown.Item> : null}
                                        <Dropdown.Item
                                            onClick={() => handleAdvertisementInfoClick(jobAdvertisement.id)}>
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
            <div>
                <Menu secondary icon={"labeled"} vertical pagination
                      style={{marginRight: "3em", marginTop: "16em"}} fixed={"right"}>
                    <Menu.Item name='5' active={jobAdvertisementsPerPage === 5}
                               disabled={filteredJobAdverts.length === 0 || jobAdvertisements.length === 0}
                               onClick={() => handlePagePerJobAdvMenuClick(5)}>5</Menu.Item>
                    <Menu.Item name='10' active={jobAdvertisementsPerPage === 10}
                               disabled={filteredJobAdverts.length === 0 || jobAdvertisements.length === 0}
                               onClick={() => handlePagePerJobAdvMenuClick(10)}>10</Menu.Item>
                    <Menu.Item name='20' active={jobAdvertisementsPerPage === 20}
                               disabled={filteredJobAdverts.length === 0 || jobAdvertisements.length === 0}
                               onClick={() => handlePagePerJobAdvMenuClick(20)}>20</Menu.Item>
                    <Menu.Item name='50' active={jobAdvertisementsPerPage === 50}
                               disabled={filteredJobAdverts.length === 0 || jobAdvertisements.length === 0}
                               onClick={() => handlePagePerJobAdvMenuClick(50)}>50</Menu.Item>
                    <Menu.Item name='100' active={jobAdvertisementsPerPage === 100}
                               disabled={filteredJobAdverts.length === 0 || jobAdvertisements.length === 0}
                               onClick={() => handlePagePerJobAdvMenuClick(100)}>100</Menu.Item>
                    <Menu.Item>
                        <Button animated="vertical" fluid color={"violet"} size="small"
                                style={{borderRadius: 10}}
                                onClick={() => window.scrollTo(0, 55)}>
                            <Button.Content visible>
                                <Icon name='arrow up' style={{marginRight: -5, marginLeft: -5}}/>
                            </Button.Content>
                            <Button.Content hidden>
                                <Icon name='arrow up' style={{marginRight: -5, marginLeft: -5}}/>
                            </Button.Content>
                        </Button>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }

    function paginationBar() {
        return (
            <Pagination
                totalPages={Math.ceil(filteredJobAdverts.length / jobAdvertisementsPerPage)} onPageChange={handlePaginationChange}
                activePage={currentPage} secondary pointing firstItem={null} lastItem={null} siblingRange={2}
                disabled={filteredJobAdverts.length === 0 || jobAdvertisements.length === 0}
            />
        )
    }

    if (String(userProps.userType) !== "systemEmployee") return <Header content={"Nice Try !"}/>

    return (
        <div>
            {infoPopUp()}
            {itemsPerPageBar()}
            {filtersSegment()}
            {advertsLoading ?
                <Loader active inline='centered' size={"big"}/> :
                <div>
                    <Grid padded textAlign={"center"}>
                        <Grid.Row>
                            {paginationBar("top")}
                        </Grid.Row>
                    </Grid>
                    {listJobAdvertisements(currentJobAdvertisements)}
                </div>
            }
        </div>
    );
}
