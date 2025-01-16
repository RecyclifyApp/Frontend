import { useState } from 'react';
import { Heading, Box, Button, Text, Group, Input, InputAddon } from '@chakra-ui/react';
import { Toaster, toaster } from "@/components/ui/toaster";
import { CloseButton } from "@/components/ui/close-button";
import { FileUploadDropzone, FileUploadRoot } from "@/components/ui/file-upload"
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from "@/components/ui/dialog"
import server from "../../../networking";

function ImageRecognition() {
    const [open, setOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const [itemCategory, setItemCategory] = useState(null);
    const [itemRecyclable, setItemRecyclable] = useState(false);
    const [submissionReady, setSubmissionReady] = useState(false);

    const clearFile = () => {
        setSelectedFile(null);
        setSubmissionReady(false);
    };

    const handleFileChange = (details) => {
        const file = details.acceptedFiles[0];
        setSelectedFile(file);
        setSubmissionReady(!!file);
    }

    const handleUploadItem = () => {
        if (!selectedFile) {
            toaster.promise(Promise.reject(), {
                error: {
                    title: "Error",
                    description: "No file selected for upload",
                },
            });
            return;
        }
    
        const formData = new FormData();
        formData.append("file", selectedFile);
    
        const uploadPromise = server.post("/api/student/recognise-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            transformRequest: (formData) => formData,
        });
    
        toaster.promise(
            uploadPromise
                .then((response) => {
                    if (response.status === 200) {
                        setItemCategory(response.data.category);
                        setItemRecyclable(response.data.result === "Yes");
                        setOpen(true);
                    } else {
                        throw new Error(`Unexpected response status: ${response.status}`);
                    }
                })
                .catch((error) => {
                    console.error("Upload failed:", error.response?.data || error.message);
                    throw error.response?.data?.error || "An unknown error occurred.";
                }),
            {
                loading: { title: "Uploading...", description: "Please wait while your file is being processed." },
                success: { title: "Success", description: "The file was uploaded successfully!" },
                error: { title: "Error", description: (err) => `Upload failed: ${err}` },
            }
        );
    };

    return (
        <>
            <Box display="flex" justifyContent={"center"} flexDir="column" mt={10}>
                <Heading fontSize="30px">Scan my item</Heading>

                <Box display="flex" justifyContent={"center"} alignItems={"center"} flexDir={"column"} boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"} borderRadius={20} width="40%" margin="auto" p={5} mt={5}>
                    <Heading fontSize="20px" mb={5}>Upload your image</Heading>
                    <FileUploadRoot onFileChange={handleFileChange} maxW="xl" alignItems="stretch" maxFiles={1}>
                        <FileUploadDropzone
                            label="Drag and drop here to upload"
                            description=".png, .jpg up to 5MB"
                        />

                        {selectedFile && (
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt="4">
                                <Text>{selectedFile.name}</Text>
                                <CloseButton size="sm" variant="outline" onClick={clearFile} />
                            </Box>
                        )}
                    </FileUploadRoot>

                    <Button
                        display="flex"
                        justifyContent="center"
                        backgroundColor="#2D65FF"
                        mb={2}
                        colorScheme="white"
                        _hover={{ bg: "#1752FD" }}
                        borderRadius="30px"
                        alignItems="center"
                        mt={10}
                        onClick={handleUploadItem}
                        disabled={!submissionReady}
                    >
                        <Text>Scan my item</Text>
                    </Button>
                </Box>
            </Box>

            <DialogRoot
                placement={"center"}
                motionPreset="slide-in-bottom"
                lazyMount
                open={open}
                onOpenChange={(e) => setOpen(e.open)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Results</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Box display="flex" justifyContent={"center"} alignItems={"center"} flexDir={"column"}>
                            <Heading mb={3}>Detected item: {itemCategory}</Heading>
                            <Text mb={5} fontSize={15}>Recyclable: {itemRecyclable ? "Yes" : "No"}</Text>
                        </Box>
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant="solid" backgroundColor="#2D65FF" _hover={{ bg: "#1752FD" }}>Thanks!</Button>
                        </DialogActionTrigger>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>

            <Toaster />
        </>
    );
}

export default ImageRecognition;