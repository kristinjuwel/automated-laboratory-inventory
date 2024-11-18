"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
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
import { userSchema, UserSchema } from "@/packages/api/user";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface MappedUser {
  userId: number;
  lastName: string;
  firstName: string;
  middleName: string | null;
  designation: string;
  laboratory: string;
  labId: number;
  email: string | null;
  username: string;
  status: string;
}
const labMapping = {
  Pathology: 1,
  Immunology: 2,
  Microbiology: 3,
};
const AdminView = () => {
  const [users, setUsers] = useState<MappedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<MappedUser[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MappedUser | null>(null);
  const [formData, setFormData] = useState<Partial<MappedUser>>({});
  const router = useRouter();
  const statuses = [
    "active",
    "inactive",
    "to be approved",
    "to be otp-verified",
  ];
  const laboratories = [
    { name: "Pathology", id: 1 },
    { name: "Immunology", id: 2 },
    { name: "Microbiology", id: 3 },
  ];
  const designations = [
    "medical technologist",
    "researcher",
    "lab manager",
    "student",
    "technician",
  ];
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "admin" && userRole !== "superadmin") {
      router.push("/lab/pathology");
    }
  }, [router]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}all-users`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: UserSchema[] = await response.json();

        const parsedData = z.array(userSchema).parse(data);
        const userRole = localStorage.getItem("userRole");
        const filteredData =
          userRole === "admin"
            ? parsedData.filter(
                (user) =>
                  user.designation !== "admin" &&
                  user.designation !== "superadmin"
              )
            : parsedData;

        const mappedUsers: MappedUser[] = filteredData.map((user) => ({
          userId: user.userId,
          lastName: user.lastName,
          firstName: user.firstName,
          middleName: user.middleName ?? "",
          designation: user.designation,
          laboratory: user.laboratory.labName,
          labId: user.labId,
          email: user.email ?? "",
          username: user.username,
          status: user.status,
        }));

        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers);
        console.log(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}update-user/${selectedUser.userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              labId: formData.labId || selectedUser.labId,
            }),
          }
        );

        if (response.ok) {
          const updatedUser = {
            ...selectedUser,
            ...formData,
            labId: formData.labId || selectedUser.labId,
          };
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.userId === updatedUser.userId ? updatedUser : user
            )
          );
          setFilteredUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.userId === updatedUser.userId ? updatedUser : user
            )
          );
          toast.success("User updated successfully!");
          setIsEditDialogOpen(false);
          window.location.reload();
        } else {
          throw new Error("Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Failed to update user");
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}update-user/${selectedUser.userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "Deleted",
            }),
          }
        );

        if (response.ok) {
          toast.success("User Deleted successfully!");
          window.location.reload();
        } else {
          throw new Error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      }
    }
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
                <TableRow
                  key={user.userId}
                  className={cn(
                    `capitalize ${
                      user.status === "deleted"
                          ? "text-red-500 rounded-md"
                          : user.status === "active"
                          ? "text-teal-500 rounded-md"
                          : user.status === "inactive"
                          ? "text-gray-500 rounded-md"
                          : user.status === "to be approved"
                          ? "text-yellow-500 rounded-md"
                          : user.status === "to be otp-verified"
                          ? "text-blue-500 rounded-md"
                          : "text-black rounded-md"
                    }`
                  )}
                >
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{`${user.firstName} ${user.middleName} ${user.lastName}`}</TableCell>
                  <TableCell className="capitalize">
                    {user.designation}
                  </TableCell>
                  <TableCell className="capitalize">
                    {user.laboratory}
                  </TableCell>
                  <TableCell className="capitalize">{user.status}</TableCell>
                  <TableCell className="text-center">{user.username}</TableCell>
                  <TableCell className="text-center lowercase">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.status !== "Deleted" && (
                      <>
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
                      </>
                    )}
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
            <Card key={user.userId}>
              <CardHeader>
                <CardTitle className="text-teal-900 pt-2">{`${user.firstName} ${user.middleName} ${user.lastName}`}</CardTitle>
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
        <DialogContent className="bg-white max-h-4/5 h-4/5 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div>
              <form className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500" htmlFor="firstName">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName || selectedUser.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500" htmlFor="middleName">
                    Middle Name
                  </label>
                  <Input
                    id="middleName"
                    name="middleName"
                    placeholder="Middle Name"
                    value={formData.middleName || selectedUser.middleName || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500" htmlFor="lastName">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName || selectedUser.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Designation</label>
                  <Select
                    value={formData.designation || selectedUser.designation}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, designation: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map((designation) => (
                        <SelectItem key={designation} value={designation}>
                          {designation.charAt(0).toUpperCase() +
                            designation.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Laboratory</label>
                  <Select
                    value={
                      formData.labId?.toString() ||
                      labMapping[
                        selectedUser.laboratory as keyof typeof labMapping
                      ]?.toString()
                    }
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        labId: parseInt(value, 10), // Convert the selected value back to a number
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Laboratory" />
                    </SelectTrigger>
                    <SelectContent>
                      {laboratories.map((lab) => (
                        <SelectItem key={lab.id} value={lab.id.toString()}>
                          {lab.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-500" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email || selectedUser.email || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500" htmlFor="username">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={formData.username || selectedUser.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <Select
                    value={formData.status || selectedUser.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditSubmit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Toaster />

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
              onClick={() => {
                handleDeleteUser();
                setIsDeleteDialogOpen(true);
              }}
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
          <CreateAccount closeDialog={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminView;
