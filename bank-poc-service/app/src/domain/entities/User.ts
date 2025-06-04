export interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface CreateUserRequest {
    first_name: string;
    last_name: string;
    date_of_birth: string; // ISO date string
  }
  
  export interface UpdateUserRequest {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string; // ISO date string
  }