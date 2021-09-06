import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import CandidateService from "../../services/candidateService";
import {Button, Grid, Header, Icon, Item, Loader, Segment, Table} from "semantic-ui-react";
import {getRandomColor, getRandomImg} from "../../utilities/Utils";

export default function CandidateDetail() {

    const color = getRandomColor()

    const {id} = useParams();
    const [candidate, setCandidate] = useState({});

    useEffect(() => {
        const candidateService = new CandidateService();
        candidateService.getById(id).then((result) => setCandidate(result.data.data));
    }, [id]);

    const age = new Date().getFullYear() - candidate.birthYear
    const hasGithub = !!candidate.githubAccountLink;
    const hasLinkedin = !!candidate.linkedinAccountLink;

    if (candidate === {}) return <Loader active inline='centered' size={"large"}/>

    function mainInfos() {
        return (
            <Grid stackable>
                <Grid.Column width={8}>
                    <Item.Group>
                        <Item color={color}>
                            <Item.Image src={getRandomImg("large")}/>
                            <Item.Content verticalAlign={"middle"}>
                                <Item.Header as='a'>
                                    <Header>
                                        {candidate.firstName}
                                        <Header.Subheader content={candidate.lastName}/>
                                    </Header>
                                </Item.Header>
                                <Item.Meta content={age + " years old"}/>
                                <Item.Description>
                                    <Icon name={"envelope"}/>&nbsp;{candidate.email}
                                </Item.Description>
                                {hasLinkedin || hasGithub ?
                                    <Item.Extra>
                                        {hasGithub ?
                                            <a href={candidate.githubAccountLink}>
                                                <Icon name={"github"} size="big" color={"black"}/>
                                            </a> : null}
                                        {hasLinkedin ?
                                            <a href={candidate.linkedinAccountLink}>
                                                <Icon name={"linkedin"} size="big"/>
                                            </a> : null}
                                    </Item.Extra>
                                    : null}
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
            </Grid>
        )
    }

    return (
        <div>
            {mainInfos()}
            {details(candidate.candidateJobExperiences, candidate.candidateSchools, candidate.candidateLanguages, candidate.candidateSkills)}
        </div>
    )
}

function details(candJobExps, candSchools, candLangs, candSkills) {

    const noDetail =
        (candJobExps?.length === 0 && candSkills?.length === 0 && candSchools?.length === 0 && candLangs?.length === 0) ||
        (!candJobExps && !candSkills && !candSchools && !candLangs)

    return (
        <div style={{marginRight: -20, marginLeft: -20}}>
            <Header style={{marginTop: 20, marginLeft: 20}} content={noDetail ? "No Detail found" : null}/>
            <Grid stackable style={{marginTop: 10}}>
                {candJobExps?.length !== 0 && candJobExps ?
                    <Grid.Column width={8}>
                        <Header textAlign={"center"} dividing color="green" content={"Job Experiences"}/>
                        <Table basic={"very"} size="large" celled unstackable textAlign="center">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell content={"Workplace"}/>
                                    <Table.HeaderCell content={"Position"}/>
                                    <Table.HeaderCell content={"Start Year"}/>
                                    <Table.HeaderCell content={"Quit Year"}/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {candJobExps?.map((candJobExp) => (
                                    <Table.Row key={candJobExp.id}>
                                        <Table.Cell content={candJobExp.workPlace}/>
                                        <Table.Cell content={candJobExp.position?.title}/>
                                        <Table.Cell content={candJobExp.startYear}/>
                                        <Table.Cell content={candJobExp.quitYear === null ? "Continues" : candJobExp.quitYear}/>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Grid.Column> : null}

                {candSchools?.length !== 0 && candSchools ?
                    <Grid.Column width={8}>
                        <Header textAlign={"center"} dividing color="yellow">
                            Schools
                        </Header>
                        <Table basic={"very"} size="large" celled unstackable textAlign="center">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell content={"Schools"}/>
                                    <Table.HeaderCell content={"Department"}/>
                                    <Table.HeaderCell content={"Start Year"}/>
                                    <Table.HeaderCell content={"Graduation Year"}/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {candSchools?.map((candSchool) => (
                                    <Table.Row key={candSchool.id}>
                                        <Table.Cell content={candSchool.school?.name}/>
                                        <Table.Cell content={candSchool.department?.name}/>
                                        <Table.Cell content={candSchool.startYear}/>
                                        <Table.Cell content={candSchool.graduationYear === null ? "Continues" : candSchool.graduationYear}/>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Grid.Column> : null}

                {candLangs?.length !== 0 && candLangs ?
                    <Grid.Column width={8}>
                        <Header textAlign={"center"} dividing color="violet" content={"Languages"}/>
                        <Table basic={"very"} size="large" celled unstackable textAlign="center">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell content={"Languages"}/>
                                    <Table.HeaderCell content={"Level(CEFR)"}/>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {candLangs?.map((candLang) => (
                                    <Table.Row key={candLang.id}>
                                        <Table.Cell content={candLang.language?.name}/>
                                        <Table.Cell content={candLang.languageLevel}/>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Grid.Column> : null}

                {candSkills?.length !== 0 && candSkills ?
                    <Grid.Column width={8}>
                        <Header textAlign={"center"} dividing color="pink" content={"Skills"}/>
                        <Segment basic>
                            {candSkills?.map((candSkill) => (
                                <Button key={candSkill.id} color={getRandomColor()} circular
                                        style={{marginTop: 6, marginLeft: 5}} content={candSkill.skill?.name}/>
                            ))}
                        </Segment>
                    </Grid.Column> : null}
            </Grid>
        </div>
    )
}