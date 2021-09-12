import {Link, useHistory, useParams} from "react-router-dom";
import * as Yup from "yup";
import {Button, Form, Grid, Header, Icon, Message, Segment} from "semantic-ui-react";
import {useFormik} from "formik";
import {useDispatch} from "react-redux";
import {login} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import CandidateService from "../../services/candidateService";
import SystemEmployeeService from "../../services/systemEmployeeService";
import EmployerService from "../../services/employerService";
import SPopupInput from "../../utilities/customFormControls/SPopupInput";
import {handleCatch} from "../../utilities/Utils";
import {useEffect, useState} from "react";

export function SignUp() {

    const {userType} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const [loginMsgOpen, setLoginMsgOpen] = useState(true);
    const [verticalScreen, setVerticalScreen] = useState(window.innerWidth < window.innerHeight);

    useEffect(() => {
        setVerticalScreen(window.innerWidth < window.innerHeight)
    }, [loginMsgOpen, userType]);

    //validation shapes (Yup)
    const commonYupShape = () => {
        return {
            email: Yup.string().required("Required").matches(/^\w+(\.\w+)*@([a-z]{2,12})(\.[a-z]{2,6})$/, "Not a valid e-mail format"),
            password: Yup.string().required("Required").min(6, "Minimum 6 characters").max(20, "Maximum 20 characters"),
            passwordRepeat: Yup.string().oneOf([Yup.ref("password"), null], "Not matching").required("Required")
        }
    }

    const sysEmplYupShape = () => {
        return {
            firstName: Yup.string().required("Required").min(2, "Minimum 2 characters").max(50, "Maximum 50 characters"),
            lastName: Yup.string().required("Required").min(2, "Minimum 2 characters").max(50, "Maximum 50 characters"),
            ...commonYupShape()
        }
    }

    const candidateShape = () => {
        return {
            nationalityId: Yup.string().required("Required").matches(/^\d{11}$/, "Should be 11 digits"),
            birthYear: Yup.number().required("Required").min(1900, "Minimum 1900").max(new Date().getFullYear() - 16, "You should be over 16 years old to sign up"),
            ...sysEmplYupShape()
        }
    }

    const employerYupShape = () => {
        return {
            companyName: Yup.string().required("Required").min(2, "Minimum 2 characters").max(50, "Maximum 50 characters"),
            website: Yup.string().required("Required").matches(/^(w{3}\.)?[^.]+(\.[a-z]{2,12})$/, "Not a valid web site format"),
            phoneNumber: Yup.string().required("Required").matches(/^((\+?\d{1,3})?0?[\s-]?)?\(?0?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, "Not a valid phone number format"),
            ...commonYupShape()
        }
    }

    //initial values (Formik)
    const commonInitial = {email: "", password: "", passwordRepeat: "",}
    const sysEmplInitial = {firstName: "", lastName: "", ...commonInitial}
    const candidateInitial = {birthYear: "", nationalityId: "", ...sysEmplInitial}
    const employerInitial = {companyName: "", website: "", phoneNumber: "", ...commonInitial}

    //determine which one will be used according to userType
    let initialValues;
    let validationShape;
    let service;
    switch (String(userType)) {
        case "candidate" :
            initialValues = candidateInitial;
            validationShape = candidateShape();
            service = new CandidateService();
            break
        case "systemEmployee" :
            initialValues = sysEmplInitial;
            validationShape = sysEmplYupShape();
            service = new SystemEmployeeService();
            break
        case "employer" :
            initialValues = employerInitial;
            validationShape = employerYupShape();
            service = new EmployerService();
            break
        default :
            break
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object().shape(validationShape),
        onSubmit: (values) => {
            service.add(values)
                .then((r) => {
                    dispatch(login(r.data.data, userType))
                    toast("Welcome")
                    history.push("/")
                })
                .catch(handleCatch)
        }
    });

    if (userType !== "candidate" && userType !== "employer" && userType !== "systemEmployee")
        return <Header content={"Invalid User Type"}/>

    //inputs according to userType
    const popupSize = !verticalScreen ? undefined : "small"
    const popupPosition = !verticalScreen ? "right center" : "top center"
    const iconPosition = "left"
    const commonInputs = () => [
        <SPopupInput icon="at" placeholder="Email" name="email" type={"email"} popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={1}/>,
        <SPopupInput icon="lock" placeholder="Password" name="password" type={"password"} popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={2}/>,
        <SPopupInput icon="lock" placeholder="Password Repeat" name="passwordRepeat" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} type={"password"} formik={formik} key={3}/>
    ]

    const sysEmplInputs = () => [
        <SPopupInput icon="user" placeholder="First Name" name="firstName" popupposition={popupPosition} formik={formik}
                     popupsize={popupSize} iconposition={iconPosition} key={4}/>,
        <SPopupInput icon="user" placeholder="Last Name" name="lastName" popupposition={popupPosition} formik={formik}
                     popupsize={popupSize} iconposition={iconPosition} key={5}/>,
        ...commonInputs()
    ]

    const candidateInputs = () => [
        ...sysEmplInputs(),
        <SPopupInput icon="id card" placeholder="Nationality ID" name="nationalityId" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} type={"number"} formik={formik} key={6}/>,
        <SPopupInput icon="calendar check" placeholder="Birth Year" name="birthYear" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} type={"number"} formik={formik} key={7}/>
    ]

    const employerInputs = () => [
        <SPopupInput icon="building outline" placeholder="Company Name" name="companyName" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={8}/>,
        <SPopupInput icon="world" placeholder="Website" name="website" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={9}/>,
        <SPopupInput icon="phone" placeholder="Phone Number" name="phoneNumber" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={10}/>,
        ...commonInputs()
    ]

    return (
        <div>
            <Header color="purple" textAlign="center" content={"Sign Up"}/>

            <Grid centered stackable padded>
                <Grid.Column width={6}>
                    <Segment placeholder color={"purple"} padded textAlign={"center"} raised style={{borderRadius: 15}}>
                        <Form size="large" onSubmit={formik.handleSubmit}>

                            {userType === "candidate" ? candidateInputs() :
                                userType === "employer" ? employerInputs() :
                                    userType === "systemEmployee" ? sysEmplInputs() :
                                        null}

                            <Button animated="fade" type="submit" size="large" color="purple" style={{marginTop: 15}}>
                                <Button.Content hidden><Icon name='signup'/></Button.Content>
                                <Button.Content visible>Sign Up</Button.Content>
                            </Button>

                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>

            <Grid textAlign="center" stackable>
                <Grid.Column width={10}>
                    <Message warning onDismiss={() => setLoginMsgOpen(false)} hidden={!loginMsgOpen}>
                        <Icon name='help'/>
                        Already signed up ?
                        <Link to={"/login"} onClick={() => window.scrollTo(0, 0)}> Login Here </Link>
                        instead.
                    </Message>
                </Grid.Column>
            </Grid>

        </div>
    );
}
