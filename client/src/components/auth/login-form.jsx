"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard based on role
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <Tabs defaultValue="student" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="student">Student</TabsTrigger>
        <TabsTrigger value="faculty">Faculty</TabsTrigger>
        <TabsTrigger value="admin">Admin</TabsTrigger>
      </TabsList>

      <TabsContent value="student" className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student-id">Student ID</Label>
            <Input
              id="student-id"
              placeholder="Enter your student ID"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In as Student"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="faculty" className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="faculty-id">Faculty ID</Label>
            <Input
              id="faculty-id"
              placeholder="Enter your faculty ID"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cse">Computer Science</SelectItem>
                <SelectItem value="ece">Electronics & Communication</SelectItem>
                <SelectItem value="me">Mechanical Engineering</SelectItem>
                <SelectItem value="ce">Civil Engineering</SelectItem>
                <SelectItem value="eee">Electrical Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="faculty-password">Password</Label>
            <Input
              id="faculty-password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In as Faculty"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="admin" className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="Enter admin email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In as Admin"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
