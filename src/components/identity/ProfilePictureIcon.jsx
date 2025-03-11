/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../../slices/AuthState";
import { Button, Box, Image } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import server from "../../../networking";
import ShowToast from "../../Extensions/ShowToast";

const ProfilePictureIcon = ({ onLogout }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loaded, error } = useSelector((state) => state.auth);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [renderReady, setRenderReady] = useState(false)

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                if (user?.avatar) {
                    const response = await server.get(`/api/Identity/getAvatar?userId=${user.id}`);
                    if (response.data.avatarUrl) {
                        setAvatarUrl(response.data.avatarUrl);
                        setRenderReady(true)
                    }
                } else {
                    setAvatarUrl(null);
                    setRenderReady(true)
                }
            } catch (error) {
                console.error("Error fetching avatar:", error);
                setAvatarUrl(null);
                setRenderReady(true)

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
        if (user) fetchAvatar();
    }, [user?.id, user?.avatar]);
    
    const handleViewProfile = () => {
        if (!error && loaded && user) {
            navigate("/identity/myAccount");
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("jwt");
        onLogout();
    };

    if (!loaded || !user) {
        return (
            <Box 
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Box 
                    as={CgProfile} 
                    boxSize="35px" 
                    onClick={() => navigate("/auth/login")}
                    _hover={{ cursor: "pointer" }}
                />
            </Box>
        );
    }

    if (renderReady == true) {
        return (
            <MenuRoot>
                {!avatarUrl ? (
                    <MenuTrigger asChild>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Box 
                                as={CgProfile} 
                                boxSize="50px" 
                                p={2} 
                            />
                        </Box>
                    </MenuTrigger>
                ) : (
                    <MenuTrigger asChild>
                        <Button
                            variant="unstyled"
                            aria-label="Profile options"
                            backgroundColor="transparent"
                            zIndex={9999}
                        >
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Image
                                    src={avatarUrl}
                                    boxSize="35px"
                                    borderRadius="full"
                                    alt="User Avatar"
                                />
                            </Box>
                        </Button>
                    </MenuTrigger>
                )}
                <MenuContent>
                    <MenuItem value="view-profile" onClick={handleViewProfile}>
                        View Profile
                    </MenuItem>
                    <MenuItem value="logout" onClick={handleLogout} color="red">
                        Logout
                    </MenuItem>
                </MenuContent>
            </MenuRoot>
        );
    }
};

export default ProfilePictureIcon;