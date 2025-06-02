export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}
