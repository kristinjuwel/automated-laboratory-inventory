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
import { Edit, Search, TriangleAlert, FilePlus, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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

const CalibrationLogs = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
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

  return (
    <div className=" p-8">
      <h1 className="text-3xl font-semibold text-teal-700 mb-4">
        Calibration Log Forms
      </h1>
      <div className="flex text-right justify-left items-center mb-4">
        <div className="flex items-center">
          <Input
            placeholder="Search for an entry"
            value={search}
            onChange={handleSearch}
            className="w-80 pr-8"
          />
          <span className="relative -ml-8">
            <Search className="size-5 text-gray-500" />
          </span>

          <Button
            className={cn(
              `bg-teal-500 text-white w-36 justify-center rounded-lg hover:bg-teal-700 transition-colors duration-300 ease-in-out mx-6`
            )}
            onClick={() => {
              setIsCreateDialogOpen(true);
            }}
          >
            <FilePlus className="w-4 h-4" strokeWidth={1.5} />
            Create Form
          </Button>
        </div>
      </div>

      <Toaster />

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
                    <Printer className="w-4 h-4 -mr-1" /> Print
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
              <FilePlus className="text-teal-500 size-5 -mt-0.5" />
              Add User
            </DialogTitle>
          </DialogHeader>
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

export default CalibrationLogs;
