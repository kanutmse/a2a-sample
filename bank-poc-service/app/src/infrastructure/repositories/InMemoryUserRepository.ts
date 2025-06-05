import { User, CreateUserRequest, UpdateUserRequest } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';


const mocksUser: User[] = [
  {
    user_id: "001",
    first_name: "นายเอ",
    last_name: "สกุล บี",
    date_of_birth: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    user_id: "002",
    first_name: "นายโจ้",
    last_name: "ซ่า",
    date_of_birth: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  },
]

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  constructor() {
    mocksUser.forEach(user => {
      this.users.set(user.user_id, user);
    });
  }




  async findByFirstNameOrLastName(firstName: string, lastName: string): Promise<User[]> {

    let result: User[] = []

    const firstNameRegex = firstName ?
    new RegExp(`.*${firstName}.*`) : null
    const lastNameRegex = lastName ?
    new RegExp(`.*${lastName}.*`) : null
    



    this.users.forEach(user => {

      let matches = false

      if (firstNameRegex && user.first_name && firstNameRegex.test(user.first_name)) {
        matches = true
      }

      if (lastNameRegex && user.last_name && lastNameRegex.test(user.last_name)) {
        matches = true
      }

      if (matches) {
        result.push(user)
      }
    })

    return result

  }




  async create(userData: CreateUserRequest): Promise<User> {
    const user: User = {
      user_id: uuidv4(),
      first_name: userData.first_name,
      last_name: userData.last_name,
      date_of_birth: new Date(userData.date_of_birth),
      created_at: new Date(),
      updated_at: new Date()
    };

    this.users.set(user.user_id, user);
    return user;
  }

  async findById(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async update(user: User): Promise<User | null> {

    const updatedUser: User = {
      ...user,
      updated_at: new Date()
    };

    this.users.set(updatedUser.user_id, updatedUser);
    return updatedUser;
  }

  async delete(userId: string): Promise<boolean> {
    return this.users.delete(userId);
  }
}