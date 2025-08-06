import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "@/config/routes";
import { InviteService } from "@/services/deals/InviteService";

type InviteType = 'link' | 'email';

export function useAcceptInvite(inviteType: InviteType) {
  const { user, loading: isFetchingUser } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();
  const [isAcceptingInvite, setIsAcceptingInvite] = useState(false);
  const [acceptInviteError, setAcceptInviteError] = useState<string | null>(null);

  const storageKey = `pending_${inviteType}_invite_token`;
  const acceptMethod = inviteType === 'link' 
    ? InviteService.acceptLinkInvite 
    : InviteService.acceptEmailInvite;

  useEffect(() => {
    if (isFetchingUser) return;
    if (!user) {
      // First save the token if it is there.
      if (token) {
        localStorage.setItem(storageKey, token);
      }
      // Redirect to the login page.
      navigate(ROUTES.SIGNIN);
    } else {
      // If user is logged in, check if there is a token.
      if (token) {
        // Accept the invite.
        handleAcceptInvite();
      }
      // If there is no token. Search if the token is in local storage.
      else {
        const pendingToken = localStorage.getItem(storageKey);
        if (pendingToken) {
          handleAcceptInvite();
        }
        // If there is no token, in local storage also, then redirect to dashboard.
        else {
          navigate(ROUTES.DASHBOARD);
          toast.error("No invite token found");
        }
      }
    }
  }, [user, token, isFetchingUser]);

  const handleAcceptInvite = async () => {
    setIsAcceptingInvite(true);
    try {
      const dealMember = await acceptMethod(user?.id, token);
      toast.success("Invite accepted successfully");
      // navigate to the deal page.
      navigate(`${ROUTES.VIEW_DEAL.replace(':dealId', dealMember.deal_id)}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to accept invite");
      setAcceptInviteError(error.message);
    } finally {
      setIsAcceptingInvite(false);
      // Clear the stored token
      localStorage.removeItem(storageKey);
    }
  };

  return { 
    isAcceptingInvite, 
    acceptInviteError, 
    handleAcceptInvite 
  };
} 