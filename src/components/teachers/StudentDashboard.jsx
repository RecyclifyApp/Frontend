/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Tabs, Box, Flex, Button, Text, Stack, Field, Input, Image, defineStyle } from '@chakra-ui/react';
import { MdDelete, MdEdit, MdOutlineMoreVert, MdOutlineEmail } from 'react-icons/md';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu';
import { DialogActionTrigger, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toaster } from "@/components/ui/toaster"
import server from "../../../networking"
import ShowToast from '../../Extensions/ShowToast';
import { PiArrowLineDownFill, PiArrowLineUpFill } from "react-icons/pi";

function StudentDashboard({ classData, students }) {
    const { user, loaded, error } = useSelector((state) => state.auth);
    const [sortOrder, setSortOrder] = useState({
        name: '',
        league: '',
        currentPoints: '',
        totalPoints: '',
        redemptions: '',
        studentEmail: '',
        parentEmail: '',
    });
    const [studentsList, setStudentsList] = useState(students || []);
    const [editedStudent, setEditedStudent] = useState({
        fName: '',
        lName: '',
        studentEmail: '',
    });

    const [validationError, setValidationError] = useState({
        fName: '',
        lName: '',
        studentEmail: '',
    });
    const [open, setOpen] = useState(false);
    const [selectedRecipients, setSelectedRecipients] = useState([]);

    const handleSort = (column) => {
        const newSortOrder = sortOrder[column] === 'asc' ? 'desc' : 'asc';

        // Update sort order only for the clicked column
        setSortOrder({
            [column]: newSortOrder,
        });

        // Sort the students list based on the selected column
        const sortedStudents = [...studentsList].sort((a, b) => {
            let valueA, valueB;

            if (column === 'name') {
                valueA = a.user.name;
                valueB = b.user.name;
            } else if (column === 'studentEmail') {
                valueA = a.user.email || 'N/A';
                valueB = b.user.email || 'N/A';
            } else if (column === 'parentEmail') {
                valueA = a.parent?.parentEmail || 'N/A';
                valueB = b.parent?.parentEmail || 'N/A';
            } else {
                valueA = a[column];
                valueB = b[column];
            }

            // Handle sorting based on string or numeric values
            if (newSortOrder === 'asc') {
                if (typeof valueA === 'string') {
                    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
                }
                return valueA - valueB;
            } else {
                if (typeof valueA === 'string') {
                    return valueB.toLowerCase().localeCompare(valueA.toLowerCase());
                }
                return valueB - valueA;
            }
        });

        // Update the students list with the sorted list
        setStudentsList(sortedStudents);
    };

    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(name)) {
            return 'Name can only contain letters and spaces.';
        }
        if (name.length > 40) {
            return 'Name cannot be more than 40 character.';
        }
        return '';
    };

    // Function to validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address.';
        }
        if (email.length > 60) {
            return 'Email cannot be more than 60 character.';
        }
        return '';
    };

    const tableCellColorList = ["#EDEEFC", "#E6F1FD"];

    const floatingStyles = defineStyle({
        pos: "absolute",
        bg: "bg",
        px: "0.5",
        top: "-3",
        insetStart: "2",
        fontWeight: "normal",
        pointerEvents: "none",
        transition: "position",
        _peerPlaceholderShown: {
            color: "fg.muted",
            top: "2.5",
            insetStart: "3",
        },
        _peerFocusVisible: {
            color: "black",
            top: "-3",
            insetStart: "2",
        },
    })

    // Function to open the edit dialog with the selected student's details
    const handleEditStudent = (student) => {
        setEditedStudent({
            studentID: student.studentID,
            fName: student.user.fName || '',
            lName: student.user.lName || '',
            studentEmail: student.user.email,
        });
        setOpen(true);
    };

    // Function to reset the edited student state
    const resetEditedStudent = () => {
        setEditedStudent({
            fName: '',
            lName: '',
            studentEmail: '',
        });
        setOpen(false);
    };

    // Function to handle changes in the edit dialog fields
    const handleChange = (field, value) => {
        let error = '';
        if (field === 'fName' || field === 'lName') {
            error = validateName(value);
        } else if (field === 'studentEmail') {
            error = validateEmail(value);
        }

        setValidationError((prev) => ({
            ...prev,
            [field]: error,
        }));

        setEditedStudent((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Fetch students data from the backend
    const fetchStudents = async () => {
        try {
            const response = await server.get(`/api/Teacher/get-students/?classId=${classData.classID}`);
            if (response.status === 200) {
                setStudentsList(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            setStudentsList([]);
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

    // Function to save the edited student details
    const handleSaveEdit = async () => {
        if (validationError.fName || validationError.lName || validationError.studentEmail) {
            console.error('Validation errors:', validationError);
            return;
        }

        try {
            const response = await server.put(`/api/Teacher/update-student`, null, {
                params: {
                    studentID: editedStudent.studentID,
                    fName: editedStudent.fName,
                    lName: editedStudent.lName,
                    studentEmail: editedStudent.studentEmail,
                },
            });

            if (response.status === 200) {
                ShowToast("success", "Student successfully updated.");
                await fetchStudents();
                setOpen(false);
            }
        } catch (error) {
            console.error('Error updating student: ', error.message);
            setOpen(true);
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

    const handleDeleteStudent = async (studentId) => {
        try {
            const response = await server.delete(`/api/Teacher/delete-student/?studentID=${studentId}`);

            if (response.status === 200) {
                ShowToast("success", "Student successfully deleted.");
                await fetchStudents();
            }
        } catch (error) {
            console.error("Error deleting student.", error.message);
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

    // Function to handle checkbox change
    const handleCheckboxChange = (value) => {
        setSelectedRecipients((prevRecipients) => {
            const updatedRecipients = prevRecipients.includes(value)
                ? prevRecipients.filter((recipient) => recipient !== value)
                : [...prevRecipients, value];

            return updatedRecipients;
        });
    };

    const sendEmail = async (student) => {
        if (selectedRecipients.length === 0) return;

        // Build query string
        const queryParams = new URLSearchParams({
            recipients: selectedRecipients.join(","),
            classID: classData.classID,
            studentID: student.studentID,
            studentEmail: student.user.email,
            parentID: student.parentID ? student.parentID : "",
            parentEmail: student.parent ? student.parent.parentEmail : "",
        }).toString();

        // Create the promise that sends the email
        const emailPromise = new Promise((resolve, reject) => {
            server
                .post(`/api/Teacher/send-update-email?${queryParams}`)
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedRecipients([]);
                        resolve();
                    } else {
                        reject(
                            response.data.error
                                ? response.data.error.substring("ERROR: ".length)
                                : "Unexpected error occurred."
                        );
                    }
                })
                .catch((error) => {
                    console.error("Error sending email:", error.message);
                    setSelectedRecipients([]);
                    if (
                        error.response &&
                        error.response.data &&
                        error.response.data.error &&
                        typeof error.response.data.error === "string"
                    ) {
                        if (error.response.data.error.startsWith("UERROR")) {
                            reject(
                                error.response.data.error.substring("UERROR: ".length)
                            );
                        } else {
                            reject(
                                error.response.data.error.substring("ERROR: ".length)
                            );
                        }
                    } else {
                        reject("An unexpected error occurred.");
                    }
                });
        });

        // Use toaster.promise to show notifications based on the promise outcome
        toaster.promise(emailPromise, {
            loading: {
                title: "Sending email...",
                description: "Please wait and don't leave this page.",
            },
            success: {
                title: "Email sent successfully!",
                description: "The email has been delivered.",
            },
            error: (errorMessage) => ({
                title: "Error sending email",
                description: errorMessage,
            }),
        });
    };

    const isFormInvalid = !!validationError.fName || !!validationError.lName || !!validationError.studentEmail || !editedStudent.fName.trim() || !editedStudent.lName.trim() || !editedStudent.studentEmail.trim();

    useEffect(() => {
        if (!error && loaded && user && user.userRole == "teacher") {
            if (classData !== null && classData !== undefined) {
                if (classData.classID) {
                    fetchStudents();
                }
            }
        }
    }, [loaded, classData && students]);

    if (classData != null && classData != undefined && students != null && students != null) {
        return (
            <Tabs.Content value='Students'>
                <Box w="100%" h="65dvh" p={4} bg="#9F9FF8" borderRadius="xl" boxShadow="md">
                    <Table.ScrollArea rounded="md" w="100%" h="100%" overflowY="auto" borderRadius="xl">
                        <Table.Root size="sm" stickyHeader>
                            <Table.Header>
                                <Table.Row bg="bg.subtle">
                                    <Table.ColumnHeader onClick={() => handleSort('name')}>
                                        <Flex align="center" gap={2}>
                                            Student Name
                                            {sortOrder.name && (sortOrder.name === 'asc' ? <PiArrowLineUpFill /> : <PiArrowLineDownFill />)}
                                        </Flex>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader onClick={() => handleSort('league')}>
                                        <Flex align="center" gap={2}>
                                            League
                                            {sortOrder.league && (sortOrder.league === 'asc' ? <PiArrowLineUpFill /> : <PiArrowLineDownFill />)}
                                        </Flex>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader onClick={() => handleSort('currentPoints')}>
                                        <Flex align="center" gap={2}>
                                            Current Points
                                            {sortOrder.currentPoints && (sortOrder.currentPoints === 'asc' ? <PiArrowLineUpFill /> : <PiArrowLineDownFill />)}
                                        </Flex>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader onClick={() => handleSort('totalPoints')}>
                                        <Flex align="center" gap={2}>
                                            Total Points
                                            {sortOrder.totalPoints && (sortOrder.totalPoints === 'asc' ? <PiArrowLineUpFill /> : <PiArrowLineDownFill />)}
                                        </Flex>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader onClick={() => handleSort('redemptions')}>
                                        <Flex align="center" gap={2}>
                                            Redemptions
                                            {sortOrder.redemptions && (sortOrder.redemptions === 'asc' ? <PiArrowLineUpFill /> : <PiArrowLineDownFill />)}
                                        </Flex>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader onClick={() => handleSort('studentEmail')}>
                                        <Flex align="center" gap={2}>
                                            Student Email
                                            {sortOrder.studentEmail && (sortOrder.studentEmail === 'asc' ? <PiArrowLineUpFill /> : <PiArrowLineDownFill />)}
                                        </Flex>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader onClick={() => handleSort('parentEmail')}>
                                        <Flex align="center" gap={2}>
                                            Parent Email
                                            {sortOrder.parentEmail && (sortOrder.parentEmail === 'asc' ? <PiArrowLineUpFill /> : <PiArrowLineDownFill />)}
                                        </Flex>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {/* check students list, if there are no students just go to fallback, or else just render the students details in the dashboard */}
                                {studentsList.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={8}>
                                            <Text textAlign="center" color="gray.500">
                                                No students enrolled in this class.
                                            </Text>
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    studentsList.map((student, index) => (
                                        <Table.Row key={student.studentID} bg={index % 2 === 0 ? tableCellColorList[0] : tableCellColorList[1]}>
                                            <Table.Cell color="black">
                                                <Flex gap={2} align="center">
                                                    {student.user.fName} {student.user.lName}
                                                </Flex>
                                            </Table.Cell>
                                            <Table.Cell color="black">
                                                <Image src={student.league === "Gold" ? "/gold-medal.png" : student.league === "Silver" ? "/silver-medal.png" : "/bronze-medal.png"} alt={student.league} w="30px" h="30px" />
                                            </Table.Cell>
                                            <Table.Cell color="black">{student.currentPoints}</Table.Cell>
                                            <Table.Cell color="black">{student.totalPoints}</Table.Cell>
                                            <Table.Cell color="black">{student.redemptions.length > 0 ? student.redemptions.length : 0}</Table.Cell>
                                            <Table.Cell color="black">{student.user.email ? student.user.email : "N/A"}</Table.Cell>
                                            <Table.Cell color="black">{student.parent != null && student.parent.parentEmail ? student.parent.parentEmail : "N/A"}</Table.Cell>
                                            <Table.Cell>
                                                <MenuRoot positioning={{ placement: 'left-start' }} cursor="pointer">
                                                    <MenuTrigger asChild>
                                                        <Box
                                                            bg={index % 2 === 0 ? tableCellColorList[0] : tableCellColorList[1]}
                                                            p="2"
                                                            borderRadius="full"
                                                            cursor="pointer"
                                                        >
                                                            <MdOutlineMoreVert size={24} color="black" />
                                                        </Box>
                                                    </MenuTrigger>
                                                    <MenuContent
                                                        borderRadius="xl"
                                                        transition="box-shadow 0.3s ease, border-color 0.3s ease"
                                                        transitionDelay="0.1s"
                                                        _hover={{
                                                            boxShadow: 'lg',
                                                            border: '1px solid',
                                                            borderColor: 'gray.200',
                                                        }}
                                                    >
                                                        <DialogRoot size="lg" isOpen={open} onClose={resetEditedStudent}>
                                                            <DialogTrigger >
                                                                <MenuItem
                                                                    bg="white"
                                                                    value="edit-student-details"
                                                                    closeOnSelect={false}
                                                                    cursor="pointer"
                                                                    onClick={() => handleEditStudent(student)}
                                                                >
                                                                    <MdEdit /> Edit Student
                                                                </MenuItem>
                                                            </DialogTrigger>
                                                            <DialogContent >
                                                                <DialogHeader>
                                                                    <DialogTitle color="black" fontWeight="bold" textAlign="left">
                                                                        Edit Student Details
                                                                    </DialogTitle>
                                                                </DialogHeader>
                                                                <DialogBody>
                                                                    <Stack direction="column" gap={8}>
                                                                        <Field.Root>
                                                                            <Box pos="relative" w="full">
                                                                                <Input
                                                                                    className="student-fname"
                                                                                    value={editedStudent.fName}
                                                                                    onChange={(e) => handleChange('fName', e.target.value)}
                                                                                    borderColor={validationError.fName ? 'red.500' : 'gray.300'}
                                                                                />
                                                                                <Field.Label css={floatingStyles}>First Name</Field.Label>
                                                                                {validationError.fName && (
                                                                                    <Text color="red.500" fontSize="sm" mt={1}>
                                                                                        * {validationError.fName}
                                                                                    </Text>
                                                                                )}
                                                                            </Box>
                                                                        </Field.Root>

                                                                        {/* Last Name Field */}
                                                                        <Field.Root>
                                                                            <Box pos="relative" w="full">
                                                                                <Input
                                                                                    className="student-lname"
                                                                                    value={editedStudent.lName}
                                                                                    onChange={(e) => handleChange('lName', e.target.value)}
                                                                                    borderColor={validationError.lName ? 'red.500' : 'gray.300'}
                                                                                />
                                                                                <Field.Label css={floatingStyles}>Last Name</Field.Label>
                                                                                {validationError.lName && (
                                                                                    <Text color="red.500" fontSize="sm" mt={1}>
                                                                                        * {validationError.lName}
                                                                                    </Text>
                                                                                )}
                                                                            </Box>
                                                                        </Field.Root>
                                                                        <Field.Root>
                                                                            <Box pos="relative" w="full">
                                                                                <Input
                                                                                    className="student-email"
                                                                                    value={editedStudent.studentEmail}
                                                                                    onChange={(e) => handleChange('studentEmail', e.target.value)}
                                                                                />
                                                                                <Field.Label css={floatingStyles}>Student Email</Field.Label>
                                                                                {validationError.studentEmail && (
                                                                                    <Text color="red.500" fontSize="sm" mt={1}>
                                                                                        * {validationError.studentEmail}
                                                                                    </Text>
                                                                                )}
                                                                            </Box>
                                                                        </Field.Root>
                                                                    </Stack>
                                                                </DialogBody>

                                                                <DialogFooter display="flex" gap={10} justifyContent="center">
                                                                    <DialogActionTrigger asChild>
                                                                        <Button bg="red" color="white" onClick={resetEditedStudent}>
                                                                            Cancel
                                                                        </Button>
                                                                    </DialogActionTrigger>
                                                                    <DialogActionTrigger asChild>
                                                                        <Button bg="#2D65FF" color="white" onClick={handleSaveEdit} disabled={isFormInvalid}>
                                                                            Save
                                                                        </Button>
                                                                    </DialogActionTrigger>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </DialogRoot>
                                                        {(student.user.email || (student.parent && student.parent.parentEmail)) && (
                                                            <DialogRoot size="lg">
                                                                <DialogTrigger asChild>
                                                                    <MenuItem value="copy-uuid" borderRadius="xl" mt={2} cursor="pointer" closeOnSelect={false}>
                                                                        <MdOutlineEmail /> Send Email
                                                                    </MenuItem>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle color="black" fontWeight="bold" textAlign="center">
                                                                            Choose the email recipient:
                                                                        </DialogTitle>
                                                                    </DialogHeader>
                                                                    <DialogBody textAlign="center">
                                                                        <Text color="#FF0000" mb={4}>
                                                                            The system will automatically generate an email to the selected recipient
                                                                        </Text>
                                                                        <Stack spacing={4} align="start" width="20%" mx="auto">
                                                                            <Checkbox onChange={() => handleCheckboxChange("students")} size="lg" mb={2} colorPalette="green" disabled={!student.user.email}>
                                                                                Students
                                                                            </Checkbox>
                                                                            <Checkbox onChange={() => handleCheckboxChange("parents")} size="lg" mb={2} colorPalette="green" disabled={student.parent == null || !student.parent.parentEmail}>
                                                                                Parents
                                                                            </Checkbox>
                                                                        </Stack>
                                                                    </DialogBody>
                                                                    <DialogFooter display="flex" gap={10} justifyContent="center">
                                                                        <DialogActionTrigger asChild>
                                                                            <Button variant="subtle" color="white" bg="#FF0000" >
                                                                                Cancel
                                                                            </Button>
                                                                        </DialogActionTrigger>
                                                                        <DialogActionTrigger asChild>
                                                                            <Button bg="#2D65FF" color="white" onClick={() => sendEmail(student)} disabled={selectedRecipients.length === 0}>
                                                                                Send
                                                                            </Button>
                                                                        </DialogActionTrigger>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </DialogRoot>
                                                        )}
                                                        <DialogRoot size="lg">
                                                            <DialogTrigger asChild>
                                                                <MenuItem value="delete-class" bg="#FF8080" borderRadius="xl" closeOnSelect={false} mt={2} cursor="pointer">
                                                                    <MdDelete /> Remove
                                                                </MenuItem>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle color="black" fontWeight="bold" textAlign="center">
                                                                        Are you sure you want to remove this student from this class?
                                                                    </DialogTitle>
                                                                </DialogHeader>
                                                                <DialogBody color="#FF0000" textAlign="center">
                                                                    <Text>
                                                                        The student can enroll back to this class again using the class UUID
                                                                    </Text>
                                                                </DialogBody>
                                                                <DialogFooter display="flex" gap={10} justifyContent="center">
                                                                    <DialogActionTrigger asChild>
                                                                        <Button bg="#2D65FF" color="white">
                                                                            Cancel
                                                                        </Button>
                                                                    </DialogActionTrigger>
                                                                    <DialogActionTrigger asChild>
                                                                        <Button bg="red" color="white" onClick={() => handleDeleteStudent(student.studentID)}>
                                                                            Remove
                                                                        </Button>
                                                                    </DialogActionTrigger>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </DialogRoot>
                                                    </MenuContent>
                                                </MenuRoot>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                </Box>
            </Tabs.Content>
        );
    }
}

export default StudentDashboard;
