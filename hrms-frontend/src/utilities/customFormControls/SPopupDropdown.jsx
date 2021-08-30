import {errorPopupStyle, getValueByFieldName, infoPopupStyle} from "../Utils";
import {Dropdown, Popup} from "semantic-ui-react";
import React from "react";

export default function SPopupDropdown(
    {
        name, formik,
        error = getValueByFieldName(formik.errors, name),
        touched = getValueByFieldName(formik.touched, name),
        value = getValueByFieldName(formik.values, name),
        placeholder, options, onChange, selectOnBlur = false, onBlur, dropdownClassName, as, icon, loading, disabled, fluid,
        popupPosition = "bottom center", popupSize, mouseEnterDelay, mouseLeaveDelay, popupBasic, popupClassName,
        customDropdownStyle, customErrPopupStyle = errorPopupStyle, customInfoPopupStyle = infoPopupStyle
    }
) {
    return (
        <Popup
            trigger={
                <Dropdown clearable item search selection loading={loading} disabled={disabled} fluid={fluid} selectOnBlur={selectOnBlur}
                          placeholder={placeholder} options={options} value={value} icon={icon}
                          style={customDropdownStyle} as={as} className={dropdownClassName} onBlur={onBlur}
                          onChange={onChange ? onChange : (event, data) => formik.setFieldValue(name, data.value)}
                />
            }
            position={popupPosition} content={error ? error : placeholder} size={popupSize} open={error && touched}
            style={error ? customErrPopupStyle : customInfoPopupStyle} basic={popupBasic} className={popupClassName}
            mouseEnterDelay={mouseEnterDelay} mouseLeaveDelay={mouseLeaveDelay}
        />
    )
}