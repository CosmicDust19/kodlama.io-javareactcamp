import {Button, Grid, Header, Icon, Input, Menu, Segment} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import defEmployerImg from "../../assets/images/defEmployerImg.png";
import AreYouSureModal from "../../components/common/AreYouSureModal";
import {updateCompanyName, updateEmailAndWebsite, updatePhoneNumber} from "../../utilities/EmployerUtils";
import {checkCurrentPassword, deleteAccount, updatePassword} from "../../utilities/UserUtils";
import MainInfos from "../../components/common/MainInfos";

export function EmployerAccount() {

    const dispatch = useDispatch();
    const history = useHistory()
    const userProps = useSelector(state => state?.user?.userProps)

    const [employer, setEmployer] = useState(userProps.user);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [activeItem, setActiveItem] = useState('email');

    useEffect(() => {
        setEmployer(userProps.user)
    }, [userProps.user])

    const formik = useFormik({
        initialValues: {
            email: "", website: "", password: "", passwordRepeat: "", currentPassword: "",
            companyName: "", phoneNumber: "",
        }
    });

    if (String(userProps.userType) !== "employer") return <Header content={"😛🤪🤭"}/>

    const handleMenuItemClick = (activeItem) => setActiveItem(activeItem)
    const handleDeleteClick = () => setDeletePopupOpen(true)

    const handleEmailAndWebsiteSubmit = () => updateEmailAndWebsite(dispatch, employer, formik.values.email, formik.values.website)
    const handleCurrentPasswordSubmit = () => checkCurrentPassword(employer, formik, setAuthenticated)
    const handlePasswordSubmit = () => updatePassword(employer.id, formik)
    const handleCompanyNameSubmit = () => updateCompanyName(dispatch, employer, formik.values.companyName)
    const handlePhoneNumberSubmit = () => updatePhoneNumber(dispatch, employer, formik.values.phoneNumber)
    const handleDeleteAccount = () => deleteAccount(dispatch, employer.id, history, setDeletePopupOpen)

    function menuSegments() {
        switch (activeItem) {
            case "emailAndWebsite":
                return (
                    <Segment basic>
                        <Input icon="mail" iconPosition="left" placeholder="E-mail" type="email"
                               value={formik.values.email} onBlur={formik.handleBlur} name="email"
                               onChange={formik.handleChange}/><br/>
                        <Input icon="world" iconPosition="left" placeholder="Website" type="website"
                               value={formik.values.website} onBlur={formik.handleBlur} name="website"
                               onChange={formik.handleChange} style={{marginTop: 10}}/><br/>
                        <Button color="blue" onClick={handleEmailAndWebsiteSubmit} style={{marginTop: 10, marginBottom: 10}}
                                content={"Send Request"} icon={"paper plane outline"}/>
                    </Segment>
                )
            case "password":
                return (
                    authenticated ?
                        <Segment basic>
                            <Input icon="lock" iconPosition="left" placeholder="New Password"
                                   type="password" value={formik.values.password}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="password"/><br/>
                            <Input icon="lock" iconPosition="left" placeholder="New Password Repeat"
                                   type="password" value={formik.values.passwordRepeat} style={{marginTop: 10, marginBottom: 10}}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="passwordRepeat"/><br/>
                            <Button color="blue" icon={"save"}
                                    onClick={handlePasswordSubmit} content={"Save"}/>
                        </Segment> :
                        <Segment basic>
                            <Input icon="lock" iconPosition="left" placeholder="Current Password"
                                   type="password" value={formik.values.currentPassword}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="currentPassword"/><br/>
                            <Button color="olive" style={{marginTop: 10, marginBottom: 10}} icon={"id card outline"}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}/>
                        </Segment>

                )
            case "compName":
                return (
                    <Segment basic>
                        <Input icon="building" iconPosition="left" placeholder="Company Name"
                               type="text" value={formik.values.companyName}
                               onChange={formik.handleChange} onBlur={formik.handleBlur}
                               name="companyName"/><br/>
                        <Button color="blue" onClick={handleCompanyNameSubmit} style={{marginTop: 10, marginBottom: 10}}
                                content={"Send Request"} icon={"paper plane outline"}/>
                    </Segment>
                )
            case "phone":
                return (
                    <Segment basic>
                        <Input icon="phone" iconPosition="left" placeholder="Phone Number"
                               type="phone" value={formik.values.phoneNumber}
                               onChange={formik.handleChange} onBlur={formik.handleBlur}
                               name="phoneNumber"/><br/>
                        <Button color="blue" onClick={handlePhoneNumberSubmit} style={{marginTop: 10, marginBottom: 10}}
                                content={"Send Request"} icon={"paper plane outline"}/>
                    </Segment>
                )
            case "danger":
                return (
                    authenticated ?
                        <Segment basic>
                            <Button color="red" onClick={handleDeleteClick}>
                                <Icon name="x"/>Delete Account
                            </Button>
                        </Segment> :
                        <Segment basic>
                            <Input icon="lock" iconPosition="left" placeholder="Password"
                                   type="password" value={formik.values.currentPassword}
                                   onChange={formik.handleChange} onBlur={formik.handleBlur}
                                   name="currentPassword"/><br/>
                            <Button color="olive" style={{marginTop: 10, marginBottom: 10}} icon={"id card outline"}
                                    onClick={handleCurrentPasswordSubmit} content={"Authenticate"}/>
                        </Segment>
                )
            default:
                return null
        }
    }

    return (
        <div>
            <AreYouSureModal open={deletePopupOpen} message={"Are you sure you want to delete your account permanently ?"}
                             yesColor={"red"} noColor={"grey"} onYes={handleDeleteAccount} onNo={() => setDeletePopupOpen(false)}/>
            <MainInfos user={employer} defImgSrc={defEmployerImg} imgSize={"small"} width={7}/>
            <Grid stackable>
                <Grid.Column width={4}>
                    <strong>Change</strong>
                    <Menu fluid vertical secondary>
                        <Menu.Item color={"purple"} name='emailAndWebsite' content={"Email & Website"} icon={"connectdevelop"}
                                   active={activeItem === 'emailAndWebsite'}
                                   onClick={() => handleMenuItemClick("emailAndWebsite")}/>
                        <Menu.Item color={"teal"} name='Password' icon={"lock"} active={activeItem === 'password'}
                                   onClick={() => handleMenuItemClick("password")}/>
                        <Menu.Item color={"blue"} name='Company Name' icon={"building"} active={activeItem === 'compName'}
                                   onClick={() => handleMenuItemClick("compName")}/>
                        <Menu.Item color={"yellow"} name='Phone Number' icon={"phone"} active={activeItem === 'phone'}
                                   onClick={() => handleMenuItemClick("phone")}/>
                        <Menu.Item color={"red"} icon={"warning sign"} name='Delete Account' active={activeItem === 'danger'}
                                   onClick={() => handleMenuItemClick("danger")}/>
                    </Menu>
                </Grid.Column>
                <Grid.Column stretched width={12}>
                    <Segment basic content={menuSegments()}/>
                </Grid.Column>
            </Grid>
        </div>
    )
}
