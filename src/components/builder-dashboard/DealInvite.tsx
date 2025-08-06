import DealLoader from "@/components/ui/loader";
import { useAcceptInvite } from "@/hooks/useAcceptInvite";

type InviteType = 'link' | 'email';

interface DealInviteProps {
  inviteType: InviteType;
}

export default function DealInvite({ inviteType }: DealInviteProps) {
  const { isAcceptingInvite, acceptInviteError } = useAcceptInvite(inviteType);

  if (isAcceptingInvite) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <DealLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {acceptInviteError && (
        <h1 className="text-2xl font-bold">
          Could not accept invite, token not found or expired. Please try again. Redirecting to dashboard...
        </h1>
      )}
    </div>
  );
} 