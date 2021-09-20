import {Menu} from "semantic-ui-react";
import React from "react";

function ItemsPerPageBar({itemPerPage, handleClick, disabled, visible, listedItemsLength, ...props}) {
    if (visible === false) return null
    return (
        <Menu pointing color={"blue"} secondary {...props}>
            <Menu.Item name='5' active={itemPerPage === 5} content={"5"} disabled={disabled}
                       onClick={() => handleClick(5)}/>
            <Menu.Item name='10' active={itemPerPage === 10} content={"10"} disabled={disabled || listedItemsLength <= 5}
                       onClick={() => handleClick(10)}/>
            <Menu.Item name='20' active={itemPerPage === 20} content={"20"} disabled={disabled  || listedItemsLength <= 10}
                       onClick={() => handleClick(20)}/>
            <Menu.Item name='50' active={itemPerPage === 50} content={"50"} disabled={disabled  || listedItemsLength <= 20}
                       onClick={() => handleClick(50)}/>
            <Menu.Item name='100' active={itemPerPage === 100} content={"100"} disabled={disabled  || listedItemsLength <= 50}
                       onClick={() => handleClick(100)} style={{borderRadius: 0}}/>
        </Menu>
    )
}

export default ItemsPerPageBar;