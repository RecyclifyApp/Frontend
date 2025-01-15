import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import ClassTabs from '../../components/teachers/ClassTabs';
import server from "../../../networking"
import { useEffect, useState } from 'react';

function Class() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classData, setClassData] = useState([]);

    const fetchClassData = async () => {
        try {
            const response = await server.get(`/api/Class/get-class/?classId=${id}`);
            if (response.status === 200) {
                setClassData(response.data);
            } else {
                console.error("Failed to fetch classes");
                setClassData([]);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            setClasses([]);
        }
    };

    useEffect(() => {
        fetchClassData();
    }, [id]);

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
            <ClassTabs />
        </Box>
    );
}

export default Class;
