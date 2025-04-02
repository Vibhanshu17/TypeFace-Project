import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { AuthContext } from "@/Auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be atleast 6 characters long.",
  }),
});

function Login() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { username: "" },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    data.password = btoa(data.password);
    try {
      await context?.login(data.username, data.password);
      toast.success("Login successful!", {
        description: "Redirecting to dashboard...",
      });
      setTimeout(() => navigate("/"), 1500);
      form.reset({ username: "", password: "" });
    } catch (error) {
      toast.error("Login failed", {
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(
                {
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                  input: { username: data.username },
                },
                null,
                2
              )}
            </code>
          </pre>
        ),
      });
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Login To Simplebox
        </h1>
        <Toaster />
        <title>Simplebox</title>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full max-w-sm gap-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChangeCapture={(e) =>
                        context?.setUserName(e.currentTarget.value)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        className="pr-10"
                        {...field}
                        onChangeCapture={(e) =>
                          context?.setUserPassword(e.currentTarget.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeIcon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>Enter a secure password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <text className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Register here
            </Link>
          </text>
        </div>
      </div>
    </div>
  );
}

export default Login;
