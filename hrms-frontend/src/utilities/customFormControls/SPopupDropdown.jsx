import {defErrPopupStyle, defInfoPopupStyle} from "../Utils";
import {Dropdown, Popup} from "semantic-ui-react";
import React from "react";

function SPopupDropdown({name, formik, ...props}) {

    const meta = formik.getFieldMeta(name);
    const content = meta.error ? meta.error :  props.placeholder

    return (
        <Popup
            trigger={
                <Dropdown clearable item search selection selectOnBlur={false} value={meta.value} style ={props.dropdownstyle}
                          onChange={(event, data) => formik.setFieldValue(name, data.value)}
                          {...props}
                />
            }
            open={meta.error && meta.touched}
            position={"bottom center"}
            content={content}
            style={meta.error ? defErrPopupStyle : defInfoPopupStyle}
            {...props}
        />
    )
}

export default SPopupDropdown;