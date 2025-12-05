import React from 'react';

const AssignmentMatrix = ({ students, faculty, assignments }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2">Student / Faculty</th>
            {faculty.map(f => (
              <th key={f._id} className="border border-gray-200 p-2 text-sm">
                {f.basicUserDetails?.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td className="border border-gray-200 p-2 text-sm font-medium">
                {s.basicUserDetails?.name}
              </td>
              {faculty.map(f => {
                const isAssigned = assignments.some(a => a.studentId === s._id && a.facultyId === f._id);
                return (
                  <td key={f._id} className="border border-gray-200 p-2 text-center">
                    {isAssigned ? '✅' : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentMatrix;
