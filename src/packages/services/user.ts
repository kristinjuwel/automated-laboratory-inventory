import { UserSchema } from "../models/user";

export class UserAPI {
  static BASE_URL = "http://localhost:8080";

  // Register User
  public static async registerUser(payload: UserSchema) {
    return this.__request({
      method: "POST",
      url: "/register",
      body: payload,
    });
  }

  // Register User by Admin
  public static async adminRegisterUser(payload: UserSchema) {
    return this.__request({
      method: "POST",
      url: "/admin-register",
      body: payload,
    });
  }

  // Login User
  public static async loginUser(identifier: string, password: string) {
    return this.__request({
      method: "POST",
      url: "/login",
      body: { identifier, password },
    });
  }

  // Logout User
  public static async logoutUser(userId: number) {
    return this.__request({
      method: "POST",
      url: "/logout",
      body: { userId },
    });
  }

  // Get All Users
  public static async getAllUsers() {
    return this.__request({
      method: "GET",
      url: "/all-users",
    });
  }

  // Get User by ID
  public static async getUserById(userId: number) {
    return this.__request({
      method: "GET",
      url: `/user/${userId}`,
    });
  }

  // Verify User
  public static async verifyUser(email: string, otp: string) {
    return this.__request({
      method: "PUT",
      url: "/verify",
      body: { email, otp },
    });
  }

  // Change Password
  public static async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ) {
    return this.__request({
      method: "PUT",
      url: `/change-password/${userId}`,
      body: { oldPassword, newPassword },
    });
  }

  // Update User
  public static async updateUser(userId: number, payload: UserSchema) {
    return this.__request({
      method: "PUT",
      url: `/update-user/${userId}`,
      body: payload,
    });
  }

  // Delete User
  public static async deleteUser(userId: number) {
    return this.__request({
      method: "DELETE",
      url: `/delete-user/${userId}`,
    });
  }

  // Generic Request Method
  private static async __request({
    method,
    url,
    body,
  }: {
    method: string;
    url: string;
    body?: unknown;
  }) {
    const response = await fetch(`${this.BASE_URL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }
}
