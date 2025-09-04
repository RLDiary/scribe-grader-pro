import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Camera, 
  Upload, 
  Plus, 
  FileText, 
  Smartphone,
  Tablet,
  BookOpen,
  Calendar,
  Clock,
  Users
} from "lucide-react";
import { CameraCapture } from "@/components/upload/CameraCapture";
import { FileUpload } from "@/components/upload/FileUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Assignments = () => {
  const navigate = useNavigate();
  const [showMobileScan, setShowMobileScan] = useState(false);
  const [showTabletCapture, setShowTabletCapture] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          submissions:uploads(count),
          recent_submissions:uploads(
            id,
            file_name,
            uploaded_at,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process the data to get submission counts and recent submissions
      const processedAssignments = (data || []).map(assignment => ({
        ...assignment,
        submission_count: assignment.submissions?.[0]?.count || 0,
        recent_submissions: (assignment.recent_submissions || [])
          .sort((a: any, b: any) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
          .slice(0, 3)
      }));
      
      setAssignments(processedAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Assignment title is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('assignments')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment created successfully.",
      });

      setFormData({ title: "", description: "" });
      setShowCreateForm(false);
      fetchAssignments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create assignment.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your assignments for AI-powered grading
        </p>
      </div>

      {/* Assignment Creation Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-primary/20 hover:border-primary/40">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Mobile Scan</h3>
              <p className="text-sm text-muted-foreground">
                Scan a printed assignment with your phone
              </p>
            </div>
            <Button className="w-full" onClick={() => setShowMobileScan(true)}>
              <Smartphone className="mr-2 h-4 w-4" />
              Scan Assignment
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-secondary/20 hover:border-secondary/40">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
              <Tablet className="h-8 w-8 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Tablet Capture</h3>
              <p className="text-sm text-muted-foreground">
                Use tablet camera for larger view
              </p>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setShowTabletCapture(true)}>
              <Tablet className="mr-2 h-4 w-4" />
              Tablet Mode
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-accent/20 hover:border-accent/40">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">File Upload</h3>
              <p className="text-sm text-muted-foreground">
                Upload digital assignment files
              </p>
            </div>
            <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => setShowFileUpload(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/40">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Create New</h3>
              <p className="text-sm text-muted-foreground">
                Create assignment from scratch
              </p>
            </div>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Assignment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Assignment Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter assignment title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter assignment description..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleCreateAssignment} className="w-full">
                    Create Assignment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Your Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading assignments...</p>
            ) : assignments.length === 0 ? (
              <p className="text-center text-muted-foreground">No assignments yet. Create your first assignment above!</p>
            ) : (
              assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-start justify-between p-6 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold text-lg">{assignment.title}</span>
                      <Badge variant="outline" className="ml-2">
                        {assignment.submission_count} submission{assignment.submission_count !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    {assignment.description && (
                      <p className="text-muted-foreground">{assignment.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Created {new Date(assignment.created_at).toLocaleDateString()}
                      </span>
                      {assignment.recent_submissions && assignment.recent_submissions.length > 0 && (
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          Last activity {new Date(assignment.recent_submissions[0].uploaded_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Recent Submissions Preview */}
                    {assignment.recent_submissions && assignment.recent_submissions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-muted">
                        <p className="text-sm font-medium mb-2">Recent Activity:</p>
                        <div className="space-y-1">
                          {assignment.recent_submissions.map((submission: any) => (
                            <div key={submission.id} className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="truncate flex-1 mr-2">{submission.file_name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={submission.status === 'processed' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {submission.status}
                                </Badge>
                                <span>{new Date(submission.uploaded_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 ml-6">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/assignments/${assignment.id}`)}
                      className="flex items-center"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      View Details
                      {assignment.submission_count > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {assignment.submission_count}
                        </Badge>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showMobileScan && (
        <CameraCapture
          mode="mobile_scan"
          onClose={() => {
            setShowMobileScan(false);
            fetchAssignments();
          }}
        />
      )}

      {showTabletCapture && (
        <CameraCapture
          mode="tablet_capture"
          onClose={() => {
            setShowTabletCapture(false);
            fetchAssignments();
          }}
        />
      )}

      {showFileUpload && (
        <FileUpload
          onClose={() => {
            setShowFileUpload(false);
            fetchAssignments();
          }}
        />
      )}
    </div>
  );
};