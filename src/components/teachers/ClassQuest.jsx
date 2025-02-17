/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Flex, Tabs, Text, Stack, Badge, Button, Progress } from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';
import { PiCloverFill } from "react-icons/pi";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toaster } from "@/components/ui/toaster";
import ShowToast from '../../Extensions/ShowToast';
import server from "../../../networking";

function ClassQuest({ classData }) {
    const [classQuests, setClassQuests] = useState(null);
    const { user, loaded, error } = useSelector((state) => state.auth);

    const fetchClassQuests = async (classID) => {
        try {
            const response = await server.get(`/api/student/get-class-quests?classID=${classID}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status == 200) {
                setClassQuests(response.data.data);
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
    }

    const handleRefreshQuests = async (classID, teacherID) => {
        const formData = new FormData();
        formData.append("classID", classID);
        formData.append("teacherID", teacherID);

        const promise = new Promise((resolve, reject) => {
            server.post(`/api/Teacher/regenerate-class-quests`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                transformRequest: (formData) => formData,
            })
                .then((response) => {
                    if (response.status === 200) {
                        setClassQuests(response.data.data);
                        resolve();
                    } else {
                        reject(error.response.data.error.substring("ERROR: ".length));
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
            loading: { title: "Our AI Model is generating...", description: "Please wait" },
            success: {
                title: "",
                description: "Quests re-generated successfully!",
            },
            error: (err) => ({
                title: "",
                description: `${err}`,
            }),
        });
    };

    useEffect(() => {
        if (!error && loaded && user && user.userRole == "teacher") {
            if (classData !== null && classData !== undefined) {
                if (classData.classID) {
                    fetchClassQuests(classData.classID);
                }
            }
        }
    }, [loaded, classData]);

    if (classQuests != null && classQuests != undefined && classData != null && classData != undefined) return (
        <Tabs.Content value='Class Quests'>
            <Box w="100%" h="65dvh" p={4} bg="#9F9FF8" borderRadius="xl" boxShadow="lg">
                <Box w="100%" maxW="600px" h="100%" p={6} bg="white" borderRadius="xl" boxShadow="2xl" mx="auto">
                    {/* Header with Refresh Button */}
                    <Text fontSize="2xl" fontWeight="extrabold" color="black" flex={1} mb={6}>
                        Class Quests
                    </Text>

                    {/* Quest Cards */}
                    <Stack gap={4} overflowY="auto" h="calc(100% - 60px)" pt={1}>
                        {classQuests.map((quest, index) => (
                            <Box
                                key={index}
                                w="100%"
                                p={4}
                                bg={quest.completed === quest.totalAmountToComplete ? "#C6F6D5" : "#EDEEFC"}
                                borderRadius="xl"
                                transition="all 0.3s ease"
                                opacity={quest.completed === quest.totalAmountToComplete ? 0.7 : 1}
                                _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                            >
                                <Stack align="start" gap={2}>
                                    {/* Quest Title and Points */}
                                    <Flex w="100%" justify="space-between">
                                        <Flex direction="row" align="center" gap={2}>
                                            <Text fontSize="lg" fontWeight="bold" color="black">
                                                {quest.questTitle}
                                            </Text>
                                            <Badge variant="solid" bg="#AEC7ED" color="black" borderRadius="full" px={2} py={1}>
                                                {quest.questType}
                                            </Badge>
                                        </Flex>
                                        <Badge variant="solid" bg="white" color="black" borderRadius="full" px={2} py={1}>
                                            {quest.questPoints}

                                            <Text as={PiCloverFill} boxSize={5} color="#2CD776" />
                                        </Badge>
                                    </Flex>

                                    {/* Quest Description */}
                                    <Text fontSize="sm" color="gray.600">
                                        {quest.questDescription}
                                    </Text>
                                </Stack>

                                {/* Progress Bar */}
                                <Box w="100%" mt={2} textAlign="left">
                                    {quest.amountCompleted === quest.totalAmountToComplete ? (
                                        <Text fontSize="sm" color="black" fontWeight="bold">
                                            ✅ Quest Completed!
                                        </Text>
                                    ) : (
                                        <Text fontSize="sm" color="black" fontWeight="bold">
                                            {quest.amountCompleted} / {quest.totalAmountToComplete} Completed
                                        </Text>
                                    )}
                                    <Progress.Root w="100%" value={quest.amountCompleted} max={quest.totalAmountToComplete} mt={2}>
                                        <Stack direction="row" justify="space-between" align="center">
                                            <Progress.Track flex="1">
                                                {quest.amountCompleted === quest.totalAmountToComplete ? (
                                                    <Progress.Range bg="#2CD776" />
                                                ) : (
                                                    <Progress.Range bg="#6A6AFF" />
                                                )}
                                            </Progress.Track>
                                            <Progress.ValueText>{((quest.amountCompleted / quest.totalAmountToComplete) * 100).toFixed(1)}%</Progress.ValueText>
                                        </Stack>
                                    </Progress.Root>
                                </Box>
                            </Box>
                        ))}

                        {/* Refresh Button */}
                        <Button color="black" bg="#9F9FF8" borderRadius="xl" boxShadow="md" _hover={{ bg: '#6A6AFF' }} onClick={() => handleRefreshQuests(classData.classID, user.id)}>
                            <Stack direction="row" align="center" justify="center">
                                <FiRefreshCw />
                                <Text>Re-generate Quests</Text>
                            </Stack>
                        </Button>
                    </Stack>

                </Box>
            </Box>
        </Tabs.Content>
    );
}

export default ClassQuest;