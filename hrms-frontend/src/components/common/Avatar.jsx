import {Image} from "semantic-ui-react";
import React from "react";
import {cropImgByDynamicUrl} from "../../utilities/UserUtils";
import defUserImg from "../../assets/images/defUserImg.png";

function Avatar({image, defImgSrc = defUserImg, ...props}) {
    const imgSrc = !image ? defImgSrc : cropImgByDynamicUrl(image)
    return <Image src={imgSrc} style={{userSelect: "none"}} avatar {...props}/>
}

export default Avatar