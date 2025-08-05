import { ROUTES } from "@/config/routes";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DealInvite() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate(ROUTES.HOME);
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Deal Invite</h1>
    </div>
  );
}
