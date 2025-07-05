import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import type { LoginForm } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("root", { message: "Invalid email or password" });
      } else {
        setError("root", { message: "Login failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
            <CardAction>
              <Button variant="link" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CardContent>
              {errors.root && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{errors.root.message}</p>
                </div>
              )}
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    autoComplete="email"
                    placeholder="m@example.com"
                    className={`input-field ${errors.email ? "border-red-500" : ""}`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className={`input-field pr-10 ${errors.password ? "border-red-500" : ""}`}
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute inset-y-0 right-0 px-4 flex items-center justify-center hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" disabled={isLoading} className="w-full flex items-center justify-center space-x-2">
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
    // <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    //   <div className="max-w-md w-full space-y-8">
    //     <div>
    //       <div className="flex justify-center">
    //         <LogIn className="h-12 w-12 text-primary-600" />
    //       </div>
    //       <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
    //       <p className="mt-2 text-center text-sm text-gray-600">
    //         Or{" "}
    //         <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
    //           create a new account
    //         </Link>
    //       </p>
    //     </div>

    //     <div className="card">
    //       <div className="card-body">
    //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    //           {errors.root && (
    //             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    //               <p className="text-red-800 text-sm">{errors.root.message}</p>
    //             </div>
    //           )}

    //           <div>
    //             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
    //               Email address
    //             </label>
    //             <Input
    //               type="email"
    //               id="email"
    //               autoComplete="email"
    //               placeholder="Enter your email"
    //               className={`input-field ${errors.email ? "border-red-500" : ""}`}
    //               {...register("email", {
    //                 required: "Email is required",
    //                 pattern: {
    //                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    //                   message: "Please enter a valid email address",
    //                 },
    //               })}
    //             />
    //             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
    //           </div>

    //           <div>
    //             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
    //               Password
    //             </label>
    //             <div className="relative">
    //               <input
    //                 type={showPassword ? "text" : "password"}
    //                 id="password"
    //                 autoComplete="current-password"
    //                 placeholder="Enter your password"
    //                 className={`input-field pr-10 ${errors.password ? "border-red-500" : ""}`}
    //                 {...register("password", {
    //                   required: "Password is required",
    //                 })}
    //               />
    //               <button
    //                 type="button"
    //                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
    //                 onClick={() => setShowPassword(!showPassword)}
    //               >
    //                 {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
    //               </button>
    //             </div>
    //             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
    //           </div>

    //           <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center space-x-2">
    //             {isLoading ? (
    //               <LoadingSpinner size="sm" />
    //             ) : (
    //               <>
    //                 <LogIn className="h-5 w-5" />
    //                 <span>Sign In</span>
    //               </>
    //             )}
    //           </button>
    //         </form>
    //       </div>
    //     </div>

    //     <div className="text-center">
    //       <p className="text-sm text-gray-600">
    //         Don't have an account?{" "}
    //         <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
    //           Sign up for free
    //         </Link>
    //       </p>
    //     </div>
    //   </div>
    // </div>
  );
};

export default LoginPage;
