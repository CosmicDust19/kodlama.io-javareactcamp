import {Button, Card, Icon, Loader, Message, Segment} from "semantic-ui-react";
import FavoriteAdvertIcon from "../candidate/FavoriteAdvertIcon";
import {getCreatedAtAsStr} from "../../utilities/Utils";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import SInfoLabel from "./SInfoLabel";
import EmployerLogo from "../employer/EmployerLogo";

function JobAdvertListPublic({jobAdverts, itemsPerRow, noMsg = false, waitingResp, ...props}) {

    const history = useHistory();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => setLoading(undefined)
    }, []);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 300)
    }, [jobAdverts]);

    const handleAdvertisementClick = (jobAdvertId) => {
        history.push(`/jobAdverts/${jobAdvertId}`);
        window.scrollTo(0, 0);
    };

    const handleEmployerClick = (emplId) => {
        history.push(`/employers/${emplId}`);
        window.scrollTo(0, 0);
    };

    const unavailable = (jobAdvert) => jobAdvert.verified === false || jobAdvert.employer.verified === false

    if (waitingResp === true) return null
    else if (!jobAdverts) return <Loader active inline='centered' size={"large"} style={{marginTop: 100}}/>
    else if (jobAdverts.length === 0 && !noMsg)
        return (
            <Message warning compact as={Segment} style={{float: "left", marginLeft: 20}}>
                <Icon name={"warning sign"} size={"large"}/>
                <font style={{fontSize: "large", verticalAlign: "middle"}}>No results found.</font>
            </Message>
        )

    return (
        <Card.Group itemsPerRow={itemsPerRow} stackable doubling {...props}>
            {jobAdverts.map((jobAdvert) => (
                <Card color={"red"} key={jobAdvert.id} id={"job-advert-public-card"} raised fluid>
                    <Card.Content>
                        <Card.Header>
                            {jobAdvert.position.title}
                            <span style={{float: "right"}}>
                                <FavoriteAdvertIcon jobAdvert={jobAdvert} invisible={unavailable(jobAdvert)}/>
                                <SInfoLabel content={<div><Icon name="ban" color="red"/>Unavailable</div>}
                                            visible={unavailable(jobAdvert)} backgroundColor={"rgba(226,14,14,0.1)"}/>
                            </span>
                        </Card.Header>
                        <Card.Meta style={{marginTop: 3}}>
                            <EmployerLogo user={jobAdvert.employer} size={"mini"}/>&nbsp;&nbsp;
                            <font onClick={() => handleEmployerClick(jobAdvert.employer.id)}>{jobAdvert.employer.companyName}</font>
                        </Card.Meta>
                        <Card.Description style={{marginTop: 5}}>
                            <Icon name={"map marker alternate"} color={"blue"} size={"large"} style={{marginLeft: -1.5, marginRight: 5}}/>
                            &nbsp;{jobAdvert.city.name}
                            <Button compact icon labelPosition='right' disabled={loading} floated={"right"}
                                    onClick={() => handleAdvertisementClick(jobAdvert.id)} basic color={"red"}
                                    style={{borderRadius: 0, marginTop: -4, marginBottom: -4, opacity: 0.8}}>
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