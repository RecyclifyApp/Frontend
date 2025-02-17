import { useState } from "react";
import Server from "../../../networking";
import { Box, Heading, List, ListItem, CardBody, Input, Button, Stack, Text, Flex, Icon, Spinner, CardRoot } from "@chakra-ui/react";
import { FaRobot, FaArrowRight } from "react-icons/fa";
import ShowToast from "../../Extensions/ShowToast";
const EcoPilot = () => {
    const [inputValue, setInputValue] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSuggestionClick = (topic) => {
        setInputValue(`${topic}? `);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputValue.trim()) {
            ShowToast("Please enter a question", "error");
            return;
        }
        setLoading(true);
        setResponse("");

        try {
            const result = await Server.post(`/api/chat-completion/prompt`, {
                userPrompt: inputValue
            });
            setResponse(result.data);
        } catch (error) {
            console.error("Error fetching response:", error);
            ShowToast("An error occurred while fetching response", "error");
        } finally {
            setLoading(false);
        }
    };

    const suggestedTopics = [
        "How does recycling work?",
        "What does a student need to do to earn leafs?",
        "Understanding leafs",
        "Leaderboard system explained",
        "Contact support team"
    ];

    return (
        <Flex p={8} maxW="1400px" mx="auto" gap={8} direction={{ base: "column", md: "row" }} minH="80vh">
            {/* Left Sidebar */}
            <Box w={{ base: "100%", md: "30%" }} bg="teal.50" borderRadius="xl" p={6} boxShadow="md">
                <Flex direction="column" alignItems="center" mb={8}>
                    <Icon as={FaRobot} boxSize={10} color="teal.600" />
                    <Text fontSize="2xl" fontWeight="bold" color="teal.800" mt={3}>EcoPilot Guide</Text>
                </Flex>

                <Heading as="h3" size="md" mb={4} color="teal.800">Quick Questions</Heading>
                <List.Root spacing={3} style={{ listStyleType: "none" }}>
                {suggestedTopics.map((topic, index) => (
                    <ListItem
                        key={index}
                        bg="white"
                        borderRadius="lg"
                        p={4}
                        m={2}
                        cursor="pointer"
                        _hover={{ bg: "teal.100", transform: "translateX(8px)" }}
                        transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                        onClick={() => handleSuggestionClick(topic)}
                        boxShadow="sm"
                    >
                        <Text fontSize="md" color="teal.800" fontWeight="500">{topic}</Text>
                    </ListItem>
                ))}
            </List.Root>

            </Box>

            {/* Main Chat Area */}
            <Box flex={1} bg="white" borderRadius="2xl" >
                <CardRoot borderRadius="2xl">
                    <CardBody p={8}>
                    <Flex align="center" justify="center" mb={8}>
                            <Icon as={FaRobot} boxSize={8} color="teal.600" mr={3} />
                            <Heading as="h2" size="xl" color="teal.800" textAlign="center">
                                Ask EcoPilot
                            </Heading>
                        </Flex>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={6}>
                                <Input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    placeholder="Ask me anything about sustainability, recycling, or your eco-points..."
                                    bg="gray.50"
                                    borderRadius="lg"
                                    size="lg"
                                    _focus={{
                                        borderColor: "teal.500",
                                        boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.2)",
                                        bg: "white"
                                    }}
                                    isDisabled={loading}
                                    height="60px"
                                    fontSize="lg"
                                />
                                
                                <Flex justify="flex-end">
                                    <Button
                                        type="submit"
                                        bg={"#4DCBA4"}
                                        size="lg"
                                        px={10}
                                        isLoading={loading}
                                        loadingText="Analyzing..."
                                        rightIcon={<FaArrowRight />}
                                        isDisabled={loading || !inputValue.trim()}
                                        borderRadius="xl"
                                        fontWeight="bold"
                                        bgGradient="linear(to-r, teal.400, teal.600)"
                                        _hover={{ bgGradient: "linear(to-r, teal.500, teal.700)" }}
                                    >
                                        Ask Now
                                    </Button>
                                </Flex>
                            </Stack>
                        </form>

                        {loading && (
                            <Flex justify="center" align="center" mt={10} mb={6}>
                                <Spinner size="xl" color="teal.500" thickness="3px" />
                                <Text ml={4} color="teal.600" fontWeight="500">EcoPilot is thinking...</Text>
                            </Flex>
                        )}

                        {response && !loading && (
                            <Box mt={8} p={6} bg="teal.50" borderRadius="xl" borderLeft="4px solid" borderColor="teal.500">
                                <Flex align="center" mb={3}>
                                    <Icon as={FaRobot} color="teal.600" mr={2} />
                                    <Text fontSize="lg" fontWeight="600" color="teal.800">EcoPilot Response:</Text>
                                </Flex>
                                <Text fontSize="md" color="teal.700" lineHeight="tall">
                                    {response}
                                </Text>
                            </Box>
                        )}
                    </CardBody>
                </CardRoot>
            </Box>
        </Flex>
    );
};

export default EcoPilot;