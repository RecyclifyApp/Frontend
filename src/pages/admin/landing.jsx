/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Heading, Text, Button, SimpleGrid, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import server from "../../../networking";
import { useNavigate } from "react-router-dom";
import ShowToast from "../../Extensions/ShowToast";

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

function Dashboard() {
	const { user, loaded, error } = useSelector((state) => state.auth);
	const [chartData, setChartData] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		if (!error && loaded && user && user.userRole === "admin") {
			fetchChartData();
		}
	}, [loaded, error, user]);

	const fetchChartData = async () => {
		try {
			setLoading(true);
			const response = await server.get("/api/Recycling");
			const labels = response.data.map((item) => item.classID);
			const points = response.data.map((item) => item.totalPoints);

			setChartData({
				labels,
				datasets: [
					{
						label: "Points (clovers) gained",
						data: points,
						backgroundColor: "rgba(72, 187, 120, 0.6)",
						borderColor: "rgb(72, 187, 120)",
						borderWidth: 1,
					},
				],
			});
		} catch {
			if (error.response && error.response.data && error.response.data.error && typeof error.response.data.error === "string") {
                if (error.response.data.error.startsWith("UERROR")) {
                    ShowToast("error", error.response.data.error.substring("UERROR:".length));
                    return;
                } else {
                    ShowToast("error", error.response.data.error.substring("ERROR:".length));
                    return;
                }
            }
		} finally {
			setLoading(false);
		}
	};

	if (!loaded || loading) {
		return (
			<Box
				display="flex"
				flexDir="column"
				justifyContent="center"
				alignItems="center"
				width="100%"
				height="100vh"
			>
				<Spinner />
			</Box>
		);
	}

	// Chart options
	const options = {
		responsive: true,
		plugins: {
			legend: { position: "top" },
			title: {
				display: true,
				text: "Weekly Class Recycling Points",
			},
		},
		scales: {
			y: { beginAtZero: true },
		},
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Box
				p={5}
				minHeight="75vh"
				display="flex"
				flexDirection="column"
				width="100%"
			>
				<Heading fontSize="30px" mt={10} mb={10}>Admin Dashboard</Heading>

				<Box
					flex="1"
					display="flex"
					justifyContent="center"
					alignItems="center"
					width="100%"
					maxWidth="1200px" // Ensure the chart doesn’t stretch too much
					margin="0 auto"  // Centers the chart horizontally
				>
					{chartData && (
						<Box width="100%" height="auto">
							<Bar data={chartData} options={options} />
						</Box>
					)}
				</Box>

				<SimpleGrid columns={[1, null, 2]} spacing={4} mt={8}>
					<Box borderWidth={1} borderRadius="lg" p={4} m={2}>
						<Heading size="lg">User Management</Heading>
						<Text mt={2}>
							View and manage all users in the Recyclify system.
						</Text>
						<Button mt={4} bg={"#4DCBA4"} onClick={() => navigate("/admin/userManagement")}>
							View
						</Button>
					</Box>
					<Box borderWidth={1} borderRadius="lg" p={4} m={2}>
						<Heading size="lg">Inventory Management</Heading>
						<Text mt={2}>
							View all rewards offered in the Recyclify program.
						</Text>
						<Button mt={4} bg={"#4DCBA4"} onClick={() => navigate("/admin/inventoryManagement")}>
							View
						</Button>
					</Box>
					<Box borderWidth={1} borderRadius="lg" p={4} m={2}>
						<Heading size="lg">Events Management</Heading>
						<Text mt={2}>View and manage information on the Bulletin Board for parents in Recyclify.</Text>
						<Button mt={4} bg={"#4DCBA4"} onClick={() => navigate("/admin/eventsManagement")}>
							View
						</Button>
					</Box>
					<Box borderWidth={1} borderRadius="lg" p={4} m={2}>
						<Heading size="lg">View Contact Questions</Heading>
						<Text mt={2}>Review and respond to user inquiries.</Text>
						<Button mt={4} bg={"#4DCBA4"} onClick={() => navigate("/admin/contactManagement")}>
							View
						</Button>
					</Box>
				</SimpleGrid>
			</Box>
		</motion.div>
	);
}

export default Dashboard;
