import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import * as Yup from "yup";
import {Button, Form, Grid, Header, Icon, Message, Segment, Popup, Input} from "semantic-ui-react";
import {useFormik} from "formik";
import {useDispatch} from "react-redux";
import {login} from "../store/actions/userActions";
import {toast} from "react-toastify";
import SystemEmployeeService from "../services/systemEmployeeService";
import UserService from "../services/userService";

const userService = new UserService()
const systemEmployeeService = new SystemEmployeeService()

const errorPopUpStyle = {
    borderRadius: 0,
    opacity: 0.7,
    color: "rgb(201,201,201)"
}

export function SignUpSystemEmployee() {

    const dispatch = useDispatch();

    let timeout;

    const [fNState, setFNState] = useState({isFNOpen: false})
    const [lNState, setLNState] = useState({isLNOpen: false})
    const [eMState, setEMState] = useState({isEMOpen: false})
    const [pWState, setPWState] = useState({isPWOpen: false})
    const [pWRState, setPWRState] = useState({isPWROpen: false})

    const handleFNOpen = () => {
        setFNState({isFNOpen: true})
        timeout = setTimeout(() => {
            setFNState({isFNOpen: false})
        }, 6000)
    }
    const handleFNClose = () => {
        setFNState({isFNOpen: false})
        clearTimeout(timeout)
    }

    const handleLNOpen = () => {
        setLNState({isLNOpen: true})
        timeout = setTimeout(() => {
            setLNState({isLNOpen: false})
        }, 6000)
    }
    const handleLNClose = () => {
        setLNState({isLNOpen: false})
        clearTimeout(timeout)
    }

    const handleEMOpen = () => {
        setEMState({isEMOpen: true})
        timeout = setTimeout(() => {
            setEMState({isEMOpen: false})
        }, 7000)
    }
    const handleEMClose = () => {
        setEMState({isEMOpen: false})
        clearTimeout(timeout)
    }

    const handlePWOpen = () => {
        setPWState({isPWOpen: true})
        timeout = setTimeout(() => {
            setPWState({isPWOpen: false})
        }, 8000)
    }
    const handlePWClose = () => {
        setPWState({isPWOpen: false})
        clearTimeout(timeout)
    }

    const handlePWROpen = () => {
        setPWRState({isPWROpen: true})
        timeout = setTimeout(() => {
            setPWRState({isPWROpen: false})
        }, 8000)
    }
    const handlePWRClose = () => {
        setPWRState({isPWROpen: false})
        clearTimeout(timeout)
    }

    const systemEmployeeValidationSchema = Yup.object().shape({
        firstName: Yup.string().required("required").min(2, "too short").max(50, "too long"),
        lastName: Yup.string().required("required").min(2, "too short").max(50, "too long"),
        email: Yup.string().required("required").matches(/\w+(\.\w+)*@[a-zA-Z]+(\.\w{2,6})+/, "not a valid e-mail format"),
        password: Yup.string().required("required").min(6, "min 6 characters"),
        passwordRepeat: Yup.string().oneOf([Yup.ref("password"), null], "not matching").required("required"),
    });

    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            email: "", firstName: "", lastName: ""
            , password: "", passwordRepeat: "",
        },
        validationSchema: systemEmployeeValidationSchema,
        onSubmit: (values) => {
            if(isEmailInUse){
                toast.warning("This email in use!")
            } else {
                systemEmployeeService.add(values).then((result) => {
                    console.log(result)
                    systemEmployeeService.getByEmailAndPassword(values.email, values.password).then(r => {
                        dispatch(login(r.data.data, "systemEmployee"))
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

    const handleChangeSemantic = (fieldName, value) => {
        formik.setFieldValue(fieldName, value);
    }

    const triggerAllErrorPopUps = () => {
        if (formik.errors.firstName) handleFNOpen()
        if (formik.errors.lastName) handleLNOpen()
        if (formik.errors.email) handleEMOpen()
        if (formik.errors.password) handlePWOpen()
        if (formik.errors.passwordRepeat) handlePWROpen()
    }

    return (
        <div>
            <Header color="purple" textAlign="center">
                Sign Up
            </Header>
            <Grid centered stackable padded>
                <Grid.Column width={6}>
                    <Segment placeholder color={"purple"} padded textAlign={"center"}>
                        <Form size="large" onSubmit={formik.handleSubmit} inverted>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
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
                                        style={errorPopUpStyle} on='click' open={fNState.isCNOpen}
                                        onClose={handleFNClose} onOpen={handleFNOpen} position='right center' inverted
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
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
                                        style={errorPopUpStyle} on='click' open={lNState.isLNOpen}
                                        onClose={handleLNClose} onOpen={handleLNOpen} position='right center' inverted
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
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
                                        style={errorPopUpStyle} on='click' open={eMState.isEMOpen}
                                        onClose={handleEMClose} onOpen={handleEMOpen} position='right center' inverted
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
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
                                        style={errorPopUpStyle} on='click' open={pWState.isPWOpen}
                                        onClose={handlePWClose} onOpen={handlePWOpen} position='right center' inverted
                                    />}
                                </Grid.Column>
                            </Grid>

                            <Grid padded>
                                <Grid.Column>
                                    {<Popup
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
                                        style={errorPopUpStyle} on='click' open={pWRState.isPWROpen}
                                        onClose={handlePWRClose} onOpen={handlePWROpen} position='right center' inverted
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
                        Already signed up?&nbsp;<Link to={"/login"}>Login Here</Link>&nbsp;instead.
                    </Message>
                </Grid.Column>
            </Grid>

        </div>
    );
}