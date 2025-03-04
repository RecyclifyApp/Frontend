/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Box, VStack, Heading, Link, Text, HStack, Image } from '@chakra-ui/react'
import { StepsItem, StepsList, StepsRoot, } from "@/components/ui/steps"
import ParentRegistrationForm from '../../components/identity/ParentRegisterForm'
import StudentRegistrationForm from '../../components/identity/StudentRegisterForm'
import { useNavigate } from 'react-router-dom'
import ShowToast from '../../Extensions/ShowToast'

function CreateAccount() {
    const navigate = useNavigate();
    const [selectedAccountType, setSelectedAccountType] = useState(null);
    const { user, loaded, error, authToken } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && authToken) {   
            if (localStorage.getItem('jwt')) {
                if (!error && loaded) {
                    if (location.pathname === "/auth/createAccount") {
                        if (user.userRole === "student") {
                            navigate("/student/home");
                            ShowToast("success", "You're already logged in!");
                        } else if (user.userRole === "teacher") {
                            navigate("/teachers");
                            ShowToast("success", "You're already logged in!");
                        } else if (user.userRole === "parent") {
                            navigate("/parents");
                            ShowToast("success", "You're already logged in!");
                        } else if (user.userRole === "admin") {
                            navigate("/admin/dashboard");
                            ShowToast("success", "You're already logged in!");
                        }
                    }
                }
            }
        }
    }, [user, error, loaded, authToken]);

    const renderForm = () => {
        switch (selectedAccountType) {
            case 'Parent':
                return <ParentRegistrationForm goBack={() => setSelectedAccountType(null)} />;
            case 'Student':
                return <StudentRegistrationForm goBack={() => setSelectedAccountType(null)} />;
            default:
                return null;
        }
    };

    return (
            <Box
                bgPosition="center"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Box
                    p={8}
                    borderRadius={15}
                >
                    <VStack 
                        spacing={4}
                    >
                        <Heading
                           fontSize='30px'
                           mb={10} 
                           textAlign="center"
                        >
                            Create Your Account
                        </Heading>
    
                        {/* Progress bar */}
                        <StepsRoot 
                            defaultValue={0} 
                            count={3} 
                            linear="true" 
                            size="lg" 
                            width={1000}
                        >
                            <StepsList>
                                <StepsItem index={0} title="Step 1" description="Account Details" />
                                <StepsItem index={1} title="Step 2" description="Setup MFA" />
                                <StepsItem index={2} title="Step 3" description="Verify Email" />
                            </StepsList>
                        </StepsRoot>

                        {selectedAccountType === null ? (
                            <HStack gap={20} mt={10}>
                                <Box
                                    w={350}
                                    h={350}
                                    borderColor={"grey"}
                                    borderWidth={2}
                                    borderRadius={30}
                                    cursor={"pointer"}
                                    onClick={() => setSelectedAccountType('Parent')}
                                >
                                    <Image src='/AvatarParent.png' size="2xl" mt={30} ml={110} borderRadius={100} />
                                    <Heading mt={5} mb={1}>Parent</Heading>
                                    <Text w={"80%"} ml={35}>Receive the latest updates and keep track of your child's recycling progress in school.</Text>
                                </Box>

                                <Box
                                    w={350}
                                    h={350}
                                    borderColor={"grey"}
                                    borderWidth={2}
                                    borderRadius={30}
                                    cursor={"pointer"}
                                    onClick={() => setSelectedAccountType('Student')}
                                >
                                    <Image src='/AvatarStudent.png' size="2xl" mt={30} ml={110} borderRadius={100} />
                                    <Heading mt={5} mb={1}>Student</Heading>
                                    <Text w={"80%"} ml={35}>Recycle, complete tasks, earn points and redeem attractive rewards! Contribute to your class and climb the ranks of your school.</Text>
                                </Box>
                            </HStack>
                        ) : (
                            renderForm()
                        )}
    
                        {/* Login Link */}
                        <Text 
                            textAlign="center" 
                            fontSize="12px" 
                            mb={5}
                            mt={5}
                        >
                            Already have have an account?{' '}
                            <Link 
                                href="/auth/login" 
                                color="teal.500"
                            >
                            Sign In
                            </Link>
                        </Text>
                    </VStack>
                </Box>
            </Box>
        )
    }
    

export default CreateAccount