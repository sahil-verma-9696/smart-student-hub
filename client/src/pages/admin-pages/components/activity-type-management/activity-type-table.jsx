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
import { Edit, Trash2, CheckCircle, XCircle, Copy, Eye } from "lucide-react";

export function ActivityTypeTable({
  activityTypes,
  loading,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onDuplicate,
  onPreview,
}) {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!activityTypes || activityTypes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No activity types found. Create one to get started.
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: "secondary",
      UNDER_REVIEW: "secondary",
      APPROVED: "default",
      REJECTED: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityTypes.map((type) => (
            <TableRow key={type._id}>
              <TableCell className="font-medium">{type.name}</TableCell>
              <TableCell className="max-w-xs truncate">
                {type.description || "N/A"}
              </TableCell>
              <TableCell>{type.category || "N/A"}</TableCell>
              <TableCell>
                {type.minCredit} - {type.maxCredit}
              </TableCell>
              <TableCell>{getStatusBadge(type.status)}</TableCell>
              <TableCell>
                {type.isPrimitive ? (
                  <Badge variant="outline">Primitive</Badge>
                ) : (
                  <Badge variant="outline">Custom</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPreview(type)}
                    disabled={loading}
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDuplicate(type)}
                    disabled={loading}
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {!type.isPrimitive && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(type)}
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(type._id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {(type.status === "PENDING" || type.status === "UNDER_REVIEW") && !type.isPrimitive && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApprove(type._id)}
                        disabled={loading}
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReject(type._id)}
                        disabled={loading}
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4 text-red-600" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
