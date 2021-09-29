import {Dropdown, Popup} from "semantic-ui-react";
import React from "react";

function SPopupDropdown({name, formik, popupposition = "bottom center", popupsize, ...props}) {

    const meta = formik.getFieldMeta(name);

    return (
        <Popup
            trigger={
                <Dropdown clearable item search selection selectOnBlur={false} value={meta.value} style={props.dropdownstyle}
                          onChange={(event, data) => formik.setFieldValue(name, data.value)}
                          {...props}
                />
            }
            open={meta.error && meta.touched}
            position={popupposition} size={popupsize}
            content={meta.error ? meta.error : props.placeholder}
            className={meta.error ? "error-popup" : "info-popup"}
        />
    )
}

export default SPopupDropdown;