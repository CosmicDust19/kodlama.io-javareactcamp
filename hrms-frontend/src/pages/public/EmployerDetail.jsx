import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import EmployerService from "../../services/employerService";
import {Card, Dropdown, Grid, Header, Icon, Label, Loader, Table} from "semantic-ui-react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {useDispatch, useSelector} from "react-redux";
import {changeEmployer} from "../../store/actions/filterActions";
import {toast} from "react-toastify";
import {getRandomColor, handleCatch, months} from "../../utilities/Utils";

export default function EmployerDetail() {

    const employerService = new EmployerService();

    const dispatch = useDispatch();
    const {id} = useParams()
    const userProps = useSelector(state => state?.user?.userProps)

    const [employer, setEmployer] = useState({});
    const [jobAdvertisements, setJobAdvertisements] = useState([]);

    const history = useHistory();

    const handleAdvertisementClick = id => {
        history.push(`/jobAdverts/${id}`);
        window.scrollTo(0, 0)
    };

    useEffect(() => {
        const employerService = new EmployerService();
        const jobAdvertService = new JobAdvertisementService();
        employerService.getById(id).then((result) => setEmployer(result.data.data));
        if (String(userProps.userType) === "systemEmployee" && employer.id)
            jobAdvertService.getAllByEmployerId(employer.id).then(result => setJobAdvertisements(result.data.data))
        else if (employer.id)
            jobAdvertService.getPublicByEmployerId(employer.id).then(result => setJobAdvertisements(result.data.data))
    }, [employer.id, id, userProps.userType]);

    const systemEmployee = String(userProps.userType) === "systemEmployee";

    const changeVerification = (employer, status) => {
        employerService.updateVerification(employer.id, status).then(r => {
            dispatch(changeEmployer(employer.id, r.data.data))
            setEmployer(r.data.data)
            toast("Successful")
        }).catch(handleCatch)
    }

    const verifyUpdate = (employer) => {
        employerService.applyChanges(employer.id).then(r => {
            dispatch(changeEmployer(employer.id, r.data.data))
            setEmployer(r.data.data)
            toast("Successful")
        }).catch(handleCatch)
    }

    if (employer === {}) return <Loader active inline='centered' size={"large"} style={{marginTop: 300}}/>

    return (
        <div>
            <Table celled size={"large"} padded="very" basic="very">

                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell textAlign={"center"} width={1}>
                            <Header content={employer.companyName}/>
                            {systemEmployee && employer.companyName !== employer.employerUpdate?.companyName ?
                                <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}} size={"large"}>
                                    <Icon name="redo alternate" color="orange"/>{employer.employerUpdate?.companyName}
                                </Label> : null}
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign={"right"}>
                            {String(userProps.userType) === "systemEmployee" ?
                                <div>
                                    {employer.verified === false && employer.rejected === null ?
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(0,94,255,0.1)"}}>
                                            <Icon name="bullhorn" color="blue"/>Release Approval
                                        </Label> : null}
                                    {employer.updateVerified === false ?
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(255,113,0,0.1)"}}>
                                            <Icon name="redo alternate" color="orange"/>Update Approval
                                        </Label> : null}
                                    {employer.verified === true ?
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(58,255,0,0.1)"}}>
                                            <Icon name="check circle outline" color="green"/>Verified
                                        </Label> : null}
                                    {employer.rejected === true ?
                                        <Label style={{marginTop: 10, backgroundColor: "rgba(226,14,14,0.1)"}}>
                                            <Icon name="ban" color="red"/>Rejected
                                        </Label> : null}
                                    <Dropdown item icon={<Icon name="ellipsis vertical" color="yellow"/>}
                                              simple labeled direction={"left"}>
                                        <Dropdown.Menu
                                            style={{
                                                marginTop: 0, marginLeft: -6,
                                                backgroundColor: "rgba(250,250,250, 0.7)", borderRadius: 10
                                            }}>
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
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div> : null}
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>

                    <Table.Row>
                        <Table.Cell> <Icon name={"envelope"}/> Email </Table.Cell>
                        <Table.Cell>
                            {employer.email} &nbsp;
                            {systemEmployee && employer.email !== employer.employerUpdate?.email ?
                                <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                    <Icon name="redo alternate" color="orange"/>{employer.employerUpdate?.email}
                                </Label> : null}
                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell> <Icon name={"phone"}/> Phone </Table.Cell>
                        <Table.Cell>
                            {employer.phoneNumber} &nbsp;
                            {systemEmployee && employer.phoneNumber !== employer.employerUpdate?.phoneNumber ?
                                <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                    <Icon name="redo alternate" color="orange"/>{employer.employerUpdate?.phoneNumber}
                                </Label> : null}
                        </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell> <Icon name={"world"}/>Website </Table.Cell>
                        <Table.Cell>
                            <a href={"https://" + employer.website}>{employer.website}</a> &nbsp;
                            {systemEmployee && employer.website !== employer.employerUpdate?.website ?
                                <Label style={{backgroundColor: "rgba(255,113,0,0.1)"}}>
                                    <Icon name="redo alternate" color="orange"/>{employer.employerUpdate?.website}
                                </Label> : null}
                        </Table.Cell>
                    </Table.Row>

                </Table.Body>
            </Table>

            <Card.Group itemsPerRow={2} stackable style={{marginTop: 50}}>
                {jobAdvertisements.map((jobAdvert) => (
                    <Card color={getRandomColor()}
                          onClick={() => {
                              handleAdvertisementClick(jobAdvert.id);
                          }}
                          key={jobAdvert.id}>

                        <Card.Content>
                            <Card.Header>{jobAdvert.position.title}</Card.Header>
                            <Card.Meta>{employer.companyName}</Card.Meta>
                            <Card.Description>
                                <div>
                                    <Icon name={"map marker"}/> {jobAdvert.city.name}
                                </div>
                            </Card.Description>
                        </Card.Content>

                        <Card.Content>
                            <Card.Description>
                                <Grid>
                                    <Grid.Column width={8}>
                                        {jobAdvert.workTime + " & " + jobAdvert.workModel}
                                    </Grid.Column>
                                    <Grid.Column width={8} textAlign={"right"}>
                                        {new Date(jobAdvert.createdAt).getDate() + " " +
                                        months[new Date(jobAdvert.createdAt).getMonth()] + " " +
                                        new Date(jobAdvert.createdAt).getFullYear()}
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