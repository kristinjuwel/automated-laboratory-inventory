"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Toaster } from "sonner";

interface User {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  designation: string;
  laboratory: string;
  email: string;
  username: string;
}

const AdminView = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mocked function to fetch users; replace with API call if needed
  useEffect(() => {
    // Example data
    const fetchData = [
      {
        id: "1",
        lastName: "Doe",
        firstName: "John",
        middleName: "A.",
        designation: "Researcher",
        laboratory: "Pathology",
        email: "john.doe@example.com",
        username: "jdoe",
      },
      {
        id: "2",
        lastName: "Smith",
        firstName: "Jane",
        middleName: "B.",
        designation: "Technician",
        laboratory: "Immunology",
        email: "jane.smith@example.com",
        username: "jsmith",
      },
      {
        id: "3",
        lastName: "Brown",
        firstName: "Alex",
        middleName: "C.",
        designation: "Lab Manager",
        laboratory: "Microbiology",
        email: "alex.brown@example.com",
        username: "abrown",
      },
    ];
    setUsers(fetchData);
    setFilteredUsers(fetchData);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);

    // Filter users based on search query
    setFilteredUsers(
      users.filter((user) =>
        `${user.firstName} ${user.lastName} ${user.middleName}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    );
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user); // Set the selected user to view details
  };

  const handleBackToList = () => {
    setSelectedUser(null); // Go back to the list of users
    setSearch(""); // Clear the search input
    setFilteredUsers(users); // Reset filtered users to the original list
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center bg-gray-100">
      <Card className="p-8 w-full -mt-20 -ml-20 max-w-[935px] max-h-[700px] shadow-lg">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-xl font-bold py-1">View Users</h1>
          <hr className="w-full border-t-1 border-gray-300 my-1" />
        </div>

        <Toaster />

        {!selectedUser ? (
          <>
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
                      className="flex justify-between items-center p-3 border-b border-gray-200 cursor-pointer"
                      onClick={() => handleUserSelect(user)} // Click to view user details
                    >
                      <div>
                        <p className="text-lg font-medium">
                          {user.firstName} {user.middleName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.designation} - {user.laboratory}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No users found.</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col">
            <h2 className="text-lg font-bold mb-2">User Details</h2>
            <p className="text-lg">
              Name: {selectedUser.firstName} {selectedUser.middleName}{" "}
              {selectedUser.lastName}
            </p>
            <p className="text-lg">Username: {selectedUser.username}</p>
            <p className="text-lg">Email: {selectedUser.email}</p>
            <p className="text-lg">Designation: {selectedUser.designation}</p>
            <p className="text-lg">Laboratory: {selectedUser.laboratory}</p>
            <Button onClick={handleBackToList} className="mt-4">
              Back to User List
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminView;
