import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import server from "../../../networking";
import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { CgProfile } from 'react-icons/cg';
import { IoArrowBack } from 'react-icons/io5';
import PublicAccountDetails from "../../components/identity/PublicAccountDetails";
import ShowToast from "../../Extensions/ShowToast";

function PublicProfile() {
    const { id } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [bannerUrl, setBannerUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await server.get(`/api/Identity/getPublicUserDetails?userId=${id}`);
                const userData = response.data;
                setUserDetails(userData);

                if (userData.avatar) {
                    const avatarResponse = await server.get(`/api/Identity/getAvatar?userId=${id}`);
                    setAvatarUrl(avatarResponse.data.avatarUrl || null);
                } else {
                    setAvatarUrl(null);
                }

                if (userData.banner) {
                    const bannerResponse = await server.get(`/api/Identity/getBanner?userId=${id}`);
                    setBannerUrl(bannerResponse.data.bannerUrl || null);
                } else {
                    setBannerUrl(null);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
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
        fetchUserDetails();
    }, [id]);

    if (!userDetails) {
        return <p>Loading...</p>;
    }

    return (
        <Box
            alignItems="center"
            mt={10}
        >
            <Box bg="#96E2D6" borderRadius="full" p={2} justify="flex-start" w={65}>
                <IoArrowBack size={50} color="black" cursor="pointer" onClick={() => navigate(-1)} />
            </Box>
            <Box
                borderRadius={15}
                mx={"auto"}
                width="60%"
                height="20vh"
                display="flex"
                alignItems="center"
                position="relative"
                mt={-14}
            >
                {/* Render Banner Image if available */}
                {bannerUrl ? (
                    <Image
                        src={bannerUrl}
                        alt="User Banner"
                        objectFit="cover"
                        borderRadius={15}
                        w="100%"
                        h="100%"
                        position="absolute"
                    />
                ) : (
                    <Box
                        backgroundImage={`url('/defaultAccountBanner.png')`}
                        backgroundSize="cover"
                        backgroundPosition="center"
                        backgroundRepeat="no-repeat"
                        w="100%"
                        h="100%"
                        position="absolute"
                        borderRadius={15}
                    />
                )}

                {/* Render Avatar or Default Icon */}
                <Box 
                    position="absolute" 
                    top="100%" 
                    left="15%"
                    transform="translateY(-45%)"
                >
                    {avatarUrl ? (
                        <Image
                            border="2px solid white"
                            src={avatarUrl}
                            boxSize="130px" 
                            borderRadius="full"  
                            alt="User Avatar"
                        />
                    ) : (
                        <CgProfile size="130" />
                    )}
                </Box>
            </Box>

            <Heading fontSize="40px" mt={6} mb={4}>{userDetails.fName + " " + userDetails.lName}</Heading>

            <Text mb={6} fontStyle={"italic"}>{userDetails.userRole.charAt(0).toUpperCase() + userDetails.userRole.slice(1).toLowerCase()}</Text>

            <PublicAccountDetails userDetails={userDetails} />
        </Box>
    );
}

export default PublicProfile;