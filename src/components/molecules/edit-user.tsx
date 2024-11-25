import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { SubmitHandler, useForm } from "react-hook-form";

interface AccountDetails {
  email: string;
  userName: string;
  lastName: string;
  firstName: string;
  middleName?: string;
}

interface EditProps {
  closeDialog: () => void;
}

const EditAccount: React.FC<EditProps> = ({ closeDialog }) => {
  const currentUserId = localStorage.getItem("authToken");
  const [user, setUser] = useState<AccountDetails[]>([]);

  const form = useForm<AccountDetails>({
    defaultValues: {
      email: "",
      userName: "",
      lastName: "",
      firstName: "",
      middleName: "",
    },
  });
  const [emailError, setEmailError] = useState("");
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };
  const handleAccountEdit: SubmitHandler<AccountDetails> = async (values) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}update-user/${currentUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.userName,
            email: values.email,
            firstName: values.firstName,
            middleName: values.middleName,
            lastName: values.lastName,
          }),
        }
      );
      if (response.ok) {
        toast.success("Account update successful!");
        closeDialog();
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Account update failed!");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  useEffect(() => {
    const fetchInitialValues = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}user/${currentUserId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await response.json();

        form.reset({
          email: userData.email,
          userName: userData.username,
          lastName: userData.lastName,
          firstName: userData.firstName,
          middleName: userData.middleName || "",
        });

        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchInitialValues();
  }, [currentUserId, form]);
  return (
    <div className="items-center justify-center">
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAccountEdit)}>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 mb-4">
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Address <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-xl w-full p-3 border border-gray-300"
                      type="email"
                      placeholder="Email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        validateEmail(e.target.value);
                      }}
                      required
                    />
                  </FormControl>
                  {emailError && <FormMessage>{emailError}</FormMessage>}
                </FormItem>
              )}
            />
            <FormField
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Username <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-xl"
                      placeholder="Username"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
            <FormField
              name="lastName"
              render={({ field }) => (
                <FormItem className="col-span-3 sm:col-span-2">
                  <FormLabel>
                    Last Name <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-xl"
                      placeholder="Last Name"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="firstName"
              render={({ field }) => (
                <FormItem className="col-span-3 sm:col-span-2">
                  <FormLabel>
                    First Name <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-xl"
                      placeholder="First Name"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="middleName"
              render={({ field }) => (
                <FormItem className="w-full col-span-3 sm:col-span-1">
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-xl"
                      placeholder="Middle Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-2 pt-6">
            <Button
              variant="ghost"
              className="bg-gray-100"
              onClick={closeDialog}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-teal-500 text-white hover:bg-teal-700 transition-colors duration-300 ease-in-out"
            >
              Confirm Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default EditAccount;
