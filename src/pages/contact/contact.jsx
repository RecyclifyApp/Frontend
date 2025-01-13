import { useState } from 'react';
import { Box, VStack, Input, Textarea, Button } from '@chakra-ui/react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Box>
          <Box as="label" htmlFor="name" mb={2} display="block">
            Name:
          </Box>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            background={"white"}
            color={"black"} // Set text color to black
          />
        </Box>
        <Box>
          <Box as="label" htmlFor="email" mb={2} display="block">
            Email:
          </Box>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            background={"white"}
            color={"black"} // Set text color to black
          />
        </Box>
        <Box>
          <Box as="label" htmlFor="message" mb={2} display="block">
            Message:
          </Box>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            background={"white"}
            color={"black"} // Set text color to black
          />
        </Box>
        <Button type="submit" background={'teal'}>Send</Button>
      </VStack>
    </Box>
  );
};

export default ContactForm;