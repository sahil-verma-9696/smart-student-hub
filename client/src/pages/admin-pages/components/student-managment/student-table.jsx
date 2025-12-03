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
  
  export function StudentTable({ students, onDelete }) {
    if (students.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No students registered
            </h3>
            <p className="text-muted-foreground text-center mt-2 max-w-sm">
              Start by adding a student manually or upload a CSV file to register
              multiple students at once.
            </p>
          </CardContent>
        </Card>
      );
    }
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
          <CardDescription>
            Total: {students.length} student{students.length !== 1 ? "s" : ""}
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
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Alternate Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">{student.basicUserDetails.name}</TableCell>
                    <TableCell>{student.basicUserDetails.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {student.basicUserDetails.gender}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.roll_number || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.basicUserDetails.contactInfo?.phone || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.basicUserDetails.contactInfo?.alternatePhone || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.basicUserDetails.contactInfo?.address || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete student</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }
  