import { DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";


interface MatrixRegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  setMatrixUserId: (userId: string) => void;
  setMatrixPassword: (password: string) => void;
  onRegister: () => void;
}

export function MatrixRegistrationPopup({ isOpen, onClose, setMatrixUserId, setMatrixPassword, onRegister }: MatrixRegistrationPopupProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent> 
        <DialogTitle>Matrix Registration</DialogTitle>
        <DialogDescription>
          Please enter your Matrix user ID and password to comlete the registration. Please before submitting, the 
          details here kindly register on the matrix.org website. The registration page is opened in new tab.
          Then come back here and submit the details exactly as they are in the matrix.org website.
        </DialogDescription>
        {/* Input feild for matrix user id */}
        <div className="flex flex-col gap-2">
          <Label>Matrix User ID*</Label>
          <Input type="text" placeholder="Matrix User ID" onChange={(e) => setMatrixUserId(e.target.value)} />
        </div>
        {/* Input feild for matrix password */}
        <div className="flex flex-col gap-2">
          <Label>Matrix Password*</Label>
          <Input type="password" placeholder="Matrix Password" onChange={(e) => setMatrixPassword(e.target.value)} />
        </div>
        <DialogClose asChild>
          <Button onClick={onRegister}>Register</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}