import React, {useEffect, useState} from "react";
import CandidateService from "../../services/candidateService";
import {Card, Icon, Image, Loader, Placeholder, Transition} from "semantic-ui-react";
import {useHistory} from "react-router-dom";
import {getRandomImg, placeholderImageNames} from "../../utilities/Utils";
import Avatar from "../../components/common/Avatar";
import {getAge} from "../../utilities/UserUtils";

export default function CandidateList() {

    const [visible, setVisible] = useState(false);
    const [candidates, setCandidates] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        const candidateService = new CandidateService();
        candidateService.getAll()
            .then((result) => setCandidates(result.data.data))
            .finally(() => {
                setVisible(true)
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            });
        return () => {
            setVisible(undefined)
            setCandidates(undefined)
            setLoading(undefined)
        };
    }, []);

    const history = useHistory();

    const handleCandidateClick = id => {
        history.push(`/candidates/${id}`);
        window.scrollTo(0, 0);
    };

    if (!candidates) return <Loader active inline='centered' size={"large"}/>

    return (
        <Transition visible={visible} duration={200}>
            <div>
                <Card.Group itemsPerRow={3} stackable>
                    {candidates.map(candidate => (
                        <Card style={{borderRadius: 5, backgroundColor: "rgba(255,255,255,0.8)"}} onClick={() => handleCandidateClick(candidate.id)}
                              key={candidate.id}>
                            {loading ?
                                <Placeholder>
                                    <Placeholder.Image square/>
                                </Placeholder> : candidate.profileImg ?
                                    <Avatar image={candidate.profileImg} size={"big"} avatar={false}/> :
                                    <Image src={getRandomImg("large")}/>}
                            <Card.Content style={{height: 0, marginBottom: -28.5}}/>
                            <Card.Content extra>
                                <Card.Header content={candidate.firstName}/>
                                <Card.Meta content={candidate.lastName}/>
                                <Card.Description>
                                    <Icon name={"mail outline"} color={"red"}/>{candidate.email}
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Icon name={"calendar alternate outline"} color={"purple"}/>
                                {getAge(candidate.birthYear)} years old
                            </Card.Content>
                        </Card>
                    ))}
                </Card.Group>
                {loading ?
                    placeholderImageNames.map((imgName, index) =>
                        <Image src={`https://semantic-ui.com/images/avatar2/large/${imgName}.png`} style={{opacity: 0}}
                               size={"mini"} key={index}/>
                    ) : null}
            </div>
        </Transition>
    );
}
