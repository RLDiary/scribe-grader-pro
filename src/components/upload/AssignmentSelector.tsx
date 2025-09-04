import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BookOpen, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AssignmentSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectAssignment: (assignmentId: string, assignmentTitle: string) => void;
  mode: 'mobile_scan' | 'tablet_capture' | 'file_upload';
}

export const AssignmentSelector = ({ open, onClose, onSelectAssignment, mode }: AssignmentSelectorProps) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchAssignments();
    }
  }, [open]);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('id, title')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (!selectedAssignment) return;
    
    const assignment = assignments.find(a => a.id === selectedAssignment);
    if (assignment) {
      onSelectAssignment(selectedAssignment, assignment.title);
      setSelectedAssignment("");
      onClose();
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'mobile_scan': return 'Mobile Scan';
      case 'tablet_capture': return 'Tablet Capture';  
      case 'file_upload': return 'File Upload';
      default: return 'Upload';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Select Assignment - {getModeTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Choose which assignment these student submissions belong to:
          </p>

          {loading ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Loading assignments...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-4 space-y-3">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="font-medium">No assignments found</p>
                <p className="text-sm text-muted-foreground">
                  Create an assignment first in the Assignments tab
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="assignment-select">Assignment</Label>
                <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assignment..." />
                  </SelectTrigger>
                  <SelectContent>
                    {assignments.map((assignment) => (
                      <SelectItem key={assignment.id} value={assignment.id}>
                        {assignment.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleProceed} 
                  disabled={!selectedAssignment}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};