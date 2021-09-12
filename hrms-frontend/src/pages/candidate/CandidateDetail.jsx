import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import CandidateService from "../../services/candidateService";
import {Loader} from "semantic-ui-react";
import {getRandomImg} from "../../utilities/Utils";
import MainInfos from "../../components/common/MainInfos";
import CandPropDetails from "../../components/candidate/CandPropDetails";

export default function CandidateDetail() {

    const {id} = useParams();
    const [candidate, setCandidate] = useState({});

    useEffect(() => {
        const candidateService = new CandidateService();
        candidateService.getById(id).then((result) => setCandidate(result.data.data));
    }, [id]);

    if (candidate === {}) return <Loader active inline='centered' size={"large"}/>

    return (
        <div>
            <MainInfos user={candidate} imgSrc={getRandomImg("large")} simple/>
            <CandPropDetails user={candidate}/>
        </div>
    )
}