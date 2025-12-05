import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const activityTypesList = ['Research', 'Internship', 'Competition', 'Workshop', 'Seminar', 'Project'];

const SpecializationForm = ({ faculty, initialSpecializations, onSave }) => {
  const [selectedTypes, setSelectedTypes] = useState(initialSpecializations?.activityTypes || []);

  const handleToggle = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSave = () => {
    onSave(faculty._id, { activityTypes: selectedTypes });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="font-medium">Specializations for {faculty.basicUserDetails?.name}</h3>
      <div className="grid grid-cols-2 gap-2">
        {activityTypesList.map(type => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox 
              id={`type-${type}`} 
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => handleToggle(type)}
            />
            <Label htmlFor={`type-${type}`}>{type}</Label>
          </div>
        ))}
      </div>
      <Button onClick={handleSave}>Save Specializations</Button>
    </div>
  );
};

export default SpecializationForm;
