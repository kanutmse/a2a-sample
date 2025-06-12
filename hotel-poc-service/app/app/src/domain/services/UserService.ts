import { User, CreateUserRequest, UpdateUserRequest, GetUsersByNameRequest } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';

export class UserService  {

    constructor(private userRepository: UserRepository) {}

  async create(userData: CreateUserRequest): Promise<User> {


    const user = await this.userRepository.create(userData);
    return user;
  }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }


  async findByName(name : GetUsersByNameRequest) : Promise<User[]> {
    return this.userRepository.findByFirstNameOrLastName(name.first_name,name.last_name)
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async update(userId: string, userData: UpdateUserRequest): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    const updatedUser: User = {
      ...user,
      first_name: userData.first_name || user.first_name,
      last_name: userData.last_name || user.last_name,
      date_of_birth: userData.date_of_birth ? new Date(userData.date_of_birth) : user.date_of_birth,
    };

    this.userRepository.update(updatedUser);
    return updatedUser;
  }

  async delete(userId: string): Promise<boolean> {
    return this.userRepository.delete(userId);
  }
}