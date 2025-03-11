/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogRoot } from "@/components/ui/dialog";
import { Button, Text } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input"
import ShowToast from '../../Extensions/ShowToast';
import server from "../../../networking";
import { logout } from "../../slices/AuthState";
import { useDispatch } from 'react-redux';

function DeleteAccountDialog({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const handleDeleteAccount = async () => {
        if (!password) {
            ShowToast("error", "Please enter your password.", "Your password is required to delete your account.");
            return;
        }

        try {
            const response = await server.delete("/api/Identity/deleteAccount", {
                data: { password }
            });
            const rawResponseMessage = response.data.message;
            if (rawResponseMessage.startsWith("SUCCESS") && response.status === 200) {
                localStorage.removeItem('jwt');
                dispatch(logout())
                navigate("/auth/login");
                ShowToast("success", "Account Deleted", "It was fun while it lasted...");
            }
        } catch (err) {
            const rawErrorMessage = err.response.data.error;
            if (rawErrorMessage.startsWith("UERROR")) {
                const errorMessage = rawErrorMessage.substring("UERROR: ".length).trim();
                if (errorMessage === "Incorrect password.") {
                    ShowToast("error", "Incorrect Password", "Please try again.")
                }
            } else {
                if (err.response && err.response.data && err.response.data.error && typeof err.response.data.error === "string") {
                    if (err.response.data.error.startsWith("ERROR")) {
                        ShowToast("error", err.response.data.error.substring("ERROR:".length));
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
                    <DialogTitle>Delete Account</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Text mb={8}>Are you sure you want to delete this account? If you delete your account, you will not be able to recover it.</Text>
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                    </DialogActionTrigger>
                    <Button onClick={handleDeleteAccount} bg={"red"}>Delete Account</Button>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
}

export default DeleteAccountDialog;