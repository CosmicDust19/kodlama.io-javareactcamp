import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {Button, Card, Dropdown, Grid, Icon, Label, Loader, Table} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {syncEmplJobAdverts, syncUser} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import CandidateService from "../../services/candidateService";
import {changeJobAdvert} from "../../store/actions/filterActions";
import {changePropInList, getRandomColor, handleCatch, months} from "../../utilities/Utils";

const jobAdvertisementService = new JobAdvertisementService();

export default function JobAdvertDetail() {

    const color = getRandomColor()

    const candidateService = new CandidateService();

    let {id} = useParams()
    let history = useHistory();
    const userProps = useSelector(state => state?.user?.userProps)
    const user = useSelector(state => state?.user?.userProps?.user)
    const dispatch = useDispatch();

    const handleEmployerDetailClick = id => {
        history.push(`/employers/${id}`);
    };

    const [jobAdvert, setJobAdvert] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        jobAdvertisementService.getById(id).then((result) => setJobAdvert(result.data.data));
        setTimeout(() => {
            setLoading(false);
        }, 100)
    }, [id]);

    const systemEmployee = String(userProps.userType) === "systemEmployee";
    const publisherEmpl = user?.id === jobAdvert.employer?.id

    const isJobAdvInFavorites = () => {
        let index = user.favoriteJobAdvertisements.findIndex((jobAdvertisement2) => jobAdvertisement2.id === jobAdvert.id)
        return index !== -1;
    }

    function getSalary(jobAdvert) {
        if (!jobAdvert || (!jobAdvert.minSalary && !jobAdvert.maxSalary)) {
            return "No Salary Info"
        } else if (!jobAdvert.maxSalary) {
            return `more than ${jobAdvert.minSalary}$`
        } else if (!jobAdvert.minSalary) {
            return `less than ${jobAdvert.maxSalary}$`
        }
        return `between ${jobAdvert.minSalary} ~ ${jobAdvert.maxSalary}$`;
    }

    const salaryInfo = getSalary(jobAdvert)

    const updatedSalaryInfo = getSalary(jobAdvert.jobAdvertisementUpdate)

    const getRemainedDays = (deadline) => Math.round((new Date(deadline).getTime() - new Date().getTime()) / 86400000)

    const getDeadlineInfo = (deadline) => {
        const remainedDays = getRemainedDays(deadline)
        return `
        ${new Date(deadline).getDate()} 
        ${months[new Date(deadline).getMonth()]} 
        ${new Date(deadline).getFullYear()} | 
        ${remainedDays < 0 ? `Expired (${remainedDays * -1} day${remainedDays === -1 ? "" : "s"})` : `Remained ${remainedDays} day${remainedDays === 1 ? "" : "s"}`}
        `
    }

    const deadlineInfo = getDeadlineInfo(jobAdvert.deadline)

    const updatedDeadlineInfo = getDeadlineInfo(jobAdvert.jobAdvertisementUpdate?.deadline, getRemainedDays())

    const addToFavorites = () => {
        candidateService.addJobAdvToFavorites(user.id, jobAdvert.id).then(r => {
            dispatch(syncUser(r.data.data))
            toast.error("Added to your favorites  😍")
        }).catch(handleCatch)
    }

    const removeFromFavorites = () => {
        candidateService.removeJobAdvFromFavorites(user.id, jobAdvert.id).then(r => {
            dispatch(syncUser(r.data.data))
            toast("Deleted From Favorites")
        }).catch(handleCatch)
    }

    const changeVerification = (jobAdv, status) => {
        if (systemEmployee === false) return
        jobAdvertisementService.updateVerification(jobAdv.id, status).then(r => {
            dispatch(changeJobAdvert(jobAdv.id, r.data.data))
            setJobAdvert(r.data.data)
            toast("Successful")
        }).catch(handleCatch)
    }

    const verifyUpdate = (jobAdvert) => {
        if (systemEmployee === false) return
        jobAdvertisementService.applyChanges(jobAdvert.id).then(r => {
            dispatch(changeJobAdvert(jobAdvert.id, r.data.data))
            setJobAdvert(r.data.data)
            toast("Successful")
        }).catch(handleCatch)
    }

    const changeActivation = (status) => {
        if (publisherEmpl === false) return
        jobAdvertisementService.updateActivation(jobAdvert.id, status).then((result) => {
            const jobAdverts = changePropInList(jobAdvert.id, result.data.data, user.jobAdvertisements)
            dispatch(syncEmplJobAdverts(jobAdverts))
            setJobAdvert(result.data.data)
            status === true ? toast("Activated") : toast("Deactivated")
        }).catch(handleCatch)
    }

    if (jobAdvert === {} || loading) return <Loader active inline='centered' size={"large"} style={{marginTop: "15em"}}/>

    return (
        <div>
            <Card color={color} fluid>

                <Card.Content>
                    <Grid>
                        <Grid.Column width={8}>
                            <Card.Header>
                                <font style={{fontSize: "large"}}>{jobAdvert.position?.title}</font> &nbsp;
                                {(systemEmployee || publisherEmpl) &&
                                jobAdvert.position?.id !== jobAdvert.jobAdvertisementUpdate?.position?.id ?
                                    <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                        <Icon name="redo alternate" color="orange"/>
                                        {jobAdvert.jobAdvertisementUpdate.position.title}
                                    </Label> : null}
                            </Card.Header>
                            <Card.Meta>{jobAdvert.employer?.companyName}</Card.Meta>
                        </Grid.Column>
                        <Grid.Column width={8} textAlign={"right"}>
                            {user?.favoriteJobAdvertisements ?
                                (isJobAdvInFavorites(jobAdvert.id) ?
                                    <Icon name={"heart"} color={"red"} size="large" onClick={() => {
                                        removeFromFavorites(jobAdvert.id)
                                    }}/> :
                                    <Icon name={"heart outline"} size="large" onClick={() => {
                                        addToFavorites(jobAdvert.id)
                                    }}/>) : null}
                            {systemEmployee || publisherEmpl ?
                                <div>
                                    {!jobAdvert.verified && jobAdvert.rejected === null ?
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(0,94,255,0.1)"}}>
                                            <Icon name="bullhorn" color="blue"/>Release Approval
                                        </Label> : null}
                                    {jobAdvert.updateVerified === false ?
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(255,113,0,0.1)"}}>
                                            <Icon name="redo alternate" color="orange"/>Update Approval
                                        </Label> : null}
                                    {jobAdvert.verified === true ?
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(58,255,0,0.1)"}}>
                                            <Icon name="check circle outline" color="green"/>Verified
                                        </Label> : null}
                                    {jobAdvert.rejected === true ?
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(226,14,14,0.1)"}}>
                                            <Icon name="ban" color="red"/>Rejected
                                        </Label> : null}
                                    {jobAdvert.active === true ?
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(57,255,0,0.1)"}}>
                                            <Icon name="checkmark" color="green"/>Active
                                        </Label> :
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(76,16,11,0.1)"}}>
                                            <Icon name="minus circle" color="brown"/>Inactive
                                        </Label>}
                                    {systemEmployee ?
                                        <Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>}
                                                  simple labeled direction={"left"}>
                                            <Dropdown.Menu
                                                style={{
                                                    marginTop: 0, marginLeft: -6,
                                                    backgroundColor: "rgba(250,250,250, 0.7)", borderRadius: 10
                                                }}>
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
                                            </Dropdown.Menu>
                                        </Dropdown> :
                                        <Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>}
                                                  simple labeled direction={"left"}>
                                            <Dropdown.Menu style={{marginTop: 0, marginLeft: -6, backgroundColor: "rgba(250,250,250, 0.7)", borderRadius: 10}}>
                                                {jobAdvert.active === false ?
                                                    <Dropdown.Item
                                                        onClick={() => changeActivation(true)}>
                                                        <Icon name="check" color="green"/>Activate
                                                    </Dropdown.Item> :
                                                    <Dropdown.Item
                                                        onClick={() => changeActivation(false)}>
                                                        <Icon name="minus circle" color="brown"/>Deactivate
                                                    </Dropdown.Item>}
                                            </Dropdown.Menu>
                                        </Dropdown>}
                                </div> : null}
                        </Grid.Column>
                    </Grid>
                    <Card.Description>
                        <Icon name={"map marker"}/> {jobAdvert.city?.name} &nbsp;
                        {(systemEmployee || publisherEmpl) &&
                        jobAdvert.city?.id !== jobAdvert.jobAdvertisementUpdate?.city?.id ?
                            <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                <Icon name="redo alternate"
                                      color="orange"/>{jobAdvert.jobAdvertisementUpdate.city.name}
                            </Label> : null}
                    </Card.Description>
                </Card.Content>

                <Card.Content>
                    <Card.Description>
                        {jobAdvert.workTime + " & " + jobAdvert.workModel} &nbsp;
                        {(systemEmployee || publisherEmpl) &&
                        jobAdvert.workTime !== jobAdvert.jobAdvertisementUpdate?.workTime ?
                            <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                <Icon name="redo alternate"
                                      color="orange"/>{jobAdvert.jobAdvertisementUpdate.workTime}
                            </Label> : null} &nbsp;
                        {(systemEmployee || publisherEmpl) &&
                        jobAdvert.workModel !== jobAdvert.jobAdvertisementUpdate?.workModel ?
                            <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                <Icon name="redo alternate"
                                      color="orange"/>{jobAdvert.jobAdvertisementUpdate.workModel}
                            </Label> : null}
                    </Card.Description>
                </Card.Content>

                {salaryInfo !== "No Salary Info" || systemEmployee ?
                    <Card.Content>
                        Salary | {salaryInfo} &nbsp;
                        {(systemEmployee || publisherEmpl) &&
                        salaryInfo !== updatedSalaryInfo ?
                            <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                <Icon name="redo alternate" color="orange"/>{updatedSalaryInfo}
                            </Label> : null}
                    </Card.Content> : null}

                <Card.Content>
                    Application deadline | {deadlineInfo} &nbsp;
                    {(systemEmployee || publisherEmpl) &&
                    deadlineInfo !== updatedDeadlineInfo ?
                        <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                            <Icon name="redo alternate" color="orange"/>{updatedDeadlineInfo}
                        </Label> : null}
                </Card.Content>

                <Card.Content>
                    <Grid>
                        <Grid.Column width={8}>
                            Open Positions |{` ${jobAdvert.openPositions}`} &nbsp;
                            {(systemEmployee || publisherEmpl) &&
                            jobAdvert.openPositions !== jobAdvert.jobAdvertisementUpdate?.openPositions ?
                                <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                    <Icon name="redo alternate"
                                          color="orange"/>{jobAdvert.jobAdvertisementUpdate.openPositions}
                                </Label> : null}
                        </Grid.Column>
                        <Grid.Column width={8} textAlign={"right"}>Created at
                            {" " + new Date(jobAdvert.createdAt).getDate() + " " +
                            months[new Date(jobAdvert.createdAt).getMonth()] + " " +
                            new Date(jobAdvert.createdAt).getFullYear()}
                        </Grid.Column>
                    </Grid>
                </Card.Content>

            </Card>

            <Grid stackable padded={"vertically"}>
                <Grid.Column width={10}>
                    <Card fluid color={color}>
                        <Card.Content>
                            <Card.Header>
                                Job Description
                            </Card.Header>
                        </Card.Content>
                        <Card.Content>
                            {jobAdvert.jobDescription}
                        </Card.Content>
                    </Card>

                    {(systemEmployee || publisherEmpl) &&
                    jobAdvert.jobDescription !== jobAdvert.jobAdvertisementUpdate?.jobDescription ?
                        <Card fluid color={color}>
                            <Card.Content>
                                <Card.Header>
                                    <Icon name="redo alternate" color="orange"/> &nbsp;
                                    <font style={{color: "rgb(255,113,0)"}}>New Job Description</font>
                                </Card.Header>
                            </Card.Content>
                            <Card.Content>
                                {jobAdvert.jobAdvertisementUpdate.jobDescription}
                            </Card.Content>
                        </Card> : null}

                </Grid.Column>

                <Grid.Column width={6}>
                    <Table compact celled>

                        <Table.Header>
                            {(jobAdvert.employer?.verified || !jobAdvert.employer?.rejected) ? null :
                                <Label
                                    style={{marginRight: -90, marginTop: -7, backgroundColor: "rgba(226,14,14,0.22)"}}
                                    attached={"top right"} ribbon={"right"}>
                                    <Icon name="ban" color="red"/>Rejected
                                </Label>}
                            <Table.Row>
                                <Table.HeaderCell>
                                    {jobAdvert.employer?.companyName}
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign={"right"}>
                                    <Button basic color={color} onClick={() => {
                                        handleEmployerDetailClick(jobAdvert.employer?.id)
                                    }}>Company Detail</Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>

                            <Table.Row>
                                <Table.Cell> <Icon name={"envelope"}/> E-mail</Table.Cell>
                                <Table.Cell>{jobAdvert.employer?.email}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell> <Icon name={"phone"}/> Phone</Table.Cell>
                                <Table.Cell>{jobAdvert.employer?.phoneNumber}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell> <Icon name={"world"}/> Website</Table.Cell>
                                <Table.Cell>
                                    <a href={"https://" + jobAdvert.employer?.website}>{"https://" + jobAdvert.employer?.website}</a>
                                </Table.Cell>
                            </Table.Row>

                        </Table.Body>

                    </Table>
                </Grid.Column>
            </Grid>
        </div>
    );
}