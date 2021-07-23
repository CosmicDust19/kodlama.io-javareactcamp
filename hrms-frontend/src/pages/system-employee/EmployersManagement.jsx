import React, {useEffect, useState} from "react";
import {
    Button, Dropdown, Grid, Header, Icon,
    Label, Loader, Menu, Modal, Pagination, Popup, Segment, Table
} from "semantic-ui-react";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {changeEmployersFilters, changeFilteredEmployers, filterEmployers} from "../../store/actions/filterActions"
import EmployerService from "../../services/employerService";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";

let employerService = new EmployerService();
export default function EmployersManagement() {

    const dispatch = useDispatch();
    const filters = useSelector(state => state?.filter.filter.employersFilters)
    const filteredEmployers = useSelector(state => state?.filter.filter.filteredEmployers)
    const history = useHistory();
    const userProps = useSelector(state => state?.user?.userProps)

    const [infoPopUpOpen, setInfoPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [employersPerPage, setEmployersPerPage] = useState(20);
    const [employers, setEmployers] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        let employerService = new EmployerService();
        employerService.getAll().then((result) => setEmployers(result.data.data));
    }, []);

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

    employerOption = employerCompanyNameOption.concat(employersPhoneOption).concat(employerEmailOption).concat(employersWebsiteOption)

    const formik = useFormik({
        initialValues: {
            pending: filters.pending,
            verification: filters.verification,
            employerId: 0
        }
    });

    const refreshPage = () => {
        if (refresh === true) setRefresh(false);
        else setRefresh(true)
    }

    const handleCatch = (error) => {
        toast.warning("A problem has occurred")
        console.log(error.response)
        refreshPage()
    }

    const getRowColor = (employer) => {
        if ((employer.rejected === null && employer.verified === false)) return "rgba(0,94,255,0.07)"
        else if (employer.rejected) return "rgba(255,0,0,0.07)"
        else if (employer.verified) return "rgba(27,252,3,0.05)"
        else return "rgba(255,255,255,0.1)"
    }

    const handleChangeVerification = (employer, status) => {
        employerService.updateVerification(employer.id, status).then(() => {
            employer.verified = status
            employer.rejected = !status
            const index = filteredEmployers.findIndex((filteredEmployer) => filteredEmployer.id === employer.id)
            filteredEmployers[index] = employer
            dispatch(changeFilteredEmployers(filteredEmployers))
            toast("Successful")
            refreshPage()
        }).catch(handleCatch)
    }

    const handleEmployerInfoClick = id => {
        history.push(`/employers/${id}`);
        window.scrollTo(0, 0)
    };

    const handleChangeFilter = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
        if (fieldName === "employerId") {
            formik.values.employerId = value
            handleFilter()
        }
    }

    const handlePagePerEmployerMenuClick = (number) => {
        setCurrentPage(1)
        setEmployersPerPage(number)
    }

    const handlePendingMenuClick = (activeItem) => {
        if (activeItem === formik.values.pending) {
            formik.values.pending = ""
            handleChangeFilter("pending", "")
        } else {
            formik.values.pending = activeItem
            handleChangeFilter("pending", activeItem)
            if (activeItem === "updateApproval") toast("Update is not supported for now, it won't affect the filtering process")
        }
        dispatch(changeEmployersFilters(formik.values))
    }

    const handleVerificationMenuClick = (activeItem) => {
        if (activeItem === formik.values.verification) {
            formik.values.verification = ""
            handleChangeFilter("verification", "")
        } else {
            formik.values.verification = activeItem
            handleChangeFilter("verification", activeItem)
        }
        dispatch(changeEmployersFilters(formik.values))
    }

    const handlePaginationChange = (e, {activePage}) => setCurrentPage(activePage)

    const handleResetFilters = () => {
        handleChangeFilter("pending", "")
        handleChangeFilter("verification", "")
        handleChangeFilter("employerId", 0)
        formik.values = {
            pending: "", verification: "", employerId: 0
        }
        handleFilter()
    }

    const handleFilter = () => {
        dispatch(changeEmployersFilters(formik.values))
        dispatch(filterEmployers(employers, formik.values))
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
                <Segment style={{borderRadius: 20}} disabled={employers.length === 0} raised>
                    <Label attached={"top right"} style={{marginTop: 5, marginRight: 5}} color="blue" circular
                           onClick={() => setInfoPopUpOpen(true)}>
                        <Icon name="help" style={{marginRight: 0}}/>
                    </Label>
                    <Grid stackable>
                        <Grid.Column width="6">
                            <Segment basic>
                                <Header size={"small"} style={{color: "rgba(20,23,182,0.63)", marginLeft: 10}}>
                                    <Header.Content>
                                        <Icon name="wait"/> Pending
                                    </Header.Content>
                                </Header>
                                <Menu secondary style={{borderRadius: 10}}>
                                    <Menu.Item active={filters.pending === "signUpApproval"} color={"blue"}
                                               style={{borderRadius: 10}} onClick={() => {
                                        handlePendingMenuClick("signUpApproval")
                                    }}><Icon name="add user"/>Sign Up Approval</Menu.Item>
                                    <Menu.Item active={filters.pending === "updateApproval"} color={"orange"}
                                               style={{borderRadius: 10}} onClick={() => {
                                        handlePendingMenuClick("updateApproval")
                                    }}><Icon name="redo alternate"/>Update Approval</Menu.Item>
                                </Menu>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width="6">
                            <Segment basic>
                                <Header size={"small"} style={{color: "rgba(250,180,2,0.73)", marginLeft: 10}}>
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
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Grid padded>
                    <Grid.Column width="10">
                        <Button basic animated="fade" fluid color={"green"} style={{borderRadius: 10}} loading={loading}
                                disabled={employers.length === 0 || loading} active onClick={() => {
                            setLoading(true)
                            setTimeout(() => {
                                formik.values.employerId = 0
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
                                disabled={employers.length === 0 || loading} active onClick={() => {
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

    function listEmployers(currentEmployers) {
        if (employers.length === 0) {
            return (
                <Segment basic size={"large"}>
                    <Loader active inline='centered' size={"large"}/>
                </Segment>
            )
        } else if (currentEmployers.length === 0) {
            return (
                <Header style={{marginTop: "2em", marginLeft: "2em"}}>
                    <font style={{fontStyle: "italic"}} color="black">No results were found</font>
                </Header>
            )
        }

        return (
            <Table>
                <Table.Body>
                    {currentEmployers.map((employer) => (
                        <Table.Row style={{backgroundColor: getRowColor(employer)}} key={employer.id}>
                            <Table.Cell>
                                {employer.companyName}
                            </Table.Cell>
                            <Table.Cell>
                                {employer.phoneNumber}
                            </Table.Cell>
                            <Table.Cell>
                                {employer.email}
                            </Table.Cell>
                            <Table.Cell>
                                {employer.website}
                            </Table.Cell>
                            <Table.Cell textAlign={"center"} verticalAlign={"middle"}>
                                {!employer.verified && employer.rejected === null ?
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(0,94,255,0.1)"}}>
                                        <Icon name="add user" color="blue"/>Sign Up Approval
                                    </Label> : null}
                                {employer.updateVerified === null || !!employer.updateVerified ? null :
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(255,113,0,0.1)"}}>
                                        <Icon name="redo alternate" color="orange"/>Update Approval
                                    </Label>}
                                {!employer.verified ? null :
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(58,255,0,0.1)"}}>
                                        <Icon name="check circle outline" color="green"/>Verified
                                    </Label>}
                                {(employer.verified || !employer.rejected) ? null :
                                    <Label style={{marginTop: 10, backgroundColor: "rgba(226,14,14,0.1)"}}>
                                        <Icon name="ban" color="red"/>Rejected
                                    </Label>}
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
                                        {(!employer.verified && employer.rejected === null) ?
                                            <Dropdown.Item
                                                onClick={() => handleChangeVerification(employer, true)}>
                                                <Icon name="check circle outline" color="green"/>Verify
                                            </Dropdown.Item> : null}
                                        {(!employer.verified && employer.rejected === null) ?
                                            <Dropdown.Item
                                                onClick={() => handleChangeVerification(employer, false)}>
                                                <Icon name="ban" color="red"/>Reject
                                            </Dropdown.Item> : null}
                                        {!employer.verified ? null :
                                            <Dropdown.Item
                                                onClick={() => handleChangeVerification(employer, false)}>
                                                <Icon name="ban" color="red"/>Cancel Verification
                                            </Dropdown.Item>}
                                        {!employer.rejected ? null :
                                            <Dropdown.Item
                                                onClick={() => handleChangeVerification(employer, true)}>
                                                <Icon name="check circle outline" color="green"/>Verify
                                            </Dropdown.Item>}
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
            <div>
                <Menu secondary icon={"labeled"} vertical pagination
                      style={{marginRight: "3em", marginTop: "16em"}} fixed={"right"}>
                    <Menu.Item name='5' active={employersPerPage === 5}
                               disabled={filteredEmployers.length === 0}
                               onClick={() => handlePagePerEmployerMenuClick(5)}>5</Menu.Item>
                    <Menu.Item name='10' active={employersPerPage === 10}
                               disabled={filteredEmployers.length === 0}
                               onClick={() => handlePagePerEmployerMenuClick(10)}>10</Menu.Item>
                    <Menu.Item name='20' active={employersPerPage === 20}
                               disabled={filteredEmployers.length === 0}
                               onClick={() => handlePagePerEmployerMenuClick(20)}>20</Menu.Item>
                    <Menu.Item name='50' active={employersPerPage === 50}
                               disabled={filteredEmployers.length === 0}
                               onClick={() => handlePagePerEmployerMenuClick(50)}>50</Menu.Item>
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
                        totalPages={Math.ceil(filteredEmployers.length / employersPerPage)}
                        onPageChange={handlePaginationChange}
                        activePage={currentPage}
                        secondary
                        pointing
                        firstItem={null}
                        lastItem={null}
                        siblingRange={2}
                        disabled={filteredEmployers.length === 0}
                    />
                }
                disabled={filteredEmployers.length === 0}
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
            <Grid padded>
                <Grid.Column width={8}>
                    <Dropdown placeholder="Search employers" search className="icon" label = {formik.values.employerId === 0 ? null :
                        <Button icon="x" circular disabled={employers.length === 0 || loading} loading={loading}
                                onClick={() => handleChangeFilter("employerId", 0)}/>}
                              loading={employers.length === 0} button labeled icon="search"
                              options={employerOption} value={formik.values.employerId}
                              style={{borderRadius: 10}} basic
                              onChange={(event, data) => {
                                  handleChangeFilter("employerId", data.value)
                              }}/>
                    {formik.values.employerId === 0 ? null :
                        <Button icon="x" circular disabled={employers.length === 0 || loading} loading={loading}
                                onClick={() => handleChangeFilter("employerId", 0)}/>}
                </Grid.Column>
                <Grid.Column width={8}>
                    {paginationBar()}
                </Grid.Column>
            </Grid>
            {listEmployers(currentEmployers)}
        </div>
    );
}