import {Icon, Loader, Message, Segment, Table, Transition} from "semantic-ui-react";
import {getEmployerColor} from "../../utilities/EmployerUtils";
import SysEmplEmployerDropdown from "./SysEmplEmployerDropdown";
import React, {useEffect, useState} from "react";
import EmployerInfoLabels from "../employer/EmployerInfoLabels";
import EmployerLogo from "../employer/EmployerLogo";

function EmployerMngList({employers}) {

    const [visible, setVisible] = useState(false);
    const [hidden, setHidden] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setVisible(true)
        return () => {
            setVisible(undefined)
            setHidden(undefined)
            setLoading(undefined)
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setHidden(false)
        }, 400)
    }, []);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 150)
    }, [employers]);

    if (!employers) return <Loader active inline='centered' size={"large"} style={{marginTop: 100}}/>

    if (employers.length === 0)
        return (
            <Message warning compact as={Segment} style={{float: "left"}} hidden={hidden}>
                <Icon name={"warning sign"} size={"big"}/>
                <font style={{fontSize: "large", verticalAlign: "middle"}}>No results found.</font>
            </Message>
        )

    return (
        <Transition visible={visible} duration={200}>
            <div>
                <Table style={{borderRadius: 0, opacity: loading ? 0.8 : 1}} padded>
                    <Table.Body>
                        {employers.map((employer) => (
                            <Table.Row style={{backgroundColor: getEmployerColor(employer)}} key={employer.id}>
                                <Table.Cell collapsing>
                                    <EmployerLogo user={employer} size={"mini"} defImgSize={26} avatar/>&nbsp;&nbsp;
                                    {employer.companyName}
                                </Table.Cell>
                                <Table.Cell collapsing>
                                    <Icon name={"phone"} color={"yellow"}/>
                                    {employer.phoneNumber}
                                </Table.Cell>
                                <Table.Cell collapsing>
                                    <Icon name={"mail outline"} color={"red"}/>
                                    {employer.email}
                                </Table.Cell>
                                <Table.Cell collapsing>
                                    <Icon name={"world"} color={"blue"}/>
                                    {employer.website}
                                </Table.Cell>
                                <Table.Cell textAlign={"center"} verticalAlign={"middle"}>
                                    <EmployerInfoLabels employer={employer}/>
                                </Table.Cell>
                                <Table.Cell collapsing>
                                    <SysEmplEmployerDropdown employer={employer} infoOption fluid direction={undefined}/>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </Transition>
    )
}

export default EmployerMngList;