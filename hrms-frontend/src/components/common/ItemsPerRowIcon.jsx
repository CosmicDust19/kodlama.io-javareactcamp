import {Icon, Transition} from "semantic-ui-react";
import React, {useState} from "react";

function ItemsPerRowIcon({visible, itemsPerRow, ...props}) {

    const [thLargeVisible, setThLargeVisible] = useState(false);
    const [gridLayoutVisible, setGridLayoutVisible] = useState(true);
    const [thListVisible, setThListVisible] = useState(false);

    if (visible === false) return null
    const iconStyle = {marginLeft: 20, marginRight: 20, marginTop: 10, color: "rgba(31,90,211,0.78)"}
    const duration = 120

    const toggleVisible = () => {
        setThListVisible(itemsPerRow === 3)
        setGridLayoutVisible(itemsPerRow === 2)
        setThLargeVisible(itemsPerRow === 1)
    }

    return (
        <span style={{float: "right", marginLeft: -60}}>
            <Transition visible={itemsPerRow === 1 && thLargeVisible} duration={duration} onHide={toggleVisible} animation={"drop"}>
                <Icon name={"th large"} style={iconStyle} {...props}/>
            </Transition>
            <Transition visible={itemsPerRow === 2 && gridLayoutVisible} duration={duration} onHide={toggleVisible} animation={"drop"}>
                 <Icon name={"grid layout"} size="large" style={iconStyle} {...props}/>
            </Transition>
            <Transition visible={itemsPerRow === 3 && thListVisible} duration={duration} onHide={toggleVisible} animation={"drop"}>
                 <Icon name={"th list"} size="large" style={iconStyle} {...props}/>
            </Transition>
        </span>
    )
}

export default ItemsPerRowIcon