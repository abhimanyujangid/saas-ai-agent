
import Link from "next/link";
import Image from "next/image";
import {
     CallControls,
     SpeakerLayout
} from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";

interface Props {
    onLeave: () => void;
    meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
    return (
        <div className="flex bg-[#101213] flex-col items-center justify-between h-full text-white">
        <div className="bg-[#101213] rounded-full p-4 flex items-center justify-center gap-4 ">
           <Link href={`/`} className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
               <Image src="/logo.svg" alt="Meeting Logo" width={22} height={22} />
           </Link>
           <h4 className="text-base">
            {
                meetingName
            }
           </h4>
        </div>
      <div className="w-full h-ful">  <SpeakerLayout /></div>
       <div className="bg-[#101213] rounded-full px-4 flex items-center justify-center w-fit gap-8">
           <CallControls onLeave={onLeave} />
           <Button onClick={onLeave}>Leave Call</Button>
       </div>
        </div>
    );
}