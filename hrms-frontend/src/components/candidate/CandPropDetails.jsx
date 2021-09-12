import {Grid} from "semantic-ui-react";
import CandJobExpsTable from "./CandJobExpsTable";
import React from "react";
import CandSchoolsTable from "./CandSchoolsTable";
import CandLangsTable from "./CandLangsTable";
import CandSkillsSeg from "./CandSkillsSeg";

function CandPropDetails({user}) {

    const vertical = window.innerWidth < window.innerHeight

    return (
        <div style={{marginRight: -20, marginLeft: -20}}>
            <Grid stackable style={{marginTop: 10}}>
                <CandJobExpsTable unstackable user={user} vertical={vertical} defaultClosed={vertical} width={8}/>
                <CandSchoolsTable unstackable user={user} vertical={vertical} defaultClosed={vertical} width={8}/>
                <CandLangsTable unstackable user={user} vertical={vertical} defaultClosed={vertical}/>
                <CandSkillsSeg unstackable user={user} vertical={vertical} defaultClosed={vertical}/>
            </Grid>
        </div>
    )
}

export default CandPropDetails