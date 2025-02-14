import { Box, Flex, Heading, HStack, Image, Text, Button } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import server from "../../../networking";
import ShowToast from "../../Extensions/ShowToast";
import LeaderboardPlaceCard from "../../components/teachers/LeaderboardPlaceCard";
import { DialogActionTrigger, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion } from "framer-motion";
import { PiCloverFill } from "react-icons/pi";
import { FaLeaf } from "react-icons/fa";

function Leaderboards() {
	const navigate = useNavigate();
	const { user, loaded, error } = useSelector((state) => state.auth);
	const [schoolClassesData, setSchoolClassesData] = useState([]);
	const [classes, setClasses] = useState([]);
	const [topContributor, setTopContributor] = useState(null);
	const [topContributors, setTopContributors] = useState({});
	const [selectedClass, setSelectedClass] = useState(null); 

	const fetchSchoolClasses = async () => {
		try {
			const response = await server.get(`/api/Teacher/get-overall-classes-data/`);
			if (response.status === 200) {
				const sortedClasses = Array.isArray(response.data.data) ? sortSchoolClassesData(response.data.data) : [];
				setSchoolClassesData(sortedClasses);
				await fetchStudentsForClasses(sortedClasses);
			}
		} catch (error) {
			console.error("Error fetching classes:", error);
			if (error.response.status === 400) {
				ShowToast("error", "Error fetching classes", error.response.data.message.split("UERROR: "));
				setSchoolClassesData([]);
			} else {
				ShowToast("error", "Error fetching classes", "Please try again.");
				setSchoolClassesData([]);
			}
			setSchoolClassesData([]);
		}
	};

	// Fetch the students for each class
	const fetchStudentsForClasses = async (classes) => {
		// Create a mapping of classID to students
		if (!classes || classes.length === 0) {
			setClasses([]);
			return;
		}
		const updatedClasses = await Promise.all(classes.map(async (cls) => {
			try {
				const response = await server.get(`/api/Teacher/get-students/?classId=${cls.classID}`);
				if (response.status === 200) {
					const studentsData = response.data.data || [];
					cls.students = studentsData; // Link the students with their class
					return cls;
				} else {
					cls.students = [];
					return cls;
				}
			} catch (error) {
				console.error("Error fetching students:", error);
				cls.students = [];
				return cls;
			}
		}));

		setClasses(updatedClasses);

		await fetchTopContributors(updatedClasses);
	};

	// Fetch students data from the backend
	const fetchStudents = async (classID) => {
		try {
			const response = await server.get(`/api/Teacher/get-students/?classId=${classID}`);
			if (response.status === 200) {
				findTopContributor(response.data.data);
			}
		} catch (error) {
			console.error("Error fetching students:", error);
			if (error.response.status === 400) {
				ShowToast("error", "Error fetching students", error.response.data.message.split("UERROR: "));
			} else {
				ShowToast("error", "Error fetching students", "Please try again.");
			}
		}
	};

	// Find the student with the highest total points
	const findTopContributor = (students) => {
		if (!students || students.length === 0) {
			setTopContributor(null);
			return;
		}

		const validStudents = students.filter(student => student && student.totalPoints !== undefined);
		if (validStudents.length === 0) {
			setTopContributor(null);
			return;
		}

		const topStudent = validStudents.reduce((max, student) =>
			student.totalPoints > max.totalPoints ? student : max
		);

		setTopContributor(topStudent);
	};

	const fetchTopContributors = async (classes) => {
		const contributorsMap = {};

		classes.forEach((cls) => {

			const students = cls.students || [];

			const topStudent = students.reduce((max, student) =>
				student.totalPoints > max.totalPoints ? student : max,
				students[0] || null
			);

			contributorsMap[cls.classID] = topStudent || null;
		});

		setTopContributors(contributorsMap);
	};

	//Function to sort school classes data in descending order
	function sortSchoolClassesData(schoolClassesData) {
		if (!Array.isArray(schoolClassesData) || schoolClassesData.length === 0) {
			return [];
		}

		return [...schoolClassesData].sort((a, b) => b.classPoints - a.classPoints);
	}

	const sendCertificate = async (topContributor) => {
		try {
			const response = await server.post("/api/Teachers/send-certificate", {
				topContributorName: topContributor.user.name,
				topContributorEmail: topContributor.user.email,
			});

			if (response.status === 200) {
				ShowToast("success", "Certificate sent", "Certificate has been sent to the top contributor.");
			}
		} catch (error) {
			console.error("Error sending certificate:", error);
			if (error.response.status === 400) {
				ShowToast("error", "Error sending certificate", error.response.data.message.split("UERROR: "));
			} else {
				ShowToast("error", "Error sending certificate", "Please try again.");
			}
		}
	};

	const getPrevClass = () => {
		if (!selectedClass || classes.length <= 1) return null;
		const currentIndex = classes.findIndex(cls => cls.classID === selectedClass.classID);
		const prevIndex = (currentIndex - 1 + classes.length) % classes.length;
		return classes[prevIndex];
	};

	const getNextClass = () => {
		if (!selectedClass || classes.length <= 1) return null;
		const currentIndex = classes.findIndex(cls => cls.classID === selectedClass.classID);
		const nextIndex = (currentIndex + 1) % classes.length;
		return classes[nextIndex];
	};

	const handlePrev = () => {
		const prevClass = getPrevClass();
		if (prevClass) {
			setSelectedClass(prevClass);
			fetchStudents(prevClass.classID);
		}
	};

	const handleNext = () => {
		const nextClass = getNextClass();
		if (nextClass) {
			setSelectedClass(nextClass);
			fetchStudents(nextClass.classID);
		}
	};

	useEffect(() => {
		if (classes.length > 0) {
			setSelectedClass(classes[0]); // Automatically select the first class
			fetchStudents(classes[0].classID); // Fetch students for the first class
		}
	}, [classes]);

	useEffect(() => {
		if (user) {
			fetchSchoolClasses();
			fetchStudentsForClasses();
		}
	}, [user]);

	if (!error && loaded && user) {
		return (
			<Box>
				<Flex direction="row" align="center" justify="space-between" h="12vh">
					<Box bg="#96E2D6" borderRadius="full" p={2}>
						<IoArrowBack size={50} color="black" cursor="pointer" onClick={() => navigate(`/teachers`)} />
					</Box>
					<Box mt={4} fontSize="2xl" textAlign="center" flex="1" mr={20}>
						<Heading fontSize={40} fontWeight="bold" mb={4}>
							Class Leaderboards
						</Heading>
					</Box>
				</Flex>

				{/* Main Content */}
				<Box display="flex" justifyContent={"space-between"} width="100%" height={"67vh"} mt={10} boxSizing={"border-box"} gap={5}>
					{/* Leaderboard Panel */}
					<Flex direction="column" justifyContent={"space-between"} width="28%" height={"100%"}>
						<Box display="flex" flexDir={"column"} width="100%" height="100%" backgroundColor="#E5ECFF" borderRadius={20} >
							{/* Class brief information card */}
							<Box position="relative" display="flex" flexDir={"column"} mt={4} p={3} borderRadius={20} height={"30%"} justifyContent={"center"} alignItems={"center"}>
								{/* Left Arrow & Previous Class Name */}
								{classes.length > 1 && (
									<Box position="absolute" left={2} top="50%" transform="translateY(-50%)" width="46px" >
										<Text fontSize="sm" color="gray.600" mb={1} width="100%" textAlign="center" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
											{getPrevClass()?.className}
										</Text>
										<Box bg="#96E2D6" borderRadius="full" p={2} cursor="pointer" onClick={handlePrev} transition="all 0.2s ease-in-out"
											_hover={{
												transform: "scale(1.1)",
												bg: "#7DD4C0",
											}}>
											<IoArrowBack size={30} color="black" />
										</Box>
									</Box>
								)}

								{/* Class Name & Points */}
								<Box display="flex" flexDir="column" justifyContent="center" alignItems="center" height="40%" mt={8}>
									<Heading fontSize="40px">Class {selectedClass?.className || "Class Name"}</Heading>
									<Flex justifyContent="center" alignItems="center" mt={4} gap={2}>
										<Heading fontSize="24px">{selectedClass?.classPoints || 0}</Heading>
										<Text as={PiCloverFill} boxSize={25} color="#2CD776"></Text>
									</Flex>
								</Box>

								{/* Right Arrow & Next Class Name */}
								{classes.length > 1 && (
									<Box position="absolute" right={2} top="50%" transform="translateY(-50%)" width="46px">
										<Text fontSize="sm" color="gray.600" mb={1} textAlign="center" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
											{getNextClass()?.className}
										</Text>
										<Box bg="#96E2D6" borderRadius="full" p={2} cursor="pointer" onClick={handleNext} transition="all 0.2s ease-in-out"
											_hover={{
												transform: "scale(1.1)",
												bg: "#7DD4C0",
											}}>
											<IoArrowForward size={30} color="black" />
										</Box>
									</Box>
								)}
							</Box>

							{/* Top Contributor Panel */}
							{topContributor ? (
								<DialogRoot size="lg" >
									<DialogTrigger asChild cursor="pointer">
										<motion.div
											whileHover={{ scale: 1.02 }}
											transition={{ duration: 0.2 }}
											width="100%"
											height="70%"
										>
											<Box display="flex" flexDir={"column"} justifyContent={"center"} alignItems={"center"} mt={4} mb={4} height={"100%"}>
												<Heading fontWeight={"bold"} textAlign="center" fontSize={"30px"} mt={4} mb={4} height={"10%"}>
													Top Contributor
												</Heading>
												<Box
													display="flex"
													flexDir={"column"}
													justifyContent={"space-around"}
													alignItems={"center"}
													backgroundColor="#FFFFFF"
													borderRadius={20}
													width="80%"
													height="90%"
													padding={4}
													boxShadow="lg"
												>
													<Avatar name={topContributor.user.name} src={"https://bit.ly/dan-abramov"} size="sm" />
													<Heading fontSize={"24px"} mt={2} color="#2D3748">
														{topContributor.user.name}
													</Heading>
													<Flex justifyContent={"center"} alignItems={"center"} mt={2} gap={2}>
														<Heading>{topContributor.totalPoints}</Heading>
														<Box w="100%" h="100%" size={30} color="#2CD776" display="flex" justifyContent="center" alignItems="center">
															<FaLeaf />
														</Box>
													</Flex>
													<Box
														display="flex"
														justifyContent={"center"}
														alignItems={"center"}
														border="3px solid"
														borderColor={topContributor.league === "Gold" ? "gold" : topContributor.league === "Silver" ? "silver" : "#F6B191"}
														borderRadius={20}
														height="30%"
														mt={2}
														mb={4}
														padding={5}
														boxShadow="md"
													>
														<Image
															src={
																topContributor.league === "Bronze" ? "/bronze-medal.png" :
																	topContributor.league === "Silver" ? "/silver-medal.png" :
																		"/gold-medal.png"
															}
															boxSize={8}
														/>
														<Text fontSize={"md"} ml={2} color="#2D3748">
															{topContributor.league} League
														</Text>
													</Box>
												</Box>
											</Box>
										</motion.div>
									</DialogTrigger>

									{/* Confirmation Dialog */}
									<DialogContent>
										<DialogHeader>
											<DialogTitle color="black" fontWeight="bold" textAlign="center">
												Are you sure you want to send a certificate to {topContributor.user.name}?
											</DialogTitle>
										</DialogHeader>
										<DialogBody color="#FF0000" textAlign="center">
											<Text>This action cannot be undone.</Text>
										</DialogBody>
										<DialogFooter display="flex" gap={10} justifyContent="center">
											<DialogActionTrigger asChild>
												<Button variant="outline" bg="#2D65FF" color="white" >
													Cancel
												</Button>
											</DialogActionTrigger>
											<DialogActionTrigger asChild>
												<Button bg="#FF8080" color="white" onClick={sendCertificate}>
													Send Certificate
												</Button>
											</DialogActionTrigger>
										</DialogFooter>
									</DialogContent>
								</DialogRoot>
							) : (
								<Heading color="#718096" fontWeight={"bold"} textAlign="center" fontSize={"30px"} mt={4} mb={4} height={"10%"}>No top contributor.</Heading>
							)}
						</Box>
					</Flex>

					<Box
						display="flex"
						flexDir={"column"}
						alignItems={"center"}
						width="100%"
						backgroundColor="#E5ECFF"
						borderRadius={20}
						overflowY="auto"
						padding={4}
						boxShadow="lg"
					>
						<HStack
							mt={2}
							display="flex"
							justifyContent={"space-between"}
							alignItems="center"
							width="98%"
							padding="10px"
							backgroundColor="#CBD8F7"
							borderRadius={12}
							fontWeight="bold"
							boxShadow="md"
						>
							<Box width="10%" textAlign="center">
								<Text fontSize="md">Rank</Text>
							</Box>

							<Box width="20%" textAlign="center">
								<Text fontSize="md">Class Name</Text>
							</Box>

							<Box width="50%" textAlign="center">
								<Text fontSize="md">Top Contributor</Text>
							</Box>

							<Box width="20%" textAlign="center">
								<Text fontSize="md">Class Clovers</Text>
							</Box>
						</HStack>

						{/* Sort classes by classPoints in descending order */}
						{schoolClassesData
							.sort((a, b) => b.classPoints - a.classPoints)
							.map((schoolClass, index) => (
								<motion.div key={schoolClass.classID} whileHover={{ scale: 1.01 }} style={{ display: "block", width: "100%" }}>
									<LeaderboardPlaceCard key={schoolClass.classID} rank={index + 1} schoolClass={schoolClass} topContributor={topContributors[schoolClass.classID] || null} />
								</motion.div>
							))}
					</Box>
				</Box>
			</Box>
		);
	}
}

export default Leaderboards;