import React, {useState} from "react";
import {Button, Dimmer, Grid, Image, Modal, Popup, Segment} from "semantic-ui-react";
import ImageService from "../../services/imageService";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {changeImages} from "../../store/actions/userActions";
import {handleCatch} from "../../utilities/Utils";
import UserService from "../../services/userService";
import {onUpdate} from "../../utilities/UserUtils";

function ImageUploadModal({user, ...props}) {

    const imageService = new ImageService();
    const userService = new UserService()

    const dispatch = useDispatch()

    const [open, setOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState();
    const [fileInput, setFileInput] = useState();
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedImgId, setSelectedImgId] = useState();

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
                toast("Uploaded");
            })
            .catch(err => {
                if (!handleCatch(err))
                    toast.warning("You can upload files up to 1 MB")
            })
            .finally(() => setUploading(false))
    };

    const deleteImg = () => {
        setDeleting(true)
        if (selectedImgId === user.profileImgId) updateProfileImg(undefined)
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
    }

    const updateProfileImg = (imgId) => {
        userService.updateProfileImgId(imgId, user.id)
            .then(r => onUpdate(dispatch, r, imgId ? "Successful" : "Profile photo removed"))
            .catch(handleCatch)
    }

    const handleImgClick = (imageId) =>
        selectedImgId === imageId ? setSelectedImgId(undefined) : setSelectedImgId(imageId)

    const hasImg = user.images?.length !== 0

    const dimmerStyle = {backgroundColor: "rgba(0,0,0,0.3)", outlineStyle: "ridge"}
    const imgDimmer = <Dimmer active style={dimmerStyle}/>

    return (
        <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} closeIcon basic
               trigger={
                   <Button compact color={"violet"} labelPosition={"right"} icon={"images"}
                           content={user.images?.length === 0 ? "Add a photo" : "Your photos"} {...props}/>}>
            <Modal.Header style={{marginLeft: 15}}>
                {!hasImg ? "Upload your first photo" : "Select a Photo"}
            </Modal.Header>
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
                            <Button content={"Make profile photo"} icon={"user"} labelPosition={"right"} fluid
                                    onClick={() => updateProfileImg(selectedImgId)} color={"blue"}
                                    disabled={!selectedImgId || selectedImgId === user.profileImgId}/>
                        </Grid.Column>}
                    {!hasImg ? null :
                        <Grid.Column width={5}>
                            <Button content={"Delete"} icon={"x"} labelPosition={"right"} fluid
                                    onClick={deleteImg} color={"red"} loading={deleting} disabled={!selectedImgId}/>
                        </Grid.Column>}
                    {!hasImg ? null :
                        <Grid.Column width={5}>
                            <Button content={"Remove profile photo"} icon={"x"} labelPosition={"right"} fluid
                                    onClick={() => updateProfileImg(undefined)} color={"yellow"}
                                    disabled={!user.profileImgId}/>
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