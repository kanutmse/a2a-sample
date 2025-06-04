import { User, CreateUserRequest, UpdateUserRequest } from '../entities/User';

export interface UserRepository {
  create(userData: CreateUserRequest): Promise<User>;
  findById(userId: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(user: User): Promise<User | null>;
  delete(userId: string): Promise<boolean>;
}