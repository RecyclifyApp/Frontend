/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import server from "../../../networking";

const UserManagamentProfilePictureIcon = ({ userId }) => {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [renderReady, setRenderReady] = useState(false);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                if (userId) {
                    const response = await server.get(`/api/Identity/getAvatar?userId=${userId}`);
                    console.log(response.data.avatarUrl);
                    if (response.data.avatarUrl) {
                        setAvatarUrl(response.data.avatarUrl);
                    } else {
                        setAvatarUrl(null);
                    }
                } else {
                    setAvatarUrl(null);
                }
            } catch (error) {
                console.error("Error fetching avatar:", error);
                setAvatarUrl(null);
            }
            setRenderReady(true);
        };
        
        if (userId) fetchAvatar();
    }, [userId]);
    
    if (!renderReady) return null;

    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    boxSize="35px"
                    borderRadius="full"
                    alt="User Avatar"
                />
            ) : (
                <Box as={CgProfile} boxSize="35px" />
            )}
        </Box>
    );
};

export default UserManagamentProfilePictureIcon;