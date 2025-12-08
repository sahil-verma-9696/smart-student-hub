import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users } from "lucide-react";

export function FacultyTable({ faculties, onDelete }) {
  if (faculties.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No faculty registered
          </h3>
          <p className="text-muted-foreground text-center mt-2 max-w-sm">
            Start by adding a faculty member manually or upload a CSV file to register
            multiple faculty at once.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Faculty</CardTitle>
        <CardDescription>
          Total: {faculties.length} faculty member{faculties.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Employee Code</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Alternate Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faculties.map((faculty) => {
                const userDetails = faculty.basicUserDetails || faculty;
                return (
                <TableRow key={faculty._id || faculty.id}>
                  <TableCell className="font-medium">{userDetails.name || faculty.name}</TableCell>
                  <TableCell>{userDetails.email || faculty.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {userDetails.gender || faculty.gender}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {faculty.employee_code || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {faculty.department || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {faculty.designation || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {userDetails.contactInfo?.phone || faculty.contactInfo?.phone || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {userDetails.contactInfo?.alternatePhone || faculty.contactInfo?.alternatePhone || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {userDetails.contactInfo?.address || faculty.contactInfo?.address || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(faculty._id || faculty.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete faculty</span>
                    </Button>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
