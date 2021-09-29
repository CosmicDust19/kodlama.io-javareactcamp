import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import EmployerService from "../../services/employerService";
import {Card, Grid, Icon, Loader, Table, Transition} from "semantic-ui-react";
import JobAdvertisementService from "../../services/jobAdvertisementService";
import {useSelector} from "react-redux";
import SInfoLabel from "../../components/common/SInfoLabel";
import SysEmplEmployerDropdown from "../../components/systemEmployee/SysEmplEmployerDropdown";
import EmployerInfoLabels from "../../components/employer/EmployerInfoLabels";
import SUpdateTableCell from "../../components/common/SUpdateTableCell";
import JobAdvertListPublic from "../../components/common/JobAdvertListPublic";
import EmployerLogo from "../../components/employer/EmployerLogo";

export default function EmployerDetail() {

    const {id} = useParams()
    const userProps = useSelector(state => state?.user?.userProps)
    const verticalScreen = window.innerWidth < window.innerHeight

    const [visible, setVisible] = useState(false);
    const [employer, setEmployer] = useState();
    const [jobAdverts, setJobAdverts] = useState();

    useEffect(() => {
        return () => {
            setEmployer(undefined)
            setJobAdverts(undefined)
        };
    }, []);

    useEffect(() => {
        const employerService = new EmployerService();
        const jobAdvertService = new JobAdvertisementService();
        employerService.getById(id).then((result) => setEmployer(result.data.data));
        if (String(userProps.userType) === "systemEmployee" && employer?.id)
            jobAdvertService.getAllByEmployerId(employer.id)
                .then(result => setJobAdverts(result.data.data))
                .finally(() => setVisible(true))
        else if (employer?.id)
            jobAdvertService.getPublicByEmployerId(employer.id)
                .then(result => setJobAdverts(result.data.data))
                .finally(() => setVisible(true))
    }, [employer?.id, id, userProps.userType]);

    if (!employer) return <Loader active inline='centered' size={"large"} style={{marginTop: 300}}/>

    const systemEmployee = String(userProps.userType) === "systemEmployee";
    const self = Number(id) === userProps.user?.id

    const updateColor = "rgba(255,113,0,0.1)"
    const updateIcon = <Icon name="redo alternate" color="orange"/>

    const compNameUpdated = employer.companyName !== employer.employerUpdate?.companyName
    const emailUpdated = employer.email !== employer.employerUpdate?.email
    const phoneNumberUpdated = employer.phoneNumber !== employer.employerUpdate?.phoneNumber
    const websiteUpdated = employer.website !== employer.employerUpdate?.website
    const tableInfosUpdated = emailUpdated || phoneNumberUpdated || websiteUpdated

    return (
        <Transition visible={visible} duration={300}>
            <div>
                <Card raised fluid
                      style={{borderRadius: 0, marginBottom: -1, marginTop: -1, backgroundColor: "rgba(240,240,240,0.35)"}}>
                    <Card.Content>
                        <Grid columns={"equal"} stackable>
                            <Grid.Column verticalAlign={"middle"}>
                                <EmployerLogo user={employer} size={"mini"} defImgSize={34}/> &nbsp;&nbsp;
                                <font style={{fontSize: "large"}}>{employer.companyName}</font> &nbsp;
                                <SInfoLabel content={<div>{updateIcon}{employer.employerUpdate?.companyName}</div>}
                                            size={"large"} visible={(systemEmployee || self) && compNameUpdated}
                                            backgroundColor={updateColor}/>
                            </Grid.Column>
                            <Grid.Column verticalAlign={"middle"} textAlign={"right"}>
                                <EmployerInfoLabels employer={employer}/>
                                <SysEmplEmployerDropdown employer={employer} setEmployer={setEmployer}/>
                            </Grid.Column>
                        </Grid>

                    </Card.Content>
                </Card>

                <Table celled size={"large"} padded striped style={{marginTop: 1, marginBottom: 23, borderRadius: 0, backgroundColor: "rgb(250,250,250, 0.7)"}}>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell width={2}><Icon name={"mail outline"} color={"red"}/>Email</Table.Cell>
                            <Table.Cell content={employer.email}/>
                            <SUpdateTableCell infoAuthorized={systemEmployee || self} visible={emailUpdated}
                                              emptyCell={tableInfosUpdated} content={employer.employerUpdate?.email}/>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell width={2}><Icon name={"phone"} color={"yellow"}/>Phone</Table.Cell>
                            <Table.Cell content={employer.phoneNumber}/>
                            <SUpdateTableCell infoAuthorized={systemEmployee || self} visible={phoneNumberUpdated}
                                              emptyCell={tableInfosUpdated} content={employer.employerUpdate?.phoneNumber}/>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell width={2}><Icon name={"world"} color={"blue"}/>Website</Table.Cell>
                            <Table.Cell content={<a href={"https://" + employer.website}>{employer.website}</a>}/>
                            <SUpdateTableCell
                                content={<a href={"https://" + employer.employerUpdate?.website}>{employer.employerUpdate?.website}</a>}
                                infoAuthorized={systemEmployee || self} visible={websiteUpdated}
                                emptyCell={tableInfosUpdated}/>
                        </Table.Row>
                    </Table.Body>
                </Table>

                <div align={"center"} style={verticalScreen ? {marginRight: -13.15, marginLeft: -13.15} : undefined}>
                    <JobAdvertListPublic jobAdverts={jobAdverts} itemsPerRow={2} noMsg/>
                </div>
            </div>
        </Transition>
    )
}