import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import EmployerService from "../../services/employerService";
import {Card, Grid, Icon, Loader, Table} from "semantic-ui-react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {useSelector} from "react-redux";
import SInfoLabel from "../../components/common/SInfoLabel";
import SysEmplEmployerDropdown from "../../components/systemEmployee/SysEmplEmployerDropdown";
import EmployerInfoLabels from "../../components/employer/EmployerInfoLabels";
import SUpdateTableCell from "../../components/common/SUpdateTableCell";
import JobAdvertListPublic from "../../components/common/JobAdvertListPublic";
import UserAvatar from "../../components/common/UserAvatar";

export default function EmployerDetail() {

    const {id} = useParams()
    const userProps = useSelector(state => state?.user?.userProps)

    const [employer, setEmployer] = useState();
    const [jobAdverts, setJobAdverts] = useState();

    useEffect(() => {
        const employerService = new EmployerService();
        const jobAdvertService = new JobAdvertisementService();
        employerService.getById(id).then((result) => setEmployer(result.data.data));
        if (String(userProps.userType) === "systemEmployee" && employer?.id)
            jobAdvertService.getAllByEmployerId(employer.id).then(result => setJobAdverts(result.data.data))
        else if (employer?.id)
            jobAdvertService.getPublicByEmployerId(employer.id).then(result => setJobAdverts(result.data.data))
    }, [employer?.id, id, userProps.userType]);

    if (!employer) return <Loader active inline='centered' size={"large"} style={{marginTop: 300}}/>

    const systemEmployee = String(userProps.userType) === "systemEmployee";
    const self = Number(id) === userProps.user?.id

    const logo = employer.profileImgId ?
        <UserAvatar user={employer} style={{height: 30, width: 30, marginBottom: 4}}/> :
        <Icon name={"building outline"} size={"large"} style={{marginBottom: 4}}/>

    const updateColor = "rgba(255,113,0,0.1)"
    const updateIcon = <Icon name="redo alternate" color="orange"/>

    const compNameUpdated = employer.companyName !== employer.employerUpdate?.companyName
    const emailUpdated = employer.email !== employer.employerUpdate?.email
    const phoneNumberUpdated = employer.phoneNumber !== employer.employerUpdate?.phoneNumber
    const websiteUpdated = employer.website !== employer.employerUpdate?.website
    const tableInfosUpdated = emailUpdated || phoneNumberUpdated || websiteUpdated

    return (
        <div>
            <Card raised fluid style={{borderRadius: 0, marginBottom: -1, marginTop: -1, backgroundColor: "rgba(0,0,0,0.02)"}}>
                <Card.Content>
                    <Grid columns={"equal"} stackable>
                        <Grid.Column verticalAlign={"middle"}>
                            {logo}&nbsp;&nbsp;
                            <font style={{fontSize: "large"}}>{employer.companyName}</font> &nbsp;
                            <SInfoLabel content={<div>{updateIcon}{employer.employerUpdate?.companyName}</div>} size={"large"}
                                        visible={(systemEmployee || self) && compNameUpdated} backgroundColor={updateColor}/>
                        </Grid.Column>
                        <Grid.Column verticalAlign={"middle"} textAlign={"right"}>
                            <EmployerInfoLabels employer={employer}/>
                            <SysEmplEmployerDropdown employer={employer} setEmployer={setEmployer}/>
                        </Grid.Column>
                    </Grid>

                </Card.Content>
            </Card>

            <Table celled size={"large"} padded striped style={{marginTop: 1, marginBottom: 23, borderRadius: 0}}>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell width={2}><Icon name={"envelope"} color={"red"}/>Email</Table.Cell>
                        <Table.Cell content={employer.email}/>
                        <SUpdateTableCell infoAuthorized={systemEmployee || self} visible={emailUpdated} emptyCell={tableInfosUpdated}
                                          content={employer.employerUpdate?.email}/>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell width={2}><Icon name={"phone"} color={"yellow"}/>Phone</Table.Cell>
                        <Table.Cell content={employer.phoneNumber}/>
                        <SUpdateTableCell infoAuthorized={systemEmployee || self} visible={phoneNumberUpdated} emptyCell={tableInfosUpdated}
                                          content={employer.employerUpdate?.phoneNumber}/>
                    </Table.Row>

                    <Table.Row>
                        <Table.Cell width={2}><Icon name={"world"} color={"blue"}/>Website</Table.Cell>
                        <Table.Cell content={<a href={"https://" + employer.website}>{employer.website}</a>}/>
                        <SUpdateTableCell
                            content={<a href={"https://" + employer.employerUpdate?.website}>{employer.employerUpdate?.website}</a>}
                            infoAuthorized={systemEmployee || self} visible={websiteUpdated} emptyCell={tableInfosUpdated}/>
                    </Table.Row>
                </Table.Body>
            </Table>

            <JobAdvertListPublic jobAdverts={jobAdverts} itemsPerRow={2} noMsg/>
        </div>
    )
}