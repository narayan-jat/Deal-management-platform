import { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { data, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "@/config/routes";
import { InviteService } from "@/services/deals/InviteService";

export function useAcceptLinkInvite() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (!user){
      // First save the token if it is there.
      if (token) {
        localStorage.setItem("pending_link_invite_token", token);
      }
      // Redirect to the login page.
      navigate(ROUTES.SIGNIN);
    }
    else{
      // If user is logged in, check if there is a token.
      if (token) {
        // Accept the invite.
        handleAcceptLinkInvite();
      }
      // If there is no token. Search if the token is in local storage.
      else{
        const pendingToken = localStorage.getItem("pending_link_invite_token");
        if (pendingToken) {
          handleAcceptLinkInvite();
        }
        // If there is no token, in local storage also, then redirect to dashboard.
        else{
          navigate(ROUTES.DASHBOARD);
        }
      }
    }
  }, [user, token]);


  const handleAcceptLinkInvite = async () => {
  }
}