export interface SignUpFormType {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  location: string;
  organizationName: string;
  organizationCode: string;
  organizationType: "create" | "join";
}

export interface SignInFormType {
  email: string;
  password: string;
  confirmPassword?: string; // Optional for consistency
}