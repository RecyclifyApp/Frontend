/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom'
import * as Yup from "yup"
import { useFormik } from 'formik';
import { VStack, Box, Button, Input, Text, Flex, } from "@chakra-ui/react"
import { LuUser, LuLock, LuIdCard, LuPhone, LuMail } from "react-icons/lu"
import { InputGroup } from "@/components/ui/input-group"
import { PasswordInput } from "@/components/ui/password-input"
import server from "../../../networking"
import ShowToast from '../../Extensions/ShowToast';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function StudentRegistrationForm({ goBack }) {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={siteKey}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: 'head',
            }}
        >
            <InnerStudentForm goBack={goBack} />
        </GoogleReCaptchaProvider>
    );
}

function InnerStudentForm({ goBack }) {
    const { executeRecaptcha } = useGoogleReCaptcha();
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
            .matches(/^\d{6}[A-Za-z]$/, "Email must be prefixed with student admin number")
            .required("Email is required"),
        contactNumber: Yup.string()
            .matches(/^\d+$/, "Contact must be a valid number")
            .required("Contact is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const handleSubmit = async (values) => {
        try {
            if (!executeRecaptcha) {
                ShowToast("error", "reCAPTCHA Error", "reCAPTCHA not loaded. Please refresh the page.");
                return;
            }
        
            const token = await executeRecaptcha('student_signup');
            
            const submissionData = { ...values, RecaptchaResponse: token };

            const response = await server.post("/api/Identity/createAccount", submissionData);
            const rawResponseMessage = response.data.message;
            if (rawResponseMessage.startsWith("SUCCESS") && response.status === 200) {
                const responseMessage = rawResponseMessage.substring("SUCCESS: ".length).trim()
                if (responseMessage === "Account created successfully.") {
                    localStorage.setItem('jwt', response.data.token);
                    ShowToast("success", "Account created successfully!");
                    if (response.data.qrCodeUrl) {
                        navigate("/auth/msAuth", { state: { qrCodeUrl: response.data.qrCodeUrl } })
                    } else {
                        navigate("/auth/emailVerification")
                        ShowToast("success", "Microsoft Authenticator QR Code unavailable.", "Please proceed with Email Verification.");
                    }
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
                ShowToast("error", "Invalid Input.", errorMessage)
            } else {
                console.error(err)
                ShowToast( "error", "Something went wrong.", "Please try again later.")
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
            password: '',
            confirmPassword: '',
            userRole: 'student',
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
            <Box width="100%" as="form" onSubmit={formik.handleSubmit} maxWidth="400px">
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

                    <InputGroup flex="1" startElement={<LuMail />} width="400px" endElement={"@mymail.nyp.edu.sg"}>
                        <Input
                            placeholder="Email"
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
                        loading={formik.isSubmitting}
                        loadingText={"Creating Account..."}
                    >
                        Get Started!
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
}

export default StudentRegistrationForm;