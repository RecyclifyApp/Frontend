/* eslint-disable react/prop-types */
import { Box, Text, Button, Spinner } from '@chakra-ui/react';
import { BsGift } from 'react-icons/bs';
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";
import server from "../../../networking";

function StreakRewardCard({ studentID, streak, lastClaimedStreak, updateStudentPoints }) {
    const [giftClaimed, setGiftClaimed] = useState(false);

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' });

    let lastClaimedStreakDate = null;
    if (lastClaimedStreak) {
        lastClaimedStreakDate = new Date(lastClaimedStreak).toISOString().split('T')[0];
    }

    let remainingStreaks = (7 - (streak % 7)) % 7;
    if (streak === 0) {
        remainingStreaks = 7;
    }

    const isClaimable = remainingStreaks === 0 && lastClaimedStreakDate !== today && streak > 0;

    const handleAwardGift = () => {
        const promise = new Promise((resolve, reject) => {
            server.post("/api/student/award-gift", studentID, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(response => {
                if (response.status === 200) {
                    const pointsAwarded = response.data.data.pointsAwarded;
                    setGiftClaimed(true);
                    updateStudentPoints(pointsAwarded);
                    resolve(pointsAwarded);
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.error && typeof error.response.data.error === "string") {
                    if (error.response.data.error.startsWith("UERROR")) {
                        reject(error.response.data.error.substring("UERROR: ".length));
                    } else {
                        reject(error.response.data.error.substring("ERROR: ".length));
                    }
                } else {
                    reject("An unexpected error occurred");
                }
            });
        });
    
        toaster.promise(promise, {
            loading: { title: "Processing...", description: "Please wait" },
            success: (points) => ({
                title: "",
                description: `${points} leafs awarded successfully!`,
            }),
            error: (err) => ({
                title: "",
                description: `${err}`,
            }),
        });
    };
    
    if (!studentID || streak == null) {
        return (
            <Box display="flex" flexDir={"column"} justifyContent={"center"} alignItems="center" width="100%" height="100%">
                <Spinner mb={3} color="#3A9F83" animationDuration="0.5s" css={{ "--spinner-track-color": "colors.gray.200" }} />
            </Box>
        )
    }

    if ((remainingStreaks >= 0) && (isClaimable == true || isClaimable == false)) return (
        <>
            <Box 
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    padding: 6,
                    boxSizing: "border-box",
                    borderRadius: 20
                }}
            >
                <Box display="flex" justifyContent={"center"} flexDir={"column"} alignItems="center">
                    <Box display="flex" justifyContent={"center"} alignItems="center">
                        {(isClaimable && !giftClaimed) && remainingStreaks === 0 && (
                            <Box ml={2} mr={2}>
                                <Text
                                    as={BsGift}
                                    fontSize="48px"
                                    color="white"
                                />
                            </Box>
                        )}

                        <Box
                            color="white"
                            fontSize="lg"
                            fontWeight="semibold"
                        >
                            {(isClaimable && !giftClaimed) ? (
                                <Button
                                    color="#4DCBA4"
                                    border={"2px solid white"}
                                    backgroundColor={"white"}
                                    _hover={{ backgroundColor: "#4DCBA4", color: "white" }}
                                    px={8}
                                    py={4}
                                    borderRadius={24}
                                    fontWeight="bold"
                                    fontSize="md"
                                    transition={"ease-in-out 0.2s"}
                                    disabled={!isClaimable || giftClaimed}
                                    onClick={handleAwardGift}
                                >
                                    Claim my Daily Streak Gift
                                </Button>
                            ) : (
                                remainingStreaks === 0 ? (
                                    <Text>Successfully claimed Gift!</Text>
                                ) : (
                                    <Text>You are {remainingStreaks} streaks away from unlocking your mystery gift!</Text>
                                )
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default StreakRewardCard;