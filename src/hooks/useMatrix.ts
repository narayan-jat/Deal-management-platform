import { ErrorService } from "@/services/ErrorService";
import { MatrixUserService } from "@/services/MatrixUserService";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MatrixService } from "@/services/MatrixService";

/**
 * This hook is used to handle the matrix login and registration.
 * It is used to check if the user is authorized with matrix.org.
 * It is used to check if the user has a matrix user.
 * If not, it redirects to the Matrix authorization page.
 * If the user has a matrix user, it logs in to the matrix.
 */
export function useMatrix() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matrixUserId, setMatrixUserId] = useState<string | null>(null);
  const [isFetchingMatrixUser, setIsFetchingMatrixUser] = useState(true);
  const [matrixPassword, setMatrixPassword] = useState<string | null>(null);
  const [isMatrixRegistrationPopupOpen, setIsMatrixRegistrationPopupOpen] = useState(false);

  // Check if the user is authorized with matrix.org.
  // Check if the user has a matrix user.
  // If not, redirect to the Matrix authorization page.
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const matrixUser = await MatrixUserService.getMatrixUser(user?.id);
        const matrixUserId = matrixUser?.matrix_user_id;
        const matrixPassword = matrixUser?.matrix_password;
        setMatrixUserId(matrixUserId);
        setMatrixPassword(matrixPassword);
      } catch (error) {
        ErrorService.logError(error, "useMessages.useEffect");
        throw error;
      } finally {
        setIsFetchingMatrixUser(false);
      }
    };
    checkAuthorization();
  }, []);

  useEffect(() => {
    if (isFetchingMatrixUser) { 
      return;
    }
    if (!matrixUserId || !matrixPassword) {
      // Redirect to the matrix registration page open in new tab.
      const registrationUrl = "https://app.element.io/#/register";
      window.open(registrationUrl, "_blank", "noopener,noreferrer");
      setIsMatrixRegistrationPopupOpen(true);
    }
    else{
      handleMatrixLogin();
    }
  }, [isFetchingMatrixUser]);

  const handleMatrixLogin = async () => {
    try {
      const matrixLoggedInUser = await MatrixService.login({
        username: matrixUserId,
        password: matrixPassword,
      });
      // store userid and access token in the local storage.
      localStorage.setItem("matrixUserId", matrixLoggedInUser.userId);
      localStorage.setItem("matrixAccessToken", matrixLoggedInUser.accessToken);
    } catch (error) {
      ErrorService.logError(error, "useMessages.handleMatrixLogin");
      toast.error("Could not login to matrix. Please check your credentials.");
    }
  };

  const onRegister = async () => {
    // check if the matrix user id and password are valid.
    // if valid, then create the matrix user in the database.
    // if not valid, then show the matrix registration popup again.
    if (!matrixUserId || !matrixPassword) {
      toast.error("matrix user id or password are required.");
      return;
    }
    try {
      const matrixUser = await MatrixUserService.createMatrixUser({
          userId: user?.id,
          matrixUserId,
          matrixPassword,
        });
        toast.success("matrix user created successfully.");
        setIsMatrixRegistrationPopupOpen(false);
        handleMatrixLogin();
      } catch (error) {
      ErrorService.logError(error, "useMessages.onRegister");
      toast.error("matrix user creation failed.");
    }
  };

  return {
    isFetchingMatrixUser,
    matrixUserId,
    setMatrixUserId,
    matrixPassword,
    setMatrixPassword,
    isMatrixRegistrationPopupOpen,
    setIsMatrixRegistrationPopupOpen,
    onRegister,
  };
}