import {Image} from "semantic-ui-react";
import React from "react";
import {getImgUrl} from "../../utilities/UserUtils";
import defUserImg from "../../assets/images/defUserImg.png";
import defEmployerImg from "../../assets/images/defEmployerImg.png"

function UserAvatar ({user, size = "mini", ...props}) {

    const defImgSrc = !!user.companyName ? defEmployerImg : defUserImg

    const defImg = !user.profileImgId

    const imgSrc = defImg ? defImgSrc : getImgUrl(user.profileImgId, user.images)

    const height = defImg ? undefined : (size === "mini" ? 35 : 170)

    return <Image src={imgSrc} size={size} avatar={!!user.profileImgId} style={{height: height}} {...props}/>
}

export default UserAvatar