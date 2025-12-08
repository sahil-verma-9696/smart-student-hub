import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function ActivityTypePreview({ isOpen, onClose, activityType }) {
  if (!activityType) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview: {activityType.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="font-semibold">Category:</span> {activityType.category}
                </div>
                <div>
                    <span className="font-semibold">Credits:</span> {activityType.minCredit} - {activityType.maxCredit}
                </div>
                <div className="col-span-2">
                    <span className="font-semibold">Description:</span> {activityType.description}
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Form Preview</h3>
                <div className="space-y-4">
                    {activityType.formSchema?.map((field, index) => (
                        <div key={index} className="space-y-2">
                            <Label>
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            
                            {field.type === 'text' && <Input placeholder={field.placeholder} disabled />}
                            {field.type === 'number' && <Input type="number" placeholder={field.placeholder} disabled />}
                            {field.type === 'date' && <Input type="date" disabled />}
                            {field.type === 'select' && (
                                <Select disabled>
                                    <SelectTrigger>
                                        <SelectValue placeholder={field.placeholder || "Select option"} />
                                    </SelectTrigger>
                                </Select>
                            )}
                            {field.type === 'checkbox' && (
                                <div className="space-y-2">
                                    {field.options?.map((opt, i) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <Checkbox id={`preview-${index}-${i}`} disabled />
                                            <label htmlFor={`preview-${index}-${i}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {opt}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {(!activityType.formSchema || activityType.formSchema.length === 0) && (
                        <p className="text-muted-foreground text-sm italic">No custom fields defined.</p>
                    )}
                </div>
            </div>
        </div>
        <div className="flex justify-end">
            <Button onClick={onClose}>Close Preview</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
