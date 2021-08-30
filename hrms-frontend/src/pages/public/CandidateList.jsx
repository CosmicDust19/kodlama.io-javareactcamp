import React, {useState, useEffect} from "react";
import CandidateService from "../../services/candidateService";
import {Card, Image, Loader, Placeholder} from "semantic-ui-react";
import {useHistory} from "react-router-dom";

export default function CandidateList() {

    const imageNames = ["elyse", "kristy", "lena", "lindsay", "mark", "matthew", "molly", "patrick", "rachel"]

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        const candidateService = new CandidateService();
        candidateService.getAll().then((result) => setCandidates(result.data.data));
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, []);

    const history = useHistory();

    const handleCandidateClick = id => {
        history.push(`/candidates/${id}`);
        window.scrollTo(0, 0);
    };

    if (candidates.length === 0) return <Loader active inline='centered' size={"large"}/>

    return (
        <div>
            <Card.Group itemsPerRow={3} stackable>
                {candidates.map(candidate => (
                    <Card style={{borderRadius: 5}} onClick={() => handleCandidateClick(candidate.id)}
                          key={candidate.id}>
                        {loading ?
                            <Placeholder>
                                <Placeholder.Image square/>
                            </Placeholder> :
                            <Image src={`https://semantic-ui.com/images/avatar2/large/${imageNames[Math.floor(Math.random() * 9)]}.png`}/>}
                        <Card.Content>
                            <Card.Header content={candidate.firstName}/>
                            <Card.Meta content={candidate.lastName}/>
                            <Card.Description content={candidate.email}/>
                        </Card.Content>
                        <Card.Content extra content={`Birth Year | ${candidate.birthYear}`}/>
                    </Card>
                ))}
            </Card.Group>
            {loading ?
                imageNames.map(imgName =>
                    <Image src={`https://semantic-ui.com/images/avatar2/large/${imgName}.png`} style={{opacity: 0}}
                           size={"mini"} key={imageNames.indexOf(imgName)}/>
                ) : null}
        </div>
    );
}
