export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    needPasswordChange: boolean;
    email: string;
    name: string;
    role: string;
    image: string;
    status: string;
    isDeleted: boolean;
    emailVerified: boolean;
  };
}

export interface IProfile {
  email: string;
  name: string;
  role: string;
  image: string;
  status: string;
  isDeleted: boolean;
  emailVerified: boolean;
}

export interface IRegisterResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
