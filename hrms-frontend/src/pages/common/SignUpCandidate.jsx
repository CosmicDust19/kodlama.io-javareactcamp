import {SignUp} from "../../components/common/SignUp";
import CandidateService from "../../services/candidateService";
import * as Yup from "yup";
import SPopupInput from "../../utilities/customFormControls/SPopupInput";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {useFormik} from "formik";
import {login} from "../../store/actions/userActions";
import {toast} from "react-toastify";
import {handleCatch} from "../../utilities/Utils";

export function SignUpCandidate() {

    const candidateService = new CandidateService()

    const dispatch = useDispatch();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [jiggle, setJiggle] = useState(true);
    const [verticalScreen, setVerticalScreen] = useState(window.innerWidth < window.innerHeight);

    useEffect(() => {
        return () => {
            setLoading(undefined)
            setJiggle(undefined)
            setVerticalScreen(undefined)
        };
    }, []);

    useEffect(() => {
        setVerticalScreen(window.innerWidth < window.innerHeight)
    }, [jiggle]);

    const initial = {firstName: "", lastName: "", birthYear: "", nationalityId: "", email: "", password: "", passwordRepeat: ""}

    const shape = {
        email: Yup.string().required("Required").matches(/^\w+(\.\w+)*@([a-z]{2,12})(\.[a-z]{2,6})$/, "Not a valid e-mail format"),
        password: Yup.string().required("Required").min(6, "Minimum 6 characters").max(20, "Maximum 20 characters"),
        passwordRepeat: Yup.string().oneOf([Yup.ref("password"), null], "Not matching").required("Required"),
        firstName: Yup.string().required("Required").min(2, "Minimum 2 characters").max(50, "Maximum 50 characters"),
        lastName: Yup.string().required("Required").min(2, "Minimum 2 characters").max(50, "Maximum 50 characters"),
        nationalityId: Yup.string().required("Required").matches(/^\d{11}$/, "Should be 11 digits"),
        birthYear: Yup.number().required("Required").min(1900, "Minimum 1900").max(new Date().getFullYear() - 16, "You should be over 16 years old to sign up")
    }

    const formik = useFormik({
        initialValues: initial,
        validationSchema: Yup.object().shape(shape),
        onSubmit: (values) => {
            setLoading(true)
            candidateService.add(values)
                .then((r) => {
                    dispatch(login(r.data.data, "candidate"));
                    toast("Welcome");
                    history.push("/");
                })
                .catch(handleCatch)
                .finally(() => setLoading(false))
        }
    });

    const popupSize = !verticalScreen ? undefined : "small"
    const popupPosition = !verticalScreen ? "right center" : "top center"
    const iconPosition = "left"
    const inputComponents = [
        <SPopupInput icon="user" placeholder="First Name" name="firstName" popupposition={popupPosition} formik={formik}
                     popupsize={popupSize} iconposition={iconPosition} key={1} jiggle={jiggle}
                     className={"padded"}/>,
        <SPopupInput icon="user" placeholder="Last Name" name="lastName" popupposition={popupPosition} formik={formik}
                     popupsize={popupSize} iconposition={iconPosition} key={2} jiggle={jiggle}
                     className={"padded"}/>,
        <SPopupInput icon="id card" placeholder="Nationality ID" name="nationalityId" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} type={"number"} formik={formik} key={3}
                     jiggle={jiggle} className={"padded"}/>,
        <SPopupInput icon="calendar check" placeholder="Birth Year" name="birthYear" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} type={"number"} formik={formik} key={4}
                     jiggle={jiggle} className={"padded"}/>,
        <SPopupInput icon="at" placeholder="Email" name="email" type={"email"} popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={5} jiggle={jiggle}
                     className={"padded"}/>,
        <SPopupInput icon="lock" placeholder="Password" name="password" type={"password"} popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} formik={formik} key={6} jiggle={jiggle}
                     className={"padded"}/>,
        <SPopupInput icon="lock" placeholder="Password Repeat" name="passwordRepeat" popupposition={popupPosition}
                     popupsize={popupSize} iconposition={iconPosition} type={"password"} formik={formik} key={7}
                     className={"padded"} jiggle={jiggle}/>
    ]

    return <SignUp service={candidateService} formik={formik} inputComponents={inputComponents}
                   toggleJiggle={() => setJiggle(!jiggle)} loading={loading}/>
}