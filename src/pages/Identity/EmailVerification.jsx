/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, VStack, Heading, Text, Button } from '@chakra-ui/react'
import { StepsItem, StepsList, StepsRoot } from "@/components/ui/steps";
import { PinInput } from "@/components/ui/pin-input";
import { Controller, useForm } from "react-hook-form"
import server from "../../../networking";
import ShowToast from '../../Extensions/ShowToast';

function EmailVerification() {
    const navigate = useNavigate();
    const { user, authToken, error, loaded } = useSelector((state) => state.auth);
    const [isResending, setIsResending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            pin: Array(6).fill(''),
        },
    });

    useEffect(() => {
        if(authToken && !error && loaded && user) {
            if (user.emailVerified) {
                navigateBasedOnRole();
                ShowToast("success", "Email Verified", "Your email is already verified.")
            }
        }
    }, [user, loaded]);

    const navigateBasedOnRole = () => {
        if (user?.userRole === "student") {
            navigate("/student/home");
        } else if (user?.userRole === "teacher") {
            navigate("/teachers");
        } else if (user?.userRole === "admin") {
            navigate("/admin/dashboard");
        } else if (user?.userRole === "parent") {
            navigate("/parents");
        } else {
            navigate("/auth/login");
        }
    };

    const verifyEmail = async (data) => {
        const isComplete = data.pin.every(digit => digit.length === 1);
        if (!isComplete) {
            ShowToast("error", "Missing Digits", "Please enter all 6 digits of the verification code");
            return;
        }
        setIsLoading(true);
        try {
            const verificationCode = data.pin.join('');
            const response = await server.post('/api/identity/verifyEmail', { code: verificationCode }
            );

            if (response.data.message.startsWith("SUCCESS") && response.status === 200) {
                ShowToast("success", "Email Verified!", "Your email has been successfully verified.");
                navigateBasedOnRole();
            }
        } catch (error) {
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
        finally {
            setIsLoading(false);
        }
    };

    const sendVerificationEmail = async () => {
        setIsResending(true);
        try {
            await server.post('/api/identity/emailVerification');
            ShowToast("success", "Code Sent!", "A new verification code has been sent to your email.");
        } catch (error) {
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
            setIsResending(false);
        }
    };

    return (
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
                        Verify Your Email
                    </Heading>

                    {/* Progress bar */}
                    <StepsRoot 
                        defaultStep={2} 
                        count={3} 
                        linear="true" 
                        size="lg" 
                        width={1000}
                    >
                        <StepsList>
                            <StepsItem index={0} title="Step 1" description="Account Details" />
                            <StepsItem index={1} title="Step 2" description="Setup MFA" />
                            <StepsItem index={2} title="Step 3" description="Verify Email" />
                        </StepsList>
                    </StepsRoot>

                    <Heading mt={14}>
                        Check your inbox
                    </Heading>

                    <Text mt={2} mb={20}>
                        We've sent a verification code to your email inbox!
                    </Text>
                    
                    <Controller
                        control={control}
                        name="pin"
                        rules={{
                            validate: (value) => 
                                value.every(digit => digit.length === 1) || 
                                "Please enter all 6 digits"
                        }}
                        render={({ field }) => (
                            <Box>
                                <PinInput
                                    value={field.value}
                                    onValueChange={(values) => field.onChange(values.value)}
                                    otp
                                    size="md"
                                    gap={2}
                                />
                                {errors.pin && (
                                    <Text color="red.500" fontSize="sm" mt={2}>
                                        {errors.pin.message}
                                    </Text>
                                )}
                            </Box>
                        )}
                    />

                    <Button
                        display="flex"
                        justifyContent="center"
                        backgroundColor="#2D65FF"
                        mb={4}
                        colorScheme="white"
                        _hover={{ bg: "#1752FD" }}
                        borderRadius="30px"
                        alignItems="center"
                        mt={20}
                        w={150}
                        onClick={handleSubmit(
                            (data) => verifyEmail(data),
                            (errors) => {
                                ShowToast("error", "Invalid Verification Code", "Please enter a complete 6-digit code");
                                console.error(errors);
                            }
                        )}
                        loading={isLoading}
                        loadingText="Verifying..."
                    >
                        <Text>Verify Email</Text>
                    </Button>

                    <Text
                        mt={2}
                        fontSize={12}
                    >
                        Didn’t receive the email? 
                        <Button 
                            variant="link" 
                            colorScheme="blue" 
                            ml={2}
                            size={'sm'}
                            onClick={sendVerificationEmail}
                            loading={isResending}
                            loadingText="Sending..."
                        >
                            Resend Email
                        </Button>
                    </Text> 
                </VStack>
            </Box>
        </Box>
    );
}

export default EmailVerification;