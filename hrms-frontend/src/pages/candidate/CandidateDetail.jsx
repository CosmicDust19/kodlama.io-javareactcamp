import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import CandidateService from "../../services/candidateService";
import {Grid, Header, Table, Icon, Item, Tab, Card, Segment, Button, Loader} from "semantic-ui-react";
import CandidateCvService from "../../services/candidateCvService";

export default function CandidateDetail() {

    let placeholderImageNames = ["elyse", "kristy", "lena", "lindsay", "mark", "matthew", "molly", "patrick", "rachel"]

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

    let color = colors[Math.floor(Math.random() * 12)]

    let {id} = useParams()

    const [candidate, setCandidate] = useState({});

    useEffect(() => {
        let candidateService = new CandidateService();
        candidateService.getById(id).then((result) => setCandidate(result.data.data));
    }, [id]);

    const [selectedCv, setSelectedCv] = useState({});

    useEffect(() => {
        let candidateCvService = new CandidateCvService();
        if (selectedCv.id !== undefined)
            candidateCvService.getById(selectedCv?.id).then((result) => setSelectedCv(result.data.data));
    }, [selectedCv.id]);

    const handleCvClick = id => {
        if (selectedCv.id !== id) setSelectedCv({id: id})
    };

    function getAge() {
        return new Date().getFullYear() - candidate.birthYear
    }

    function doesHaveGithub() {
        return !!(candidate.githubAccountLink);
    }

    function doesHaveLinkedin() {
        return !!(candidate.linkedinAccountLink);
    }

    if (candidate === {}) {
        return <Loader active inline='centered' size={"large"}/>
    }

    function mainInfos() {
        return (
            <Grid stackable>
                <Grid.Column width={8}>
                    <Item.Group unstackable>
                        <Item color={color}>
                            <Item.Image
                                src={`https://semantic-ui.com/images/avatar2/large/${placeholderImageNames[Math.floor(Math.random() * 9)]}.png`}/>
                            <Item.Content>
                                <Item.Header as='a'>
                                    <Header>
                                        {candidate.firstName}
                                        <Header.Subheader>{candidate.lastName}</Header.Subheader>
                                    </Header></Item.Header>
                                <Item.Meta>{getAge() + " years old"}</Item.Meta>
                                <Item.Description>
                                    <Icon name={"envelope"}/>{"  " + candidate.email}
                                </Item.Description>
                                {doesHaveLinkedin() || doesHaveGithub() ?
                                    <Item.Extra>
                                        {doesHaveGithub() ?
                                            <a href={candidate.githubAccountLink}>
                                                <Icon name={"github"} size="big" color={"black"}/>
                                            </a> : null}
                                        {doesHaveLinkedin() ?
                                            <a href={candidate.linkedinAccountLink}>
                                                <Icon name={"linkedin"} size="big"/>
                                            </a> : null}
                                    </Item.Extra>
                                    : null}
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={8}>
                    {candidate.candidateCvs?.length !== 0 ?
                        <Table basic={"very"} compact selectable collapsing celled unstackable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>CV Title</Table.HeaderCell>
                                    <Table.HeaderCell>Creation Date</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {candidate.candidateCvs?.map((candidateCv) => (
                                    <Table.Row onClick={() => {
                                        handleCvClick(candidateCv.id);
                                    }} key={candidateCv.id}>
                                        <Table.Cell>{candidateCv.title}</Table.Cell>
                                        <Table.Cell>
                                            {" " + new Date(candidateCv.createdAt).getDate() + " " +
                                            months[new Date(candidateCv.createdAt).getMonth()] + " " +
                                            new Date(candidateCv.createdAt).getFullYear()}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table> : null}
                </Grid.Column>
            </Grid>
        )
    }

    function details(candidateJobExperiences, candidateSkills, candidateSchools, candidateLanguages) {
        return (
            <Grid>
                <Header style={{marginTop: 20}}>
                    {((candidateJobExperiences?.length === 0 && candidateSkills?.length === 0 &&
                        candidateSchools?.length === 0 && candidateLanguages?.length === 0) ||
                        (!candidateJobExperiences && !candidateSkills &&
                            !candidateSchools && !candidateLanguages)) ?
                        "No info found." : null}
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
                                        <Table.HeaderCell>Workplace</Table.HeaderCell>
                                        <Table.HeaderCell>Position</Table.HeaderCell>
                                        <Table.HeaderCell>Start Year</Table.HeaderCell>
                                        <Table.HeaderCell>Quit Year</Table.HeaderCell>
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
                                        <Table.HeaderCell>Schools</Table.HeaderCell>
                                        <Table.HeaderCell>Department</Table.HeaderCell>
                                        <Table.HeaderCell>Start Year</Table.HeaderCell>
                                        <Table.HeaderCell>Graduation Year</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {candidateSchools?.map((candidateSchool) => (
                                        <Table.Row key={candidateSchool.id}>
                                            <Table.Cell>{candidateSchool.school?.name}</Table.Cell>
                                            <Table.Cell>{candidateSchool.department?.name}</Table.Cell>
                                            <Table.Cell>{candidateSchool.schoolStartYear}</Table.Cell>
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

    function cvDetail() {

        if (!selectedCv.id && candidate.candidateCvs?.length !== 0) {
            return (
                <Header>
                    Please select a cv from cvs table.
                </Header>
            )
        } else if (candidate.candidateCvs?.length === 0) {
            return (
                <Header>
                    No cv found for this candidate.
                </Header>
            )
        }

        return (
            <div>
                {selectedCv?.coverLetter ?
                    <Card fluid color={color}>

                        <Card.Content>
                            <Card.Header>
                                Cover Letter
                            </Card.Header>
                        </Card.Content>

                        <Card.Content>
                            {selectedCv?.coverLetter}
                        </Card.Content>

                    </Card> : null}


                {details(
                    selectedCv?.candidateJobExperiences, selectedCv?.candidateSkills,
                    selectedCv?.candidateSchools, selectedCv?.candidateLanguages
                )}
                <Segment basic>
                    <Table basic={"very"} textAlign="right">
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    Created at
                                    {` ${new Date(selectedCv?.createdAt).getDate()} 
                                    ${months[new Date(selectedCv?.createdAt).getMonth()]} 
                                    ${new Date(selectedCv?.createdAt).getFullYear()} `}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Segment>
            </div>
        )
    }

    const panes = [
        {
            menuItem: 'Details', render: () => details(
                candidate.candidateJobExperiences, candidate.candidateSkills,
                candidate.candidateSchools, candidate.candidateLanguages
            )
        },
        {menuItem: 'Cv', render: () => cvDetail()}
    ]

    const Tabs = () => (
        <Tab menu={{secondary: true, pointing: true}} panes={panes} style={{marginTop: 40}} defaultActiveIndex={1}/>
    )

    return (
        <div>
            {mainInfos()}
            <Tabs/>
        </div>
    )
}