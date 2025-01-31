/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { PinInput } from "@/components/ui/pin-input"
import { StepsItem, StepsList, StepsRoot, } from "@/components/ui/steps"
import { Toaster } from '@/components/ui/toaster';
import ShowToast from '../../Extensions/ShowToast';
function ContactVerification() {
    const navigate = useNavigate();
    const { user, authToken, error, loaded } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && authToken) {     
            if (!error && loaded) {
                if (user.userRole === "student") {
                    navigate("/student/home");
                } else if (user.userRole === "teacher") {
                    navigate("/teachers");
                } else {
                    navigate("/admin/dashboard");
                }
            }
            ShowToast("success", "Success", "You are already logged in!");
        }
    }, [user, error, loaded, authToken]);

    return (
        <>
            <Box
                bgPosition="center"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Box
                    p={8}
                    borderRadius={15}
                >
                    <VStack 
                        spacing={4}
                    >
                        <Heading
                            fontSize='30px'
                            mb={10} 
                            textAlign="center"
                        >
                            Verify Your Contact
                        </Heading>

                        {/* Progress bar */}
                        <StepsRoot 
                            defaultStep={2} 
                            count={3} 
                            linear="true" 
                            size="lg" 
                            width={900}
                        >
                            <StepsList>
                                <StepsItem index={0} title="Step 1" description="Account Details" />
                                <StepsItem index={1} title="Step 2" description="Verify Email" />
                                <StepsItem index={2} title="Step 3" description="Verify Contact" />
                            </StepsList>
                        </StepsRoot>

                        <Heading mt={14}>
                            Check your SMS
                        </Heading>

                        <Text mt={2}>
                            We've sent a verification code to you via SMS!
                        </Text>
                        
                        <PinInput size="md" otp mt={10} p={10} />

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
                            w={150}
                        >
                            <Text>Verify Contact</Text>
                        </Button>
                    </VStack>
                </Box>
            </Box>

            <Toaster />
        </>
    );
}

export default ContactVerification