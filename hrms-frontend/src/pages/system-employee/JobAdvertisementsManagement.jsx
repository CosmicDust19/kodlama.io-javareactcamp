import React, {useEffect, useState} from "react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {
    Button,
    Checkbox,
    Dropdown,
    Grid,
    Header,
    Icon,
    Input,
    Label,
    Loader,
    Menu,
    Modal,
    Pagination,
    Popup,
    Segment,
    Table
} from "semantic-ui-react";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {
    changeFilteredJobAdverts, changeJobAdvert,
    changeJobAdvertsFilters,
    changeJobAdvVerification,
    filterJobAdverts
} from "../../store/actions/filterActions"
import CityService from "../../services/cityService";
import PositionService from "../../services/positionService";
import EmployerService from "../../services/employerService";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";

const jobAdvertisementService = new JobAdvertisementService();

export default function JobAdvertisementsManagement() {

    const dispatch = useDispatch();
    const filters = useSelector(state => state?.filter.filter.jobAdvertsFilters)
    let filteredJobAdvertisements = useSelector(state => state?.filter.filter.filteredJobAdverts)
    const history = useHistory();
    const userProps = useSelector(state => state?.user.userProps)

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
        let cityService = new CityService();
        let positionService = new PositionService();
        let employerService = new EmployerService();
        cityService.getCities().then((result) => setCities(result.data.data));
        positionService.getPositions().then((result) => setPositions(result.data.data));
        employerService.getAll().then((result) => setEmployers(result.data.data));
        jobAdvertisementService.getAll().then((result) => {
            setJobAdvertisements(result.data.data)
        });
    }, []);

    if (filteredJobAdvertisements === undefined) filteredJobAdvertisements = jobAdvertisements

    const indexOfLastJobAdvertisement = currentPage * jobAdvertisementsPerPage
    const indexOfFirstJobAdvertisement = indexOfLastJobAdvertisement - jobAdvertisementsPerPage
    const currentJobAdvertisements = filteredJobAdvertisements.slice(indexOfFirstJobAdvertisement, indexOfLastJobAdvertisement)

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

    const refreshComp = () => {
        if (refresh === true) setRefresh(false);
        else setRefresh(true)
    }

    const handleCatch = (error) => {
        toast.warning("A problem has occurred")
        console.log(error.response)
        refreshComp()
    }

    const getRemainedDays = (jobAdvertisement) => {
        let remainedDays = Math.floor((new Date(jobAdvertisement.deadline).getTime() - new Date().getTime()) / 86400000) + 1
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

    const handleChangeVerification = (jobAdvert, status) => {
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
        history.push(`/jobAdvertisements/${id}`);
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

    const handlePendingMenuClick = (activeItem) => {
        if (activeItem === formik.values.pending) {
            formik.values.pending = ""
            handleChangeFilter("pending", "")
        } else {
            formik.values.pending = activeItem
            handleChangeFilter("pending", activeItem)
        }
        dispatch(changeJobAdvertsFilters(formik.values))
    }

    const handleVerificationMenuClick = (activeItem) => {
        if (activeItem === formik.values.verification) {
            formik.values.verification = ""
            handleChangeFilter("verification", "")
        } else {
            formik.values.verification = activeItem
            handleChangeFilter("verification", activeItem)
        }
        dispatch(changeJobAdvertsFilters(formik.values))
    }

    const handleActivationMenuClick = (activeItem) => {
        if (activeItem === formik.values.activation) {
            formik.values.activation = ""
            handleChangeFilter("activation", "")
        } else {
            formik.values.activation = activeItem
            handleChangeFilter("activation", activeItem)
        }
        dispatch(changeJobAdvertsFilters(formik.values))
    }

    const handlePaginationChange = (e, {activePage}) => setCurrentPage(activePage)

    const handleResetFilters = () => {
        handleChangeFilter("cityIds", [])
        handleChangeFilter("positionIds", [])
        handleChangeFilter("employerIds", [])
        handleChangeFilter("workModels", [])
        handleChangeFilter("workTimes", [])
        handleChangeFilter("minSalaryLessThan", "")
        handleChangeFilter("maxSalaryLessThan", "")
        handleChangeFilter("minSalaryMoreThan", "")
        handleChangeFilter("maxSalaryMoreThan", "")
        handleChangeFilter("applicationDeadLineBefore", "")
        handleChangeFilter("applicationDeadLineAfter", "")
        handleChangeFilter("today", false)
        handleChangeFilter("thisWeek", false)
        handleChangeFilter("pending", "")
        handleChangeFilter("verification", "")
        handleChangeFilter("activation", "")
        formik.values = {
            cityIds: [], positionIds: [], employerIds: [], workTimes: [], workModels: [],
            minSalaryLessThan: "", maxSalaryLessThan: "", minSalaryMoreThan: "", maxSalaryMoreThan: "",
            applicationDeadLineBefore: "", applicationDeadLineAfter: "",
            today: false, thisWeek: false,
            pending: "", verification: "", activation: "",
        }
        handleFilter()
    }

    const handleFilter = () => {
        dispatch(changeJobAdvertsFilters(formik.values))
        dispatch(filterJobAdverts(jobAdvertisements, formik.values))
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
                <Segment style={{borderRadius: 20}} disabled={jobAdvertisements.length === 0} raised vertical>
                    <Label attached={"top right"} style={{marginTop: 5, marginRight: 5}} color="blue" circular
                           onClick={() => setInfoPopUpOpen(true)}>
                        <Icon name="help" style={{marginRight: 0}}/>
                    </Label>
                    <Grid stackable padded={"horizontally"}>
                        <Grid.Column width="6">

                            <Segment basic>
                                <Header size={"small"} textAlign={"center"} style={{color: "rgba(20,23,182,0.63)"}}>
                                    <Header.Content>
                                        <Icon name="wait"/> Pending
                                    </Header.Content>
                                </Header>
                                <Menu secondary style={{borderRadius: 10}}>
                                    <Menu.Item active={filters.pending === "releaseApproval"} color={"blue"}
                                               style={{borderRadius: 10}} onClick={() => {
                                        handlePendingMenuClick("releaseApproval")
                                    }}><Icon name="bullhorn"/>Release Approval</Menu.Item>
                                    <Menu.Item active={filters.pending === "updateApproval"} color={"orange"}
                                               style={{borderRadius: 10}} onClick={() => {
                                        handlePendingMenuClick("updateApproval")
                                    }}><Icon name="redo alternate"/>Update Approval</Menu.Item>
                                </Menu>
                            </Segment>

                            <Segment basic>
                                <Header size={"small"} textAlign={"center"} style={{color: "rgba(250,180,2,0.73)"}}>
                                    <Header.Content>
                                        <Icon name="check circle outline"/> Verification
                                    </Header.Content>
                                </Header>
                                <Menu secondary style={{borderRadius: 10}}>
                                    <Menu.Item active={filters.verification === "verified"} color={"green"}
                                               style={{borderRadius: 10}} onClick={() => {
                                        handleVerificationMenuClick("verified")
                                    }}><Icon name="check circle outline"/>Verified</Menu.Item>
                                    <Menu.Item active={filters.verification === "rejected"} color={"red"}
                                               style={{borderRadius: 10}} onClick={() => {
                                        handleVerificationMenuClick("rejected")
                                    }}><Icon name="ban"/>Rejected</Menu.Item>
                                </Menu>
                            </Segment>

                            <Segment basic>
                                <Header size={"small"} textAlign={"center"} style={{color: "rgba(250,2,52,0.66)"}}>
                                    <Header.Content>
                                        <Icon name="checkmark"/> Activation
                                    </Header.Content>
                                </Header>
                                <Menu secondary style={{borderRadius: 10}}>
                                    <Menu.Item active={formik.values.activation === "active"} color={"green"}
                                               style={{borderRadius: 10}} onClick={() => {
                                        handleActivationMenuClick("active")
                                    }}><Icon name="checkmark"/>Active</Menu.Item>
                                    <Menu.Item active={formik.values.activation === "inactive"} color="brown"
                                               style={{borderRadius: 10}} onClick={() => {
                                        handleActivationMenuClick("inactive")
                                    }}><Icon name="minus circle"/>Inactive</Menu.Item>
                                    <Menu.Item active={formik.values.activation === "expired"} color="purple"
                                               style={{borderRadius: 10}} onClick={() => {
                                        handleActivationMenuClick("expired")
                                    }}><Icon name="calendar times"/>Expired</Menu.Item>
                                </Menu>
                            </Segment>

                        </Grid.Column>
                        <Grid.Column width="10">
                            <Dropdown clearable item placeholder="Select cities" search multiple selection
                                      loading={jobAdvertisements.length === 0}
                                      options={cityOption} value={formik.values.cityIds}
                                      style={{marginLeft: 10, marginTop: 10, borderRadius: 10}}
                                      onChange={(event, data) => {
                                          handleChangeFilter("cityIds", data.value)
                                      }}/>
                            <Dropdown clearable item placeholder="Select positions" search multiple selection
                                      loading={jobAdvertisements.length === 0}
                                      options={positionOption} value={formik.values.positionIds}
                                      style={{marginLeft: 10, marginTop: 10, borderRadius: 10}}
                                      onChange={(event, data) => {
                                          handleChangeFilter("positionIds", data.value)
                                      }}/>
                            <Dropdown clearable item placeholder="Select employers" search multiple selection
                                      loading={jobAdvertisements.length === 0}
                                      options={employerOption} value={formik.values.employerIds}
                                      style={{marginLeft: 10, marginTop: 10, borderRadius: 10}}
                                      onChange={(event, data) => {
                                          handleChangeFilter("employerIds", data.value)
                                      }}/>
                            <Dropdown clearable item placeholder="Select work model" search multiple selection
                                      loading={jobAdvertisements.length === 0}
                                      options={workModelOption} value={formik.values.workModels}
                                      style={{marginLeft: 10, marginTop: 10, borderRadius: 10}}
                                      onChange={(event, data) => {
                                          handleChangeFilter("workModels", data.value)
                                      }}/>
                            <Dropdown clearable item placeholder="Select work time" search multiple selection
                                      loading={jobAdvertisements.length === 0}
                                      options={workTimeOption} value={formik.values.workTimes}
                                      style={{marginLeft: 10, marginTop: 10, borderRadius: 10}}
                                      onChange={(event, data) => {
                                          handleChangeFilter("workTimes", data.value)
                                      }}/>

                            <Grid columns="equal" style={{marginTop: 10}} stackable>
                                <Grid.Column>
                                    <Segment basic>
                                        <Header size="tiny" disabled={jobAdvertisements.length === 0}>
                                            Minimum Salary
                                        </Header>
                                        <Input placeholder="More than" value={formik.values.minSalaryMoreThan}
                                               loading={jobAdvertisements.length === 0}
                                               name="minSalaryMoreThan" type="number" style={{borderRadius: 10}}
                                               onChange={formik.handleChange} icon={"money bill alternate"}/>
                                        <Input placeholder="Less than" value={formik.values.minSalaryLessThan}
                                               loading={jobAdvertisements.length === 0}
                                               name="minSalaryLessThan" type="number"
                                               style={{marginTop: 10, borderRadius: 10}}
                                               onChange={formik.handleChange} icon={"money bill alternate"}/>
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment basic>
                                        <Header size="tiny" disabled={jobAdvertisements.length === 0}>
                                            Maximum Salary
                                        </Header>
                                        <Input placeholder="More than" value={formik.values.maxSalaryMoreThan}
                                               loading={jobAdvertisements.length === 0}
                                               name="maxSalaryMoreThan" type="number" style={{borderRadius: 10}}
                                               onChange={formik.handleChange} icon={"money bill alternate"}/>
                                        <Input placeholder="Less than" value={formik.values.maxSalaryLessThan}
                                               loading={jobAdvertisements.length === 0}
                                               name="maxSalaryLessThan" type="number"
                                               style={{marginTop: 10, borderRadius: 10}}
                                               onChange={formik.handleChange} icon={"money bill alternate"}/>
                                    </Segment>
                                </Grid.Column>
                            </Grid>

                            <Grid columns="equal" style={{marginTop: -20}} stackable>
                                <Grid.Column>
                                    <Segment basic style={{marginTop: 10}}>
                                        <Checkbox label='Today' checked={formik.values.today} style={{marginLeft: 7}}
                                                  disabled={jobAdvertisements.length === 0} onChange={() => {
                                            handleChangeFilter("today", !formik.values.today)
                                        }}/>
                                        <Checkbox label='This Week' checked={formik.values.thisWeek}
                                                  style={{marginLeft: 20}}
                                                  disabled={jobAdvertisements.length === 0} onChange={() => {
                                            handleChangeFilter("thisWeek", !formik.values.thisWeek)
                                        }}/>
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment basic>
                                        <Header size="tiny" disabled={jobAdvertisements.length === 0}>
                                            Application DeadLine
                                        </Header>
                                        <font style={{fontStyle: "italic"}}>Before</font>&nbsp;&nbsp;&nbsp;
                                        <Input placeholder="Before" value={formik.values.applicationDeadLineBefore}
                                               loading={jobAdvertisements.length === 0}
                                               name="applicationDeadLineBefore" type="date"
                                               onChange={formik.handleChange}/>
                                        <Header style={{marginTop: 0}}/>
                                        <font
                                            style={{fontStyle: "italic", marginLeft: 8}}>After</font>&nbsp;&nbsp;&nbsp;
                                        <Input placeholder="After" value={formik.values.applicationDeadLineAfter}
                                               loading={jobAdvertisements.length === 0}
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
                                disabled={jobAdvertisements.length === 0 || loading} active onClick={() => {
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
                                disabled={jobAdvertisements.length === 0 || loading} active onClick={() => {
                            setLoading(true)
                            setTimeout(() => {
                                handleResetFilters()
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
        if (jobAdvertisements.length === 0 && (!currentJobAdvertisements || currentJobAdvertisements.length === 0)) {
            return (
                <Segment basic size={"large"}>
                    <Loader active inline='centered' size={"large"}/>
                </Segment>
            )
        } else if (currentJobAdvertisements.length === 0) {
            return (
                <Header style={{marginTop: "2em", marginLeft: "2em"}}>
                    <font style={{fontStyle: "italic"}} color="black">No results were found</font>
                </Header>
            )
        }

        return (
            <Table>
                <Table.Body>
                    {currentJobAdvertisements.map((jobAdvertisement) => (
                        <Table.Row style={{backgroundColor: getRowColor(jobAdvertisement)}} key={jobAdvertisement.id}>
                            <Table.Cell>
                                {jobAdvertisement.employer.companyName}
                            </Table.Cell>
                            <Table.Cell>
                                {jobAdvertisement.position.title}
                            </Table.Cell>
                            <Table.Cell>
                                {jobAdvertisement.city.name}
                            </Table.Cell>
                            <Table.Cell>
                                {getRemainedDays(jobAdvertisement)}
                            </Table.Cell>
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
                                                onClick={() => {verifyUpdate(jobAdvertisement)}}>
                                                <Icon name="redo alternate" color="orange"/>Verify Update
                                            </Dropdown.Item> : null}
                                        {jobAdvertisement.verified === false ?
                                            <Dropdown.Item
                                                onClick={() => handleChangeVerification(jobAdvertisement, true)}>
                                                <Icon name="check circle outline" color="green"/>Verify
                                            </Dropdown.Item> :
                                            <Dropdown.Item
                                                onClick={() => handleChangeVerification(jobAdvertisement, false)}>
                                                <Icon name="ban" color="red"/>Cancel Verification
                                            </Dropdown.Item>}
                                        {jobAdvertisement.verified === false && jobAdvertisement.rejected === null ?
                                            <Dropdown.Item
                                                onClick={() => handleChangeVerification(jobAdvertisement, false)}>
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
                               disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
                               onClick={() => handlePagePerJobAdvMenuClick(5)}>5</Menu.Item>
                    <Menu.Item name='10' active={jobAdvertisementsPerPage === 10}
                               disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
                               onClick={() => handlePagePerJobAdvMenuClick(10)}>10</Menu.Item>
                    <Menu.Item name='20' active={jobAdvertisementsPerPage === 20}
                               disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
                               onClick={() => handlePagePerJobAdvMenuClick(20)}>20</Menu.Item>
                    <Menu.Item name='50' active={jobAdvertisementsPerPage === 50}
                               disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
                               onClick={() => handlePagePerJobAdvMenuClick(50)}>50</Menu.Item>
                    <Menu.Item name='100' active={jobAdvertisementsPerPage === 100}
                               disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
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
            <Popup
                trigger={
                    <Pagination
                        totalPages={Math.ceil(filteredJobAdvertisements.length / jobAdvertisementsPerPage)}
                        onPageChange={handlePaginationChange}
                        activePage={currentPage}
                        secondary
                        pointing
                        firstItem={null}
                        lastItem={null}
                        siblingRange={2}
                        disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
                    />
                }
                disabled={filteredJobAdvertisements.length === 0 || jobAdvertisements.length === 0}
                content={"Page number"}
                style={{
                    borderRadius: 15,
                    opacity: 0.9,
                    color: "rgb(18,18,18)"
                }}
                position={"top center"}
                on={"hover"}
                mouseEnterDelay={1000}
                mouseLeaveDelay={150}
            />
        )
    }

    if (String(userProps.userType) !== "systemEmployee")
        return (
            <Header>
                Nice Try !
            </Header>
        )

    return (
        <div>
            {infoPopUp()}
            {itemsPerPageBar()}
            {filtersSegment()}
            <Grid padded textAlign={"center"}>
                <Grid.Row>
                    {paginationBar("top")}
                </Grid.Row>
            </Grid>
            {listJobAdvertisements(currentJobAdvertisements)}
        </div>
    );
}
