"use client";

import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Auth Client Import
import { authClient } from "@/lib/auth-client";

// UI import
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Icon Import
import { OctagonAlertIcon } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const SignInView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  // Form Hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form Submit Handler
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);
    authClient.signIn
      .email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            router.push("/");
          },
          onError: ({ error }) => {
            setError(error.message || "An error occurred during sign in.");
          },
        }
      )
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className=" grid  p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6  md:p-8"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-semibold">Welcome Back</h1>
                  <p className="text-sm text-muted-foreground">
                    {" "}
                    Login to your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="*********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert variant="destructive" className="bg-destructive/10">
                    <OctagonAlertIcon className="h-4 w-4" />
                    <AlertTitle>{error}</AlertTitle>
                    {/* <AlertDescription>
                        Please check your email and password.
                      </AlertDescription> */}
                  </Alert>
                )}

                <Button className="w-full" type="submit" disabled={pending}>
                  Sign In
                </Button>

                {/* Divider */}
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with{" "}
                  </span>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      authClient.signIn.social({ provider: "google" });
                    }}
                  >
                      <FaGoogle />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      authClient.signIn.social({ provider: "github" });
                    }}
                  >
                    <FaGithub />
                  </Button>
                </div>

                {/* change to Sign Up */}
                <div className="text-center text-sm ">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign Up
                  </Link>{" "}
                </div>
              </div>
            </form>
          </Form>
          <div
            className="relative hidden md:flex flex-col gap-y-4 items-center justify-center"
            style={{
              background: `radial-gradient(
      oklch(0.525 0.147 24.9381),
      oklch(0.465 0.147 24.9381),
      oklch(0.405 0.147 24.9381)
    )`,
            }}
          >
            <Image
              src="/logo.svg"
              width={92}
              height={92}
              alt="AI Meet"
              className="h-[92px] w-[92px]"
            />
            <p className="text-2xl text-white font-semibold">AI Meet</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-shadow-black *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
};
