import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import JobAdvertisementService from "../services/jobAdvertisementService";
import {Button, Card, Grid, Icon, Table, Header, Loader, Label} from "semantic-ui-react";
import {useDispatch, useSelector} from "react-redux";
import {changeFavoriteJobAdv} from "../store/actions/userActions";
import {toast} from "react-toastify";
import CandidateService from "../services/candidateService";

export default function JobAdvertisementDetail() {

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']
    let color = colors[Math.floor(Math.random() * 12)]
    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

    const candidateService = new CandidateService();

    let {id} = useParams()
    let history = useHistory();
    const userProps = useSelector(state => state?.user?.userProps)
    const user = useSelector(state => state?.user?.userProps?.user)
    const dispatch = useDispatch();

    const handleEmployerDetailClick = id => {
        history.push(`/employers/${id}`);
    };

    const [jobAdvertisement, setJobAdvertisement] = useState({});
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        let jobAdvertisementService = new JobAdvertisementService();
        jobAdvertisementService.getById(id).then((result) => setJobAdvertisement(result.data.data));
        setTimeout(() => {
            setLoading(false);
        }, 100)
    }, [id]);

    const isJobAdvInFavorites = () => {
        let index = user.favoriteJobAdvertisements.findIndex((jobAdvertisement2) => jobAdvertisement2.id === jobAdvertisement.id)
        return index !== -1;
    }

    function salaryInfo() {
        if (!jobAdvertisement.minSalary && !jobAdvertisement.maxSalary) {
            return null
        } else if (!jobAdvertisement.maxSalary) {
            return `more than ${jobAdvertisement.minSalary}$`
        } else if (!jobAdvertisement.minSalary) {
            return `less than ${jobAdvertisement.maxSalary}$`
        }
        return `between ${jobAdvertisement.minSalary} ~ ${jobAdvertisement.maxSalary}$`;
    }

    let remainedDays = Math.round((new Date(jobAdvertisement.applicationDeadline).getTime() - new Date().getTime()) / 86400000)

    const handleAddToFavorites = () => {
        candidateService.addJobAdvertisementToFavorites(user.id, jobAdvertisement.id).then(r => {
            console.log(r)
            if (r.data.success) {
                user.favoriteJobAdvertisements.push(jobAdvertisement)
                dispatch(changeFavoriteJobAdv(user.favoriteJobAdvertisements))
                toast.error("Added To Favorites  😍")
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    const handleDeleteFromFavorites = () => {
        candidateService.deleteJobAdvertisementToFavorites(user.id, jobAdvertisement.id).then(r => {
            console.log(r)
            if (r.data.success) {
                let index = user.favoriteJobAdvertisements.findIndex((jobAdvertisement2) => {
                    return jobAdvertisement2.id === jobAdvertisement.id
                })
                user.favoriteJobAdvertisements.splice(index, 1)
                dispatch(changeFavoriteJobAdv(user.favoriteJobAdvertisements))
                toast("Deleted From Favorites")
                if (refresh === 0) setRefresh(1);
                else setRefresh(0)
            } else toast.warning("A problem has occurred")
        }).catch(reason => {
            console.log(reason)
            toast.warning("A problem has occurred")
        })
    }

    if (jobAdvertisement === {} || loading) {
        return <Loader active inline='centered' size={"large"} style={{marginTop: "15em"}}/>
    }

    return (
        <div>
            <Card color={color} fluid>

                <Card.Content>
                    <Grid>
                        <Grid.Column width={8}>
                            <Card.Header>
                                <Header>{jobAdvertisement.position?.title}</Header>
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
                            {String(userProps.userType) === "systemEmployee" ?
                                <div>
                                    {!jobAdvertisement.systemVerificationStatus && jobAdvertisement.systemRejectionStatus === null ?
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(0,94,255,0.1)"}}>
                                            <Icon name="bullhorn" color="blue"/>Release Approval
                                        </Label> : null}
                                    {jobAdvertisement.updateVerificationStatus === undefined ? null :
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(255,113,0,0.1)"}}>
                                            <Icon name="redo alternate" color="orange"/>Update Approval
                                        </Label>}
                                    {!jobAdvertisement.systemVerificationStatus ? null :
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(58,255,0,0.1)"}}>
                                            <Icon name="check circle outline" color="green"/>Verified
                                        </Label>}
                                    {(jobAdvertisement.systemVerificationStatus || !jobAdvertisement.systemRejectionStatus) ? null :
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(226,14,14,0.1)"}}>
                                            <Icon name="ban" color="red"/>Rejected
                                        </Label>}
                                    {!jobAdvertisement.activationStatus ? null :
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(57,255,0,0.1)"}}>
                                            <Icon name="checkmark" color="green"/>Active
                                        </Label>}
                                    {jobAdvertisement.activationStatus ? null :
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(76,16,11,0.1)"}}>
                                            <Icon name="minus circle" color="brown"/>Inactive
                                        </Label>}
                                </div> : null }
                        </Grid.Column>
                    </Grid>
                    <Card.Description>
                        <Icon name={"map marker"}/> {jobAdvertisement.city?.name}
                    </Card.Description>
                </Card.Content>

                <Card.Content>
                    <Card.Description>
                        {jobAdvertisement.workTime + " & " + jobAdvertisement.workModel}
                    </Card.Description>
                </Card.Content>

                {salaryInfo() ?
                    <Card.Content>
                        Salary | {salaryInfo()}
                    </Card.Content> : null}

                <Card.Content>Application deadline
                    | {" " + new Date(jobAdvertisement.applicationDeadline).getDate() + " " +
                    months[new Date(jobAdvertisement.applicationDeadline).getMonth()] + " " +
                    new Date(jobAdvertisement.applicationDeadline).getFullYear()} |
                    Remained {remainedDays} {(remainedDays > 1) ? "days" : "day"}
                </Card.Content>

                <Card.Content>
                    <Grid>
                        <Grid.Column width={8}>
                            Number of candidates to be hired |{" " + jobAdvertisement.numberOfPeopleToBeHired}
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
                </Grid.Column>

                <Grid.Column width={6}>
                    <Table compact celled>

                        <Table.Header>
                            {(jobAdvertisement.employer?.systemVerificationStatus || !jobAdvertisement.employer?.systemRejectionStatus) ? null :
                                <Label style={{marginRight: -90, marginTop: -7,backgroundColor: "rgba(226,14,14,0.22)"}} attached={"top right"} ribbon={"right"}>
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