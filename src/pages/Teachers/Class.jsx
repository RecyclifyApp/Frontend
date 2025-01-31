/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import ClassTabs from '../../components/teachers/ClassTabs';
import server from "../../../networking"
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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
        }
    };

    // Fetch class data on component mount
    useEffect(() => {
        if (!error) {
            if (loaded) {
                if (!user || user.userRole != "teacher") {
                    navigate("/auth/login");
                } else {
                    if (id) {
                        fetchClassData();
                        fetchStudents();
                    }
                    else {
                        navigate("/teachers");
                    }
                }
            }
        } else {
            console.log("Error", "An error occured while fetching user state");
        }
    }, [loaded && id]);

    if (!error && loaded && user) {
        return (
            <Box>
                <Flex direction="row" align="center" justify="flex-start" h="12vh">
                    <Box bg="#96E2D6" borderRadius="full" p={2}>
                        <IoArrowBack size={50} color="black" cursor="pointer" onClick={() => navigate(`/teachers`)} />
                    </Box>
                    <Box mt={4} fontSize="2xl" align="left" ml={4}>
                        <Heading fontSize={40} fontWeight="bold" mt={8} mb={4} textAlign="left">
                            {classData.className}
                        </Heading>
                        <Text textAlign="left" fontSize="xl" fontWeight="medium">
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
