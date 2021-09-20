import defEmployerImg from "../../assets/images/defEmployerImg.png";
import {cropImgByDynamicUrl} from "../../utilities/UserUtils";
import {Image} from "semantic-ui-react";
import React from "react";

function EmployerLogo({user, defImgSize = 23, padded, ...props}) {

    const defImg = !user.profileImg
    const imgSrc = defImg ? defEmployerImg : cropImgByDynamicUrl(user.profileImg)
    const radius = defImg ? 0 : undefined

    const size = {height: defImgSize, width: defImg ? defImgSize * 0.85 : defImgSize}
    const style = props.size === "mini" && defImg ?
        {borderRadius: radius, marginRight: padded ? 7 : 2, marginLeft: padded ? 7 : 2} : undefined

    return <Image src={imgSrc} avatar={!defImg} style={{...style, ...size}} {...props}/>
}

export default EmployerLogo