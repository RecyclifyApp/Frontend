import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTrigger } from "@/components/ui/drawer"
import { Flex, Heading, Button, Image, Text, Box } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaRegClipboard, FaTasks } from "react-icons/fa";
import { BsCalendar, BsQuestionCircle } from "react-icons/bs";
import { BiHome, BiLeaf, BiMessage } from "react-icons/bi";
import { MdOutlineRedeem, MdOutlineLeaderboard } from "react-icons/md";
import { CgUserList } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
import { TbMessageShare } from "react-icons/tb";

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
                            <Button color={"#515F7C"} mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/home")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <BiHome ml={1} />
                                <Text ml={2}>Dashboard</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/milestones")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <BsCalendar ml={1} />
                                <Text ml={3}>Milestones</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/leaderboards")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <Box ml={0.5}>
                                    <FaRegClipboard fontSize={"20px"} />
                                </Box>
                                <Text ml={2.5}>Leaderboards</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/redemption")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <BiLeaf ml={1} />
                                <Text ml={2}>Redeem my leafs</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/scanItem")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <BiMessage ml={1} />
                                <Text ml={3}>Scan my item</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/inbox")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <Text as={BsQuestionCircle} fontSize="20px" color="#515F7C" ml={0.5} />
                                <Text ml={3}>Inbox</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/myClass")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <Text as={BsQuestionCircle} fontSize="20px" color="#515F7C" ml={0.5} />
                                <Text ml={3}>My class</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/student/enrolClass")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <Text as={BsQuestionCircle} fontSize="20px" color="#515F7C" ml={0.5} />
                                <Text ml={3}>Enrol into class</Text>
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
    function AdminSidebar() {
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
                            <Button color={"#515F7C"} mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/admin/dashboard")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <MdOutlineLeaderboard fontSize={"20px"} />
                                <Text ml={2}>Dashboard</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/admin/userManagement")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <CgUserList />
                                <Text ml={3}>User Managament</Text>
                            </Button>

                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/admin/inventoryManagement")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <FaTasks ml={1} />
                                <Text ml={2.5}>Inventory Managament</Text>
                            </Button>
                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <CiSettings />
                                <Text ml={2.5}>System Services</Text>
                            </Button>
                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' onClick={() => navigate("/admin/contactManagement")} _hover={{ bg: "#E4EBF8" }} borderRadius={"30px"}>
                                <TbMessageShare />
                                <Text ml={2.5}>View Contact Messages</Text>
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