import { useState } from 'react';
import { Box, VStack, Input, Button, Heading } from '@chakra-ui/react';
import Server from '../../../networking';
import ShowToast  from '../../Extensions/ShowToast';

const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Server.post(`/api/ContactForm`, {
                senderName: name,
                senderEmail: email,
                message,
            });
    
            if (response.status === 200) {
                if (response.data.message.startsWith("SUCCESS:")) {
                    let message = response.data.message.substring("SUCCESS: ".length);
                    ShowToast("success", "Success", message);
                }
                setName('');
                setEmail('');
                setMessage('');
            } else {
                ShowToast('error', 'Error', response.data.error || 'Failed to submit form');
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

    return (
        <Box as="form" onSubmit={handleSubmit} mt={10}>
                    <Heading fontSize={"30px"} m={10}>
                        Contact Us!
                    </Heading>
            <VStack spacing={4} align="stretch">
                <Box>
                    <Box as="label" htmlFor="name" mb={2} display="block" textAlign={"left"}>
                        Name:
                    </Box>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        background={"white"}
                        color={"black"}
                    />
                </Box>
                <Box>
                    <Box as="label" htmlFor="email" mb={2} display="block" textAlign={"left"}>
                        Email:
                    </Box>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        background={"white"}
                        color={"black"}
                    />
                </Box>
                <Box>
                    <Box as="label" htmlFor="message" mb={2} display="block" textAlign={"left"}>
                        Message:
                    </Box>
                    <Input
                        id="message"
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        background={"white"}
                        color={"black"}
                    />
                </Box>
                <Button type="submit" bg={"#4DCBA4"} mt={3}>Send</Button>
            </VStack>
        </Box>
        
    );
};

export default ContactForm;