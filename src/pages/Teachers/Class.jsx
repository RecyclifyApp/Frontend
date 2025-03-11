/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import ClassTabs from '../../components/teachers/ClassTabs';
import server from "../../../networking"
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ShowToast from '../../Extensions/ShowToast';

function Class() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loaded, error } = useSelector((state) => state.auth);

    const [classData, setClassData] = useState({});
    const [students, setStudents] = useState([]);

    const fetchClassData = async () => {
        try {
            const response = await server.get(`/api/Teacher/get-class/?classId=${id}`);
            if (response.status === 200) {
                setClassData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            setClassData({});
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

    // Fetch students data from the backend
    const fetchStudents = async () => {
        try {
            const response = await server.get(`/api/Teacher/get-students/?classId=${id}`);
            if (response.status === 200) {
                setStudents(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            setStudents([]);
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

    // Fetch class data on component mount
    useEffect(() => {
        if (!error && loaded && user && user.userRole == "teacher") {
            if (id) {
                fetchClassData();
                fetchStudents();
            }
        }
    }, [loaded && id]);

    if (!error && loaded && user && classData && students) {
        return (
            <Box>
                <Flex direction="row" align="center" justify="space-between" h="12vh">
                    <Box bg="#96E2D6" borderRadius="full" p={2}>
                        <IoArrowBack size={50} color="black" cursor="pointer" onClick={() => navigate(`/teachers`)} />
                    </Box>
                    <Box fontSize="2xl" textAlign="center" flex="1" mr={24} mb={4}>
                        <Heading fontSize={40} fontWeight="bold" mt={8} mb={4}>
                            {classData.className}
                        </Heading>
                        <Text fontSize="xl" fontWeight="medium">
                            {classData.classDescription}
                        </Text>
                    </Box>
                </Flex>
                {/* conditional rendering for class tabs */}
                <ClassTabs classData={classData} students={students} />
            </Box>
        );
    }
}

export default Class;
