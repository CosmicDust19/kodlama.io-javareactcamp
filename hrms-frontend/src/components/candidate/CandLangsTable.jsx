import {Button, Grid, Icon, Loader, Table, Transition} from "semantic-ui-react";
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
import ManagementTable from "../common/ManagementTable";
import AreYouSureModal from "../common/AreYouSureModal";

function CandLangsTable
({user, cv, editable = false, defaultClosed = false, unstackable = false, vertical = false, small = false, width = 8}) {

    const candLangService = new CandidateLanguageService();
    const candCvService = new CandidateCvService()

    const dispatch = useDispatch();

    const [languages, setLanguages] = useState([]);
    const [active, setActive] = useState(defaultClosed !== true);
    const [candLangIdDel, setCandLangIdDel] = useState();

    useEffect(() => {
        return () => {
            setLanguages(undefined)
            setActive(undefined)
            setCandLangIdDel(undefined)
        };
    }, []);

    useEffect(() => {
        if (editable && !cv) {
            const languageService = new LanguageService();
            languageService.getAll().then((result) => setLanguages(result.data.data));
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

    const onRemove = () => {
        cv ? removeLangFromCv(candLangIdDel) : deleteLanguage(candLangIdDel)
        setCandLangIdDel(undefined)
    }

    const headerRow = [
        "Languages", "Level(CEFR)",
        editable && (candLangs.length !== 0 || !cv) ? "" : undefined
    ]

    const tableData = candLangs.map(candLang => ({candLang: candLang}))

    const renderBodyRow = ({candLang}, i) => ({
        key: i,
        cells: [
            candLang.language.name,
            candLang.languageLevel,
            editable ?
                <Table.Cell key={"del"} onClick={() => setCandLangIdDel(candLang.id)} negative selectable
                            icon={<Icon name={"x"} style={{marginRight: 0}}/>}/> : null
        ]
    })

    const footerCells = editable && !cv ? [
        <SDropdown options={languageOption} name="languageId" placeholder="Language" multiple={false} formik={formik} style={{}}/>,
        <SDropdown options={languageLevelOption} name="languageLevel" placeholder="Language Level" multiple={false} formik={formik} style={{}}/>,
    ] : null

    return (
        <Grid.Column width={width} style={{marginTop: 10}}>
            <AreYouSureModal open={!!candLangIdDel} message={`Are you sure you want to remove${cv ? "" : " from everywhere"} ?`}
                             yesColor={"red"} noColor={"grey"} onYes={onRemove} onNo={() => setCandLangIdDel(undefined)}/>
            <ManagementTable
                headerContent={"Languages"} color={"violet"} unstackable={unstackable} open={active} setOpen={setActive}
                tableSize={tableSize} segmentSize={segmentSize} onAdd={addLanguage} addDisabled={invalidCandLang}
                headerRow={headerRow} tableData={tableData} renderBodyRow={renderBodyRow} footerCells={footerCells}/>
            <Transition visible={active} duration={200} animation={"slide down"}>
                <div>
                    {editable && cv ?
                        <div>
                            <SDropdown options={candLangOption} name="candLangIds" placeholder="Languages"
                                       formik={formik} loading={false} disabled={candLangOption.length === 0}
                                       style={{marginRight: 10, color: "rgba(90,20,200,0.9)", backgroundColor: "rgba(255,255,255,0.7)"}}/>
                            <Button icon="plus" color="blue" content={"Add"} onClick={addLangsToCv}
                                    disabled={formik.values.candLangIds.length === 0} style={{marginTop: 10, borderRadius: 10}}/>
                        </div> : null}
                </div>
            </Transition>

        </Grid.Column>
    )
}

export default CandLangsTable