import React, {useEffect, useState} from "react";
import {Button, Dimmer, Grid, Icon, Image, Label, Modal, Popup, Segment} from "semantic-ui-react";
import ImageService from "../../services/imageService";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {changeImages} from "../../store/actions/userActions";
import {handleCatch} from "../../utilities/Utils";
import UserService from "../../services/userService";
import {onUpdate} from "../../utilities/UserUtils";
import CandidateCvService from "../../services/candidateCvService";
import {onCVUpdate} from "../../utilities/CandidateUtils";

function ImageUploadModal({user, cv, ...props}) {

    const imageService = new ImageService();
    const userService = new UserService();
    const cvService = new CandidateCvService();

    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [fileInput, setFileInput] = useState();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedImgId, setSelectedImgId] = useState();

    useEffect(() => {
        return () => {
            setOpen(undefined)
            setSelectedFile(undefined)
            setFileInput(undefined)
            setLoading(undefined)
            setUploading(undefined)
            setDeleting(undefined)
            setSelectedImgId(undefined)
        };
    }, []);

    useEffect(() => {
        if (selectedFile?.size / 1000000 > 1) {
            toast.warning("You can upload files up to 1 MB")
            setSelectedFile(undefined)
        }
    }, [selectedFile]);

    if (!user) return null

    const profileImgId = user.profileImg?.id
    const cvImgId = cv?.image?.id

    const selectFile = (event) => setSelectedFile(event.target.files[0])

    const uploadImg = () => {
        setUploading(true)
        const fd = new FormData();
        fd.append("multipartFile", selectedFile, selectedFile.name);
        imageService.upload(user.id, fd)
            .then(r => {
                user.images.push(r.data.data)
                dispatch(changeImages(user.images))
                setSelectedFile(undefined)
                setSelectedImgId(r.data.data.id)
                toast("Uploaded");
            })
            .catch(handleCatch)
            .finally(() => setUploading(false))
    };

    const deleteImg = () => {
        setDeleting(true)
        if (selectedImgId === profileImgId) updateProfileImg(undefined)
        if (selectedImgId === cvImgId) updateCvImg(undefined)
        const index = user.cvs ? user.cvs.findIndex(userCv => userCv.id !== cv?.id && userCv.image?.id === selectedImgId) : -1
        if (index !== -1) {
            toast.warning(`You are using this image in ${cv ? "other CVs" : "your CVs"}`)
            setDeleting(false);
            return;
        }
        imageService.deleteById(selectedImgId)
            .then(() => {
                const imgIndex = user.images.findIndex(img => img.id === selectedImgId)
                user.images.splice(imgIndex, 1)
                dispatch(changeImages(user.images))
                setSelectedImgId(undefined)
                toast("Deleted")
            })
            .catch(handleCatch)
            .finally(() => setDeleting(false))
    };

    const photoKind = !!user.companyName ? "logo" : cv ? "CV photo" : "profile photo"

    const updateProfileImg = (imgId) => {
        setLoading(true)
        userService.updateProfileImg(imgId, user.id)
            .then(r => onUpdate(dispatch, r, imgId ? "Successful" : "Removed from profile"))
            .catch(handleCatch)
            .finally(() => setLoading(false))
    }

    const updateCvImg = (imgId) => {
        setLoading(true)
        cvService.updateImg(imgId, cv.id)
            .then(r => onCVUpdate(dispatch, cv.id, user.cvs, r, imgId ? "Successful" : "Removed from CV"))
            .catch(handleCatch)
            .finally(() => setLoading(false))
    }

    const onUpdateImg = (imgId) => cv ? updateCvImg(imgId) : updateProfileImg(imgId)

    const handleImgClick = (imageId) =>
        selectedImgId === imageId ? setSelectedImgId(undefined) : setSelectedImgId(imageId)

    const hasImg = user.images?.length !== 0

    const dimmerStyle = {backgroundColor: "rgba(0,0,0,0.3)", outlineStyle: "ridge"}
    const imgDimmer = <Dimmer active style={dimmerStyle}/>

    const modelHeaderContent = !hasImg ?
        <div>Upload {photoKind} &nbsp;<Icon name={"cloud upload"} color={"blue"}/></div> : "Select a Photo"

    return (
        <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} closeIcon basic
               trigger={
                   <Label attached={"top right"} as={Button}
                          icon={<Icon name={"images"} style={{marginLeft: -2, marginTop: -2}} size={"large"} color={"violet"}/>}
                          style={{marginTop: -10, marginRight: -10, borderRadius: 20, opacity: 0.85, width: 33}} {...props}/>}>
            <Modal.Header style={{marginLeft: 15}} content={modelHeaderContent}/>
            {!hasImg ? null :
                <Modal.Content image scrolling style={{maxHeight: "30em"}}>
                    <Modal.Description>
                        <Segment basic style={{marginLeft: -8}}>
                            <Image.Group size={"medium"}>
                                {user.images.map(image =>
                                    <Image src={image.imageUrl} key={image.id} onClick={() => handleImgClick(image.id)}
                                           dimmer={image.id === selectedImgId ? imgDimmer : undefined}/>
                                )}
                            </Image.Group>
                        </Segment>
                    </Modal.Description>
                </Modal.Content>}
            <Modal.Actions>
                <input style={{display: "none"}} type="file" onChange={selectFile}
                       ref={fileInput => setFileInput(fileInput)}/>
                <Grid stackable doubling>
                    {!hasImg ? null :
                        <Grid.Column width={5}>
                            <Button content={`Make ${photoKind}`} icon={!!user.companyName ? "building outline" : "user"} loading={loading}
                                    labelPosition={"right"} fluid onClick={() => onUpdateImg(selectedImgId)} color={"blue"}
                                    disabled={!selectedImgId || cv ? selectedImgId === cvImgId : selectedImgId === profileImgId || loading}/>
                        </Grid.Column>}
                    {!hasImg ? null :
                        <Grid.Column width={5}>
                            <Button content={"Delete"} icon={"x"} labelPosition={"right"} fluid
                                    onClick={deleteImg} color={"red"} loading={deleting} disabled={!selectedImgId}/>
                        </Grid.Column>}
                    {!hasImg ? null :
                        <Grid.Column width={5}>
                            <Button content={`Remove ${photoKind}`} icon={"x"} labelPosition={"right"} fluid
                                    onClick={() => onUpdateImg(undefined)} color={"yellow"} loading={loading}
                                    disabled={cv ? !cvImgId : !profileImgId || loading}/>
                        </Grid.Column>}
                    <Grid.Column width={5}>
                        <Button content={selectedFile ? "Change selected file" : "Choose a file to upload"}
                                icon={"file image outline"} labelPosition={"right"} fluid
                                onClick={() => fileInput.click()}/>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Popup
                            trigger={
                                <Button content={`Upload`} icon='check' labelPosition='right' onClick={uploadImg}
                                        fluid positive loading={uploading} disabled={!selectedFile}/>
                            }
                            content={selectedFile?.name} on={"hover"} position={"top center"}/>
                    </Grid.Column>
                </Grid>
            </Modal.Actions>
        </Modal>
    )
}

export default ImageUploadModal