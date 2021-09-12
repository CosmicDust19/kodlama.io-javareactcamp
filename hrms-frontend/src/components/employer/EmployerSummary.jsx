import {Card, Header, Icon, Segment, Table} from "semantic-ui-react";
import SInfoLabel from "../common/SInfoLabel";
import React from "react";
import {useHistory} from "react-router-dom";
import UserAvatar from "../common/UserAvatar";

function EmployerSummary({employer}) {

    const history = useHistory();

    const handleEmployerDetailClick = id => {
        history.push(`/employers/${id}`);
        window.scrollTo(0, 0)
    }

    const logo = employer.profileImgId ?
        <UserAvatar user={employer} style={{marginRight: 8, marginLeft: 3, height: 30, width: 30}}/> :
        <Icon name={"building outline"} size={"large"} color={"black"} style={{}}/>

    return (
        <Card onClick={() => handleEmployerDetailClick(employer?.id)} fluid raised
              style={{borderRadius: 0, backgroundColor: "rgba(0,0,0,0.02)"}}>
            <Card.Content>
                <Card.Header style={{marginBottom: -20}}>
                    {logo}<font color={"black"} style={{fontSize: 17}}>{employer?.companyName}</font>
                    <SInfoLabel visible={employer?.rejected === true} basic attached={"top right"}
                                content={<div><Icon name="ban" color="red"/>Rejected</div>}
                                style={{backgroundColor: "rgba(226,14,14,0.22)"}}/>
                </Card.Header>
            </Card.Content>
            <Segment vertical style={{marginBottom: -14}} basic>
                <Table striped onClick={() => handleEmployerDetailClick(employer?.id)} style={{borderRadius: 0}} celled>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell collapsing> <Icon name={"envelope"} color={"red"}/> E-mail</Table.Cell>
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