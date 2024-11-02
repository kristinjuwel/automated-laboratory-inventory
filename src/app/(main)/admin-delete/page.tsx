"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { FaTrashAlt } from "react-icons/fa"; 

interface User {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
}

const AdminDelete = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  // Mocked function to fetch users; replace with API call if needed
  useEffect(() => {
    // Example data
    const fetchData = [
      { id: "1", lastName: "Doe", firstName: "John", email: "john.doe@example.com" },
      { id: "2", lastName: "Smith", firstName: "Jane", email: "jane.smith@example.com" },
      { id: "3", lastName: "Brown", firstName: "Alex", email: "alex.brown@example.com" },
    ];
    setUsers(fetchData);
    setFilteredUsers(fetchData);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    setFilteredUsers(
      users.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    );
  };

  const handleDelete = (userId: string) => {
    try {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center bg-gray-100">
      <Card className="p-8 w-full max-w-[935px] max-h-[700px] shadow-lg">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-xl font-bold py-1">Delete Users</h1>
          <hr className="w-full border-t-1 border-gray-300 my-1" />
        </div>

        <Toaster />

        <Input
          placeholder="Search for a user"
          value={search}
          onChange={handleSearch}
          className="mb-4"
        />

        <div className="overflow-y-auto max-h-[500px]">
          {filteredUsers.length > 0 ? (
            <ul>
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center p-3 border-b border-gray-200"
                >
                  <div>
                    <p className="text-lg font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No users found.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDelete;