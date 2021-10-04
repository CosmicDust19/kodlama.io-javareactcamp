import {Button, Grid, Icon, Menu, Segment, Transition} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {onUpdate} from "../../utilities/UserUtils";
import AreYouSureModal from "../../components/common/AreYouSureModal";
import SInput from "../../utilities/customFormControls/SInput";
import MainInfos from "../../components/common/MainInfos";
import defEmployerImg from "../../assets/images/defEmployerImg.png";
import {changeEmail, signOut} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import {handleCatch} from "../../utilities/Utils";
import UserService from "../../services/userService";
import CandidateService from "../../services/candidateService";
import EmployerService from "../../services/employerService";
import SystemEmployeeService from "../../services/systemEmployeeService";

function Account() {

    const userService = new UserService()
    const candidateService = new CandidateService()
    const employerService = new EmployerService()
    const sysEmplService = new SystemEmployeeService()

    const dispatch = useDispatch();
    const history = useHistory()
    const userProps = useSelector(state => state?.user?.userProps)

    const fields =
        String(userProps.userType) === "employer" ? ["emailAndWebsite", "companyName", "phoneNumber"] :
            String(userProps.userType) === "candidate" ? ["email", "accountLinks"] :
                String(userProps.userType) === "systemEmployee" ? ["email", "name"] : null

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState(userProps.user);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [activeItem, setActiveItem] = useState(fields[0])

    useEffect(() => {
        setTimeout(() => setVisible(true), 50)
        return () => {
            setLoading(undefined)
            setVisible(undefined)
            setUser(undefined)
            setDeletePopupOpen(undefined)
            setAuthenticated(undefined)
            setActiveItem(undefined)
        };
    }, []);

    useEffect(() => {
        setUser(userProps.user)
    }, [userProps.user])

    const formik = useFormik({
        initialValues: {
            email: "", password: "", passwordRepeat: "", currentPassword: "",
            githubAccount: "", linkedinAccount: "",
            website: "", companyName: "", phoneNumber: "",
            firstName: "", lastName: ""
        }
    });

    const handleFinalActs = () => setLoading(false)

    const handleItemClick = (activeItem) => setActiveItem(activeItem)
    const handleDeleteClick = () => setDeletePopupOpen(true)

    const updateEmail = () =>
        userService.updateEmail(user.id, formik.values.email)
            .then(r => {
                dispatch(changeEmail(r.data.data.email))
                toast("Saved")
            })
            .catch(handleCatch)
            .finally(handleFinalActs)

    const checkCurrentPassword = () =>
        userService.existsByEmailAndPW(user.email, formik.values.currentPassword)
            .then(r => {
                if (r.data.data === true) {
                    setAuthenticated(true)
                    toast("Authenticated")
                } else toast.warning("Wrong password");
            })
            .catch(handleCatch)
            .finally(handleFinalActs)

    const updatePassword = () => {
        if (formik.values.password === formik.values.passwordRepeat)
            userService.updatePassword(user.id, formik.values.password, formik.values.currentPassword)
                .then(() => {
                    toast("Saved")
                    formik.values.currentPassword = formik.values.password
                    formik.setFieldValue("currentPassword", formik.values.password)
                })
                .catch(handleCatch)
                .finally(handleFinalActs)
        else {
            toast.warning("Passwords do not match")
            handleFinalActs()
        }
    }

    const deleteAccount = () =>
        userService.deleteById(user.id)
            .then(() => {
                history.push("/")
                dispatch(signOut())
                toast("Good Bye 👋")
            })
            .catch(handleCatch)
            .finally(handleFinalActs)

    const updateGithub = (githubAccount) =>
        candidateService.updateGithubAccount(user.id, githubAccount)
            .then(r => onUpdate(dispatch, r, "Saved"))
            .catch(handleCatch)
            .finally(handleFinalActs)

    const updateLinkedin = (linkedinAccount) =>
        candidateService.updateLinkedinAccount(user.id, linkedinAccount)
            .then(r => onUpdate(dispatch, r, "Saved"))
            .catch(handleCatch)
            .finally(handleFinalActs)

    const updateEmailAndWebsite = () =>
        employerService.updateEmailAndWebsite(user.id, formik.values.email, formik.values.website)
            .then(r => onUpdate(dispatch, r, "Sent"))
            .catch(handleCatch)
            .finally(handleFinalActs)

    const updateCompanyName = () =>
        employerService.updateCompanyName(user.id, formik.values.companyName)
            .then(r => onUpdate(dispatch, r, "Sent"))
            .catch(handleCatch)
            .finally(handleFinalActs)

    const updatePhoneNumber = () => {
        let phoneNumber = formik.values.phoneNumber
        if (phoneNumber.includes("+")) phoneNumber = phoneNumber.substr(1)
        employerService.updatePhoneNumber(user.id, phoneNumber)
            .then(r => onUpdate(dispatch, r, "Sent"))
            .catch(handleCatch)
            .finally(handleFinalActs)
    }

    const updateFirstName = () =>
        sysEmplService.updateFirstName(user.id, formik.values.firstName)
            .then(r => onUpdate(dispatch, r, "Saved"))
            .catch(handleCatch)
            .finally(handleFinalActs)

    const updateLastName = () =>
        sysEmplService.updateLastName(user.id, formik.values.lastName)
            .then(r => onUpdate(dispatch, r, "Saved"))
            .catch(handleCatch)
            .finally(handleFinalActs)

    function AccountSubmitButton({onClick, color, request = false, remove = false, ...props}) {
        const handleClick = () => {
            onClick()
            setLoading(true)
        }
        return (
            <Button color={color} icon={request ? "paper plane outline" : remove ? "x" : "save"} labelPosition={"right"}
                    content={request ? "Send Request" : remove ? "Remove" : "Save"} onClick={handleClick}
                    style={{marginTop: 10, marginBottom: 10}} loading={loading} disabled={loading} {...props}/>
        )
    }

    function menuSegments() {
        switch (activeItem) {
            case "name":
                return (
                    <div>
                        <Segment basic>
                            <SInput name="firstName" placeholder="First Name" formik={formik} style={{}} id="wrapper"
                                    icon={<Icon name={"user outline"} color={"yellow"}/>} iconPosition="left"/><br/>
                            <AccountSubmitButton color={"yellow"} onClick={updateFirstName}/>
                        </Segment>
                        <Segment basic>
                            <SInput name="lastName" placeholder="Last Name" formik={formik} style={{}}
                                    icon={<Icon name={"user outline"} color={"yellow"}/>} iconPosition="left"/><br/>
                            <AccountSubmitButton color={"yellow"} onClick={updateLastName}/>
                        </Segment>
                    </div>
                )
            case "emailAndWebsite":
                return (
                    <Segment basic>
                        <SInput name="email" placeholder="Email" type="email" formik={formik} id="wrapper"
                                icon={<Icon name={"mail outline"} color={"red"}/>} iconPosition="left"/><br/>
                        <SInput name="website" placeholder="Website" type="website" formik={formik} style={{marginTop: 10}}
                                icon={<Icon name={"world"} color={"red"}/>} iconPosition="left" /><br/>
                        <AccountSubmitButton color={"red"} onClick={updateEmailAndWebsite} request/>
                    </Segment>
                )
            case "compName":
                return (
                    <Segment basic>
                        <SInput name="companyName" placeholder="Company Name" formik={formik} style={{}}
                                icon={<Icon name={"building outline"} color={"blue"}/>} iconPosition="left"/><br/>
                        <AccountSubmitButton color={"blue"} onClick={updateCompanyName} request/>
                    </Segment>
                )
            case "phone":
                return (
                    <Segment basic>
                        <SInput name="phoneNumber" placeholder="Phone Number" formik={formik} style={{}}
                                icon={<Icon name={"phone"} color={"yellow"}/>} iconPosition="left"/><br/>
                        <AccountSubmitButton color={"yellow"} onClick={updatePhoneNumber} request/>
                    </Segment>
                )
            case "email":
                return (
                    <Segment basic>
                        <SInput name="email" placeholder="Email" type="email" formik={formik} style={{}}
                                icon={<Icon name={"mail outline"} color={"red"}/>} iconPosition="left"/><br/>
                        <AccountSubmitButton color={"red"} onClick={updateEmail}/>
                    </Segment>
                )
            case "links":
                return (
                    <div>
                        <Segment basic>
                            <SInput name="githubAccount" placeholder="Github Link" formik={formik} style={{}}
                                    icon={<Icon name={"linkify"} color={"blue"}/>} iconPosition="left"/><br/>
                            <AccountSubmitButton color={"blue"} onClick={() => updateGithub(formik.values.githubAccount)}/>
                            <AccountSubmitButton color={"red"} onClick={() => updateGithub(undefined)} remove
                                                 style={{marginTop: 10, marginBottom: 10, marginRight: 10}}/>
                        </Segment>
                        <Segment basic>
                            <SInput name="linkedinAccount" placeholder="Linkedin Link" formik={formik} style={{}}
                                    icon={<Icon name={"linkify"} color={"blue"}/>} iconPosition="left"/><br/>
                            <AccountSubmitButton color={"blue"} onClick={() => updateLinkedin(formik.values.linkedinAccount)}/>
                            <AccountSubmitButton color={"red"} onClick={() => updateLinkedin(undefined)} remove
                                                 style={{marginTop: 10, marginBottom: 10, marginRight: 10}}/>
                        </Segment>
                    </div>
                )
            case "password":
                return (
                    authenticated ?
                        <Segment basic>
                            <SInput name="password" placeholder="New Password" type="password" formik={formik} style={{}}
                                    icon={<Icon name={"lock"} color={"teal"}/>} iconPosition="left"/><br/>
                            <SInput name="passwordRepeat" placeholder="New Password Repeat" type="password" formik={formik}
                                    icon={<Icon name={"lock"} color={"teal"}/>} iconPosition="left"
                                    style={{marginTop: 10, marginBottom: 10}}/><br/>
                            <AccountSubmitButton color={"teal"} onClick={updatePassword}/>
                        </Segment> :
                        <Segment basic>
                            <SInput name="currentPassword" placeholder="Current Password" type="password" formik={formik} style={{}}
                                    icon={<Icon name={"key"} color={"teal"}/>} iconPosition="left"/><br/>
                            <AccountSubmitButton color={"teal"} onClick={checkCurrentPassword} icon={"unlock"} content={"Authenticate"}/>
                        </Segment>
                )
            case "danger":
                return (
                    authenticated ?
                        <Segment basic>
                            <AccountSubmitButton color={"red"} onClick={handleDeleteClick} remove content={"Delete Account"}/>
                        </Segment> :
                        <Segment basic>
                            <SInput name="currentPassword" placeholder="Password" type={"password"} formik={formik} style={{}}
                                    icon={<Icon name={"key"} color={"red"}/>} iconPosition="left"/><br/>
                            <AccountSubmitButton color={"red"} onClick={checkCurrentPassword} icon={"unlock"} content={"Authenticate"}/>
                        </Segment>
                )
            default:
                return null
        }
    }

    return (
        <Transition visible={visible} duration={200}>
            <div>
                <AreYouSureModal open={deletePopupOpen} message={"Are you sure you want to delete your account permanently ?"}
                                 yesColor={"red"} noColor={"grey"} onYes={deleteAccount} onNo={() => setDeletePopupOpen(false)}/>
                {String(userProps.userType) === "employer" ?
                    <MainInfos user={user} defImgSrc={defEmployerImg} imgSize={"small"} width={7}/> :
                    <MainInfos user={user}/>}
                <Grid stackable>
                    <Grid.Column width={4}>
                        <strong>Change</strong>
                        <Menu fluid vertical secondary stackable>
                            {fields.includes("name") ?
                                <Menu.Item color={"yellow"} icon={"user"} name='Name' active={activeItem === 'name'}
                                           onClick={() => handleItemClick("name")}/> : null}
                            {fields.includes("emailAndWebsite") ?
                                <Menu.Item color={"red"} name='emailAndWebsite' content={"Email & Website"}
                                           icon={<span style={{float: "right"}}><Icon name={"mail"}/>& <Icon name={"world"}/></span>}
                                           active={activeItem === 'emailAndWebsite'}
                                           onClick={() => handleItemClick("emailAndWebsite")}/> : null}
                            {fields.includes("email") ?
                                <Menu.Item icon={"mail"} color={"red"} name='Email' active={activeItem === 'email'}
                                           onClick={() => handleItemClick("email")}/> : null}
                            {fields.includes("accountLinks") ?
                                <Menu.Item icon={"linkify"} color={"blue"} name='Account Links' active={activeItem === 'links'}
                                           onClick={() => handleItemClick("links")}/> : null}
                            {fields.includes("companyName") ?
                                <Menu.Item color={"blue"} name='Company Name' icon={"building"} active={activeItem === 'compName'}
                                           onClick={() => handleItemClick("compName")}/> : null}
                            {fields.includes("phoneNumber") ?
                                <Menu.Item color={"yellow"} name='Phone Number' icon={"phone"} active={activeItem === 'phone'}
                                           onClick={() => handleItemClick("phone")}/> : null}
                            <Menu.Item icon={authenticated ? "lock open" : "lock"} color={"teal"} name='Password'
                                       active={activeItem === 'password'}
                                       onClick={() => handleItemClick("password")}/>
                            <Menu.Item icon={"warning sign"} color={"red"} name='Delete Account' active={activeItem === 'danger'}
                                       onClick={() => handleItemClick("danger")}/>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Segment basic style={{opacity: 0.9}} content={menuSegments()}/>
                    </Grid.Column>
                </Grid>
            </div>
        </Transition>
    )
}

export default Account