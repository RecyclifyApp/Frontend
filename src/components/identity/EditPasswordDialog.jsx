/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogRoot } from "@/components/ui/dialog";
import { Button, Text, VStack } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input"
import ShowToast from '../../Extensions/ShowToast';
import server from "../../../networking";
import { logout } from "../../slices/AuthState";
import { useDispatch } from 'react-redux';

function EditPasswordDialog({ isOpen, onClose }) {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");

    const handleChangePassword = async () => {
        setError("");
        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match.");
            ShowToast("error", "Passwords do not match", "Please try again.");
            return;
        }

        try {
            const response = await server.post("/api/Identity/changePassword", { oldPassword, newPassword });
            const rawResponseMessage = response.data.message;
            if (rawResponseMessage.startsWith("SUCCESS") && response.status === 200) {
                ShowToast("success", "Password changed successfully!", "Please login again.");
                onClose();
                localStorage.removeItem('jwt');
                dispatch(logout())
                navigate("/auth/login")
            }
        } catch (err) {
            const rawErrorMessage = err.response.data.error;
            if (rawErrorMessage.startsWith("UERROR")) {
                const errorMessage = rawErrorMessage.substring("UERROR: ".length).trim();
                if (errorMessage === "Incorrect password.") {
                    setError("Incorrect password.");
                    ShowToast("error", "Incorrect Password", "Please try again.")
                }
            } else {
                console.error(err);
                if (error.response && error.response.data && error.response.data.error && typeof error.response.data.error === "string") {
                    if (error.response.data.error.startsWith("ERROR")) {
                        ShowToast("error", error.response.data.error.substring("ERROR:".length));
                        return;
                    }
                }
            }
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
                    <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Text mb={4}>Enter your old password and set a new password.</Text>
                    <VStack gap={4}>
                        <PasswordInput
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter old password"
                        />
                        <PasswordInput
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                        <PasswordInput
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Confirm new password"
                        />
                    </VStack>
                    {error && <Text color="red" mt={2}>{error}</Text>}
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                    </DialogActionTrigger>
                    <Button onClick={handleChangePassword} bg="#2D65FF">Save</Button>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
}

export default EditPasswordDialog;
