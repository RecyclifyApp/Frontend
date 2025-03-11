/* eslint-disable react/prop-types */
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogRoot } from "@/components/ui/dialog";
import { Button, Box, Image } from "@chakra-ui/react";
import { FileInput, FileUploadClearTrigger, FileUploadLabel, FileUploadRoot } from "@/components/ui/file-upload";
import { CloseButton } from "@/components/ui/close-button";
import { InputGroup } from "@/components/ui/input-group";
import { LuFileUp } from "react-icons/lu";
import { useEffect, useState } from "react";
import server from "../../../networking";
import { CgProfile } from "react-icons/cg";
import ShowToast from "../../Extensions/ShowToast";

function EditAvatarDialog({ userDetails, isOpen, onClose }) {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSaveLoading, setIsSaveLoading] = useState(false);  
    const [isRemoveLoading, setIsRemoveLoading] = useState(false); 

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                if (userDetails.avatar) {
                    const response = await server.get(`/api/Identity/getAvatar?userId=${userDetails.id}`);
                    if (response.data.avatarUrl) {
                        setAvatarUrl(response.data.avatarUrl);
                    }
                } else {
                    setAvatarUrl(null);
                }
            } catch (error) {
                console.error("Error fetching avatar:", error);
                setAvatarUrl(null);
            }
        };

        fetchAvatar();
    }, [userDetails.id, userDetails.avatar]);

    const handleFileChange = (details) => {
        const file = details.acceptedFiles[0];
        setSelectedFile(file);
    };

    const onSave = async () => {
        if (!selectedFile) {
            alert("Please select a file before saving.");
            return;
        }

        setIsSaveLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await server.post("/api/Identity/editAvatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                transformRequest: (formData) => formData,
            });

            if (response.data.avatarUrl) {
                setAvatarUrl(response.data.avatarUrl);
                onClose();
                setTimeout(() => window.location.reload(), 1000);
                ShowToast("success", "Avatar Uploaded Successfully", "Enjoy your new look!")
            } else {
                console.error("Failed to update avatar:", response.data);
            }
        } catch (error) {
            console.error("Error updating avatar:", error);
            if (error.response && error.response.data && error.response.data.error && typeof error.response.data.error === "string") {
                if (error.response.data.error.startsWith("UERROR")) {
                    ShowToast("error", error.response.data.error.substring("UERROR:".length));
                    return;
                } else {
                    ShowToast("error", error.response.data.error.substring("ERROR:".length));
                    return;
                }
            }
        } finally {
            setIsSaveLoading(false);
        }
    };

    const onRemove = async () => {
        setIsRemoveLoading(true);

        try {
            const response = await server.post(`/api/Identity/removeAvatar`, {}, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.message === "SUCCESS: Avatar removed successfully.") {
                setAvatarUrl(null);
                onClose();
                setTimeout(() => window.location.reload(), 1000);
                ShowToast("success", "Avatar Removed Successfully", "Back to the default...")
            } else {
                console.error("Failed to remove avatar:", response.data);
            }
        } catch (error) {
            console.error("Error removing avatar:", error);
            if (error.response && error.response.data && error.response.data.error && typeof error.response.data.error === "string") {
                if (error.response.data.error.startsWith("UERROR")) {
                    ShowToast("error", error.response.data.error.substring("UERROR:".length));
                    return;
                } else {
                    ShowToast("error", error.response.data.error.substring("ERROR:".length));
                    return;
                }
            }
        } finally {
            setIsRemoveLoading(false);
        }
    };

    const onCancel = () => {
        setSelectedFile(null);
        onClose();
    };

    return (
        <DialogRoot placement="center" motionPreset="slide-in-bottom" open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Avatar</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                boxSize="150px"  
                                borderRadius="full"  
                                alt="User Avatar"
                            />
                        ) : (
                            <CgProfile size="150" />
                        )}
                    </Box>
                    <FileUploadRoot onFileChange={handleFileChange} gap="1" p={2}>
                        <FileUploadLabel mb={2}>Upload Avatar</FileUploadLabel>
                        <InputGroup
                            w="100%"
                            startElement={<LuFileUp />}
                            endElement={
                                <FileUploadClearTrigger asChild>
                                    <CloseButton
                                        me="-1"
                                        size="xs"
                                        variant="plain"
                                        focusVisibleRing="inside"
                                        focusRingWidth="2px"
                                        pointerEvents="auto"
                                        color="fg.subtle"
                                    />
                                </FileUploadClearTrigger>
                            }
                        >
                            <FileInput />
                        </InputGroup>
                    </FileUploadRoot>
                </DialogBody>
                <DialogFooter>
                    <Button 
                        onClick={onRemove} 
                        backgroundColor="red" 
                        color={"white"}
                        variant="outline" 
                        loading={isRemoveLoading} 
                        loadingText="Removing..." 
                        left={6}
                        position={"absolute"}
                        disabled={!userDetails.avatar}
                    >
                        Remove
                    </Button>
                    <DialogActionTrigger asChild>
                        <Button 
                            variant="outline" 
                            onClick={onCancel} 
                            disabled={isSaveLoading || isRemoveLoading}
                            mr={2}
                        >
                            Cancel
                        </Button>
                    </DialogActionTrigger>
                    <Button 
                        onClick={onSave} 
                        background="#2D65FF"
                        loading={isSaveLoading} 
                        loadingText="Uploading..."
                        disabled={!selectedFile}
                    >
                        Save
                    </Button>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
}

export default EditAvatarDialog;
