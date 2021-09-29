import {Card, Icon, Segment, Table} from "semantic-ui-react";
import SInfoLabel from "../common/SInfoLabel";
import React from "react";
import {useHistory} from "react-router-dom";
import EmployerLogo from "./EmployerLogo";

function EmployerSummary({employer}) {

    const history = useHistory();

    const handleEmployerDetailClick = id => {
        history.push(`/employers/${id}`);
        window.scrollTo(0, 0)
    }

    return (
        <Card onClick={() => handleEmployerDetailClick(employer?.id)} fluid raised
              style={{borderRadius: 0, backgroundColor: "rgba(240,240,240,0.35)"}}>
            <Card.Content>
                <Card.Header style={{marginBottom: -20}}>
                    <EmployerLogo user={employer} size={"mini"} defImgSize={28}/> &nbsp;
                    <font color={"black"} style={{fontSize: 17}}>{employer?.companyName}</font>
                    <SInfoLabel visible={employer?.rejected === true} basic attached={"top right"}
                                content={<div><Icon name="ban" color="red"/>Rejected</div>}
                                style={{backgroundColor: "rgba(226,14,14,0.22)"}}/>
                </Card.Header>
            </Card.Content>
            <Segment vertical style={{marginBottom: -14}} basic>
                <Table striped onClick={() => handleEmployerDetailClick(employer?.id)}
                       style={{borderRadius: 0, backgroundColor: "rgb(250,250,250, 0.7)"}} celled>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell collapsing> <Icon name={"mail outline"} color={"red"}/> E-mail</Table.Cell>
                            <Table.Cell content={employer?.email}/>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell collapsing> <Icon name={"phone"} color={"yellow"}/> Phone</Table.Cell>
                            <Table.Cell content={employer?.phoneNumber}/>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell collapsing> <Icon name={"world"} color={"blue"}/> Website</Table.Cell>
                            <Table.Cell>
                                <a href={"https://" + employer?.website}>{"https://" + employer?.website}</a>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Segment>
        </Card>
    )
}

export default EmployerSummary;