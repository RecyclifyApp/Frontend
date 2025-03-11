import { Box, Heading, Text, Button, VStack, Image } from '@chakra-ui/react';
import { PinInput } from "@/components/ui/pin-input";
import { StepsItem, StepsList, StepsRoot } from "@/components/ui/steps";
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import server from "../../../networking";
import ShowToast from '../../Extensions/ShowToast';
import { Controller, useForm } from "react-hook-form"

function MsAuth() {
    const navigate = useNavigate();
    const location = useLocation();
    const { qrCodeUrl } = location.state || {};
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            pin: Array(6).fill(''),
        },
    });

    const verifyMfa = async (data) => {
        const isComplete = data.pin.every(digit => digit.length === 1);
        if (!isComplete) {
            ShowToast("error", "Missing Digits", "Please enter all 6 digits of the verification code");
            return;
        }
        
        setIsLoading(true);
        try {
            const verificationCode = data.pin.join('');
            const response = await server.post('/api/Identity/verifyMfa', { code: verificationCode });

            if (response.data.token) {
                ShowToast("success", "MFA Verified", "Please verify your email.");
                navigate("/auth/emailVerification")
            }
        } catch (error) {
            console.error(error)
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
            setIsLoading(false);
        }
    };

    return (
        <Box
            bgPosition="center"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Box p={8} borderRadius={15}>
                <VStack spacing={4}>
                    <Heading fontSize="30px" mb={10} textAlign="center">
                        Secure Your Account
                    </Heading>

                    <StepsRoot defaultStep={1} count={4} linear="true" size="lg" width={1000}>
                        <StepsList>
                            <StepsItem index={0} title="Step 1" description="Account Details" />
                            <StepsItem index={1} title="Step 2" description="Setup MFA" />
                            <StepsItem index={2} title="Step 3" description="Verify Email" />
                        </StepsList>
                    </StepsRoot>

                    <Heading mt={14}>Check your Authenticator App</Heading>

                    <Text mt={2} mb={6}>
                        Scan the QR code with your authenticator app and enter the code below to verify your account.
                    </Text>

                    <Image src={qrCodeUrl} alt="QR Code for MFA" mb={10} />

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
                        backgroundColor="#2D65FF"
                        colorScheme="white"
                        _hover={{ bg: "#1752FD" }}
                        borderRadius="30px"
                        mt={10}
                        w={150}
                        onClick={handleSubmit(
                            (data) => verifyMfa(data),
                            () => {
                                ShowToast("error", "Invalid Code", "Please enter a complete 6-digit code");
                            }
                        )}
                        loading={isLoading}
                        loadingText="Verifying..."
                    >
                        Verify Code
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
}

export default MsAuth;