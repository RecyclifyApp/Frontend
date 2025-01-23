import * as Yup from "yup"
import { useFormik } from 'formik';
import { toaster } from "@/components/ui/toaster"
import { VStack, Box, Button, Input, Text, Flex } from "@chakra-ui/react"
import { InputGroup } from "@/components/ui/input-group"
import { LuUser, LuLock, LuIdCard, LuPhone, LuMail } from "react-icons/lu"
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/password-input"
import server from "../../../networking"
import { FaIdBadge } from "react-icons/fa";

function ParentRegistrationForm({ goBack }) {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        fname: Yup.string()
            .matches(/^[a-zA-Z\s]*$/, 'First Name cannot contain numbers')
            .required('First Name is required'),
        lname: Yup.string()
            .matches(/^[a-zA-Z\s]*$/, 'Last Name cannot contain numbers')
            .required('Last Name is required'),
        name: Yup.string()
            .matches(/^\S*$/, 'Username cannot contain spaces')
            .required('Username is required'),
        email: Yup.string()
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Invalid email address'
            )
            .required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
        contactNumber: Yup.string()
            .matches(/^[0-9]{8}$/, 'Contact number must be exactly 8 digits')
            .required('Contact number is required'),
        studentID: Yup.string()
            .required('StudentID is required')
    });

    const handleSubmit = async (values) => {
        try {
            const response = await server.post("/api/Identity/createAccount", values);
            const rawResponseMessage = response.data.message;
            if (rawResponseMessage.startsWith("SUCCESS")) {
                const responseMessage = rawResponseMessage.substring("SUCCESS: ".length).trim()
                if (responseMessage === "Account created successfully.") {
                    toaster.create({
                        title: "Account Created!",
                        description: "Please verify your email.",
                        type: "success",
                        duration: 3000
                    })
                    navigate("/auth/emailVerification")
                }
            }
        } catch (err) {
            const rawErrorMessage = err.response.data.error;
            if (rawErrorMessage.startsWith("UERROR")) {
                const errorMessage = rawErrorMessage.substring("UERROR: ".length).trim()
                if (errorMessage === "Username must be unique.") {
                    formik.setFieldError('name', 'Username already exists');
                } 
                if (errorMessage === "Email must be unique.") {
                    formik.setFieldError('email', 'Email already exists');
                } 
                if (errorMessage === "Contact number must be unique.") {
                    formik.setFieldError('contactNumber', 'Contact number already exists');
                } 
                if (errorMessage === "Invalid student ID.") {
                    formik.setFieldError('studentID', 'Invalid StudentID');
                }
                toaster.create({
                    title: "Invalid Input.",
                    description: errorMessage,
                    type: "error",
                    duration: 3000
                })
            } else {
                console.log(err)
                toaster.create({
                    title: "Something went wrong.",
                    description: "Please try again later.",
                    type: "error",
                    duration: 3000
                })
            }
        }
    }

    const formik = useFormik({
        initialValues: {
            fname: '',
            lname: '',
            name: '',
            email: '',
            contactNumber: '',
            studentID: '',
            password: '',
            confirmPassword: '',
            userRole: 'parent',
            avatar: ''
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <Flex direction="column" align="center" width="100%" p={4} mt={5}>
            <Flex width="100%" justify="flex-start" mb={4}>
                <Button variant="ghost" onClick={goBack}>
                    ← Back
                </Button>
            </Flex>
            <Box as="form" onSubmit={formik.handleSubmit} width="400px" >
                <VStack gap={4} align="stretch">
                    <InputGroup flex="1" startElement={<LuUser />} width="400px">
                        <Input
                            placeholder="Username (Display Name)"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputGroup>
                    <Text
                        fontSize={"12px"}
                        color={"red"}
                        display={formik.touched.name && formik.errors.name ? "block" : "none"}
                        mt={"-10px"}
                        textAlign={"left"}
                        ml={2}
                    >
                        {formik.errors.name}
                    </Text>
                    
                    <InputGroup flex="1" startElement={<LuIdCard />} width="400px">
                        <Input
                            placeholder="First Name"
                            name="fname"
                            value={formik.values.fname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputGroup>
                    <Text
                        fontSize={"12px"}
                        color={"red"}
                        display={formik.touched.fname && formik.errors.fname ? "block" : "none"}
                        mt={"-10px"}
                        textAlign={"left"}
                        ml={2}
                    >
                        {formik.errors.fname}
                    </Text>

                    <InputGroup flex="1" startElement={<LuIdCard />} width="400px">
                        <Input
                            placeholder="Last Name"
                            name="lname"
                            value={formik.values.lname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputGroup>
                    <Text
                        fontSize={"12px"}
                        color={"red"}
                        display={formik.touched.lname && formik.errors.lname ? "block" : "none"}
                        mt={"-10px"}
                        textAlign={"left"}
                        ml={2}
                    >
                        {formik.errors.lname}
                    </Text>

                    <InputGroup flex="1" startElement={<LuMail />} width="400px">
                        <Input
                            placeholder="Email"
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputGroup>
                    <Text
                        fontSize={"12px"}
                        color={"red"}
                        display={formik.touched.email && formik.errors.email ? "block" : "none"}
                        mt={"-10px"}
                        textAlign={"left"}
                        ml={2}
                    >
                        {formik.errors.email}
                    </Text>

                    <InputGroup flex="1" startElement={<LuPhone />} width="400px">
                        <Input
                            placeholder="Contact"
                            type="tel"
                            name="contactNumber"
                            value={formik.values.contactNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputGroup>
                    <Text
                        fontSize={"12px"}
                        color={"red"}
                        display={formik.touched.contactNumber && formik.errors.contactNumber ? "block" : "none"}
                        mt={"-10px"}
                        textAlign={"left"}
                        ml={2}
                    >
                        {formik.errors.contactNumber}
                    </Text>

                    <InputGroup flex="1" startElement={<FaIdBadge />} width="400px">
                        <Input
                            placeholder="Child ID"
                            name="studentID"
                            value={formik.values.studentID}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputGroup>
                    <Text
                        fontSize={"12px"}
                        color={"red"}
                        display={formik.touched.studentID && formik.errors.studentID ? "block" : "none"}
                        mt={"-10px"}
                        textAlign={"left"}
                        ml={2}
                    >
                        {formik.errors.studentID}
                    </Text>

                    <InputGroup flex="1" startElement={<LuLock />} width="400px">
                        <PasswordInput
                            placeholder="Password"
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputGroup>
                    <Text
                        fontSize={"12px"}
                        color={"red"}
                        display={formik.touched.password && formik.errors.password ? "block" : "none"}
                        mt={"-10px"}
                        textAlign={"left"}
                        ml={2}
                    >
                        {formik.errors.password}
                    </Text>

                    <InputGroup flex="1" startElement={<LuLock />} width="400px">
                        <PasswordInput
                            placeholder="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputGroup>
                    <Text
                        fontSize={"12px"}
                        color={"red"}
                        display={formik.touched.confirmPassword && formik.errors.confirmPassword ? "block" : "none"}
                        mt={"-10px"}
                        textAlign={"left"}
                        ml={2}
                    >
                        {formik.errors.confirmPassword}
                    </Text>

                    <Button
                        variant="solid"
                        background="#2D65FF"
                        color={"white"}
                        width="50%"
                        type="submit"
                        borderRadius={30}
                        mt={5}
                        alignSelf="center"
                        isLoading={formik.isSubmitting}
                    >
                        Get Started!
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
}

export default ParentRegistrationForm;