import {Icon, Loader, Message, Segment, Table} from "semantic-ui-react";
import {getJobAdvertColor} from "../../utilities/JobAdvertUtils";
import {getRemainedDaysAsFont} from "../../utilities/Utils";
import JobAdvertInfoLabels from "../common/JobAdvertInfoLabels";
import SysEmplAdvertDropdown from "./SysEmplAdvertDropdown";
import React from "react";

function JobAdvertMngList({jobAdverts, noAdvPublished}) {

    if (!jobAdverts) return <Loader active inline='centered' size={"large"} style={{marginTop: 100}}/>

    if (noAdvPublished)
        return (
            <Message warning compact as={Segment} style={{float: "left"}} raised>
                <Icon name={"wait"} size={"large"}/>
                <font style={{verticalAlign: "middle"}}>No job advertisement found. Please wait for employers to add.</font>
            </Message>
        )

    if (jobAdverts.length === 0)
        return (
            <Message warning compact as={Segment} style={{float: "left"}}>
                <Icon name={"warning sign"} size={"big"}/>
                <font style={{fontSize: "large", verticalAlign: "middle"}}>No results found.</font>
            </Message>
        )

    return (
        <Table style={{borderRadius: 0, marginTop: -3}}>
            <Table.Body>
                {jobAdverts.map(jobAdvert => (
                    <Table.Row style={{backgroundColor: getJobAdvertColor(jobAdvert)}} key={jobAdvert.id}>
                        <Table.Cell content={jobAdvert.employer.companyName}/>
                        <Table.Cell content={jobAdvert.position.title}/>
                        <Table.Cell content={jobAdvert.city.name}/>
                        <Table.Cell content={getRemainedDaysAsFont(jobAdvert.deadline)}/>
                        <Table.Cell textAlign={"center"} verticalAlign={"middle"}>
                            <JobAdvertInfoLabels jobAdvert={jobAdvert}/>
                        </Table.Cell>
                        <Table.Cell>
                            <SysEmplAdvertDropdown jobAdvert={jobAdvert} infoOption fluid direction={undefined}/>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

export default JobAdvertMngList;