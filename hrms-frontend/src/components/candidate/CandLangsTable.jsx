import {Accordion, Button, Card, Grid, Header, Icon, Loader, Segment, Table} from "semantic-ui-react";
import SDropdown from "../../utilities/customFormControls/SDropdown";
import {
    getFilteredCandLangOption, getFilteredLanguageOption, languageLevelOption, onCVUpdate, onPropAdd, syncCandidate
} from "../../utilities/CandidateUtils";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import CandidateLanguageService from "../../services/candidateLanguageService";
import LanguageService from "../../services/languageService";
import {useFormik} from "formik";
import {changeLangs} from "../../store/actions/userActions";
import {handleCatch} from "../../utilities/Utils";
import CandidateCvService from "../../services/candidateCvService";

function CandLangsTable({user, cv, editable = false, defaultClosed = false, unstackable = false, vertical = false, small = false, width = 8}) {

    const candLangService = new CandidateLanguageService();
    const candCvService = new CandidateCvService()

    const dispatch = useDispatch();

    const [languages, setLanguages] = useState([]);
    const [open, setOpen] = useState(defaultClosed !== true);

    useEffect(() => {
        if (editable && !cv) {
            const languageService = new LanguageService();
            languageService.getLanguages().then((result) => setLanguages(result.data.data));
        }
    }, [cv, editable]);

    const formik = useFormik({
        initialValues: {
            candidateId: user.id, languageId: "", languageLevel: "", candLangIds: []
        }
    });

    if (!user || !user.candidateLanguages) return <Loader active inline='centered' style={{marginTop: 50}}/>

    const cvCandLangs = cv ? (cv.candidateLanguages ? cv.candidateLanguages : []) : null
    const userCandLangs = user.candidateLanguages ? user.candidateLanguages : []
    const candLangs = cvCandLangs ? cvCandLangs : userCandLangs

    if (!editable && (candLangs.length === 0)) return null

    const tableSize = small || (vertical && !editable) ? "small" : "large"
    const segmentSize = small ? "small" : undefined

    const languageOption = !cv || !editable ? getFilteredLanguageOption(languages, user.candidateLanguages) : null
    const candLangOption = cv ? getFilteredCandLangOption(userCandLangs, cvCandLangs) : null

    const invalidCandLang = !cv ?
        formik.values.languageId <= 0 ||
        !formik.values.languageId ||
        !formik.values.languageLevel : null

    //profile functions
    const addLanguage = () =>
        candLangService.add(formik.values)
            .then(r => onPropAdd(dispatch, r.data.data, user.candidateLanguages, changeLangs))
            .catch(handleCatch)

    const deleteLanguage = (langId) => candLangService.delete(langId)
        .then(() => syncCandidate(dispatch, user.id))
        .catch(handleCatch)
    //

    //cv functions
    const addLangsToCv = () => {
        if (formik.values.candLangIds.length === 0) return
        candCvService.updateLanguages(cv.id, formik.values.candLangIds, "add")
            .then(r => {
                onCVUpdate(dispatch, cv.id, user.cvs, r, "Added")
                formik.setValues({candLangIds: []})
            })
            .catch(handleCatch)
    }

    const removeLangFromCv = (candLangId) =>
        candCvService.updateLanguages(cv.id, [candLangId], "remove")
            .then(r => onCVUpdate(dispatch, cv.id, user.cvs, r, "Removed"))
            .catch(handleCatch)
    //

    const onRemove = (candLangId) => cv ? removeLangFromCv(candLangId) : deleteLanguage(candLangId)

    return (
        <Grid.Column width={width} style={{marginTop: 10}}>
            <Accordion>
                <Accordion.Title onClick={() => setOpen(!open)} active={open}>
                    <Card fluid raised style={{borderRadius: 0}} onClick={() => {}}>
                        <Card.Header>
                            <Header textAlign={"center"} dividing color="violet" content={"Languages"}
                                    style={{marginBottom: 0, borderRadius: 0}} block/>
                        </Card.Header>
                    </Card>
                </Accordion.Title>
                <Accordion.Content active={open} as={Segment} size={segmentSize} raised vertical
                                   style={{marginTop: -6.5, marginBottom: 10, borderRadius: 0}}>
                    <Table size={tableSize} celled unstackable={unstackable} textAlign="center" striped
                           style={{marginTop: -14, marginBottom: -14, borderRadius: 0}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell content={"Languages"}/>
                                <Table.HeaderCell content={"Level(CEFR)"}/>
                                {editable && (candLangs.length !== 0 || !cv) ? <Table.HeaderCell/> : null}
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {candLangs.map((candLang) => (
                                <Table.Row key={candLang.id}>
                                    <Table.Cell content={candLang.language.name}/>
                                    <Table.Cell content={candLang.languageLevel}/>
                                    {editable ? <Table.Cell onClick={() => onRemove(candLang.id)} negative selectable
                                                            icon={<Icon name={"x"} style={{marginRight: 0}}/>}/> : null}
                                </Table.Row>
                            ))}
                        </Table.Body>

                        {editable && !cv ? <Table.Footer>
                            <Table.Row>
                                <Table.Cell>
                                    <SDropdown options={languageOption} name="languageId" placeholder="Language"
                                               multiple={false} formik={formik} style={{}}/>
                                </Table.Cell>
                                <Table.Cell>
                                    <SDropdown options={languageLevelOption} name="languageLevel" placeholder="Language Level"
                                               multiple={false} formik={formik} style={{}}/>
                                </Table.Cell>
                                <Table.Cell positive icon={<Icon name={"plus"} style={{marginRight: 0}} disabled={invalidCandLang}/>}
                                            onClick={addLanguage} selectable disabled={invalidCandLang}/>
                            </Table.Row>
                        </Table.Footer> : null}
                    </Table>
                </Accordion.Content>
            </Accordion>
            {editable && cv && open ?
                <div>
                    <SDropdown options={candLangOption} name="candLangIds" placeholder="Languages"
                               formik={formik} loading={false} disabled={candLangOption.length === 0}
                               style={{marginRight: 10, color: "rgba(90,20,200,0.9)"}}/>
                    <Button icon="plus" color="blue" content={"Add"} onClick={addLangsToCv}
                            disabled={formik.values.candLangIds.length === 0} style={{marginTop: 10, borderRadius: 10}}/>
                </div> : null}
        </Grid.Column>
    )
}

export default CandLangsTable