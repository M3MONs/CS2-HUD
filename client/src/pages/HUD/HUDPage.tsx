import { useGSISocket } from "@/hooks/useGSISocket";

const HUDPage = () => {
    const gsiData = useGSISocket();

    console.log(gsiData);

    return <div>HUDPage</div>;
};

export default HUDPage;
