import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import EmployerService from "../../services/employerService";
import {Card, Grid, Icon, Table, Header, Loader, Label} from "semantic-ui-react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {useSelector} from "react-redux";

export default function EmployerDetail() {

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

    let {id} = useParams()
    const userProps = useSelector(state => state?.user?.userProps)

    const [employer, setEmployer] = useState({});
    const [jobAdvertisements, setJobAdvertisements] = useState([]);

    let history = useHistory();

    const handleAdvertisementClick = id => {
        history.push(`/jobAdvertisements/${id}`);
        window.scrollTo(0,0)
    };

    useEffect(() => {
        const employerService = new EmployerService();
        const jobAdvertisementService = new JobAdvertisementService()
        employerService.getById(id).then((result) => setEmployer(result.data.data));
        jobAdvertisementService.getEmployerJobs(employer.id).then(result => setJobAdvertisements(result.data.data))
    }, [employer.id, id]);

    if (employer === {}){
        return <Loader active inline='centered' size={"large"} style = {{marginTop: 300}}/>
    }

    return (
        <div>
            <Table celled size={"large"} padded = "very" basic = "very">

                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell textAlign={"right"} width={1}>
                            <Header>
                                {employer.companyName}
                            </Header>
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign={"right"}>
                            {String(userProps.userType) === "systemEmployee" ?
                                <div>
                                    {!employer.systemVerificationStatus && employer.systemRejectionStatus === null ?
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(0,94,255,0.1)"}}>
                                            <Icon name="bullhorn" color="blue"/>Release Approval
                                        </Label> : null}
                                    {employer.updateVerificationStatus === undefined ? null :
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(255,113,0,0.1)"}}>
                                            <Icon name="redo alternate" color="orange"/>Update Approval
                                        </Label>}
                                    {!employer.systemVerificationStatus ? null :
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(58,255,0,0.1)"}}>
                                            <Icon name="check circle outline" color="green"/>Verified
                                        </Label>}
                                </div> : null }
                            {(employer.systemVerificationStatus || !employer.systemRejectionStatus) ? null :
                                <Label style={{marginTop: 10, backgroundColor: "rgba(226,14,14,0.1)"}}>
                                    <Icon name="ban" color="red"/>Rejected
                                </Label>}
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>

                    <Table.Row>
                        <Table.Cell> <Icon name={"envelope"}/> E-mail</Table.Cell>
                        <Table.Cell>{employer.email}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell> <Icon name={"phone"}/> Phone</Table.Cell>
                        <Table.Cell>{employer.phoneNumber}</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell> <Icon name={"world"}/> Website</Table.Cell>
                        <Table.Cell>
                            <a href={"https://" + employer.website}>{employer.website}</a>
                        </Table.Cell>
                    </Table.Row>

                </Table.Body>
            </Table>

            <Card.Group itemsPerRow={2} stackable style = {{marginTop : 50}}>
                {jobAdvertisements.map((jobAdvertisement) => (
                    <Card color={colors[Math.floor(Math.random() * 12)]}
                          onClick={() => {
                              handleAdvertisementClick(jobAdvertisement.id);
                          }}
                          key={jobAdvertisement.id}>

                        <Card.Content>
                            <Card.Header>{jobAdvertisement.position.title}</Card.Header>
                            <Card.Meta>{employer.companyName}</Card.Meta>
                            <Card.Description>
                                <div>
                                    <Icon name={"map marker"}/> {jobAdvertisement.city.name}
                                </div>
                            </Card.Description>
                        </Card.Content>

                        <Card.Content>
                            <Card.Description>
                                <Grid>
                                    <Grid.Column width={8}>
                                        {jobAdvertisement.workTime + " & " + jobAdvertisement.workModel}
                                    </Grid.Column>
                                    <Grid.Column width={8} textAlign={"right"}>
                                        {new Date(jobAdvertisement.createdAt).getDate() + " " +
                                        months[new Date(jobAdvertisement.createdAt).getMonth()] + " " +
                                        new Date(jobAdvertisement.createdAt).getFullYear()}
                                    </Grid.Column>
                                </Grid>
                            </Card.Description>
                        </Card.Content>

                    </Card>
                ))}
            </Card.Group>
        </div>
    )
}