/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Stack, VStack, Text, useBreakpointValue } from '@chakra-ui/react'
import { LuBox } from "react-icons/lu"
import { useNavigate } from 'react-router-dom'
import AddClassButton from "@/components/teachers/AddClassButton"
import ClassCard from "@/components/teachers/ClassCard"
import server from "../../../networking"
import { useSelector } from 'react-redux'
import { motion } from "framer-motion"
import ShowToast from '../../Extensions/ShowToast';

function Landing() {
    const navigate = useNavigate();
    const { user, loaded, error } = useSelector((state) => state.auth)
    const [teacherID, setTeacherID] = useState(null)
    const [classes, setClasses] = useState([]);

    // Reusable function to fetch classes
    const fetchClasses = async (teacherID) => {
        try {
            const response = await server.get(`/api/Teacher/get-classes/?teacherID=${teacherID}`);
            if (response.status === 200) {
                setClasses(Array.isArray(response.data.data) ? response.data.data : []);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            setClasses([]);
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

    // Fetch classes on component mount
    useEffect(() => {
        if (!error && loaded && user && user.userRole == "teacher") {
            setTeacherID(user.id);
            fetchClasses(user.id);
        }
    }, [loaded]);

    // Card height and width based on screen size
    const cardWidth = useBreakpointValue({
        base: '300px',
        md: '380px',
        lg: '500px',
    });

    const cardHeight = useBreakpointValue({
        base: '200px',
        md: '260px',
        lg: '300px',
    });

    // Function to delete a class by ID using the backend API
    const handleDeleteClass = async (classId) => {
        try {
            const response = await server.delete(`/api/Teacher/delete-class`, {
                params: { classId },
            });
            if (response.status === 200) {
                ShowToast("success", "Class deleted successfully.");
                fetchClasses(user.id);
            }
        } catch (error) {
            console.error("Error deleting class:", error);
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

    // Function to edit a class by ID using the backend API, add in class image later
    const handleEditClass = async (classId, updatedClass) => {
        try {
            const response = await server.put(`/api/Teacher/update-class`, null, {
                params: {
                    classId,
                    className: updatedClass.className,
                    classDescription: updatedClass.classDescription
                },
            });
            if (response.status === 200) {
                ShowToast("success", "Class updated successfully.");
                fetchClasses(user.id);
            }
        } catch (error) {
            console.error("Error updating class:", error);
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

    // Add a new class, add class image later
    const handleAddClass = async (newClass) => {
        try {
            const response = await server.post(`/api/Teacher/create-class`, null, {
                params: {
                    className: newClass.className,
                    classDescription: newClass.classDescription,
                    teacherID: teacherID,
                }
            });
            if (response.status === 200) {
                ShowToast("success", "Class added successfully.");
                fetchClasses(user.id);
            }
        } catch (error) {
            console.error("Error adding class:", error);
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

    if (!error && loaded && user) {
        return (
            <>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Stack gap="8" direction="row" wrap="wrap" justify="center" mt={8}>
                        {classes.length ? (
                            classes.map((classItem, classIndex) => (
                                <ClassCard
                                    key={classItem.classID}
                                    classIndex={classIndex}
                                    classItem={classItem}
                                    cardWidth={cardWidth}
                                    cardHeight={cardHeight}
                                    onCardClick={() => navigate(`/teachers/class/${classItem.classID}`)}
                                    onDelete={() => handleDeleteClass(classItem.classID)}
                                    onEdit={(updatedClass) => handleEditClass(classItem.classID, updatedClass)}
                                />
                            ))
                        ) : (
                            <VStack textAlign="center" fontWeight="medium">
                                <LuBox />
                                <Text>No class data available</Text>
                            </VStack>
                        )}
                    </Stack>

                </motion.div>

                {/* Add new class button */}
                <AddClassButton onCreate={handleAddClass} />
            </>
        )
    }
}

export default Landing