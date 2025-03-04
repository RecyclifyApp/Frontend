/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Box, Button, HStack, Input, VStack, Heading, Text, Textarea, Flex, Alert } from "@chakra-ui/react";
import { LuCheck, LuX } from "react-icons/lu"
import { ActionBarContent, ActionBarRoot, ActionBarSelectionTrigger, ActionBarSeparator } from "@/components/ui/action-bar";
import ShowToast from '../../Extensions/ShowToast';
import server from "../../../networking";
import { ClipboardIconButton, ClipboardRoot } from "@/components/ui/join-code-clipboard"
import EmailVerificationDialog from "../../components/identity/EmailVerificationDialog";

function AccountDetails({ userDetails, setUserDetails }) {
    const [height, setHeight] = useState('auto');
    const hiddenDivRef = useRef(null);
    const textareaRef = useRef(null);
    const [editedDetails, setEditedDetails] = useState(userDetails);
    const [isEditing, setIsEditing] = useState(false);
    const [isEmailDialogOpen, setEmailDialogOpen] = useState(false);
    const [isSendingVerificationEmail, setIsSendingVerificationEmail] = useState(false);
    const [emailVerified, setEmailVerified] = useState(userDetails.emailVerified);

    useEffect(() => {
        if (hiddenDivRef.current && textareaRef.current) {
            hiddenDivRef.current.innerText = editedDetails.aboutMe;
            setHeight(`${hiddenDivRef.current.offsetHeight}px`);
        }
    }, [editedDetails.aboutMe]);

    useEffect(() => {
        const isReverted = JSON.stringify(editedDetails) === JSON.stringify(userDetails);
        if (isReverted) {
            setIsEditing(false);
        }
    }, [editedDetails, userDetails]);

    const toggleEmailVerified = (value) => {
        setEmailVerified(value);
    };

    const handleSave = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{8}$/;
        const nameRegex = /^[A-Za-z\s]+$/;
        const studentEmailRegex = /^\d{6}[a-zA-Z]@mymail\.nyp\.edu\.sg$/;
    
        if (!emailRegex.test(editedDetails.email)) {
            ShowToast("error", "Invalid Email", "Please enter a valid email address.");
            return;
        }

        if (userDetails.userRole.toLowerCase() === "student" && !studentEmailRegex.test(editedDetails.email.trim())) {
            ShowToast("error", "Invalid Email", "Student email must follow the format: admin number followed by @mymail.nyp.edu.sg");
            return;
        }

        if (!phoneRegex.test(editedDetails.contactNumber)) {
            ShowToast("error", "Invalid Phone Number", "Phone number must be exactly 8 digits.");
            return;
        }

        if (!nameRegex.test(editedDetails.fName)) {
            ShowToast("error", "Invalid First Name", "First name can only contain letters and spaces.");
            return;
        }
    
        if (!nameRegex.test(editedDetails.lName)) {
            ShowToast("error", "Invalid Last Name", "Last name can only contain letters and spaces.");
            return;
        }    
    
        const detailsToUpdate = { ...editedDetails };
    
        try {
            const response = await server.put(`/api/Identity/editDetails`, detailsToUpdate);
            const rawResponseMessage = response.data.message;
            if (rawResponseMessage.startsWith("SUCCESS") && response.status === 200) {
                setUserDetails(editedDetails); 
                setIsEditing(false); 
                ShowToast("success", "Changes saved", "Your changes have been saved successfully.");
            }
        } catch (err) {
            const rawErrorMessage = err.response.data.error;
            if (rawErrorMessage.startsWith("UERROR")) {
                const errorMessage = rawErrorMessage.substring("UERROR: ".length).trim();
                if (errorMessage === "Username must be unique.") {
                    formik.setFieldError('name', 'Username already exists');
                } 
                if (errorMessage === "Email must be unique.") {
                    formik.setFieldError('email', 'Email already exists');
                } 
                if (errorMessage === "Contact number must be unique.") {
                    formik.setFieldError('contactNumber', 'Contact number already exists');
                }
                ShowToast("error", "Invalid Input.", errorMessage);
            } else if (rawErrorMessage.startsWith("ERROR")) {
                ShowToast("error", rawErrorMessage.substring("ERROR: ".length).trim());
            }
        }
    };

    const handleCancel = () => {
        setEditedDetails(userDetails); 
        setIsEditing(false); 
        ShowToast("warning", "Changes reverted", "Your changes have been reverted.");
    };

    const sendVerificationEmail = async () => {
        setIsSendingVerificationEmail(true);
        try {
            await server.post('/api/identity/emailVerification');
            setEmailDialogOpen(true);
            ShowToast("success", "Code Sent!", "A new verification code has been sent to your email.");
        } catch (error) {
            ShowToast("error", "Sending Failed", error.response?.data?.error || "Failed to send code");
        } finally {
            setIsSendingVerificationEmail(false);
        }
    };

    return (
        <Box w="70%" mx="auto">
            {/* About Me */}
            <HStack spacing={4} mb={6} mt={6}>
                <VStack align="start" flex={1}>
                    <Text
                        fontWeight={"bold"}
                        fontSize={20}
                    >
                        {userDetails.userRole.charAt(0).toUpperCase() + userDetails.userRole.slice(1).toLowerCase()}
                    </Text>

                    <Flex align="center" mb={4}>
                        <Text fontSize={12} mr={2}>UserId: {userDetails.id}</Text>
                        <ClipboardRoot value={userDetails.id}>
                            <ClipboardIconButton />
                        </ClipboardRoot>
                    </Flex>

                    <Heading size="md">About Me</Heading>
                    <Box position="relative" width="100%">
                        <Box
                            ref={hiddenDivRef}
                            position="absolute"
                            visibility="hidden"
                            whiteSpace="pre-wrap"
                            wordBreak="break-word"
                            width="100%"
                            fontSize="md"
                        />
                        <Textarea
                            ref={textareaRef}
                            value={editedDetails.aboutMe}
                            placeholder="Share something interesting about yourself!"
                            resize="none"
                            w="100%"
                            height={height}
                            minHeight="80px"
                            whiteSpace="pre-wrap"
                            wordBreak="break-word"
                            overflow="hidden"
                            onChange={(e) => {
                                setEditedDetails({ ...editedDetails, aboutMe: e.target.value });
                                setIsEditing(true);
                            }}
                        />
                    </Box>
                </VStack>
            </HStack>

            {/* Name Section */}
            <VStack align="start" spacing={4} mb={6}>
                <Heading size="md">Name</Heading>
                <HStack spacing={4} w="100%">
                    <VStack align="start" flex={1}>
                        <Text>Username</Text>
                        <Input 
                            value={editedDetails.name} 
                            onChange={(e) => {
                                setEditedDetails({ ...editedDetails, name: e.target.value });
                                setIsEditing(true);
                            }}
                        />
                    </VStack>
                    <VStack align="start" flex={1}>
                        <Text>First Name</Text>
                        <Input 
                            value={editedDetails.fName} 
                            onChange={(e) => {
                                setEditedDetails({ ...editedDetails, fName: e.target.value });
                                setIsEditing(true);
                            }}
                        />
                    </VStack>
                    <VStack align="start" flex={1}>
                        <Text>Last Name</Text>
                        <Input 
                            value={editedDetails.lName} 
                            onChange={(e) => {
                                setEditedDetails({ ...editedDetails, lName: e.target.value });
                                setIsEditing(true);
                            }}
                        />
                    </VStack>
                </HStack>
            </VStack>

            {/* Contact Information */}
            <VStack align="start" spacing={4} mb={6}>
                <Heading size="md">Contact Information</Heading>
                <HStack spacing={4} w="100%">
                    <VStack align="start" flex={1}>
                        <Text>Email</Text>
                        <Input 
                            value={editedDetails.email} 
                            onChange={(e) => {
                                setEditedDetails({ ...editedDetails, email: e.target.value });
                                setIsEditing(true);
                            }}
                        />
                    </VStack>
                    <VStack align="start" flex={1}>
                        <Text>Phone Number</Text>
                        <Input 
                            value={editedDetails.contactNumber} 
                            onChange={(e) => {
                                setEditedDetails({ ...editedDetails, contactNumber: e.target.value });
                                setIsEditing(true);
                            }}
                        />
                    </VStack>
                </HStack>
            </VStack>

            {/* Unverified contact alerts */}
            {(!userDetails.emailVerified) && (
                <HStack spacing={4} mb={6}>
                    {!emailVerified && (
                    <Alert.Root status="warning" w="100%">
                        <Alert.Indicator />
                        <Flex justify="space-between" align="center" w="100%">
                            <VStack align="start" flex={1}>
                                <Alert.Title>Email Not Verified</Alert.Title>
                                <Text fontSize="sm">Please verify your email to access all features.</Text>
                            </VStack>
                            <Button
                                backgroundColor={"#4DCBA4"}
                                size="sm"
                                loading={isSendingVerificationEmail}
                                loadingText="Sending..."
                                onClick={sendVerificationEmail}
                            >
                                Verify Email
                            </Button>
                        </Flex>
                    </Alert.Root>
                    )}
                </HStack>
            )}
            <EmailVerificationDialog isOpen={isEmailDialogOpen} onClose={() => setEmailDialogOpen(false)} toggleEmailVerified={toggleEmailVerified} />

            {/* Action Bar */}
            <ActionBarRoot open={isEditing}>
                <ActionBarContent>
                    <ActionBarSelectionTrigger>You Have Unsaved Changes!</ActionBarSelectionTrigger>
                    <ActionBarSeparator />
                    <Button variant="solid" bgColor={"red"} size="sm" onClick={handleCancel}>
                        <LuX /> Cancel
                    </Button>
                    <Button variant="solid" bg="#4DCBA4" size="sm" onClick={handleSave}>
                        <LuCheck /> Save Changes
                    </Button>
                </ActionBarContent>
            </ActionBarRoot>
        </Box>
    );
}

export default AccountDetails;