import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import CandidateService from "../services/candidateService";
import {Card, Grid, Icon, Table, Header} from "semantic-ui-react";

export default function CandidateDetail() {

    let {id} = useParams()

    const colors = ['red', 'orange', 'yellow', 'olive', 'green',
        'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']

    const months = ["January", "February", "March", "April", "May",
        "June", "July", "August", "September", "October", "November", "December"]

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