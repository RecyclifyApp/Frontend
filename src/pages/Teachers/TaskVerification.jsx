/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Flex, Heading, Tabs, Badge, Text, VStack } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import server from "../../../networking";
import ShowToast from "../../Extensions/ShowToast";
import TaskRow from "../../components/teachers/TaskRow";
import { LuBox } from "react-icons/lu";

function TaskVerification() {
    const navigate = useNavigate();
    const { user, loaded, error } = useSelector((state) => state.auth);
    const [tasks, setTasks] = useState({
        all: [],
        unverified: [],
        verified: [],
        rejected: [],
    });

    // Fetch all task data that is assigned to the teacher
    const fetchTasks = async () => {
        try {
            const response = await server.get(`/api/Teacher/get-all-tasks/?teacherID=${user.id}`);
            if (response.status === 200) {
                const data = response.data.data;
                const tasksWaitingVerification = data.tasksWaitingVerification || [];
                const tasksVerified = data.tasksVerified || [];
                const tasksRejected = data.tasksRejected || [];

                setTasks({
                    all: [...tasksWaitingVerification, ...tasksVerified, ...tasksRejected],
                    unverified: tasksWaitingVerification.filter((task) => task.verificationPending),
                    verified: tasksVerified.filter((task) => task.taskVerified),
                    rejected: tasksRejected.filter((task) => task.taskRejected),
                });
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setTasks([]);
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

    useEffect(() => {
        if (!error && loaded && user && user.userRole == "teacher") {
            fetchTasks(user.id);
        }
    }, [loaded]);

    if (!error && loaded && user) {
        return (
            <Box>
                <Flex direction="row" align="center" justify="space-betweem" h="12vh">
                    <Box bg="#96E2D6" borderRadius="full" p={2}>
                        <IoArrowBack size={50} color="black" cursor="pointer" onClick={() => navigate(`/teachers`)} />
                    </Box>
                    <Box mt={4} fontSize="2xl" textAlign="center" flex={1} mr={20}>
                        <Heading fontSize={40} fontWeight="bold" mb={4} >
                            Task Verification
                        </Heading>
                    </Box>
                </Flex>
                {tasks.unverified.length === 0 && tasks.verified.length === 0 && tasks.rejected.length === 0 ? (
                    <Box textAlign="center" mt={20}>
                        <VStack textAlign="center" fontWeight="medium" mt={4} mr={6} >
                            <LuBox />
                            <Text>No task is waiting for verification.</Text>
                        </VStack>
                    </Box>
                ) : (
                    <Tabs.Root defaultValue="All" colorPalette={"blue"}>
                        <Tabs.List>
                            <Tabs.Trigger value="All" bg="none">
                                All {tasks.unverified.length > 0 && <Badge ml={2}>{tasks.unverified.length}</Badge>}
                            </Tabs.Trigger>
                            <Tabs.Trigger value="Unverified" bg="none">
                                Unverified {tasks.unverified.length > 0 && <Badge ml={2}>{tasks.unverified.length}</Badge>}
                            </Tabs.Trigger>
                            <Tabs.Trigger value="Rejected" bg="none">Rejected</Tabs.Trigger>
                            <Tabs.Trigger value="Verified" bg="none">Verified</Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="All">
                            {tasks.all.map((task) => <TaskRow key={task.taskID} task={task} fetchTasks={fetchTasks} />)}
                        </Tabs.Content>
                        <Tabs.Content value="Unverified">
                            {tasks.unverified.map((task) => <TaskRow key={task.taskID} task={task} fetchTasks={fetchTasks} />)}
                        </Tabs.Content>
                        <Tabs.Content value="Rejected">
                            {tasks.rejected.map((task) => <TaskRow key={task.taskID} task={task} fetchTasks={fetchTasks} />)}
                        </Tabs.Content>
                        <Tabs.Content value="Verified">
                            {tasks.verified.map((task) => <TaskRow key={task.taskID} task={task} fetchTasks={fetchTasks} />)}
                        </Tabs.Content>
                    </Tabs.Root>
                )}
            </Box>
        );
    }
}

export default TaskVerification