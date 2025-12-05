import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BulkAssignmentWizard = ({ facultyList, onAssign }) => {
  const [step, setStep] = useState(1);
  const [filters, setFilters] = useState({
    course: '',
    branch: '',
    year: '',
    section: ''
  });
  const [selectedFaculty, setSelectedFaculty] = useState('');

  const handleAssign = () => {
    onAssign({ ...filters, facultyId: selectedFaculty });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="font-medium">Bulk Assignment Wizard</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Course</Label>
          <Input 
            value={filters.course} 
            onChange={(e) => setFilters({...filters, course: e.target.value})} 
            placeholder="e.g. B.Tech"
          />
        </div>
        <div className="space-y-2">
          <Label>Branch</Label>
          <Input 
            value={filters.branch} 
            onChange={(e) => setFilters({...filters, branch: e.target.value})} 
            placeholder="e.g. CSE"
          />
        </div>
        <div className="space-y-2">
          <Label>Year</Label>
          <Input 
            value={filters.year} 
            onChange={(e) => setFilters({...filters, year: e.target.value})} 
            placeholder="e.g. 3"
          />
        </div>
        <div className="space-y-2">
          <Label>Target Faculty</Label>
          <Select onValueChange={setSelectedFaculty}>
            <SelectTrigger>
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
      </div>

      <Button onClick={handleAssign} disabled={!selectedFaculty}>
        Run Bulk Assignment
      </Button>
    </div>
  );
};

export default BulkAssignmentWizard;
