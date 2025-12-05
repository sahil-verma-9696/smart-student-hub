import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StudentAssignmentCard = ({ student, facultyList, onAssign, onRemove }) => {
  return (
    <Card className="mb-2">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h4 className="font-medium">{student.basicUserDetails?.name}</h4>
          <p className="text-sm text-muted-foreground">
            {student.acadmicDetails?.course} - {student.acadmicDetails?.branch} ({student.acadmicDetails?.year} Year)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select onValueChange={(value) => onAssign(student._id, value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Faculty" />
            </SelectTrigger>
            <SelectContent>
              {facultyList.map((faculty) => (
                <SelectItem key={faculty._id} value={faculty._id}>
                  {faculty.basicUserDetails?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAssignmentCard;
