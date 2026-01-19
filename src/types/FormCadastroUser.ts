export interface FormData {
  username: string;
  email: string;
  sector: string;
  password: string;
  confirmPassword: string;
  userType: "admin" | "tecnico";
  especialidade?: string;
}
