import {Input, Popup} from "semantic-ui-react";
import {errorPopupStyle, getValueByFieldName, infoPopupStyle, inputStyle} from "../Utils";

export default function SPopupInput(
    {
        name, formik,
        error = getValueByFieldName(formik.errors, name),
        touched = getValueByFieldName(formik.touched, name),
        value = getValueByFieldName(formik.values, name),
        icon, iconPosition, placeholder, type = "text", as, inputSize, disabled,
        fluid, inverted, label, labelPosition, loading, inputClassName, onChange = formik.handleChange,
        popupPosition = "bottom center", popupSize, mouseEnterDelay, mouseLeaveDelay, popupBasic, popupClassName,
        customInputStyle = inputStyle, customErrPopupStyle = errorPopupStyle, customInfoPopupStyle = infoPopupStyle
    }
) {
    return (
        <Popup
            trigger={
                <Input icon={icon} iconPosition={iconPosition} placeholder={placeholder} type={type} size={inputSize}
                       label={label} labelPosition={labelPosition} disabled={disabled} fluid={fluid} loading={loading}
                       inverted={inverted} name={name} onChange={onChange} as={as} value={value}
                       style={customInputStyle} className={inputClassName}
                />
            }
            position={popupPosition} content={error ? error : placeholder} size={popupSize} open={error && touched}
            style={error ? customErrPopupStyle : customInfoPopupStyle} basic={popupBasic} className={popupClassName}
            mouseEnterDelay={mouseEnterDelay} mouseLeaveDelay={mouseLeaveDelay}
        />
    )
}
