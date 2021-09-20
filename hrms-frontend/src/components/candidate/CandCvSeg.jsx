import CandCvTitleSeg from "./CandCvTitleSeg";
import CandCvCoverLetterSeg from "./CandCvCoverLetterSeg";
import {Button, Grid, Header, Popup} from "semantic-ui-react";
import CandJobExpsTable from "./CandJobExpsTable";
import CandSchoolsTable from "./CandSchoolsTable";
import CandLangsTable from "./CandLangsTable";
import CandSkillsSeg from "./CandSkillsSeg";
import {getCreatedAtAsStr, handleCatch} from "../../utilities/Utils";
import React, {useEffect, useState} from "react";
import {changeCandCVs} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import CandidateCvService from "../../services/candidateCvService";
import {useDispatch} from "react-redux";
import Avatar from "../common/Avatar";
import ImageUploadModal from "../common/ImageUploadModal";

function CandCvSeg({user, cv, setIndex}) {

    const candidateCvService = new CandidateCvService()

    const dispatch = useDispatch();

    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        return () => setPopupOpen(undefined)
    }, []);

    const verticalScreen = window.innerWidth < window.innerHeight

    const deleteCv = () => {
        candidateCvService.deleteById(cv.id).then(() => {
            const cvIndex = user.cvs.findIndex(userCv => cv.id === userCv.id)
            user.cvs.splice(cvIndex, 1)
            dispatch(changeCandCVs(user.cvs))
            setIndex(user.cvs.length - 1)
            toast("CV Deleted")
            window.scrollTo(0, 0)
        }).catch(handleCatch)
    }

    return (
        <div style={{marginRight: -10, marginLeft: -10}}>

            <Grid style={{marginBottom: -10}} stackable>
                <Grid.Column width={3} style={{marginTop: -15}} verticalAlign={"middle"}>
                    <Avatar image={cv.image} size={"small"} avatar={false} centered/>
                    <ImageUploadModal user={user} cv={cv}
                                      style={{marginTop: 20, marginRight: 107, borderRadius: 20, opacity: 0.85, width: 33}}/>
                </Grid.Column>
                <Grid.Column width={13}>
                    <CandCvTitleSeg user={user} cv={cv}/>
                    <CandCvCoverLetterSeg user={user} cv={cv}/>
                </Grid.Column>
            </Grid>
            <Grid stackable>
                <CandJobExpsTable user={user} cv={cv} unstackable editable small={verticalScreen}/>
                <CandSchoolsTable user={user} cv={cv} unstackable editable small={verticalScreen}/>
                <CandLangsTable user={user} cv={cv} unstackable editable small={verticalScreen}/>
                <CandSkillsSeg user={user} cv={cv} unstackable editable small={verticalScreen}/>
            </Grid>

            <font style={{float: "right", marginTop: 25}}>{getCreatedAtAsStr(cv?.createdAt)}</font>
            <br/>
            <Header dividing/>
            <Popup
                trigger={<Button icon={"x"} content={"Delete CV"} negative floated={"right"}
                                 onClick={() => setPopupOpen(!popupOpen)}/>}
                content={<Button icon={"x"} content={"Delete CV"} negative onClick={deleteCv}/>}
                closeOnEscape closeOnTriggerClick on='click' position='bottom center' size={"mini"}/>
        </div>
    )

}

export default CandCvSeg;