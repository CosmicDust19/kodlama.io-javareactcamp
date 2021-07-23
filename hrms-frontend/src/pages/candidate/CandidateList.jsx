import React, {useState, useEffect} from "react";
import CandidateService from "../../services/candidateService";
import {Card, Image, Loader, Placeholder} from "semantic-ui-react";
import {useHistory} from "react-router-dom";

export default function CandidateList() {

    let placeholderImageNames = ["elyse", "kristy", "lena", "lindsay", "mark", "matthew", "molly", "patrick", "rachel"]

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        let candidateService = new CandidateService();
        candidateService.getAll().then((result) => setCandidates(result.data.data));
        setTimeout(() => {
            setLoading(false)
        }, 1500)
    }, []);

    let history = useHistory();

    const handleCandidateClick = id => {
        history.push(`/candidates/${id}`);
        window.scrollTo(0, 0);
    };

    if (candidates.length === 0) {
        return <Loader active inline='centered' size={"large"}/>
    }

    return (
        <div>
            <Card.Group itemsPerRow={3} stackable>
                {candidates.map((candidate) => (
                    <Card style={{borderRadius: 5}} onClick={() => {
                        handleCandidateClick(candidate.id);
                    }} key={candidate.id}>
                        {loading ?
                            <Placeholder>
                                <Placeholder.Image square/>
                            </Placeholder> :
                            <Image
                                src={`https://semantic-ui.com/images/avatar2/large/${placeholderImageNames[Math.floor(Math.random() * 9)]}.png`}/>}
                        <Card.Content>
                            <Card.Header>{candidate.firstName}</Card.Header>
                            <Card.Meta>
                                <span>{candidate.lastName}</span>
                            </Card.Meta>
                            <Card.Description>
                                {candidate.email}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            Birth Year | {candidate.birthYear}
                        </Card.Content>
                    </Card>
                ))}
            </Card.Group>
            {loading ?
                <div>
                    <Image src={`https://semantic-ui.com/images/avatar2/large/elyse.png`} style={{opacity: 0}} size={"mini"}/>
                    <Image src={`https://semantic-ui.com/images/avatar2/large/kristy.png`} style={{opacity: 0}} size={"mini"}/>
                    <Image src={`https://semantic-ui.com/images/avatar2/large/lena.png`} style={{opacity: 0}} size={"mini"}/>
                    <Image src={`https://semantic-ui.com/images/avatar2/large/lindsay.png`} style={{opacity: 0}} size={"mini"}/>
                    <Image src={`https://semantic-ui.com/images/avatar2/large/mark.png`} style={{opacity: 0}} size={"mini"}/>
                    <Image src={`https://semantic-ui.com/images/avatar2/large/matthew.png`} style={{opacity: 0}} size={"mini"}/>
                    <Image src={`https://semantic-ui.com/images/avatar2/large/molly.png`} style={{opacity: 0}} size={"mini"}/>
                    <Image src={`https://semantic-ui.com/images/avatar2/large/patrick.png`} style={{opacity: 0}} size={"mini"}/>
                    <Image src={`https://semantic-ui.com/images/avatar2/large/rachel.png`} style={{opacity: 0}} size={"mini"}/>
                </div>: null}
        </div>
    );
}
