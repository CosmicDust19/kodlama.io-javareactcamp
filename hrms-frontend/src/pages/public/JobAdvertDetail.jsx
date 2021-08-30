import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {Button, Card, Dropdown, Grid, Icon, Label, Loader, Table} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {changeFavoriteJobAdv} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import CandidateService from "../../services/candidateService";
import {changeJobAdvert, changeJobAdvVerification} from "../../store/actions/filterActions";

const jobAdvertisementService = new JobAdvertisementService();

export default function JobAdvertDetail() {

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']
    const color = colors[Math.floor(Math.random() * 12)]
    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

    const candidateService = new CandidateService();

    let {id} = useParams()
    let history = useHistory();
    const userProps = useSelector(state => state?.user?.userProps)
    const user = useSelector(state => state?.user?.userProps?.user)
    const dispatch = useDispatch();

    const systemEmployee = String(userProps.userType) === "systemEmployee";

    const handleEmployerDetailClick = id => {
        history.push(`/employers/${id}`);
    };

    const [jobAdvertisement, setJobAdvertisement] = useState({});
    const [refresh, setRefresh] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        jobAdvertisementService.getById(id).then((result) => setJobAdvertisement(result.data.data));
        setTimeout(() => {
            setLoading(false);
        }, 100)
    }, [id]);

    const isJobAdvInFavorites = () => {
        let index = user.favoriteJobAdvertisements.findIndex((jobAdvertisement2) => jobAdvertisement2.id === jobAdvertisement.id)
        return index !== -1;
    }

    function getSalary(jobAdvertisement) {
        if (!jobAdvertisement || (!jobAdvertisement.minSalary && !jobAdvertisement.maxSalary)) {
            return "No Salary Info"
        } else if (!jobAdvertisement.maxSalary) {
            return `more than ${jobAdvertisement.minSalary}$`
        } else if (!jobAdvertisement.minSalary) {
            return `less than ${jobAdvertisement.maxSalary}$`
        }
        return `between ${jobAdvertisement.minSalary} ~ ${jobAdvertisement.maxSalary}$`;
    }

    const salaryInfo = getSalary(jobAdvertisement)

    const updatedSalaryInfo = getSalary(jobAdvertisement.jobAdvertisementUpdate)

    const remainedDays = Math.round((new Date(jobAdvertisement.deadline).getTime() - new Date().getTime()) / 86400000)

    const getDeadlineInfo = (deadline) =>
        `${new Date(deadline).getDate()} ${months[new Date(deadline).getMonth()]} ${new Date(deadline).getFullYear()} | Remained ${remainedDays} day(s)`

    const deadlineInfo = getDeadlineInfo(jobAdvertisement.deadline)

    const updatedDeadlineInfo = getDeadlineInfo(jobAdvertisement.jobAdvertisementUpdate?.deadline)

    const handleCatch = (error) => {
        toast.warning("A problem has occurred")
        console.log(error.response)
    }

    const refreshComp = () => {
        if (refresh === true) setRefresh(false);
        else setRefresh(true)
    }

    const handleAddToFavorites = () => {
        candidateService.addJobAdvToFavorites(user.id, jobAdvertisement.id).then(r => {
            console.log(r)
            if (r.data.success) {
                user.favoriteJobAdvertisements.push(jobAdvertisement)
                dispatch(changeFavoriteJobAdv(user.favoriteJobAdvertisements))
                toast.error("Added To Favorites  😍")
                refreshComp()
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const handleDeleteFromFavorites = () => {
        candidateService.removeJobAdvFromFavorites(user.id, jobAdvertisement.id).then(r => {
            console.log(r)
            if (r.data.success) {
                let index = user.favoriteJobAdvertisements.findIndex((jobAdvertisement2) => {
                    return jobAdvertisement2.id === jobAdvertisement.id
                })
                user.favoriteJobAdvertisements.splice(index, 1)
                dispatch(changeFavoriteJobAdv(user.favoriteJobAdvertisements))
                toast("Deleted From Favorites")
                refreshComp()
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const handleChangeVerification = (jobAdv, status) => {
        if (systemEmployee)
            jobAdvertisementService.updateVerification(jobAdv.id, status).then(() => {
                dispatch(changeJobAdvVerification(jobAdv.id, status))
                jobAdvertisementService.getById(jobAdv.id).then(r => setJobAdvertisement(r.data.data))
                toast("Successful")
            }).catch(handleCatch)
    }

    const verifyUpdate = (jobAdvert) => {
        jobAdvertisementService.applyChanges(jobAdvert.id).then(r => {
            dispatch(changeJobAdvert(jobAdvert.id, r.data.data))
            setJobAdvertisement(r.data.data)
            toast("Successful")
            refreshComp()
        }).catch(handleCatch)
    }

    if (jobAdvertisement === {} || loading)
        return <Loader active inline='centered' size={"large"} style={{marginTop: "15em"}}/>

    return (
        <div>
            <Card color={color} fluid>

                <Card.Content>
                    <Grid>
                        <Grid.Column width={8}>
                            <Card.Header>
                                <font style={{fontSize: "large"}}>{jobAdvertisement.position?.title}</font> &nbsp;
                                {systemEmployee && jobAdvertisement.position?.id !== jobAdvertisement.jobAdvertisementUpdate?.position?.id ?
                                    <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                        <Icon name="redo alternate" color="orange"/>
                                        {jobAdvertisement.jobAdvertisementUpdate.position.title}
                                    </Label> : null}
                            </Card.Header>
                            <Card.Meta>{jobAdvertisement.employer?.companyName}</Card.Meta>
                        </Grid.Column>
                        <Grid.Column width={8} textAlign={"right"}>
                            {user?.favoriteJobAdvertisements ?
                                (isJobAdvInFavorites(jobAdvertisement.id) ?
                                    <Icon name={"heart"} color={"red"} size="large" onClick={() => {
                                        handleDeleteFromFavorites(jobAdvertisement.id)
                                    }}/> :
                                    <Icon name={"heart outline"} size="large" onClick={() => {
                                        handleAddToFavorites(jobAdvertisement.id)
                                    }}/>) : null}
                            {systemEmployee ?
                                <div>
                                    {!jobAdvertisement.verified && jobAdvertisement.rejected === null ?
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
                                    {<Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>}
                                               simple labeled>
                                        <Dropdown.Menu
                                            style={{
                                                marginTop: 0, marginLeft: -6,
                                                backgroundColor: "rgba(250,250,250, 0.7)", borderRadius: 10
                                            }}>
                                            {jobAdvertisement.updateVerified === false ?
                                                <Dropdown.Item
                                                    onClick={() => verifyUpdate(jobAdvertisement)}>
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
                                        </Dropdown.Menu>
                                    </Dropdown>}
                                </div> : null}
                        </Grid.Column>
                    </Grid>
                    <Card.Description>
                        <Icon name={"map marker"}/> {jobAdvertisement.city?.name} &nbsp;
                        {systemEmployee && jobAdvertisement.city?.id !== jobAdvertisement.jobAdvertisementUpdate?.city?.id ?
                            <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                <Icon name="redo alternate"
                                      color="orange"/>{jobAdvertisement.jobAdvertisementUpdate.city.name}
                            </Label> : null}
                    </Card.Description>
                </Card.Content>

                <Card.Content>
                    <Card.Description>
                        {jobAdvertisement.workTime + " & " + jobAdvertisement.workModel} &nbsp;
                        {systemEmployee && jobAdvertisement.workTime !== jobAdvertisement.jobAdvertisementUpdate?.workTime ?
                            <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                <Icon name="redo alternate"
                                      color="orange"/>{jobAdvertisement.jobAdvertisementUpdate.workTime}
                            </Label> : null} &nbsp;
                        {systemEmployee && jobAdvertisement.workModel !== jobAdvertisement.jobAdvertisementUpdate?.workModel ?
                            <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                <Icon name="redo alternate"
                                      color="orange"/>{jobAdvertisement.jobAdvertisementUpdate.workModel}
                            </Label> : null}
                    </Card.Description>
                </Card.Content>

                {salaryInfo !== "No Salary Info" || systemEmployee ?
                    <Card.Content>
                        Salary | {salaryInfo} &nbsp;
                        {systemEmployee && salaryInfo !== updatedSalaryInfo ?
                            <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                <Icon name="redo alternate" color="orange"/>{updatedSalaryInfo}
                            </Label> : null}
                    </Card.Content> : null}

                <Card.Content>
                    Application deadline | {deadlineInfo} &nbsp;
                    {systemEmployee && deadlineInfo !== updatedDeadlineInfo ?
                        <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                            <Icon name="redo alternate" color="orange"/>{updatedDeadlineInfo}
                        </Label> : null}
                </Card.Content>

                <Card.Content>
                    <Grid>
                        <Grid.Column width={8}>
                            Open Positions |{` ${jobAdvertisement.openPositions}`} &nbsp;
                            {systemEmployee && jobAdvertisement.openPositions !== jobAdvertisement.jobAdvertisementUpdate?.openPositions ?
                                <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                    <Icon name="redo alternate"
                                          color="orange"/>{jobAdvertisement.jobAdvertisementUpdate.openPositions}
                                </Label> : null}
                        </Grid.Column>
                        <Grid.Column width={8} textAlign={"right"}>Created at
                            {" " + new Date(jobAdvertisement.createdAt).getDate() + " " +
                            months[new Date(jobAdvertisement.createdAt).getMonth()] + " " +
                            new Date(jobAdvertisement.createdAt).getFullYear()}
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
                            {jobAdvertisement.jobDescription}
                        </Card.Content>
                    </Card>

                    {systemEmployee && jobAdvertisement.jobDescription !== jobAdvertisement.jobAdvertisementUpdate?.jobDescription ?
                        <Card fluid color={color}>
                            <Card.Content>
                                <Card.Header>
                                    <Icon name="redo alternate" color="orange"/> &nbsp;
                                    <font style={{color: "rgb(255,113,0)"}}>New Job Description</font>
                                </Card.Header>
                            </Card.Content>
                            <Card.Content>
                                {jobAdvertisement.jobAdvertisementUpdate.jobDescription}
                            </Card.Content>
                        </Card> : null}

                </Grid.Column>

                <Grid.Column width={6}>
                    <Table compact celled>

                        <Table.Header>
                            {(jobAdvertisement.employer?.verified || !jobAdvertisement.employer?.rejected) ? null :
                                <Label
                                    style={{marginRight: -90, marginTop: -7, backgroundColor: "rgba(226,14,14,0.22)"}}
                                    attached={"top right"} ribbon={"right"}>
                                    <Icon name="ban" color="red"/>Rejected
                                </Label>}
                            <Table.Row>
                                <Table.HeaderCell>
                                    {jobAdvertisement.employer?.companyName}
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign={"right"}>
                                    <Button basic color={color} onClick={() => {
                                        handleEmployerDetailClick(jobAdvertisement.employer?.id)
                                    }}>Company Detail</Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>

                            <Table.Row>
                                <Table.Cell> <Icon name={"envelope"}/> E-mail</Table.Cell>
                                <Table.Cell>{jobAdvertisement.employer?.email}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell> <Icon name={"phone"}/> Phone</Table.Cell>
                                <Table.Cell>{jobAdvertisement.employer?.phoneNumber}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell> <Icon name={"world"}/> Website</Table.Cell>
                                <Table.Cell>
                                    <a href={"https://" + jobAdvertisement.employer?.website}>{"https://" + jobAdvertisement.employer?.website}</a>
                                </Table.Cell>
                            </Table.Row>

                        </Table.Body>

                    </Table>
                </Grid.Column>
            </Grid>
        </div>
    );
}