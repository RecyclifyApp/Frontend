import { Box, Grid, Heading } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import BulletinCard from '../../components/parents/BulletinCard';
import { useState, useEffect } from 'react';
import server from "../../../networking"
import ShowToast from '../../Extensions/ShowToast';

function ParentsHomepage() {
    const { user, loaded, error } = useSelector((state) => state.auth);
    
    // State to hold events
    const [events, setEvents] = useState([]);
    
    // State for loading and error
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Fetch events from API
    useEffect(() => {
        if (!error && loaded && user && user.userRole === "parent") {
            const fetchEvents = async () => {
                try {
                    const response = await server.get("/api/events");

                    // Check the status and fetch the events
                    if (response.status !== 200) {
                        throw new Error('Failed to fetch events');
                    }
                    // Directly use response.data to get events
                    setEvents(response.data.events);
                } catch (err) {
                    setFetchError(err.message);
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
            
            fetchEvents();
        }
    }, [loaded, user, error]);

    // Check if it's still loading or if there's an error
    if (loading) {
        return <Box textAlign="center">Loading events...</Box>;
    }

    if (fetchError) {
        return <Box textAlign="center">Error: {fetchError}</Box>;
    }

    return (
        <Box textAlign="center" fontSize="xl">
            <Heading fontSize="30px" mt={10}>Events Bulletin</Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} mt={2}>
                {events.map((event, index) => (
                    <BulletinCard
                        index={index}
                        key={event.id} // Use event.id for a more unique key
                        title={event.title}
                        date={new Date(event.eventDateTime).toLocaleDateString()}
                        description={event.description}
                        image={event.imageUrl || 'https://picsum.photos/id/11/200/300'} // Default image if no URL
                    />
                ))}
            </Grid>
        </Box>
    );
}

export default ParentsHomepage;
