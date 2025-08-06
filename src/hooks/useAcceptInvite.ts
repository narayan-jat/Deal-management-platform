import { useEffect, useState, useRef } from "react";
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
  const hasProcessed = useRef(false);

  const storageKey = `pending_${inviteType}_invite_token`;
  const acceptMethod = inviteType === 'link' 
    ? InviteService.acceptLinkInvite 
    : InviteService.acceptEmailInvite;

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current || isFetchingUser) return;

    if (!user) {
      // First save the token if it is there.
      if (token) {
        localStorage.setItem(storageKey, token);
      }
      // Redirect to the login page.
      hasProcessed.current = true;
      navigate(ROUTES.SIGNIN);
    } else {
      // If user is logged in, check if there is a token.
      if (token) {
        // Accept the invite.
        hasProcessed.current = true;
        handleAcceptInvite();
      }
      // If there is no token. Search if the token is in local storage.
      else {
        const pendingToken = localStorage.getItem(storageKey);
        if (pendingToken) {
          hasProcessed.current = true;
          handleAcceptInvite();
        }
        // If there is no token, in local storage also, then redirect to dashboard.
        else {
          hasProcessed.current = true;
          navigate(ROUTES.DASHBOARD);
          toast.error("No invite token found");
        }
      }
    }
  }, [user, token, isFetchingUser, storageKey]);

  // Reset the flag when component unmounts or dependencies change
  useEffect(() => {
    return () => {
      hasProcessed.current = false;
    };
  }, [user, token]);

  const handleAcceptInvite = async () => {
    if (isAcceptingInvite) return; // Prevent multiple calls
    
    setIsAcceptingInvite(true);
    try {
      const dealMember = await acceptMethod(user?.id, token);
      toast.success("Invite accepted successfully");
      // navigate to the deal page.
      navigate(`${ROUTES.VIEW_DEAL.replace(':dealId', dealMember.deal_id)}`);
    } catch (error) {
      toast.error(error.message || "Failed to accept invite");
      setAcceptInviteError(error.message);
      // navigate to the dashboard.
      navigate(ROUTES.DASHBOARD);
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