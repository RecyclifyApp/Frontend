import { useState } from 'react';
import { Box, Button, Input, VStack, Heading, } from '@chakra-ui/react';
import { PasswordInput } from "@/components/ui/password-input"
import { InputGroup } from "@/components/ui/input-group";
import { Field } from "@/components/ui/field";
import { useNavigate } from 'react-router-dom';
import server from "../../../networking";
import { LuUser, LuLock } from "react-icons/lu";
import ShowToast from '../../Extensions/ShowToast';
import { IoArrowBack } from 'react-icons/io5';

function AccountRecovery() {
	const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [resetKey, setResetKey] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sendingReset, setSendingReset] = useState(false);
    const [resettingPassword, setResettingPassword] = useState(false);

    const handleSendResetKey = async () => {
        if (!identifier.trim()) {
			ShowToast("error", "Please enter a username or email")
            return;
        }

        setSendingReset(true);
        try {
            const response = await server.post('/api/Identity/sendResetKey', { Identifier: identifier });
			if (response.status === 200) {
				ShowToast("success", "Reset key sent successfully.");
				setResetSent(true);
			}
        } catch (error) {
			if (error.response.data.error.substring("UERROR: ".length).trim() === "User not found.") {
				ShowToast("error", "User not found. Please check your username or email.");
			} else {
				ShowToast("error", "Failed to send reset key. Please try again later.");
			}
        }
        setSendingReset(false);
    };

    const handleResetPassword = async () => {
        if (!resetKey.trim() || !newPassword || !confirmPassword) {
			ShowToast("error", "Please fill in all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
			ShowToast("error", "Passwords do not match.");
            return;
        }

        setResettingPassword(true);
        try {
            const response = await server.post('/api/identity/resetPassword', {
				Identifier: identifier,
				ResetKey: resetKey,
				NewPassword: newPassword,
			});
			if (response.status === 200) {
				ShowToast("success", "Password reset successfully.");
				navigate('/auth/login');
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
        setResettingPassword(false);
    };

	const handleSubmit = (e) => {
		e.preventDefault();
	};

    return (
		<>
			{/* Back arrow positioned at the top left corner */}
			<Box position="fixed" mt={4}>
				<Box bg="#96E2D6" borderRadius="full" p={2} w={65}>
					<IoArrowBack
						size={50}
						color="black"
						cursor="pointer"
						onClick={() => navigate('/auth/login')}
					/>
				</Box>
			</Box>
			<Box
				bgPosition="center"
				display="flex"
				justifyContent="center"
				alignItems="center"
			>
				<Box p={8} as="form" onSubmit={handleSubmit}>
					<VStack spacing={4} w="full">
						<Heading fontSize="30px" mb={10} textAlign="center">
							Account Recovery
						</Heading>

						{/* Username or Email Field */}
						<Field
							label="Username or Email"
							invalid={false}
							errorText="This field is required"
							width="400px"
							mb={2}
						>
							<InputGroup flex="1" startElement={<LuUser />} width="400px">
								<Input
									value={identifier}
									onChange={(e) => setIdentifier(e.target.value)}
									placeholder="Enter username or email"
									disabled={resetSent}
								/>
							</InputGroup>
						</Field>

						{/* Send Reset Key Button */}
						{!resetSent && (
							<Button
								variant="solid"
								background="#2D65FF"
								color="white"
								width="50%"
								mb={5}
								borderRadius={30}
								onClick={handleSendResetKey}
								loading={sendingReset}
								loadingText="Sending..."
							>
								Send Reset Key
							</Button>
						)}

						{resetSent && (
							<>
								{/* Reset Key Field */}
								<Field
									label="Reset Key"
									invalid={false}
									errorText="This field is required"
									width="400px"
									mb={2}
								>
									<InputGroup flex="1" startElement={<LuLock />} width="400px">
										<Input
											value={resetKey}
											onChange={(e) => setResetKey(e.target.value)}
											placeholder="Enter reset key"
										/>
									</InputGroup>
								</Field>

								{/* New Password Field */}
								<Field
									label="New Password"
									invalid={false}
									errorText="This field is required"
									width="400px"
									mb={2}
								>
									<InputGroup flex="1" startElement={<LuLock />} width="400px">
										<PasswordInput
											type="password"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											placeholder="Enter new password"
										/>
									</InputGroup>
								</Field>

								{/* Confirm Password Field */}
								<Field
									label="Confirm Password"
									invalid={false}
									errorText="This field is required"
									width="400px"
									mb={2}
								>
									<InputGroup flex="1" startElement={<LuLock />} width="400px">
										<PasswordInput
											type="password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											placeholder="Confirm new password"
										/>
									</InputGroup>
								</Field>

								<Button
									variant="solid"
									background="#2D65FF"
									color="white"
									width="50%"
									mb={5}
									borderRadius={30}
									onClick={handleResetPassword}
									loading={resettingPassword}
									loadingText="Resetting..."
								>
									Reset Password
								</Button>
							</>
						)}
					</VStack>
				</Box>
			</Box>
		</>
    );
}


export default AccountRecovery;
