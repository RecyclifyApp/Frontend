/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Box, Text } from "@chakra-ui/react";
import { PinInput } from "@/components/ui/pin-input";
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogRoot } from "@/components/ui/dialog";
import server from "../../../networking";
import ShowToast from "../../Extensions/ShowToast";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { fetchUser } from '../../slices/AuthState';
import { useNavigate } from "react-router-dom";

const MsAuthLoginDialog = ({ isOpen, onClose, userId }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
            const response = await server.post(`/api/Identity/loginVerifyMfa`, { UserId: userId, Code: verificationCode });

            if (response.data.token) {
                onClose();
                localStorage.setItem('jwt', response.data.token);
                await dispatch(fetchUser());
                ShowToast("success", "Welcome Back!", "Successfully logged in.");
                if (response.data.user.userRole) {
                    if (response.data.user.userRole === "student") {
                        navigate("/student/home");
                    } else if (response.data.user.userRole === "teacher") {
                        navigate("/teachers");
                    } else if (response.data.user.userRole === "admin") {
                        navigate("/admin/dashboard");
                    } else if (response.data.user.userRole === "parent") {
                        navigate("/parents");
                    } else {
                        navigate("/auth/login");
                    }
                }                
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
        <DialogRoot
            placement="center"
            motionPreset="slide-in-bottom"
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Multi-Factor Authentication</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Text mb={4}>Please enter your verification code from your authenticator app.</Text>
                    
                    <Controller
                        control={control}
                        name="pin"
                        rules={{
                            validate: (value) =>
                                value.every(digit => digit.length === 1) || "Please enter all 6 digits"
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
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                    </DialogActionTrigger>
                    <Button 
                        onClick={handleSubmit(
                            (data) => verifyMfa(data),
                            (errors) => {
                                ShowToast("error", "Invalid Verification Code", "Please enter a complete 6-digit code");
                                console.error(errors);
                            }
                        )}
                        loading={isLoading}
                        bg="#2D65FF"
                    >
                        Verify
                    </Button>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
};

export default MsAuthLoginDialog;
