import {Button, Form, Input, Popup, Segment} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {onCVUpdate} from "../../utilities/CandidateUtils";
import {handleCatch} from "../../utilities/Utils";
import CandidateCvService from "../../services/candidateCvService";
import {useDispatch} from "react-redux";

function CandCvTitleSeg({user, cv}) {

    const candidateCvService = new CandidateCvService()

    const dispatch = useDispatch();

    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        return () => setPopupOpen(undefined)
    }, []);

    const formik = useFormik({
        initialValues: {title: ""}
    });

    const updateTitle = () =>
        candidateCvService.updateTitle(cv.id, formik.values.title)
            .then(r => onCVUpdate(dispatch, cv.id, user.cvs, r))
            .catch(handleCatch)

    return (
        <Segment basic style={{marginBottom: -10}}>
            <Popup
                trigger={<Button icon={"signup"} size={"big"} basic circular compact style={{}}
                                 onClick={() => setPopupOpen(!popupOpen)}/>}
                content={
                    <Form>
                        <Input placeholder="Title" value={formik.values.title} name="title" onChange={formik.handleChange}
                               onBlur={formik.handleBlur} actionPosition={"left"} transparent size="large"/>
                        <Button content={"Save"} circular style={{marginTop: 10}} onClick={updateTitle}
                                secondary compact fluid type="submit"/>
                    </Form>}
                on='focus' open={popupOpen} position='bottom left' pinned style={{opacity: 0.95}}
            />
            <font style={{fontSize: 17}}>Title: {cv?.title}</font>
        </Segment>
    )
}

export default CandCvTitleSeg;