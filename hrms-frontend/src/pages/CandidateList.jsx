import React, {useState, useEffect} from "react";
import CandidateService from "../services/candidateService";
import {Card, Image} from "semantic-ui-react";
import {useHistory} from "react-router-dom";

export default function CandidateList() {

    let placeholderImageNames = ["elyse", "kristy", "lena", "lindsay", "mark", "matthew", "molly", "patrick", "rachel"]

    const [candidates, setCandidate] = useState([]);

    useEffect(() => {
        let candidateService = new CandidateService();
        candidateService.getCandidates().then((result) => setCandidate(result.data.data));
    }, []);

    let history = useHistory();

    const handleCandidateClick = id => {
        history.push(`/candidates/${id}`);
    };

    return (
        <div>
            <Card.Group itemsPerRow={3} stackable>
                {candidates.map((candidate) => (
                    <Card onClick={() => {
                        handleCandidateClick(candidate.id);
                    }} key={candidate.id}>
                        <Image
                            src={`https://semantic-ui.com/images/avatar2/large/${placeholderImageNames[Math.floor(Math.random() * 9)]}.png`}
                            wrapped ui={false}/>
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

        </div>
    );
}