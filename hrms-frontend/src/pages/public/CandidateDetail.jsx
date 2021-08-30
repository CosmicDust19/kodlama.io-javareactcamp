import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import CandidateService from "../../services/candidateService";
import {Grid, Header, Table, Icon, Item, Button, Loader} from "semantic-ui-react";

export default function CandidateDetail() {

    const placeholderImageNames = ["elyse", "kristy", "lena", "lindsay", "mark", "matthew", "molly", "patrick", "rachel"]
    const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']
    const color = colors[Math.floor(Math.random() * 12)]

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
                            <Item.Image
                                src={`https://semantic-ui.com/images/avatar2/large/${placeholderImageNames[Math.floor(Math.random() * 9)]}.png`}
                            />
                            <Item.Content verticalAlign={"middle"}>
                                <Item.Header as='a'>
                                    <Header>
                                        {candidate.firstName}
                                        <Header.Subheader>{candidate.lastName}</Header.Subheader>
                                    </Header>
                                </Item.Header>
                                <Item.Meta>{age + " years old"}</Item.Meta>
                                <Item.Description>
                                    <Icon name={"envelope"}/>{"  " + candidate.email}
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

    function details(candidateJobExperiences, candidateSchools, candidateLanguages, candidateSkills) {

        const noDetail =
            (candidateJobExperiences?.length === 0 && candidateSkills?.length === 0 && candidateSchools?.length === 0 && candidateLanguages?.length === 0) ||
            (!candidateJobExperiences && !candidateSkills && !candidateSchools && !candidateLanguages)

        return (
            <Grid>
                <Header style={{marginTop: 20}}>
                    {noDetail ? "No Detail found" : null}
                </Header>
                <Grid stackable style={{marginTop: 10}}>
                    {candidateJobExperiences?.length !== 0 && candidateJobExperiences ?
                        <Grid.Column width={8}>
                            <Header textAlign={"center"} dividing color="green">
                                Job Experiences
                            </Header>
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
                                    {candidateJobExperiences?.map((candidateJobExperience) => (
                                        <Table.Row key={candidateJobExperience.id}>
                                            <Table.Cell>{candidateJobExperience.workPlace}</Table.Cell>
                                            <Table.Cell>{candidateJobExperience.position?.title}</Table.Cell>
                                            <Table.Cell>{candidateJobExperience.startYear}</Table.Cell>
                                            <Table.Cell>{candidateJobExperience.quitYear === null ? "Continues" : candidateJobExperience.quitYear}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Grid.Column> : null}

                    {candidateSchools?.length !== 0 && candidateSchools ?
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
                                    {candidateSchools?.map((candidateSchool) => (
                                        <Table.Row key={candidateSchool.id}>
                                            <Table.Cell>{candidateSchool.school?.name}</Table.Cell>
                                            <Table.Cell>{candidateSchool.department?.name}</Table.Cell>
                                            <Table.Cell>{candidateSchool.startYear}</Table.Cell>
                                            <Table.Cell>{candidateSchool.graduationYear === null ? "Continues" : candidateSchool.graduationYear}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Grid.Column> : null}

                    {candidateLanguages?.length !== 0 && candidateLanguages ?
                        <Grid.Column width={8}>
                            <Header textAlign={"center"} dividing color="violet">
                                Languages
                            </Header>
                            <Table basic={"very"} size="large" celled unstackable textAlign="center">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Languages</Table.HeaderCell>
                                        <Table.HeaderCell>Level(CEFR)</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {candidateLanguages?.map((candidateLanguage) => (
                                        <Table.Row key={candidateLanguage.id}>
                                            <Table.Cell>{candidateLanguage.language?.name}</Table.Cell>
                                            <Table.Cell>{candidateLanguage.languageLevel}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Grid.Column> : null}

                    {candidateSkills?.length !== 0 && candidateSkills ?
                        <Grid.Column width={8}>
                            <Header textAlign={"center"} dividing color="pink">
                                Skills
                            </Header>
                            <Grid padded relaxed>
                                {candidateSkills?.map((candidateSkill) => (
                                    <Button key={candidateSkill.id} color={colors[Math.floor(Math.random() * 12)]}
                                            circular style={{marginTop: 6, marginLeft: 5}}>
                                        {candidateSkill.skill?.name}
                                    </Button>
                                ))}
                            </Grid>
                        </Grid.Column> : null}
                </Grid>
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