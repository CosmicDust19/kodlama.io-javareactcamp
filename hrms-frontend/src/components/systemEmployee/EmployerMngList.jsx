import {Icon, Loader, Message, Segment, Table} from "semantic-ui-react";
import {getEmployerColor} from "../../utilities/EmployerUtils";
import SInfoLabel from "../common/SInfoLabel";
import SysEmplEmployerDropdown from "./SysEmplEmployerDropdown";
import React from "react";

function EmployerMngList({employers, noEmplSignedUp}) {

    if (!employers) return <Loader active inline='centered' size={"large"} style={{marginTop: 100}}/>

    if (noEmplSignedUp)
        return (
            <Message warning compact as={Segment} style={{float: "left"}} raised>
                <Icon name={"wait"} size={"large"}/>
                <font style={{verticalAlign: "middle"}}>No employer signed up yet.</font>
            </Message>
        )

    if (employers.length === 0)
        return (
            <Message warning compact as={Segment} style={{float: "left"}}>
                <Icon name={"warning sign"} size={"big"}/>
                <font style={{fontSize: "large", verticalAlign: "middle"}}>No results found.</font>
            </Message>
        )

    return (
        <Table style={{borderRadius: 0}}>
            <Table.Body>
                {employers.map((employer) => (
                    <Table.Row style={{backgroundColor: getEmployerColor(employer)}} key={employer.id}>
                        <Table.Cell content={employer.companyName}/>
                        <Table.Cell content={employer.phoneNumber}/>
                        <Table.Cell content={employer.email}/>
                        <Table.Cell content={employer.website}/>
                        <Table.Cell textAlign={"center"} verticalAlign={"middle"}>
                            <SInfoLabel content={<div><Icon name="add user" color="blue"/>Sign Up Approval</div>}
                                        visible={employer.verified === false && employer.rejected === null}
                                        backgroundColor={"rgba(0,94,255,0.1)"}/>
                            <SInfoLabel content={<div><Icon name="redo alternate" color="orange"/>Update Approval</div>}
                                        visible={employer.updateVerified === false} backgroundColor={"rgba(255,113,0,0.1)"}/>
                            <SInfoLabel content={<div><Icon name="check circle outline" color="green"/>Verified</div>}
                                        visible={employer.verified === true} backgroundColor={"rgba(58,255,0,0.1)"}/>
                            <SInfoLabel content={<div><Icon name="ban" color="red"/>Rejected</div>}
                                        visible={employer.rejected === true} backgroundColor={"rgba(226,14,14,0.1)"}/>
                        </Table.Cell>
                        <Table.Cell>
                            <SysEmplEmployerDropdown employer={employer} infoOption fluid direction={undefined}/>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

export default EmployerMngList;