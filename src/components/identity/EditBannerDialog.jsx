/* eslint-disable react/prop-types */
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogRoot } from "@/components/ui/dialog";
import { Button, Box, Image } from "@chakra-ui/react";
import { FileInput, FileUploadClearTrigger, FileUploadLabel, FileUploadRoot } from "@/components/ui/file-upload";
import { CloseButton } from "@/components/ui/close-button";
import { InputGroup } from "@/components/ui/input-group";
import { LuFileUp } from "react-icons/lu";
import { useEffect, useState } from "react";
import server from "../../../networking";
import ShowToast from "../../Extensions/ShowToast";

function EditBannerDialog({ userDetails, isOpen, onClose }) {
    const [bannerUrl, setBannerUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSaveLoading, setIsSaveLoading] = useState(false);  
    const [isRemoveLoading, setIsRemoveLoading] = useState(false); 

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                if (userDetails.banner) {
                    const response = await server.get(`/api/Identity/getBanner?userId=${userDetails.id}`);
                    if (response.data.bannerUrl) {
                        setBannerUrl(response.data.bannerUrl);
                    }
                } else {
                    setBannerUrl(null);
                }
            } catch (error) {
                console.error("Error fetching banner:", error);
                setBannerUrl(null);
                if (error.response && error.response.data && error.response.data.error && typeof error.response.data.error === "string") {
                    if (error.response.data.error.startsWith("UERROR")) {
                        ShowToast("error", error.response.data.error.substring("UERROR:".length));
                        return;
                    } else {
                        ShowToast("error", error.response.data.error.substring("ERROR:".length));
                        return;
                    }
                }
            }
        };

        fetchBanner();
    }, [userDetails.id, userDetails.banner]);

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
            const response = await server.post("/api/Identity/editBanner", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                transformRequest: (formData) => formData,
            });

            if (response.data.bannerUrl) {
                setBannerUrl(response.data.bannerUrl);
                onClose();
                setTimeout(() => window.location.reload(), 1000); // Refresh page after closing
                ShowToast("success", "Banner Uploaded Successfully", "Enjoy your new look!")
            } else {
                console.error("Failed to update banner:", response.data);
            }
        } catch (error) {
            console.error("Error updating banner:", error);
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
            const response = await server.post(`/api/Identity/removeBanner`, {}, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.message === "SUCCESS: Banner removed successfully.") {
                setBannerUrl(null);
                onClose();
                setTimeout(() => window.location.reload(), 1000); // Refresh page after closing
                ShowToast("success", "Banner Removed Successfully", "Back to the default...")
            } else {
                console.error("Failed to remove banner:", response.data);
            }
        } catch (error) {
            console.error("Error removing banner:", error);
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
                    <DialogTitle>Edit Banner</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
                        {bannerUrl ? (
                            <Image
                            src={bannerUrl}
                                width="100%" 
                                height="15vh"
                                objectFit="cover" 
                                borderRadius={15} 
                            />
                        ) : (
                            <Box
                                borderRadius={15}
                                borderWidth={1}
                                backgroundImage={bannerUrl || `url(/defaultAccountBanner.png)`}
                                backgroundSize="cover"
                                backgroundPosition="center"
                                backgroundRepeat="no-repeat"
                                width="100%"
                                height="15vh"
                                display="flex"
                                alignItems="center"
                                position="relative"
                            />
                        )}
                    </Box>
                    <FileUploadRoot onFileChange={handleFileChange} gap="1" p={2}>
                        <FileUploadLabel mb={2}>Upload Banner</FileUploadLabel>
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
                        disabled={!userDetails.banner}
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

export default EditBannerDialog;

