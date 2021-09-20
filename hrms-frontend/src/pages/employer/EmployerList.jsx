import React, {useEffect, useState} from "react";
import EmployerService from "../../services/employerService";
import {Card, Loader, Transition} from "semantic-ui-react";
import EmployerSummary from "../../components/employer/EmployerSummary";

export default function EmployerList() {

    const [visible, setVisible] = useState(false);
    const [employers, setEmployers] = useState();
    const [verticalScreen, setVerticalScreen] = useState(window.innerWidth < window.innerHeight);

    useEffect(() => {
        setTimeout(() => setVisible(true), 50)
        return () => {
            setEmployers(undefined)
            setVerticalScreen(undefined)
            setVisible(undefined)
        }
    }, []);


    useEffect(() => {
        const employerService = new EmployerService();
        employerService.getPublic().then((result) => setEmployers(result.data.data));
    }, []);

    if (!employers) return <Loader active inline='centered' size={"large"}/>

    return (
        <Transition visible={visible} duration={200}>
            <div>
                <Card.Group itemsPerRow={verticalScreen ? 1 : 2} as="div">
                    {employers.map(employer => <EmployerSummary employer={employer} key={employer.id}/>)}
                </Card.Group>
            </div>
        </Transition>
    );
}