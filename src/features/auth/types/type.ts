export type RegisterRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  id: number;
  email: string;
  username: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};
