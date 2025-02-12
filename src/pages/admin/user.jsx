import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Stack,
  Table,
  Heading,
  Input,
  HStack,
  Button,
  Box,
  Spinner,
  Text,
  useDisclosure,
  Textarea,
} from "@chakra-ui/react";
import { MdEdit, MdAdd } from "react-icons/md";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import ShowToast from "../../Extensions/ShowToast";
import Server from "../../../networking";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // Track the user being edited
  const { user, loaded, error } = useSelector((state) => state.auth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const subjectRef = useRef(null);
  useEffect(() => {
    if (!error && loaded && user && user.userRole == "admin") {
      fetchUsers();
    }
  }, [loaded]);
  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await Server.get(`/api/UserManagement`);

      if (response.status === 200) {
        setUsers(response.data.data);
        setIsLoading(false);
      } else {
        throw new Error(response.data.error || `Failed to fetch users`);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || error.message);
      setIsLoading(false);
    }
  };

  if (!loaded || isLoading) {
    return (
      <Box
        display="flex"
        flexDir={"column"}
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
      >
        <Spinner />
      </Box>
    );
  }

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit button click
  const handleEdit = (user) => {
    setEditingUser(user); // Set the user to be edited
  };

  const handleAdd = () => {
    onOpen();
  };

  // Handle save button click (update user)
  const handleSave = async () => {
    try {
      const response = await Server.put(
        `/api/UserManagement/${editingUser.id}`,
        editingUser,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user.id === response.data.data.id ? response.data.data : user
          )
        );
        setEditingUser(null);
        ShowToast("success", "Success", response.data.message);
      } else {
        throw new Error(response.data.error || "Failed to update user");
      }
    } catch (error) {
      ShowToast("error", "Error", error.response?.data?.error || error.message);
    }
  };

  return (
    <>
      <Stack gap="10">
        <Box textAlign="center">
          <Heading fontSize={"30px"} m={10}>
            User Management
          </Heading>
          <HStack justifyContent="center" mb="4">
            <Input
              placeholder="Search for users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="400px"
              background={"white"}
              align={"center"}
              color={"black"}
            />
            <DialogRoot isOpen={isOpen} onClose={onClose}>
              <DialogTrigger asChild>
                <Button
                  leftIcon={<MdAdd />} // Add icon
                  colorScheme="teal"
                  onClick={() => handleAdd()}
                >
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add User</DialogTitle>
                </DialogHeader>
                <DialogBody pb="4">
                  <Stack gap="4">
                    <Field label="Name">
                      <Input
                        value={editingUser?.name || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter full name"
                      />
                    </Field>
                    <Field label="First Name">
                      <Input
                        value={editingUser?.fName || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            fName: e.target.value,
                          })
                        }
                        placeholder="Enter first name"
                      />
                    </Field>
                    <Field label="Last Name">
                      <Input
                        value={editingUser?.LName || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            LName: e.target.value,
                          })
                        }
                        placeholder="Enter last name"
                      />
                    </Field>
                    <Field label="Email">
                      <Input
                        type="email"
                        value={editingUser?.email || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter email address"
                      />
                    </Field>
                    <Field label="Password">
                      <Input
                        type="password"
                        value={editingUser?.password || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            password: e.target.value,
                          })
                        }
                        placeholder="Enter password"
                      />
                    </Field>
                    <Field label="Contact Number">
                      <Input
                        type="tel"
                        value={editingUser?.contactNumber || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            contactNumber: e.target.value,
                          })
                        }
                        placeholder="Enter contact number"
                      />
                    </Field>
                    <Field label="User Role">
                      <Text>teacher</Text>
                    </Field>
                  </Stack>
                </DialogBody>

                <DialogFooter>
                  <Button
                    onClick={() => {
                      const subject = subjectRef.current.value;
                      const body = document.querySelector("textarea").value;
                      handleSendReply(subject, body);
                    }}
                  ></Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </HStack>
        </Box>
        {filteredUsers.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500">
              No users found.
            </Text>
            <DialogRoot isOpen={isOpen} onClose={onClose}>
              <DialogTrigger asChild>
                <Button
                  mt={4}
                  leftIcon={<MdAdd />}
                  colorScheme="teal"
                  onClick={() => console.log("Add User button clicked")}
                >
                  Add a New User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <DialogBody pb="4">
                  <Stack gap="4">
                    <Field label="name">
                      <Input
                        ref={subjectRef}
                        placeholder="Enter email subject"
                      />
                    </Field>
                    <Field label="fName">
                      <Textarea placeholder="Type your reply here" rows={5} />
                    </Field>
                    <Field label="LName">
                      <Textarea placeholder="Type your reply here" rows={5} />
                    </Field>
                    <Field label="email">
                      <Textarea placeholder="Type your reply here" rows={5} />
                    </Field>
                    <Field label="password">
                      <Textarea placeholder="Type your reply here" rows={5} />
                    </Field>
                    <Field label="contactNumber">
                      <Textarea placeholder="Type your reply here" rows={5} />
                    </Field>
                    <Field label="userRole">
                      <Textarea placeholder="Type your reply here" rows={5} />
                    </Field>
                  </Stack>
                </DialogBody>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      const subject = subjectRef.current.value;
                      const body = document.querySelector("textarea").value;
                      handleSendReply(subject, body);
                    }}
                  ></Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </Box>
        ) : (
          <Table.Root size="sm" showColumnBorder>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Contact Number</Table.ColumnHeader>
                <Table.ColumnHeader>User Role</Table.ColumnHeader>
                <Table.ColumnHeader>Action</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredUsers.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell color={"black"}>
                    <Box display="flex" alignItems="center">
                      <Box
                        borderRadius="full"
                        width="40px"
                        height="40px"
                        bg="pink.200"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mr="2"
                      >
                        {user.name[0]} {/* Placeholder for icon or initial */}
                      </Box>
                      {editingUser?.id === user.id ? (
                        <Input
                          value={editingUser.name}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        user.name
                      )}
                    </Box>
                  </Table.Cell>
                  <Table.Cell color={"black"}>
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.email
                    )}
                  </Table.Cell>
                  <Table.Cell color={"black"}>
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.contactNumber}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            contactNumber: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.contactNumber
                    )}
                  </Table.Cell>
                  <Table.Cell color={"black"}>
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.userRole}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            userRole: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user.userRole
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {editingUser?.id === user.id ? (
                      <Button colorScheme="teal" onClick={handleSave}>
                        Save
                      </Button>
                    ) : (
                      <HStack spacing={2}>
                        <Button
                          variant="link"
                          color="blue.500"
                          onClick={() => handleEdit(user)}
                        >
                          <MdEdit size={20} />
                        </Button>
                      </HStack>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Stack>
    </>
  );
};

export default UserManagement;
