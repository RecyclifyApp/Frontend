/* eslint-disable react/prop-types */
import { Tabs } from '@chakra-ui/react';
import ClassDashboard from './ClassDashboard';
import StudentDashboard from './StudentDashboard';
import { PiStudentFill } from 'react-icons/pi';
import { SiGoogleclassroom } from 'react-icons/si';
import { Text, VStack } from '@chakra-ui/react';
import { LuBox } from "react-icons/lu"
import { FaClipboardList } from "react-icons/fa6";
import ClassQuest from './ClassQuest';

function ClassTabs({ classData, students }) {
    const studentsList = students || [];
    
    return (
        <>
            {/* Conditionally render tabs based on student count */}
            {studentsList.length === 0 ? (
                <VStack textAlign="center" fontWeight="medium" mt={4}>
                    <LuBox />
                    <Text>No students found in this class.</Text>
                </VStack>
            ) : (
                <Tabs.Root defaultValue="Class" key="plain" variant="plain" align="center" mt={4}>
                    <Tabs.List gap={4} align="center">
                        <Tabs.Trigger 
                            value='Class' 
                            bg="#AEC7ED" 
                            color="black" 
                            align="center"
                            _selected={{
                                bg: "#B9D4FF",
                                color: "black",
                                border: "2px solid #000",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                                fontSize: "1.2rem",
                                padding: "0.8rem 1.2rem",
                                transition: "all 0.3s ease-out, transform 0.3s ease-out",
                                transform: "scale(1.05)",
                            }}
                            _hover={{
                                bg: "#B9D4FF",
                                transform: "scale(1.05)",
                            }}
                        >
                            <SiGoogleclassroom />Class Dashboard
                        </Tabs.Trigger>
                        <Tabs.Trigger 
                            value='Class Quest' 
                            bg="#AEC7ED" 
                            color="black" 
                            align="center"
                            _selected={{
                                bg: "#B9D4FF",
                                color: "black",
                                border: "2px solid #000",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                                fontSize: "1.2rem",
                                padding: "0.8rem 1.2rem",
                                transition: "all 0.3s ease-out, transform 0.3s ease-out",
                                transform: "scale(1.05)",
                            }}
                            _hover={{
                                bg: "#B9D4FF",
                                transform: "scale(1.05)",
                            }}
                        >
                            <FaClipboardList />Class Quest
                        </Tabs.Trigger>
                        <Tabs.Trigger 
                            value='Students' 
                            bg="#94E9B8" 
                            color="black" 
                            align="center"
                            _selected={{
                                bg: "#96E2D6",
                                color: "black",
                                border: "2px solid #000",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                                fontSize: "1.2rem",
                                padding: "0.8rem 1.2rem",
                                transition: "all 0.3s ease-out, transform 0.3s ease-out",
                                transform: "scale(1.05)",
                            }}
                            _hover={{
                                bg: "#96E2D6",
                                transform: "scale(1.05)",
                            }}
                        >
                            <PiStudentFill />Students Dashboard
                        </Tabs.Trigger>
                    </Tabs.List>
                    <ClassDashboard classData={classData} students={students} />
                    <ClassQuest classData={classData} />
                    <StudentDashboard classData={classData} students={students} />
                </Tabs.Root>
            )}
        </>
    );
}

export default ClassTabs;
