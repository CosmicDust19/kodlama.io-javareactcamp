import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {changeCandCVs} from "../../store/actions/userActions";
import {useFormik} from "formik";
import {Button, Form, Grid, Header, Icon, Input, Menu, Popup, Transition} from "semantic-ui-react";
import CandidateCvService from "../../services/candidateCvService";
import {getRandomColor, handleCatch} from "../../utilities/Utils";
import {toast} from "react-toastify";
import CandCvSeg from "../../components/candidate/CandCvSeg";

export function CandidateCVs() {

    const candidateCvService = new CandidateCvService()

    const dispatch = useDispatch();
    const userProps = useSelector(state => state?.user?.userProps)

    const [adding, setAdding] = useState(false);
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState(userProps.user);
    const [index, setIndex] = useState(userProps.user.cvs.length === 0 ? -1 : 0);
    const [selectedCv, setSelectedCv] = useState({});
    const [activeItem, setActiveItem] = useState();
    const [cvAddPopupOpen, setCvAddPopupOpen] = useState(false);

    useEffect(() => {
        setVisible(true)
        return () => {
            setAdding(undefined)
            setVisible(undefined)
            setUser(undefined)
            setIndex(undefined)
            setSelectedCv(undefined)
            setActiveItem(undefined)
            setCvAddPopupOpen(undefined)
        };
    }, []);

    useEffect(() => {
        setUser(userProps.user)
        index < 0 ? setSelectedCv({}) : setSelectedCv(userProps.user.cvs[index])
        setActiveItem(userProps.user.cvs[index]?.title)
        setCvAddPopupOpen(false)
    }, [index, user.cvs.length, userProps.user]);

    const formik = useFormik({
        initialValues: {cvAddTitle: ""}
    });

    if (String(userProps.userType) !== "candidate") return <Header content={"😛🤪🤭"}/>

    const hasNoProp =
        user.candidateJobExperiences.length === 0 &&
        user.candidateSchools.length === 0 &&
        user.candidateLanguages.length === 0 &&
        user.candidateSkills.length === 0

    const handleMenuItemClick = (cvIndex) => setIndex(cvIndex === index ? -1 : cvIndex)

    const addCv = () => {
        setAdding(true)
        const CV = {title: formik.values.cvAddTitle, candidateId: user.id}
        candidateCvService.add(CV).then(response => {
            user.cvs.push(response.data.data.CV.data)
            dispatch(changeCandCVs(user.cvs))
            setIndex(user.cvs.length - 1)
            toast("Created a new CV")
            if (hasNoProp)
                toast.warning("To add your infos to your CVs, you should enter your infos to about me section first.", {
                    autoClose: 8000
                })
            window.scrollTo(0, 0)
        }).catch(handleCatch).finally(() => setAdding(false))
    }

    return (
        <Transition visible={visible} duration={200}>
            <Grid stackable padded>
                <Grid.Column width={4}>
                    <Header content={"Manage Your CVs"} sub style={{userSelect: "none"}} as="font"/>&nbsp;&nbsp;
                    {adding ? <Icon loading name={"spinner"}/> : null}
                    <Menu fluid vertical secondary>
                        {user?.cvs?.map(cv =>
                            <Menu.Item key={cv?.id} name={cv?.title} active={activeItem === cv?.title} color={getRandomColor()}
                                       onClick={() => handleMenuItemClick(user.cvs.indexOf(cv))}/>)}
                        <Popup
                            trigger={
                                <Menu.Item
                                    name={"Add New"} color={"green"} header icon={"plus"}
                                    onClick={() => setCvAddPopupOpen(!cvAddPopupOpen)}
                                    active={cvAddPopupOpen}/>}
                            content={
                                <Form>
                                    <Input placeholder="Title" value={formik.values.cvAddTitle} name="cvAddTitle"
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}
                                           actionPosition={"left"} transparent size="large"/>
                                    <Button content={"Save"} circular style={{marginTop: 10}} onClick={addCv}
                                            secondary compact fluid type="submit"/>
                                </Form>}
                            on='focus' open={cvAddPopupOpen} position='bottom center' pinned
                            style={{opacity: 0.8}}
                        />
                    </Menu>
                </Grid.Column>
                <Grid.Column stretched width={12}>
                    {selectedCv?.id ? <CandCvSeg user={user} cv={selectedCv} setIndex={setIndex}/> : null}
                </Grid.Column>
            </Grid>
        </Transition>
    )
}
