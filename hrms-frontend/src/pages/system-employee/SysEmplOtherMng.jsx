import React from "react";
import {Grid, Icon} from "semantic-ui-react";
import SingleFieldObjMng from "../../components/systemEmployee/SingleFieldObjMng";
import PositionService from "../../services/positionService";
import CityService from "../../services/cityService";
import LanguageService from "../../services/languageService";
import SkillService from "../../services/skillService";
import SchoolService from "../../services/schoolService";
import DepartmentService from "../../services/departmentService";

function SysEmplOtherMng() {

    const positionService = new PositionService()
    const cityService = new CityService()
    const schoolService = new SchoolService()
    const departmentService = new DepartmentService()
    const languageService = new LanguageService()
    const skillService = new SkillService()

    const positionsHeader = <font><Icon name={"briefcase"}/>Positions</font>
    const citiesHeader = <font><Icon name={"factory"}/>Cities</font>
    const schoolsHeader = <font><Icon name={"student"}/>Schools</font>
    const departmentsHeader = <font><Icon name={"university"}/>Departments</font>
    const languagesHeader = <font><Icon name={"language"} size={"large"}/>Languages</font>
    const skillsHeader = <font><Icon name={"trophy"}/>Skills</font>

    const style = {marginBottom: 30}

    return (
        <div style={{marginTop: -50}}>
            <Grid stackable>
                <SingleFieldObjMng service={positionService} header={positionsHeader} fieldName={"title"} color={"violet"} style={style}/>
                <SingleFieldObjMng service={cityService} header={citiesHeader} fieldName={"name"} color={"yellow"} style={style}/>
                <SingleFieldObjMng service={schoolService} header={schoolsHeader} fieldName={"name"} color={"green"} style={style}/>
                <SingleFieldObjMng service={departmentService} header={departmentsHeader} fieldName={"name"} color={"red"} style={style}/>
                <SingleFieldObjMng service={languageService} header={languagesHeader} fieldName={"name"} color={"teal"} style={style}/>
                <SingleFieldObjMng service={skillService} header={skillsHeader} fieldName={"name"} color={"orange"} style={style}/>
            </Grid>
        </div>
    )
}

export default SysEmplOtherMng