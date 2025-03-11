/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Flex, Image, Tabs, Text } from '@chakra-ui/react';
import { FaLeaf } from "react-icons/fa";
import ClassPieChart from './ClassPieChart';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import server from "../../../networking";
import { PiCloverFill } from "react-icons/pi";
import { LuBox } from 'react-icons/lu';
import ClassLineChart from './ClassLineGraph';
import ShowToast from '../../Extensions/ShowToast';
import { useNavigate } from 'react-router-dom';
import StudentAvatar from '@/components/teachers/StudentAvatar';

function ClassDashboard({ classData, students }) {
    const navigate = useNavigate();
    const studentsList = students || [];
    const [schoolClassesData, setSchoolClassesData] = useState([]);
    const [classPoints, setClassPoints] = useState([]);
    const [lastWeekPoints, setLastWeekPoints] = useState(0);

    // Filter out students with totalPoints > 0 first, then sort and get top 3
    const top3Students = studentsList
        .filter(student => student.totalPoints > 0)
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 3);

    // Sort the students by TotalPoints in accending order and get the least contributed top 3
    var lowest3Students = studentsList.sort((a, b) => a.totalPoints - b.totalPoints).slice(0, 3);

    // Check for any conflics students between top3Students and lowest3Students
    const conflictStudents = lowest3Students.filter(student => top3Students.includes(student));

    // If there's any conflict, filter them out from the lowest3Students\
    if (conflictStudents.length > 0) {
        const updatedLowest3Students = lowest3Students.filter(student => !top3Students.includes(student));
        lowest3Students = updatedLowest3Students;
    }

    const { user, loaded, error } = useSelector((state) => state.auth);

    const fetchSchoolClasses = async () => {
        try {
            const response = await server.get(`/api/Teacher/get-overall-classes-data/`);
            if (response.status === 200) {
                setSchoolClassesData(Array.isArray(response.data.data) ? sortSchoolClassesData(response.data.data) : []);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            setSchoolClassesData([]);
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

    const fetchClassPoints = async () => {
        try {
            const response = await server.get(`/api/Teacher/get-class-points/?classId=${classData.classID}`);
            if (response.status === 200) {
                const pointsData = response.data.data;
                setClassPoints(pointsData);

                // Calculate the total points for the last week before setting the state
                const lastWeekTotal = pointsData.reduce((acc, curr) => acc + curr.points, 0);
                setLastWeekPoints(lastWeekTotal);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            setClassPoints([]);
            setLastWeekPoints(0);
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

    // Fetch school classes data on component mount
    useEffect(() => {
        if (!error && loaded && user && user.userRole == "teacher") {
            if (classData !== null && classData !== undefined) {
                if (classData.classID) {
                    fetchSchoolClasses();
                    fetchClassPoints();
                }
            }
        }
    }, [loaded, classData && students]);

    //Function to sort school classes data in descending order
    function sortSchoolClassesData(schoolClassesData) {
        if (!Array.isArray(schoolClassesData) || schoolClassesData.length === 0) {
            return [];
        }

        return [...schoolClassesData].sort((a, b) => b.classPoints - a.classPoints);
    }

    // Function to get the ranking of a class based on classPoints
    function getClassRanking(schoolClassesData, targetClassID) {
        if (!Array.isArray(schoolClassesData) || schoolClassesData.length === 0) {
            return "No class data available.";
        }

        // Sort classes by classPoints in descending order
        const sortedClasses = [...schoolClassesData].sort((a, b) => b.classPoints - a.classPoints);

        // Find the index of the target class
        const targetIndex = sortedClasses.findIndex((classData) => classData.classID === targetClassID);

        // If the class ID is not found, return a message
        if (targetIndex === -1) {
            return "Class not found.";
        }
        return targetIndex + 1;
    }

    // Get the class ranking
    const classRanking = getClassRanking(schoolClassesData, classData.classID);

    if (classData != null && classData != undefined && students != null && students != null) {
        return (
            <Tabs.Content value='Class' >
                <Box w="100%" h="65dvh" p={4} bg="#9F9FF8" borderRadius="xl" boxShadow="md">
                    <Flex gap={4} w="100%" h="100%" align="center">
                        <Flex w="80%" h="100%" direction="column" gap={4}>
                            <Flex gap={4} w="100%" h="50%">
                                {/* Student Contribution */}
                                <Box w="70%" h="100%" bg="white" borderRadius="xl" boxShadow="md" color="black" textAlign="center" display="flex" alignItems="center" justifyContent="center"
                                    _hover={{ transform: "scale(1.01)", boxShadow: "xl", transition: "all 0.3s ease" }}>
                                    <Flex direction="column" textAlign="left" w="90%" h="90%">
                                        <Box w="100%" h="10%" fontWeight="bold" fontSize="sm" mt={2}>Class Clover Points (Past 7 Days)</Box>
                                        <Box w="100%" h="90%">
                                            <ClassLineChart classPoints={classPoints} />
                                        </Box>
                                    </Flex>
                                </Box>
                                {/* Class Top Contributors */}
                                <Box w="30%" h="100%" bg="white" borderRadius="xl" boxShadow="md" color="black" textAlign="center" display="flex" alignItems="center" justifyContent="center"
                                    _hover={{ transform: "scale(1.01)", boxShadow: "xl", transition: "all 0.3s ease" }}>
                                    <Flex direction="column" textAlign="left" gap={2} w="90%" h="90%" p={2}>
                                        <Box w="100%" h="20%" fontWeight="bold" fontSize="sm">
                                            Class Top 3 Contributors
                                        </Box>

                                        {/* Top 3 Students Contributor based on their totalPoints */}
                                        <Flex direction="column" w="100%" h="80%" gap={4}>
                                            {top3Students.length > 0 ? (
                                                top3Students.map((student, index) => (
                                                    <Flex key={index} direction="row" w="100%" h="30%" gap={1} alignItems="flex-start" justifyContent="flex-start">
                                                        {/* Rank Icon or Badge */}
                                                        <Box w="10%" h="100%" display="flex" justifyContent="center" alignItems="center">
                                                            <Image
                                                                src={index === 0 ? "/gold-medal.png" : index === 1 ? "/silver-medal.png" : "/bronze-medal.png"}
                                                                alt={`Rank ${index + 1}`}
                                                                w="100%"
                                                                h="auto"
                                                            />
                                                        </Box>
                                                        {/* Student Avatar */}
                                                        <Box w="20%" h="100%" display="flex" justifyContent="center" alignItems="center">
                                                            <StudentAvatar student={student} />
                                                        </Box>
                                                        {/* Student's Info */}
                                                        <Box w="70%" h="100%" display="flex" justifyContent="space-between" alignItems="center">
                                                            <Box w="60%" fontSize="sm" fontWeight="bold" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                {student.user.fName} {student.user.lName}
                                                            </Box>
                                                            <Box w="30%" fontSize="2xl" fontWeight="bold" display="flex" justifyContent="flex-end">
                                                                {student.totalPoints}
                                                            </Box>
                                                            <Box w="10%" h="100%" size={30} color="#2CD776" display="flex" justifyContent="center" alignItems="center" ml={1}>
                                                                <FaLeaf />
                                                            </Box>
                                                        </Box>
                                                    </Flex>
                                                ))
                                            ) : (
                                                <Box textAlign="center" w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
                                                    <Text fontSize="lg" fontWeight="bold" color="gray.500" fontFamily="Sora, sans-serif" mb={8}>
                                                        There are no contributions yet...
                                                    </Text>
                                                </Box>
                                            )}
                                        </Flex>
                                    </Flex>
                                </Box>

                            </Flex>
                            <Flex gap={4} w="100%" h="50%">
                                <Flex gap={4} w="70%" h="100%" direction="row">
                                    {/* Month Contribution */}
                                    <Box w="70%" h="100%" bg="white" borderRadius="xl" boxShadow="md" color="black" textAlign="center" display="flex" alignItems="center" justifyContent="center"
                                        _hover={{ transform: "scale(1.01)", boxShadow: "xl", transition: "all 0.3s ease" }}>
                                        <Flex direction="column" textAlign="left" w="90%" h="90%" gap={4} p={2}>
                                            <Box w="100%" h="20%" fontWeight="bold" fontSize="sm">Class Contribution</Box>
                                            <Box w="100%" h="80%" p={2}>
                                                <ClassPieChart students={studentsList} />
                                            </Box>
                                        </Flex>
                                    </Box>
                                    <Flex w="30%" h="100%" gap={4} direction="column" >
                                        {/* Total Class Clovers */}
                                        <Box w="100%" h="50%" bg="white" borderRadius="xl" boxShadow="md" color="black" textAlign="center" display="flex" alignItems="center" justifyContent="center"
                                            _hover={{ transform: "scale(1.01)", boxShadow: "xl", transition: "all 0.3s ease" }}>
                                            <Flex direction="column" textAlign="left" gap={2} w="90%" h="90%" p={2} >
                                                <Box w="100%" h="20%" fontWeight="bold" fontSize="sm" mt={2}>Total Class Clovers</Box>
                                                <Flex direction="row" w="100%" h="70%" alignItems="center" justifyContent="left" gap={2}>
                                                    <Box h="100%" fontSize="3xl" fontWeight="bold" display="flex" justifyContent="left" alignItems="center">
                                                        {classData.classPoints}
                                                    </Box>
                                                    <Text as={PiCloverFill} boxSize={25} color="#2CD776" mt={1}></Text>
                                                </Flex>
                                            </Flex>
                                        </Box >
                                        {/* Weekly Class Clovers */}
                                        <Box w="100%" h="50%" bg="white" borderRadius="xl" boxShadow="md" color="black" textAlign="center" display="flex" alignItems="center" justifyContent="center"
                                            _hover={{ transform: "scale(1.01)", boxShadow: "xl", transition: "all 0.3s ease" }}>
                                            <Flex direction="column" textAlign="left" gap={2} w="90%" h="90%" p={2} >
                                                <Box w="100%" h="20%" fontWeight="bold" fontSize="sm" mt={2}>Weekly Class Clovers</Box>
                                                <Flex direction="row" w="100%" h="70%" alignItems="center" justifyContent="left" gap={2}>
                                                    <Box h="100%" fontSize="3xl" fontWeight="bold" display="flex" justifyContent="left" alignItems="center">
                                                        {lastWeekPoints}
                                                    </Box>
                                                    <Text as={PiCloverFill} boxSize={25} color="#2CD776" mt={1}></Text>
                                                </Flex>
                                            </Flex>
                                        </Box>
                                    </Flex>
                                </Flex>
                                {/* Flagged Student */}
                                <Box w="30%" h="100%" bg="white" borderRadius="xl" boxShadow="md" color="black" textAlign="center" display="flex" alignItems="center" justifyContent="center"
                                    _hover={{ transform: "scale(1.01)", boxShadow: "xl", transition: "all 0.3s ease" }}>
                                    <Flex direction="column" textAlign="left" gap={2} w="90%" h="90%" p={2}>
                                        <Box w="100%" h="20%" fontWeight="bold" fontSize="sm">
                                            Class Bottom 3 Contributors
                                        </Box>

                                        {/* Least 3 Students Contributor based on their totalPoints */}
                                        <Flex direction="column" w="100%" h="80%" gap={4}>
                                            {lowest3Students.map((student, index) => (
                                                <Flex key={index} direction="row" w="100%" h="30%" gap={2} alignItems="flex-start" justifyContent="flex-start" >
                                                    {/* Student Avatar */}
                                                    <Box w="20%" h="100%" display="flex" justifyContent="center" alignItems="center">
                                                        <StudentAvatar student={student} />
                                                    </Box>
                                                    {/* Student's Info */}
                                                    <Box w="80%" h="100%" display="flex" justifyContent="space-between" alignItems="center">
                                                        <Box w="60%" fontSize="sm" fontWeight="bold" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{student.user.fName} {student.user.lName}</Box>
                                                        <Box w="30%" fontSize="2xl" fontWeight="bold" display="flex" justifyContent="flex-end">
                                                            {student.totalPoints}
                                                        </Box>
                                                        <Box w="10%" h="100%" size={30} color="#2CD776" display="flex" justifyContent="center" alignItems="center" ml={1}>
                                                            <FaLeaf />
                                                        </Box>
                                                    </Box>
                                                </Flex>
                                            ))}
                                        </Flex>
                                    </Flex>
                                </Box>
                            </Flex>
                        </Flex>
                        {/* Leaderboards */}
                        <Box w="25%" h="100%" bg="white" borderRadius="xl" boxShadow="md" color="black" textAlign="center" display="flex" alignItems="center" justifyContent="center" onClick={() => navigate(`/teachers/classLeaderboards`)}
                            _hover={{ transform: "scale(1.01)", boxShadow: "xl", transition: "all 0.3s ease" }}>
                            <Flex direction="column" textAlign="left" gap={2} w="90%" h="100%" p={2}>
                                <Box w="100%" h="5%" fontWeight="bold" fontSize="sm" mt={3}>
                                    Class Leaderboards
                                </Box>

                                <Box w="100%" h="25%" fontWeight="bold" fontSize="sm" bg="#6A5AE0" borderRadius="xl" p={2} color="white"
                                    _hover={{ transform: "scale(1.05)", boxShadow: "xl", transition: "all 0.3s ease" }}>
                                    <Flex direction="row" w="100%" h="100%" gap={2} display="flex" justifyContent="center" alignItems="center">
                                        <Box w="50%" h="100%" fontSize="sm" display="flex" justifyContent="center" alignItems="center" >
                                            <Flex direction="column" alignItems="center" justifyContent="center" >
                                                <Text as={PiCloverFill} boxSize={30} color="#2CD776"></Text>
                                                <Box h="10%" fontSize="sm" fontWeight="bold" >Clovers</Box>
                                                <Box h="10%" fontSize="sm" fontWeight="bold" >{classData.classPoints}</Box>
                                            </Flex>
                                        </Box>
                                        <Box w="50%" h="100%" fontSize="sm" display="flex" justifyContent="center" alignItems="center">
                                            <Flex direction="column" alignItems="center" justifyContent="center">
                                                <Text as={LuBox} boxSize={30}></Text>
                                                <Box h="10%" fontSize="sm" fontWeight="bold" >Rank</Box>
                                                <Box h="10%" fontSize="sm" fontWeight="bold" >{classRanking}</Box>
                                            </Flex>
                                        </Box>
                                    </Flex>
                                </Box>

                                {/* School Classes Mini leaderboard */}
                                <Box w="100%" h="70%" p={2} overflowY="auto">
                                    <Flex direction="column" gap={2}>
                                        {schoolClassesData.map((leaderboardClassData, index) => (
                                            <Flex key={index} direction="row" w="100%" h="20%" gap={2} alignItems="center" justifyContent="center"
                                                bg={index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "#F6B191" : "#C4D0FB"} borderRadius="3xl" p={4}
                                                border={classData.className === leaderboardClassData.className ? "3px solid #483EA8" : "none"}
                                                _hover={{ transform: "scale(1.05)", boxShadow: "lg", transition: "all 0.3s ease" }}
                                                whileHover={{ scale: 1.05 }}>
                                                <Box w="100%" h="100%" display="flex" justifyContent="space-between" alignItems="center">
                                                    <Box w="60%" fontSize="2xl" fontWeight="bold" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{leaderboardClassData.className}</Box>
                                                    <Box w="30%" fontSize="2xl" fontWeight="bold" display="flex" justifyContent="flex-end">
                                                        {leaderboardClassData.classPoints}
                                                    </Box>
                                                    <Box w="10%" h="100%" size={30} color="#2CD776" display="flex" justifyContent="center" alignItems="center" ml={1}>
                                                        <FaLeaf />
                                                    </Box>
                                                </Box>
                                            </Flex>
                                        ))}
                                    </Flex>
                                </Box>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
            </Tabs.Content>
        );
    }
}

export default ClassDashboard;
