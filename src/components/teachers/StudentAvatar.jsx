/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import server from "../../../networking";
import ShowToast from "../../Extensions/ShowToast";

const StudentAvatar = ({ student, size}) => {
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        const fetchAvatar = async () => {
            if (!student?.studentID || !(student?.user?.avatar || student?.avatar)) return;
            try {
                const response = await server.get(`/api/Identity/getAvatar?userId=${student.studentID}`);
                if (response.data.avatarUrl) {
                    setAvatarUrl(response.data.avatarUrl);
                }
            } catch (error) {
                console.error("Error fetching avatar:", error);
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

        fetchAvatar();
    }, [student?.studentID]);

    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    boxSize={size ? size : "35px"}
                    borderRadius="full"
                    alt="User Avatar"
                />
            ) : (
                <Box as={CgProfile} boxSize={size ? size : "35px"} />
            )}
        </Box>
    );
};

export default StudentAvatar;