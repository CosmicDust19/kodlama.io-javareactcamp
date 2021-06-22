import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import CandidateService from "../services/candidateService";

export default function CandidateDetail() {

    let {id} = useParams()

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const [candidate, setCandidate] = useState({});

    let history = useHistory();

    useEffect(() => {
        let candidateService = new CandidateService();
        candidateService.getById(id).then((result) => setCandidate(result.data.data));
    }, [id]);

    return (
        <div>

        </div>
    )
}