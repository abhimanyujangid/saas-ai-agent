import {
  useCall,
  StreamTheme
} from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import "@stream-io/video-react-sdk/dist/css/styles.css";
interface Props {
    meetingName: string;
}

const CallUI = ({ meetingName }: Props) => {
    const call = useCall();

    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

    const handleJoin = async () => {
        if (!call) return;
        try {
            await call.join();
            setShow("call");
        } catch (error) {
            // Optionally, show a user notification here
            console.error("Failed to join call:", error);
        }
    };

    const handleLeave = async () => {
        if (!call) return;
        await call.endCall();
        setShow("ended");
    };

    return (
        <StreamTheme className="h-screen">
            {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName} />}
            {show === "ended" && <p>ended</p>}
            {show === "lobby" && <CallLobby onJoin={handleJoin} />}
        </StreamTheme>
    );
};

export default CallUI;
