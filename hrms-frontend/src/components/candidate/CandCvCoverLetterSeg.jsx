import {Accordion, Button, Card, Form, Grid, Header, Icon, Modal, Segment} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {onCVUpdate} from "../../utilities/CandidateUtils";
import {handleCatch} from "../../utilities/Utils";
import CandidateCvService from "../../services/candidateCvService";
import {useDispatch} from "react-redux";
import {useFormik} from "formik";

function CandCvCoverLetterSeg({user, cv, width = 16}) {

    const candidateCvService = new CandidateCvService()

    const dispatch = useDispatch();

    const [popupOpen, setPopupOpen] = useState(false);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        setPopupOpen(false);
        return () => setPopupOpen(undefined)
    }, [cv]);

    const formik = useFormik({
        initialValues: {coverLetter: ""}
    });

    const updateCoverLetter = () =>
        candidateCvService.updateCoverLetter(cv.id, formik.values.coverLetter)
            .then(r => onCVUpdate(dispatch, cv.id, user.cvs, r))
            .catch(handleCatch)

    const handleChange = (fieldName, value) => {
        if (value.length >= 1000) return
        formik.setFieldValue(fieldName, value)
    }

    return (
        <Grid.Column width={width} style={{marginTop: 10}}>
            <Modal basic onClose={() => setPopupOpen(false)} open={popupOpen} size='small'>
                <Form size="large" as={Segment} basic>
                    <Header content={"Cover Letter"} size={"small"} dividing inverted icon={"write"} style={{userSelect: "none"}}/>
                    <Form.TextArea
                        placeholder="Cover Letter (Max. 1000 character)" type="text" name="coverLetter"
                        onChange={(event, data) => handleChange("coverLetter", data.value)} onBlur={formik.handleBlur}
                        value={formik.values.coverLetter} style={{minHeight: 250, borderRadius: 10}}/>
                    <Button color="blue" size="large" style={{borderRadius: 10}} content="Save" onClick={updateCoverLetter}/>
                </Form>
            </Modal>
            <Accordion>
                <Accordion.Title active={open}>
                    <Card fluid raised color={"blue"} style={{borderRadius: 0, marginBottom: 0, backgroundColor: "rgba(0,0,0,0.02)"}}>
                        <Card.Content>
                            <Card.Header style={{userSelect: "none"}}>
                                <font style={{fontSize: 14, marginLeft: 10}} onClick={() => setOpen(!open)}>Cover Letter</font>
                                <span style={{marginRight: 10, marginBottom: -1, float: "right"}}
                                      onClick={() => setPopupOpen(true)}>
                                        <Icon name={"edit"} color={"black"}/>
                                        <font className={"handWriting"} color={"black"} style={{fontSize: 16}}>
                                            {cv.coverLetter ? "Edit" : "Add"}
                                        </font>
                                    </span>
                            </Card.Header>
                        </Card.Content>
                    </Card>
                </Accordion.Title>
                <Accordion.Content active={open && cv.coverLetter} as={Segment} raised padded secondary
                                   style={{marginTop: -5, marginBottom: 10, borderRadius: 0}}>
                    <p className={"paragraph"}>{cv.coverLetter}</p>
                </Accordion.Content>
            </Accordion>
        </Grid.Column>
    )
}

export default CandCvCoverLetterSeg;