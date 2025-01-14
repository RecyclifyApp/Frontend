import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTrigger } from "@/components/ui/drawer"
import { Flex, Heading, Button, Image, Text, Box } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx"; 
import { FaTasks } from "react-icons/fa";
import { BsMailbox, BsPeople } from "react-icons/bs";
import { BiLeaf, BiMedal } from "react-icons/bi";
import { MdOutlineRedeem, MdOutlineLeaderboard } from "react-icons/md";
import { IoSparklesOutline } from "react-icons/io5";
import { GrAddCircle } from "react-icons/gr";
import { FcStatistics } from "react-icons/fc";

function Navbar() {
    const navigate = useNavigate();

    // Student Sidebar
    function StudentsSidebar() {
        return (
            <DrawerRoot placement={"start"}>
                <DrawerBackdrop />
                <DrawerTrigger asChild>
                    <RxHamburgerMenu size="24px" color="white" cursor="pointer" />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <Image src="../RecyclifyTransparentLogoV1.png" alt="logo" mt={3} />
                    </DrawerHeader>
                    <DrawerBody display={"flex"} flexDirection={"column"}>
                        <Box display="flex" flexDirection="column" height="100%">
                            <Button color={"#515F7C"} mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/home")} _hover={{bg: "#E4EBF8"}} borderRadius={"30px"}>
                                <FcStatistics ml={1}/>
                                <Text ml={2}>Dashboard</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/milestones")} _hover={{bg: "#E4EBF8"}} borderRadius={"30px"}>
                                <BiMedal/>
                                <Text ml={2}>Milestones</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/leaderboards")} _hover={{bg: "#E4EBF8"}} borderRadius={"30px"}>
                                <Box>
                                    <MdOutlineLeaderboard fontSize={"20px"}/>
                                </Box>
                                <Text ml={2}>Leaderboards</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/redemption")} _hover={{bg: "#E4EBF8"}} borderRadius={"30px"}>
                                <BiLeaf ml={1}/>
                                <Text ml={2}>Redeem my leafs</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/scanItem")} _hover={{bg: "#E4EBF8"}} borderRadius={"30px"}>
                                <IoSparklesOutline ml={4}/>
                                <Text ml={2}>Scan my item</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/inbox")} _hover={{bg: "#E4EBF8"}} borderRadius={"30px"}>
                                <Text as={BsMailbox} fontSize="20px" color="#515F7C" />
                                <Text ml={2}>Inbox</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/myClass")} _hover={{bg: "#E4EBF8"}} borderRadius={"30px"}>
                                <Text as={BsPeople} fontSize="20px" color="#515F7C" />
                                <Text ml={2}>My class</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/enrolClass")} _hover={{bg: "#E4EBF8"}} borderRadius={"30px"}>
                                <Text as={GrAddCircle} fontSize="20px" color="#515F7C" />
                                <Text ml={2}>Enrol into class</Text>
                            </Button>
                        </Box>
                        
                        <Box textAlign="center" >
                            <Text color={"#515F7C"}>©2025 Recyclify</Text>
                        </Box>
                    </DrawerBody>
                    <DrawerFooter>
                        
                    </DrawerFooter>
                    <DrawerCloseTrigger />
                </DrawerContent>
            </DrawerRoot>
        )
    }

    // Teacher Sidebar
    function TeachersSidebar() {
        return (
            <DrawerRoot placement={"start"}>
                <DrawerBackdrop />
                <DrawerTrigger asChild>
                    <RxHamburgerMenu size="24px" color="white" cursor="pointer" />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <Image src="../RecyclifyTransparentLogoV1.png" alt="logo" mt={3} />
                    </DrawerHeader>
                    <DrawerBody display={"flex"} flexDirection={"column"}>
                        <Box display="flex" flexDirection="column" height="100%">
                            <Button color={"#515F7C"} mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/home")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <MdOutlineRedeem ml={1} />
                                <Text ml={2}>Student Redemption</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/milestones")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <FaTasks ml={1} />
                                <Text ml={3}>Task Verification</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/leaderboards")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <Box ml={0.5}>
                                    <MdOutlineLeaderboard fontSize={"20px"} />
                                </Box>
                                <Text ml={2.5}>Leaderboards</Text>
                            </Button>
                        </Box>

                        <Box textAlign="center" >
                            <Text color={"#515F7C"}>©2025 Recyclify</Text>
                        </Box>
                    </DrawerBody>
                    <DrawerFooter>

                    </DrawerFooter>
                    <DrawerCloseTrigger />
                </DrawerContent>
            </DrawerRoot>
        )
    }

    // Admin Sidebar

    // Parent Sidebar

    // Use state to determine which sidebar to display through useEffect hook to fetch user role from the backend
    return (
        <>
            <Flex as="nav" bg="#4DCBA4" w="100%" p="8px 24px 8px 24px" rounded="10px" justify="space-between" align="center" alignItems="center">

                <StudentsSidebar />

                <Heading color="white" cursor="pointer">RECYCLIFY</Heading>
                <Avatar name="Joshua Long" src="https://replace.with.your.image.url" size="sm" cursor="pointer" />
            </Flex>
        </>
    );
}

export default Navbar;