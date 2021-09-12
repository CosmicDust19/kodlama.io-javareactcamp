import {Button, Card, Icon, Loader, Message, Segment} from "semantic-ui-react";
import FavoriteAdvertIcon from "../candidate/FavoriteAdvertIcon";
import {getCreatedAtAsStr} from "../../utilities/Utils";
import React from "react";
import {useHistory} from "react-router-dom";
import SInfoLabel from "./SInfoLabel";

function JobAdvertListPublic({jobAdverts, noAdvPublished, itemsPerRow, loading, noMsg = false}) {

    const history = useHistory();

    const handleAdvertisementClick = (jobAdvertId) => {
        history.push(`/jobAdverts/${jobAdvertId}`);
        window.scrollTo(0, 0);
    };

    const handleEmployerClick = (emplId) => {
        history.push(`/employers/${emplId}`);
        window.scrollTo(0, 0);
    };

    const unavailable = (jobAdvert) => jobAdvert.rejected === true || jobAdvert.employer.rejected === true

    if (!jobAdverts) return <Loader active inline='centered' size={"large"} style={{marginTop: 100}}/>

    if (noAdvPublished)
        return (
            <Message warning compact as={Segment} style={{float: "left"}} raised>
                <Icon name={"wait"} size={"large"}/>
                <font style={{verticalAlign: "middle"}}>No job advertisement found. Please wait for employers to add.</font>
            </Message>
        )

    if (jobAdverts.length === 0 && !noMsg)
        return (
            <Message warning compact as={Segment} style={{float: "left"}}>
                <Icon name={"warning sign"} size={"large"}/>
                <font style={{fontSize: "large", verticalAlign: "middle"}}>No results found.</font>
            </Message>
        )

    return (
        <Card.Group itemsPerRow={itemsPerRow} stackable doubling>
            {jobAdverts.map((jobAdvert) => (
                <Card color={"red"} key={jobAdvert.id} style={{borderRadius: 0}} raised fluid>
                    <Card.Content>
                        <Card.Header>
                            {jobAdvert.position.title}
                            <span style={{float: "right"}}>
                                <FavoriteAdvertIcon jobAdvert={jobAdvert} invisible={unavailable(jobAdvert)}/>
                                <SInfoLabel content={<div><Icon name="ban" color="red"/>Unavailable</div>}
                                            visible={unavailable(jobAdvert)} backgroundColor={"rgba(226,14,14,0.1)"}/>
                            </span>
                        </Card.Header>
                        <Card.Meta>
                            <Icon name="building outline" style={{color: "rgba(31,90,211,0.78)"}}/>&nbsp;
                            <font onClick={() => handleEmployerClick(jobAdvert.employer.id)}>{jobAdvert.employer.companyName}</font>
                        </Card.Meta>
                        <Card.Description>
                            <Icon name={"map marker"} style={{color: "rgba(0,111,255,0.66)"}}/>{jobAdvert.city.name}
                            <Button compact icon labelPosition='right' disabled={loading} floated={"right"} inverted
                                    onClick={() => handleAdvertisementClick(jobAdvert.id)}
                                    style={{borderRadius: 0, marginTop: -4, marginBottom: -4}}>
                                <Icon name='right arrow' color={"red"}/>See detail
                            </Button>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content>
                        <Card.Description>
                            {jobAdvert.workTime + " & " + jobAdvert.workModel}
                            <span style={{float: "right"}}>
                                    {getCreatedAtAsStr(jobAdvert.createdAt, true)}
                            </span>
                        </Card.Description>
                    </Card.Content>
                </Card>
            ))}
        </Card.Group>
    )
}

export default JobAdvertListPublic;