/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogRoot } from "@/components/ui/dialog";
import { Button, Spinner, VStack, Text, Image } from "@chakra-ui/react";
import ShowToast from "../../Extensions/ShowToast";
import server from "../../../networking"

function RedemptionHistoryDialog({ isOpen, onClose, userId }) {
    const [activeRewards, setActiveRewards] = useState(null);
    const [claimedRewards, setClaimedRewards] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && userId) {
            fetchStudentRewards(userId);
        }
    }, [isOpen, userId]);

    const fetchStudentRewards = async (userId) => {
        setLoading(true);
        try {
            const response = await server.get(`/api/student/get-student-rewards?studentID=${userId}`, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                const allRewards = response.data.data;
                const receivedActiveRewards = allRewards.filter(reward => reward.redemptionStatus === "Pending");
                const receivedClaimedRewards = allRewards.filter(reward => reward.redemptionStatus === "Claimed");

                setActiveRewards(receivedActiveRewards);
                setClaimedRewards(receivedClaimedRewards);
            }
        } catch (error) {
            if (error.response?.data?.error) {
                const errorMsg = error.response.data.error.startsWith("UERROR") ? error.response.data.error.substring("UERROR:".length) : error.response.data.error.substring("ERROR:".length);
                setError(errorMsg);
                if (error.response && error.response.data && error.response.data.error && typeof error.response.data.error === "string") {
                    if (error.response.data.error.startsWith("UERROR")) {
                        ShowToast("error", error.response.data.error.substring("UERROR:".length));
                        return;
                    } else {
                        ShowToast("error", error.response.data.error.substring("ERROR:".length));
                        return;
                    }
                }
            } else {
                setError("An error occurred while fetching rewards.");
            }
        }
        setLoading(false);
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
                    <DialogTitle>Redemption History</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    {loading ? (
                        <Spinner />
                    ) : error ? (
                        <Text color="red.500">{error}</Text>
                    ) : activeRewards.length === 0 && claimedRewards.length === 0 ? (
                        <Text>No rewards redeemed yet.</Text>
                    ) : (
                        <>
                            {activeRewards.length > 0 && (
                                <>
                                    <Text fontWeight="bold">Pending Rewards</Text>
                                    <VStack align="start" spacing={3}>
                                        {activeRewards.map((reward) => (
                                            <RewardCard key={reward.RewardID} reward={reward} />
                                        ))}
                                    </VStack>
                                    {/* <Divider my={4} /> */}
                                </>
                            )}
                            {claimedRewards.length > 0 && (
                                <>
                                    <Text fontWeight="bold">Claimed Rewards</Text>
                                    <VStack align="start" spacing={3}>
                                        {claimedRewards.map((reward) => (
                                            <RewardCard key={reward.RewardID} reward={reward} />
                                        ))}
                                    </VStack>
                                </>
                            )}
                        </>
                    )}
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </DialogActionTrigger>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
}

const RewardCard = ({ reward }) => (
    <VStack align="start" borderWidth="1px" borderRadius="lg" p={4} width="100%">
        <Image src={reward.imageUrl} alt={reward.rewardTitle} boxSize="80px" objectFit="cover" />
        <Text fontWeight="bold">{reward.rewardTitle}</Text>
        <Text>{reward.rewardDescription}</Text>
        <Text color="gray.500">Required Points: {reward.requiredPoints}</Text>
        <Text fontSize="sm" color="gray.400">
            Claimed On: {new Date(reward.claimedOn).toLocaleDateString()}
        </Text>
        <Text fontSize="sm" color={reward.redemptionStatus === "Pending" ? "orange.500" : "green.500"}>
            Status: {reward.redemptionStatus}
        </Text>
    </VStack>
);

export default RedemptionHistoryDialog;