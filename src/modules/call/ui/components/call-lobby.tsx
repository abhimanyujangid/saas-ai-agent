import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import { LogInIcon } from 'lucide-react';
import Link from 'next/link';

interface Props {
  onJoin: () => void;
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user?.name ?? '',
          image:
            data?.user?.image ??
            generateAvatarUri({
              seed: data?.user?.name ?? '',
              variant: 'initials',
            }),
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowBrowserPermission = () => (
  <div>
    <p className="text-sm text-gray-500">
      Please allow access to your camera and microphone to join the call.
    </p>
  </div>
);

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasCameraPermission } = useCameraState();
  const { hasBrowserPermission: hasMicrophonePermission } = useMicrophoneState();

  const hasBrowserMediaPermissions = hasCameraPermission && hasMicrophonePermission;

  // Decide which component to render for disabled preview
  const DisabledPreviewComponent = hasBrowserMediaPermissions
    ? DisabledVideoPreview
    : AllowBrowserPermission;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to join?</h6>
            <p>Set up your camera and microphone to join the call.</p>
          </div>

          <VideoPreview DisabledVideoPreview={DisabledPreviewComponent} />

          <div className="flex items-center justify-center gap-x-4">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>

          <div className="flex gap-x-2 justify-between w-full">
            <Button variant="ghost"><Link href="/meetings">Cancel</Link></Button>
            <Button onClick={onJoin} className="flex items-center gap-x-2">
              <LogInIcon className="w-4 h-4" /> Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
