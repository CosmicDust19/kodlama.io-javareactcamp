import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import * as Yup from "yup";
import {Button, Form, Grid, Header, Icon, Message, Segment, Popup, Input} from "semantic-ui-react";
import CandidateService from "../services/candidateService";
import UserService from "../services/userService";
import {useFormik} from "formik";
import {useDispatch} from "react-redux";
import {login} from "../store/actions/userActions";
import {toast} from "react-toastify";

const userService = new UserService()
const candidateService = new CandidateService()

const errorPopUpStyle = {
    borderRadius: 3,
    opacity: 0.7,
    color: "rgb(201,201,201)"
}

export function SignUpCandidate() {

    const dispatch = useDispatch();

    let timeout;

    const [fNState, setFNState] = useState({isFNOpen: false})
    const [lNState, setLNState] = useState({isLNOpen: false})
    const [eMState, setEMState] = useState({isEMOpen: false})
    const [pWState, setPWState] = useState({isPWOpen: false})
    const [pWRState, setPWRState] = useState({isPWROpen: false})
    const [nIDState, setNIDState] = useState({isNIDOpen: false})
    const [bYState, setBYState] = useState({isBYOpen: false})

    const handleFNOpen = () => {
        setFNState({isFNOpen: true})
        timeout = setTimeout(() => {
            setFNState({isFNOpen: false})
        }, 5000)
    }
    const handleFNClose = () => {
        setFNState({isFNOpen: false})
        clearTimeout(timeout)
    }

    const handleLNOpen = () => {
        setLNState({isLNOpen: true})
        timeout = setTimeout(() => {
            setLNState({isLNOpen: false})
        }, 5100)
    }
    const handleLNClose = () => {
        setLNState({isLNOpen: false})
        clearTimeout(timeout)
    }

    const handleEMOpen = () => {
        setEMState({isEMOpen: true})
        timeout = setTimeout(() => {
            setEMState({isEMOpen: false})
        }, 5200)
    }
    const handleEMClose = () => {
        setEMState({isEMOpen: false})
        clearTimeout(timeout)
    }

    const handlePWOpen = () => {
        setPWState({isPWOpen: true})
        timeout = setTimeout(() => {
            setPWState({isPWOpen: false})
        }, 5300)
    }
    const handlePWClose = () => {
        setPWState({isPWOpen: false})
        clearTimeout(timeout)
    }

    const handlePWROpen = () => {
        setPWRState({isPWROpen: true})
        timeout = setTimeout(() => {
            setPWRState({isPWROpen: false})
        }, 5400)
    }
    const handlePWRClose = () => {
        setPWRState({isPWROpen: false})
        clearTimeout(timeout)
    }

    const handleNIDOpen = () => {
        setNIDState({isNIDOpen: true})
        timeout = setTimeout(() => {
            setNIDState({isNIDOpen: false})
        }, 5500)
    }
    const handleNIDClose = () => {
        setNIDState({isNIDOpen: false})
        clearTimeout(timeout)
    }

    const handleBYOpen = () => {
        setBYState({isBYOpen: true})
        timeout = setTimeout(() => {
            setBYState({isBYOpen: false})
        }, 5600)
    }
    const handleBYClose = () => {
        setBYState({isBYOpen: false})
        clearTimeout(timeout)
    }

    const candidateSignUpSchema = Yup.object().shape({
        firstName: Yup.string().required("required").min(2, "too short").max(50, "too long"),
        lastName: Yup.string().required("required").min(2, "too short").max(50, "too long"),
        email: Yup.string().required("required").matches(/\w+(\.\w+)*@[a-zA-Z]+(\.\w{2,6})+/, "not a valid e-mail format"),
        password: Yup.string().required("required").min(6, "min 6 characters"),
        passwordRepeat: Yup.string().oneOf([Yup.ref("password"), null], "not matching").required("required").min(6, "min 6 characters"),
        nationalityId: Yup.string().required("required").matches(/\d{11}/, "not a valid nationality id").max(11, "not a valid nationality id"),
        birthYear: Yup.number().required("required").min(1900, "Enter your real birth year").max(new Date().getFullYear() - 18, "You should be over 18 years old to sign up"),
    });

    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            birthYear: "", email: "", firstName: "", lastName: "",
            nationalityId: "", password: "", passwordRepeat: "",
        },
        validationSchema: candidateSignUpSchema,
        onSubmit: (values) => {
            let counter = 0
            if (isEmailInUse) {
                toast.warning("This email in use!")
                counter++
            }
            if (isNationalityIdInUse) {
                toast.warning("This nationality id in use!")
                counter++
            }
            if (counter === 0) {
                candidateService.add(values).then((result) => {
                    console.log(result)
                    candidateService.getByEmailAndPassword(values.email, values.password).then(r => {
                        dispatch(login(r.data.data, "candidate"))
                        toast("Welcome")
                    }).catch(reason => {
                        console.log(reason)
                        toast.warning("A problem has occurred, you can try to login")
                    }).finally(() => {
                        history.push("/")
                    })
                }).catch(reason => {
                    console.log(reason)
                    toast.warning("A problem has occurred")
                })
            }
        }
    });

    const [isEmailInUse, setIsEmailInUse] = useState([]);

    useEffect(() => {
        userService.existsByEmail(formik.values.email).then((result) => setIsEmailInUse(result.data.data));
    }, [formik.values.email]);

    const [isNationalityIdInUse, setIsNationalityIdInUse] = useState([]);

    useEffect(() => {
        candidateService.existsByNationalityId(formik.values.nationalityId).then((result) => setIsNationalityIdInUse(result.data.data));
    }, [formik.values.nationalityId]);

    const handleChangeSemantic = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
    }

    const triggerAllErrorPopUps = () => {
        if (formik.errors.firstName) handleFNOpen()
        if (formik.errors.lastName) handleLNOpen()
        if (formik.errors.email) handleEMOpen()
        if (formik.errors.password) handlePWOpen()
        if (formik.errors.passwordRepeat) handlePWROpen()
        if (formik.errors.nationalityId) handleNIDOpen()
        if (formik.errors.birthYear) handleBYOpen()
    }

    return (
        <div>
            <Header color="purple" textAlign="center">
                Sign Up
            </Header>
            <Grid centered stackable padded>
                <Grid.Column width={6}>
                    <Segment placeholder color={"purple"} padded textAlign={"center"} raised style={{borderRadius: 15}}>
                        <Form size="large" onSubmit={formik.handleSubmit} inverted>

                            <Grid padded>
                                <Grid.Column>
                                    <Popup
                                        trigger={
                                            <Input icon="user" iconPosition="left" placeholder="First Name"
                                                   type="text"
                                                   value={formik.values.firstName} name="firstName"
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("firstName", data.value)}
                                                   onBlur={formik.handleBlur}/>
                                        }
                                        content={(formik.errors.firstName) ?
                                            formik.errors.firstName :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={fNState.isFNOpen}
                                        onClose={handleFNClose} onOpen={handleFNOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    <Popup
                                        trigger={
                                            <Input icon="user" iconPosition="left" placeholder="Last Name"
                                                   type="text"
                                                   value={formik.values.lastName} name="lastName"
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("lastName", data.value)}
                                                   onBlur={formik.handleBlur}/>
                                        }
                                        content={(formik.errors.lastName) ?
                                            formik.errors.lastName :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={lNState.isLNOpen}
                                        onClose={handleLNClose} onOpen={handleLNOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    <Popup
                                        trigger={
                                            <Input icon="mail" iconPosition="left" placeholder="E-mail"
                                                   type="email"
                                                   value={formik.values.email} onChange={(event, data) =>
                                                handleChangeSemantic("email", data.value)}
                                                   onBlur={formik.handleBlur} name="email"/>
                                        }
                                        content={(formik.errors.email) ?
                                            formik.errors.email :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={eMState.isEMOpen}
                                        onClose={handleEMClose} onOpen={handleEMOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    <Popup
                                        trigger={
                                            <Input icon="lock" iconPosition="left" placeholder="Password"
                                                   type="password"
                                                   value={formik.values.password} onChange={(event, data) =>
                                                handleChangeSemantic("password", data.value)}
                                                   onBlur={formik.handleBlur}
                                                   name="password"/>
                                        }
                                        content={(formik.errors.password) ?
                                            formik.errors.password :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={pWState.isPWOpen}
                                        onClose={handlePWClose} onOpen={handlePWOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    <Popup
                                        trigger={
                                            <Input icon="lock" iconPosition="left" placeholder="Password Repeat"
                                                   type="password"
                                                   value={formik.values.passwordRepeat} onChange={(event, data) =>
                                                handleChangeSemantic("passwordRepeat", data.value)}
                                                   onBlur={formik.handleBlur}
                                                   name="passwordRepeat"/>
                                        }
                                        content={(formik.errors.passwordRepeat) ?
                                            formik.errors.passwordRepeat :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={pWRState.isPWROpen}
                                        onClose={handlePWRClose} onOpen={handlePWROpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    <Popup
                                        trigger={
                                            <Input icon="id card" iconPosition="left" placeholder="Nationality Id"
                                                   type="text"
                                                   value={formik.values.nationalityId} name="nationalityId"
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("nationalityId", data.value)}
                                                   onBlur={formik.handleBlur}/>
                                        }
                                        content={(formik.errors.nationalityId) ?
                                            formik.errors.nationalityId :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={nIDState.isNIDOpen}
                                        onClose={handleNIDClose} onOpen={handleNIDOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
                                        trigger={
                                            <Input icon="calendar check" iconPosition="left" placeholder="Birth Year"
                                                   type="number"
                                                   error={!formik.errors.birthYear}
                                                   onChange={(event, data) =>
                                                       handleChangeSemantic("birthYear", data.value)}
                                                   value={formik.values.birthYear}
                                                   onBlur={formik.handleBlur}
                                                   name="birthYear"/>
                                        }
                                        content={(formik.errors.birthYear) ?
                                            formik.errors.birthYear :
                                            <Icon name="checkmark"/>}
                                        style={errorPopUpStyle} on='hover' open={bYState.isBYOpen}
                                        onClose={handleBYClose} onOpen={handleBYOpen} position='right center' inverted
                                        mouseEnterDelay={100} mouseLeaveDelay={100}
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Segment textAlign="center" basic>
                                <Button animated="fade" type="submit" size="big" color="purple"
                                        onClick={() => {
                                            triggerAllErrorPopUps()
                                        }}>
                                    <Button.Content hidden><Icon name='signup'/></Button.Content>
                                    <Button.Content visible>Sign Up</Button.Content>
                                </Button>
                            </Segment>

                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>

            <Grid textAlign="center">
                <Grid.Column width={10}>
                    <Message attached='bottom' warning>
                        <Icon name='help'/>
                        Already signed up ?&nbsp;<Link to={"/login"} onClick={() => {
                        window.scrollTo(0, 0)
                    }}>Login Here</Link>&nbsp;instead.
                    </Message>
                    <Message attached='bottom' warning>
                        <Icon name='help'/>
                        Are you an employer ?&nbsp;<Link to={"/signUpEmployer"} onClick={() => {
                        window.scrollTo(0, 70)
                    }}>Click Here</Link>&nbsp;to sign up as an
                        employer.
                    </Message>
                </Grid.Column>
            </Grid>

        </div>
    );
}