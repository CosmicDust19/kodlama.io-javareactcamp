import {Input, Popup} from "semantic-ui-react";
import {defErrPopupStyle, defInfoPopupStyle, defInputStyle} from "../Utils";

function SPopupInput({name, formik, popupposition = "bottom center", popupsize, ...props}) {

    const meta = formik.getFieldMeta(name);

    return (
        <Popup
            trigger={
                <Input name={name} onChange={formik.handleChange} value={meta.value} iconPosition={props.iconposition}
                       style={props.inputstyle ? props.inputstyle : defInputStyle} {...props}/>
            }
            size={popupsize}
            position={popupposition}
            open={meta.error && meta.touched}
            content={meta.error ? meta.error : props.placeholder}
            style={meta.error ? defErrPopupStyle : defInfoPopupStyle}
            {...props}
        />
    )
}

export default SPopupInput;