import {Button, Divider, Grid, Header, Icon, Message, Segment,} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import CandJobExpsTable from "../../components/candidate/CandJobExpsTable";
import CandSchoolsTable from "../../components/candidate/CandSchoolsTable";
import CandLangsTable from "../../components/candidate/CandLangsTable";
import CandSkillsSeg from "../../components/candidate/CandSkillsSeg";

export function CandidateProfile() {

    const verticalScreen = window.innerWidth < window.innerHeight

    const userProps = useSelector(state => state?.user?.userProps)

    const [user, setUser] = useState(userProps.user);
    const [editable, setEditable] = useState(true);

    useEffect(() => {
        setUser(userProps.user)
    }, [userProps.user]);

    if (String(userProps.userType) !== "candidate") return <Header content={"😛🤪🤭"}/>

    const toggleEditable = () => setEditable(!editable)

    const noInfo =
        user.candidateJobExperiences.length === 0 &&
        user.candidateSchools.length === 0 &&
        user.candidateLanguages.length === 0 &&
        user.candidateSkills.length === 0

    const noInfoMessage =
        <Message info compact as={Segment} style={{float: "left", marginLeft: 20}} raised>
            <Icon name={"wait"} size={"large"}/>
            <font style={{verticalAlign: "middle"}}>No info has been entered.</font>
        </Message>

    return (
        <div style={{marginRight: -20, marginLeft: -20}}>
            <Segment basic  style={{marginLeft: 20, marginRight: 20, marginBottom: 10}}>
                <Header dividing content={"Manage Your Infos"} sub as="font"/>
                <Button compact size={"small"} onClick={toggleEditable} inverted floated={"right"}
                        style={{borderRadius: 0, marginTop: -3}} color={"vk"}>
                    <Icon name={editable ? "eye" : "edit"}/>
                    {editable ? <font style={{fontSize: 12}}>Simple</font> :
                        <font style={{fontSize: 12}}>Editable</font>}
                    &nbsp;view
                </Button>
            </Segment>
            <Grid stackable style={{marginRight: 20, marginLeft: 20}}>
                <CandJobExpsTable user={user} editable={editable} unstackable={!editable} vertical={verticalScreen}/>
                <CandSchoolsTable user={user} editable={editable} unstackable={!editable} vertical={verticalScreen}/>
                <CandLangsTable user={user} editable={editable} unstackable={!editable} vertical={verticalScreen}/>
                <CandSkillsSeg user={user} editable={editable} unstackable={!editable} vertical={verticalScreen}/>
            </Grid>
            <Divider style={{marginTop: 20}}/>
            {!editable && noInfo ? noInfoMessage : null}
        </div>
    )
}
