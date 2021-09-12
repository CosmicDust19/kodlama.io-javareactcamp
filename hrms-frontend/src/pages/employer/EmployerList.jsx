import React, {useEffect, useState} from "react";
import EmployerService from "../../services/employerService";
import {Card, Loader} from "semantic-ui-react";
import EmployerSummary from "../../components/employer/EmployerSummary";

export default function EmployerList() {

    const [employers, setEmployers] = useState();

    const verticalScreen = window.innerWidth < window.innerHeight

    useEffect(() => {
        const employerService = new EmployerService();
        employerService.getPublic().then((result) => setEmployers(result.data.data));
    }, []);

    if (!employers) return <Loader active inline='centered' size={"large"}/>

    return (
        <Card.Group itemsPerRow={verticalScreen ? 1 : 2} as="div">
            {employers.map(employer => <EmployerSummary employer={employer} key={employer.id}/>)}
        </Card.Group>
    );
}