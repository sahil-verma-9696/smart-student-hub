import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FacultyCard = ({ faculty, assignmentCount, specializations }) => {
  return (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{faculty.basicUserDetails?.name}</h4>
            <p className="text-sm text-muted-foreground">{faculty.department} - {faculty.designation}</p>
          </div>
          <Badge variant="secondary">{assignmentCount} Students</Badge>
        </div>
        <div className="mt-2">
          <p className="text-xs font-medium mb-1">Specializations:</p>
          <div className="flex flex-wrap gap-1">
            {specializations?.activityTypes?.map((type, index) => (
              <Badge key={index} variant="outline" className="text-xs">{type}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacultyCard;
