"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Trash,
  Grid,
  List,
  Search,
  TriangleAlert,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CreateAccount from "@/components/molecules/create-account";

interface User {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  designation: string;
  laboratory: string;
  email: string;
  username: string;
  status: string;
}

const AdminView = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
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
        status: "active",
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
        status: "active",
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
        status: "active",
      },
    ];
    setUsers(fetchData);
    setFilteredUsers(fetchData);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);

    setFilteredUsers(
      users.filter((user) =>
        `${user.firstName} ${user.lastName} ${user.middleName}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    );
  };

  const handleViewModeChange = (view: string) => {
    setViewMode(view);
  };

  return (
    <div className="p-12 w-screen h-screen bg-white">
      <h1 className="text-xl font-bold py-2 tracking-tight mb-4 text-teal-900 text-center flex-grow">
        MANAGE USERS
      </h1>
      <div className="flex text-right justify-between items-center mb-4">
        <div className="flex items-center">
          <Input
            placeholder="Search for a user"
            value={search}
            onChange={handleSearch}
            className="w-80 pr-8"
          />
          <span className="relative -ml-8">
            <Search className="size-5 text-gray-500" />
          </span>

          <Button
            className={cn(
              `bg-teal-500 text-white w-28 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out mx-6 ${
                viewMode === "card" ? "hidden" : ""
              }`
            )}
            onClick={() => {
              setIsCreateDialogOpen(true);
            }}
          >
            <UserPlus className="w-4 h-4" strokeWidth={1.5} />
            Add User
          </Button>
        </div>

        <div className="inline-flex right-0 border border-gray-300 rounded-xl overflow-hidden">
          <button
            className={cn(
              `px-4 py-2 ${
                viewMode === "table"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700"
              }`
            )}
            onClick={() => handleViewModeChange("table")}
          >
            <List className="w-4 h-4 inline-block mr-1" /> Table View
          </button>
          <button
            className={cn(
              `px-4 py-2 ${
                viewMode === "card"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700"
              }`
            )}
            onClick={() => handleViewModeChange("card")}
          >
            <Grid className="w-4 h-4 justify-center inline-block mr-1 items-center" />{" "}
            Card View
          </button>
        </div>
      </div>

      <Toaster />

      {viewMode === "table" ? (
        <Table className="items-center justify-center">
          <TableHeader className="text-center justify-center">
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Laboratory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Username</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{`${user.lastName}, ${user.firstName} ${user.middleName}`}</TableCell>
                  <TableCell>{user.designation}</TableCell>
                  <TableCell>{user.laboratory}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell className="text-center">{user.username}</TableCell>
                  <TableCell className="text-center">{user.email}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-md text-cyan-600 hover:text-cyan-900 hover:bg-cyan-50"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 -mr-0.5" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-md text-red-600 hover:text-red-900 hover:bg-red-50"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="w-4 h-4 -mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle className="text-teal-900 pt-2">{`${user.lastName}, ${user.firstName} ${user.middleName} `}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Designation: {user.designation}</p>
                <p>Laboratory: {user.laboratory}</p>
                <p>Status: {user.status}</p>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <div className="items-right text-right pt-16 pb-0">
                  <Button
                    size="sm"
                    className="mr-2 rounded-md text-cyan-600 hover:bg-cyan-50 hover:text-cyan-800 bg-cyan-50"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-md  text-red-600 hover:bg-red-50 hover:text-red-800 bg-red-50"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <button onClick={() => setIsCreateDialogOpen(true)}>
            <Card
              key="add-user-card"
              className="flex justify-center items-center bg-white hover:bg-teal-100 h-80"
            >
              <CardContent className="text-center w-full">
                <UserPlus
                  size={100}
                  className="text-teal-900 text-center w-full"
                />
              </CardContent>
            </Card>
          </button>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-h-4/5 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              value={selectedUser?.firstName}
              placeholder="First Name"
              className="mb-4"
            />
            <Input
              value={selectedUser?.middleName}
              placeholder="Last Name"
              className="mb-4"
            />
            <Input
              value={selectedUser?.lastName}
              placeholder="Last Name"
              className="mb-4"
            />
            <Input
              value={selectedUser?.designation}
              placeholder="Last Name"
              className="mb-4"
            />
            <Input
              value={selectedUser?.laboratory}
              placeholder="Last Name"
              className="mb-4"
            />
            <Input
              value={selectedUser?.email}
              placeholder="Last Name"
              className="mb-4"
            />
            <Input
              value={selectedUser?.username}
              placeholder="Last Name"
              className="mb-4"
            />
            <div className="relative">
              <Button
                className="absolute right-0 mr-4"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight">
              <TriangleAlert className="text-red-500 size-5 -mt-0.5" />
              Delete User
            </DialogTitle>
          </DialogHeader>
          <p className="text-left pt-2 text-sm">
            Are you sure you want to delete this user?
          </p>
          <p className="text-left bg-red-300 -mt-2 relative py-2 text-sm">
            <span className="pl-4">
              By deleting this user, they will be removed indefinitely.
            </span>
            <span className="absolute left-0 top-0 h-full w-2 bg-red-600"></span>
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 tracking-tight mb-4">
              <UserPlus className="text-teal-500 size-5 -mt-0.5" />
              Add User
            </DialogTitle>
          </DialogHeader>
          <CreateAccount />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              className="bg-teal-500 text-white hover:bg-teal-700 transition-colors duration-300 ease-in-out"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Add User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminView;
