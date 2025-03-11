/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Heading, Tabs, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import server from '../../../networking';
import ShowToast from '../../Extensions/ShowToast';
import NotificationRow from '../../components/Students/NotificationRow';

function StudentInbox() {
	const { user, loaded, error } = useSelector((state) => state.auth);
	const [inboxMessages, setInboxMessages] = useState([]);

	const fetchMessages = async (studentID) => {
		try {
			const response = await server.get(
				`/api/student/get-student-inbox-messages/?studentID=${studentID}`
			);
			if (response.status === 200) {
				const messages = response.data.data;
				setInboxMessages(messages);
			}
		} catch (error) {
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

	useEffect(() => {
		if (!error && loaded && user && user.userRole === "student") {
			fetchMessages(user.id);
		}
	}, [loaded]);

	if (!error && loaded && user) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Box display="flex" justifyContent="center" flexDir="column" mt={10} mb={10}>
					<Heading fontSize="30px">Inbox</Heading>
				</Box>

				<Tabs.Root defaultValue="All" colorPalette="blue">
					<Tabs.List>
						<Tabs.Trigger value="All" bg="none">
							All {inboxMessages.length > 0 && <Badge ml={2}>{inboxMessages.length}</Badge>}
						</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="All">
						{inboxMessages.length > 0 ? (
							inboxMessages.map((message) => (
								<NotificationRow key={message.id} message={message} />
							))
						) : (
							<Box textAlign="center" mt={4}>
								No inbox messages
							</Box>
						)}
					</Tabs.Content>
				</Tabs.Root>
			</motion.div>
		);
	}
}

export default StudentInbox;