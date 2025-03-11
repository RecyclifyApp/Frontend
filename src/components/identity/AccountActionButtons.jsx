/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box, Button, HStack, Input, VStack, Heading, Text } from "@chakra-ui/react";
import EditPasswordDialog from "./EditPasswordDialog";
import DeleteAccountDialog from "./DeleteAccountDialog";
import RedemptionHistoryDialog from "./RedemptionHistoryDialog";
import { useNavigate } from "react-router-dom";
import server from "../../../networking";
import ShowToast from "../../Extensions/ShowToast";

function AccountActionButtons({ userDetails }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditPasswordDialog, setShowEditPasswordDialog] = useState(false);
    const [showRedemptionDialog, setShowRedemptionDialog] = useState(false);
    const [childId, setChildId] = useState(null);
    const [parentId, setParentId] = useState(null);
    const navigate = useNavigate();
    const userRole = userDetails.userRole;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (userRole === "parent") {
                    const response = await server.get(`api/Identity/getChildsId?userId=${userDetails.id}`);
                    setChildId(response.data.studentId);
                } else if (userRole === "student") {
                    const response = await server.get(`api/Identity/getParentsId?userId=${userDetails.id}`);
                    setParentId(response.data.parentId);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
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

        fetchUserDetails();
    }, [userDetails.id, userRole]);

    const handleNavigateToParent = () => {
        if (!parentId) {
            ShowToast("error", "No parent account linked", "Please create a parent account and link it first.")
            return;
        }
        navigate(`/identity/publicProfile/${parentId}`);
    };

    return (
        <Box w="70%" mx="auto">
            {/* Security Section */}
            <VStack align="start" spacing={4} mb={6}>
                <Heading size="md">Security and Authentication</Heading>
                <HStack spacing="5%" w="100%" align="center">
                    <Box flex="0.8" w="80%">
                        <VStack align="start" w="100%">
                            <Text>Password</Text>
                            <Input type="password" value="************" disabled />
                        </VStack>
                    </Box>

                    <Box flex="0.25" w="25%" alignSelf={"flex-end"}>
                        <Button
                            w="60%"
                            borderRadius={30}
                            variant="solid"
                            background="#2D65FF"
                            color="white"
                            onClick={() => setShowEditPasswordDialog(true)}
                        >
                            Edit Password
                        </Button>
                    </Box>
                </HStack>
            </VStack>

            {/* More Actions */}
            {userRole !== "admin" && (
                <VStack align="start" spacing={4} mb={6}>
                    <Heading size="md" mb={2}>More Actions</Heading>
                    <HStack gap={8} w="100%">
                        {userRole === "parent" && (
                            <Button borderRadius={30} variant="solid" background="#2D65FF" color="white" onClick={() => navigate(`/identity/publicProfile/${childId}`)}>
                                Child's Account
                            </Button>
                        )}
                        {userRole === "student" && (
                            <>
                                <Button borderRadius={30} variant="solid" background="#2D65FF" color="white" onClick={handleNavigateToParent}> 
                                    Parent's Account
                                </Button>
                                <Button 
                                    borderRadius={30} variant="solid" background="#2D65FF" color="white"
                                    onClick={() => setShowRedemptionDialog(true)}
                                >
                                    Redemption History
                                </Button>
                            </>
                        )}
                        {["parent", "student", "teacher"].includes(userRole) && (
                            <Button borderRadius={30} variant="solid" background="#2D65FF" color="white" onClick={() => navigate(`/identity/publicProfile/${userDetails.id}`)}>
                                View Public Account
                            </Button>
                        )}
                        {["parent", "student"].includes(userRole) && (
                            <Button
                                borderRadius={30}
                                variant="solid"
                                background="red"
                                color="white"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                Delete Account
                            </Button>
                        )}
                    </HStack>
                </VStack>
            )}

            <DeleteAccountDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
            <EditPasswordDialog isOpen={showEditPasswordDialog} onClose={() => setShowEditPasswordDialog(false)} />
            <RedemptionHistoryDialog isOpen={showRedemptionDialog} onClose={() => setShowRedemptionDialog(false)} userId={userDetails.id}/>
        </Box>
    );
}

export default AccountActionButtons;