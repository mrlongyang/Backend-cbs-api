export interface User {
  user_id: string;
  user_name: string;
}

export interface UserWithPassword extends User {
  user_password: string;
}
