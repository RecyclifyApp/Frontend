/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import StudentCharts from '../../components/Students/StudentCharts';
import StudentProfileCard from '../../components/Students/StudentProfileCard';
import StudentTaskCard from '../../components/Students/StudentTaskCard';
import StreakCard from '../../components/Students/StreakCard';
import StreakRewardCard from '../../components/Students/StreakRewardCard';
import server from "../../../networking";
import ShowToast from '../../Extensions/ShowToast';
import { motion } from "framer-motion";

function StudentsHomepage() {
    const [studentTasks, setStudentTasks] = useState([]);
    const [studentProfile, setStudentProfile] = useState({});

    const { user, loaded, error } = useSelector((state) => state.auth);

    const updateStudentPoints = (newPoints) => {
        setStudentProfile((prevProfile) => ({
            ...prevProfile,
            currentPoints: prevProfile.currentPoints + newPoints,
        }));
    };

    const fetchStudentTasks = async (studentID) => {
        try {
            const response = await server.get(`/api/student/get-student-tasks?studentID=${studentID}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status == 200) {
                setStudentTasks(response.data.data);
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

    const fetchStudentProfile = async (studentID) => {
        try {
            const response = await server.get(`/api/student/get-student?studentID=${studentID}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status == 200) {
                setStudentProfile(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch student data:", error);
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

    useEffect(() => {
        if (!error && loaded && user && user.userRole == "student") {
            fetchStudentTasks(user.id);
            fetchStudentProfile(user.id);
        }
    }, [loaded]);

    if (!loaded) {
        return (
            <Box display="flex" flexDir={"column"} justifyContent="center" alignItems="center" width="100vw" height="80vh">
                <Spinner color="#3A9F83" animationDuration="0.5s" css={{ "--spinner-track-color": "colors.gray.200" }} />
            </Box>
        )
    }

    if (loaded && user && studentProfile !== null) return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Box display="flex" justifyContent={"space-between"} width="100%" height={"77vh"} mt={10} boxSizing={"border-box"}>
                    <Box display="flex" width="69%" height={"100%"} backgroundColor={"#E5ECFF"} borderRadius={20} boxSizing={"border-box"}>
                        <Box display={"flex"} flexDir={"column"} justifyContent={"space-between"} width="100%" boxSizing={"border-box"}>
                            <Heading fontSize="30px" mt={3}>Dashboard</Heading>

                            <Box display={"flex"} flexDir={"column"} justifyContent={"center"} mt={2} mb={2} width="100%" height="100%" boxSizing={"border-box"}>
                                <Box 
                                    display="flex"
                                    backgroundColor="white"
                                    borderRadius={20}
                                    width="95%"
                                    height="65%"
                                    marginTop={5}
                                    margin="auto"
                                    boxSizing="border-box"
                                >
                                    <Box width='100%' height='100%' padding={5} boxSizing={"border-box"}>
                                        <StudentCharts studentID={user.id} />
                                    </Box>
                                </Box>
                                <Box display="flex" justifyContent="space-between" margin="auto" width="95%" height="25%" boxSizing={"border-box"}>
                                    <Box width="49%" backgroundColor="white" borderRadius={20} display="flex" height="100%" mt="auto" mb="auto" boxSizing={"border-box"}>
                                        <StreakCard streak={studentProfile.streak} />
                                    </Box>

                                    <Box width="49%" backgroundColor="#4DCBA4" borderRadius={20} display="flex" height="100%" mt="auto" mb="auto" boxSizing={"border-box"}>
                                        <StreakRewardCard studentID={user.id} streak={studentProfile.streak} lastClaimedStreak={studentProfile.lastClaimedStreak} updateStudentPoints={updateStudentPoints} />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box display="flex" flexDir={"column"} justifyContent={"space-between"} width="29%" height={"100%"} borderRadius={20} boxSizing={"border-box"}>
                        <Box height="22%" border="3px solid" borderColor={studentProfile.league === "Gold" ? "gold" : studentProfile.league === "Silver" ? "silver" : studentProfile.league === "Bronze" ? "#F6B191" : "White"} borderRadius={20} display={"flex"} backgroundColor={"white"} boxSizing={"border-box"}>
                            <StudentProfileCard user={user} studentProfile={studentProfile} />
                        </Box>

                        <Box display="flex" flexDir="column" justifyContent="center" height="75%" backgroundColor={"#E5ECFF"} borderRadius={20} boxSizing={"border-box"}>
                            <Heading fontSize={24} fontWeight={"bold"} mt={3}>Daily tasks</Heading>

                            <Box display="flex" flexDir="column" justifyContent={"space-between"} mt={2} mb={2} borderRadius={20} margin="auto" height="85%" width="90%" boxSizing={"border-box"} paddingBottom={2}>
                                {studentTasks.length != 0 ? (
                                    studentTasks.map((task, index) => (
                                        <StudentTaskCard
                                            key={index}
                                            studentID={user.id}
                                            TaskID={task.taskID}
                                            TaskTitle={task.taskTitle}
                                            TaskDescription={task.taskDescription}
                                            TaskPoints={task.taskPoints}
                                            VerificationPending={task.verificationPending}
                                            TaskVerified={task.taskVerified}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "100%",
                                            height: "100%",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        <Box boxSizing={"border-box"}>
                                            <Spinner mb={3} color="#3A9F83" animationDuration="0.5s" css={{ "--spinner-track-color": "colors.gray.200" }} />
                                            <Text>Getting your tasks...</Text>
                                        </Box>
                                    </motion.div>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </motion.div>
        </>
    );
}

export default StudentsHomepage;