import {Icon, Loader, Message, Segment, Table} from "semantic-ui-react";
import {getJobAdvertColor} from "../../utilities/JobAdvertUtils";
import {getRemainedDaysAsFont} from "../../utilities/Utils";
import JobAdvertInfoLabels from "../common/JobAdvertInfoLabels";
import SysEmplAdvertDropdown from "./SysEmplAdvertDropdown";
import React, {useEffect, useState} from "react";
import EmployerLogo from "../employer/EmployerLogo";

function JobAdvertMngList({jobAdverts, waitingResp, ...props}) {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 150)
        return () => setLoading(undefined)
    }, [jobAdverts]);

    if (waitingResp === true) return null
    else if (!jobAdverts) return <Loader active inline='centered' size={"large"} style={{marginTop: 120}}/>
    else if (jobAdverts.length === 0)
        return (
            <Message warning compact as={Segment} style={{float: "left", marginLeft: 20}}>
                <Icon name={"warning sign"} size={"large"}/>
                <font style={{fontSize: "large", verticalAlign: "middle"}}>No results found.</font>
            </Message>
        )

    return (
        <Table style={{borderRadius: 0, marginTop: -3, opacity: loading ? 0.8 : 1, backgroundColor: "rgba(241,241,241,0.5)"}} padded {...props}>
            <Table.Body>
                {jobAdverts.map(jobAdvert => (
                    <Table.Row style={{backgroundColor: getJobAdvertColor(jobAdvert)}} key={jobAdvert.id}>
                        <Table.Cell collapsing>
                            <EmployerLogo user={jobAdvert.employer} size={"mini"} defImgSize={26} avatar/>&nbsp;&nbsp;
                            {jobAdvert.employer.companyName}
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Icon name={"suitcase"} color={"teal"}/>
                            {jobAdvert.position.title}
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Icon name={"map marker alternate"} color={"red"}/>
                            {jobAdvert.city.name}
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Icon name={"users"} color={"yellow"}/>&nbsp;&nbsp;
                            {jobAdvert.openPositions}
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Icon name={"calendar alternate outline"} color={"purple"}/>&nbsp;&nbsp;
                            {getRemainedDaysAsFont(jobAdvert.deadline)}
                        </Table.Cell>
                        <Table.Cell textAlign={"center"} verticalAlign={"middle"}>
                            <JobAdvertInfoLabels jobAdvert={jobAdvert}/>
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <SysEmplAdvertDropdown jobAdvert={jobAdvert} infoOption fluid direction={undefined}/>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

export default JobAdvertMngList;