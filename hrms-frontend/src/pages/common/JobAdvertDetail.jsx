import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {Card, Divider, Grid, Icon, Loader, Segment, Table, Transition} from "semantic-ui-react";
import {useSelector} from "react-redux";
import {getCreatedAtAsStr, getRemainedDays} from "../../utilities/Utils";
import SInfoLabel from "../../components/common/SInfoLabel";
import SysEmplAdvertDropdown from "../../components/systemEmployee/SysEmplAdvertDropdown";
import EmplAdvertDropdown from "../../components/employer/EmplAdvertDropdown";
import FavoriteAdvertIcon from "../../components/candidate/FavoriteAdvertIcon";
import JobAdvertInfoLabels from "../../components/common/JobAdvertInfoLabels";
import {getDeadlineInfo, getSalaryInfo} from "../../utilities/JobAdvertUtils";
import SUpdateTableCell from "../../components/common/SUpdateTableCell";
import EmployerSummary from "../../components/employer/EmployerSummary";
import EmployerLogo from "../../components/employer/EmployerLogo";

const jobAdvertisementService = new JobAdvertisementService();

export default function JobAdvertDetail() {

    let {id} = useParams()
    const userProps = useSelector(state => state?.user?.userProps)
    const user = useSelector(state => state?.user?.userProps?.user)

    const [visible, setVisible] = useState(false);
    const [jobAdvert, setJobAdvert] = useState({});

    useEffect(() => {
        jobAdvertisementService.getById(id)
            .then((result) => setJobAdvert(result.data.data))
            .finally(() => setVisible(true));
        return () => {
            setVisible(undefined)
            setJobAdvert(undefined)
        };
    }, [id]);

    const updateColor = "rgba(255,113,0,0.1)"
    const updateIcon = <Icon name="redo alternate" color="orange"/>

    const systemEmployee = String(userProps.userType) === "systemEmployee";
    const publisherEmpl = user?.id === jobAdvert.employer?.id;

    const salaryInfo = getSalaryInfo(jobAdvert)
    const updatedSalaryInfo = getSalaryInfo(jobAdvert.jobAdvertisementUpdate)
    const deadlineInfo = getDeadlineInfo(jobAdvert.deadline)
    const updatedDeadlineInfo = getDeadlineInfo(jobAdvert.jobAdvertisementUpdate?.deadline, getRemainedDays())

    const positionUpdated = jobAdvert.position?.id !== jobAdvert.jobAdvertisementUpdate?.position?.id
    const cityUpdated = jobAdvert.city?.id !== jobAdvert.jobAdvertisementUpdate?.city?.id
    const descUpdated = jobAdvert.jobDescription !== jobAdvert.jobAdvertisementUpdate?.jobDescription
    const workModelOrTimeUpdated =
        jobAdvert.workTime !== jobAdvert.jobAdvertisementUpdate?.workTime ||
        jobAdvert.workModel !== jobAdvert.jobAdvertisementUpdate?.workModel
    const salaryUpdated = salaryInfo !== updatedSalaryInfo
    const deadlineUpdated = deadlineInfo !== updatedDeadlineInfo
    const openPositionsUpdated = jobAdvert.openPositions !== jobAdvert.jobAdvertisementUpdate?.openPositions
    const tableInfosUpdated = workModelOrTimeUpdated || salaryUpdated || deadlineUpdated || openPositionsUpdated

    const jobAdvertLoaded = Object.keys(jobAdvert).length === 18
    const jobAdvertUpdateLoaded = jobAdvertLoaded && Object.keys(jobAdvert.jobAdvertisementUpdate).length === 11
    const jobAdvertEmployerLoaded = jobAdvertLoaded && Object.keys(jobAdvert.employer).length === 13

    if (!jobAdvertLoaded || !jobAdvertUpdateLoaded || !jobAdvertEmployerLoaded)
        return <Loader active inline='centered' size={"large"} style={{marginTop: "15em"}}/>

    return (
        <Transition visible={visible} duration={300}>
            <div>
                <Card raised fluid style={{borderRadius: 0, marginBottom: 0, backgroundColor: "rgba(240,240,240,0.35)"}}>
                    <Card.Content>
                        <Grid stackable={systemEmployee || publisherEmpl}>

                            <Grid.Column width={10}>
                                <Card.Header>
                                    <font style={{fontSize: "large"}}>{jobAdvert.position?.title}</font> &nbsp;
                                    <SInfoLabel content={<div>{updateIcon}{jobAdvert.jobAdvertisementUpdate?.position.title}</div>}
                                                visible={(systemEmployee || publisherEmpl) && positionUpdated}
                                                backgroundColor={updateColor}/>
                                </Card.Header>
                                <Card.Meta style={{marginTop: 4}}>
                                    &nbsp;<EmployerLogo user={jobAdvert.employer} size={"mini"}/>&nbsp;&nbsp;
                                    {jobAdvert.employer?.companyName}
                                </Card.Meta>
                                <Card.Description style={{marginTop: 4}}>
                                    <Icon name={"map marker alternate"} size={"large"} color={"red"}/>&nbsp;&nbsp;
                                    {jobAdvert.city?.name} &nbsp;
                                    <SInfoLabel
                                        content={<div>{updateIcon}{jobAdvert.jobAdvertisementUpdate?.city.name}</div>}
                                        visible={(systemEmployee || publisherEmpl) && cityUpdated} backgroundColor={updateColor}/>
                                </Card.Description>
                            </Grid.Column>

                            <Grid.Column width={6} textAlign={"right"}
                                         verticalAlign={systemEmployee || publisherEmpl ? "middle" : undefined}>
                                <FavoriteAdvertIcon jobAdvert={jobAdvert} iconSize={"large"}/>
                                <JobAdvertInfoLabels jobAdvert={jobAdvert}/>
                                <SysEmplAdvertDropdown jobAdvert={jobAdvert} setJobAdvert={setJobAdvert}/>
                                <EmplAdvertDropdown jobAdvert={jobAdvert} setJobAdvert={setJobAdvert}/>
                            </Grid.Column>

                        </Grid>
                    </Card.Content>
                </Card>

                <Table striped celled style={{borderRadius: 0, marginTop: 0, backgroundColor: "rgb(250,250,250, 0.7)"}}>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell collapsing>
                                <Icon name={"suitcase"} color={"teal"}/>&nbsp;
                                Working Model & Time&nbsp;
                            </Table.Cell>
                            <Table.Cell content={`${jobAdvert.workModel} & ${jobAdvert.workTime}`}/>
                            <SUpdateTableCell infoAuthorized={systemEmployee || publisherEmpl} visible={workModelOrTimeUpdated}
                                              content={`${jobAdvert.jobAdvertisementUpdate?.workModel} & ${jobAdvert.jobAdvertisementUpdate?.workTime}`}
                                              emptyCell={tableInfosUpdated}/>
                        </Table.Row>
                        {salaryInfo !== "No Salary Info" || systemEmployee || publisherEmpl ?
                            <Table.Row>
                                <Table.Cell collapsing>
                                    <Icon name={"dollar sign"} color={"green"}/>&nbsp;
                                    Salary
                                </Table.Cell>
                                <Table.Cell content={salaryInfo}/>
                                <SUpdateTableCell infoAuthorized={systemEmployee || publisherEmpl} visible={salaryUpdated}
                                                  content={updatedSalaryInfo} emptyCell={tableInfosUpdated}/>
                            </Table.Row> : null}
                        <Table.Row>
                            <Table.Cell collapsing>
                                <Icon name={"calendar alternate outline"} color={"purple"}/>&nbsp;
                                Deadline
                            </Table.Cell>
                            <Table.Cell content={deadlineInfo}/>
                            <SUpdateTableCell infoAuthorized={systemEmployee || publisherEmpl} visible={deadlineUpdated}
                                              content={updatedDeadlineInfo} emptyCell={tableInfosUpdated}/>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell collapsing>
                                <Icon name={"users"} color={"yellow"}/>&nbsp;
                                Open Positions
                            </Table.Cell>
                            <Table.Cell content={jobAdvert.openPositions}/>
                            <SUpdateTableCell infoAuthorized={systemEmployee || publisherEmpl} visible={openPositionsUpdated}
                                              content={jobAdvert.jobAdvertisementUpdate?.openPositions} emptyCell={tableInfosUpdated}/>
                        </Table.Row>
                    </Table.Body>
                </Table>

                <Table style={{borderRadius: 0, backgroundColor: "rgb(250,250,250, 0.7)"}} definition structured color={"red"}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                <Icon name={"tasks"} color={"red"} style={{marginRight: -2}}/>
                                <strong style={{marginLeft: 10}}>Job Description</strong>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                                <Segment basic content={<p className={"paragraph"}>{jobAdvert.jobDescription}</p>}/>
                            </Table.Cell>
                        </Table.Row>
                        {(systemEmployee || publisherEmpl) && descUpdated ?
                            <Table.Row>
                                <Table.Cell style={{backgroundColor: "rgba(255,200,150,0.25)"}}>
                                    <Segment content={<p className={"paragraph"}>{jobAdvert.jobAdvertisementUpdate.jobDescription}</p>}
                                             basic/>
                                </Table.Cell>
                            </Table.Row> : null}
                    </Table.Body>
                </Table>

                <EmployerSummary employer={jobAdvert.employer}/>
                <Divider/>
                <font style={{float: "right"}}>
                    {getCreatedAtAsStr(jobAdvert.createdAt)}
                </font>
            </div>
        </Transition>
    );
}