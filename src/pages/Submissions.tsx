import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Upload, 
  FileText, 
  Check, 
  Clock, 
  AlertCircle,
  Smartphone,
  Tablet
} from "lucide-react";
import { CameraCapture } from "@/components/upload/CameraCapture";
import { FileUpload } from "@/components/upload/FileUpload";
import { AssignmentSelector } from "@/components/upload/AssignmentSelector";
import { supabase } from "@/integrations/supabase/client";

export const Submissions = () => {
  const [showMobileScan, setShowMobileScan] = useState(false);
  const [showTabletCapture, setShowTabletCapture] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showAssignmentSelector, setShowAssignmentSelector] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'mobile_scan' | 'tablet_capture' | 'file_upload'>('mobile_scan');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
  const [selectedAssignmentTitle, setSelectedAssignmentTitle] = useState<string>("");
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSubmissions();
  }, []);

  const fetchRecentSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select(`
          *,
          assignments(title)
        `)
        .order('uploaded_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeClick = (mode: 'mobile_scan' | 'tablet_capture' | 'file_upload') => {
    setSelectedMode(mode);
    setShowAssignmentSelector(true);
  };

  const handleAssignmentSelected = (assignmentId: string, assignmentTitle: string) => {
    setSelectedAssignmentId(assignmentId);
    setSelectedAssignmentTitle(assignmentTitle);
    
    // Open the appropriate modal based on selected mode
    switch (selectedMode) {
      case 'mobile_scan':
        setShowMobileScan(true);
        break;
      case 'tablet_capture':
        setShowTabletCapture(true);
        break;
      case 'file_upload':
        setShowFileUpload(true);
        break;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
        return <Check className="h-4 w-4 text-success" />;
      case "processing":
        return <Clock className="h-4 w-4 text-warning" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-success/10 text-success";
      case "processing":
        return "bg-warning/10 text-warning";
      case "failed":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Submissions</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage student submissions for AI-powered grading
        </p>
      </div>

      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-primary/20 hover:border-primary/40">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Mobile Scan</h3>
              <p className="text-sm text-muted-foreground">
                Use your phone to scan student answer sheets directly
              </p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => handleModeClick('mobile_scan')}
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Start Mobile Scan
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
                Perfect for classroom use with larger screens
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="w-full" 
              onClick={() => handleModeClick('tablet_capture')}
            >
              <Tablet className="mr-2 h-4 w-4" />
              Use Tablet Mode
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
                Upload pre-scanned PDFs or image files
              </p>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" 
              onClick={() => handleModeClick('file_upload')}
            >
              <Upload className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scanning Instructions */}
      <Card className="bg-primary-subtle border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <FileText className="mr-2 h-5 w-5" />
            Submission Scanning Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">📱 For Best Results:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Ensure good lighting</li>
                <li>• Hold device steady</li>
                <li>• Keep papers flat</li>
                <li>• Avoid shadows and glare</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">✅ Supported Formats:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Handwritten answers</li>
                <li>• Multiple choice sheets</li>
                <li>• Mixed format tests</li>
                <li>• Essay responses</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading submissions...</p>
            ) : recentSubmissions.length === 0 ? (
              <p className="text-center text-muted-foreground">No submissions yet. Start by uploading your first student submissions!</p>
            ) : (
              recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{submission.file_name}</span>
                    {getStatusIcon(submission.status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{submission.assignments?.title || 'Untitled Assignment'}</span>
                    <span>•</span>
                    <span>{new Date(submission.uploaded_at).toLocaleString()}</span>
                    {submission.student_count > 0 && (
                      <>
                        <span>•</span>
                        <span>{submission.student_count} students</span>
                      </>
                    )}
                  </div>
                  {submission.error_message && (
                    <p className="text-sm text-destructive">{submission.error_message}</p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {submission.processing_time && (
                    <span className="text-sm text-muted-foreground">
                      {submission.processing_time}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      submission.status
                    )}`}
                  >
                    {submission.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assignment Selector Modal */}
      <AssignmentSelector
        open={showAssignmentSelector}
        onClose={() => setShowAssignmentSelector(false)}
        onSelectAssignment={handleAssignmentSelected}
        mode={selectedMode}
      />

      {/* Upload Modals */}
      {showMobileScan && (
        <CameraCapture
          mode="mobile_scan"
          assignmentId={selectedAssignmentId}
          assignmentTitle={selectedAssignmentTitle}
          onClose={() => {
            setShowMobileScan(false);
            fetchRecentSubmissions();
          }}
        />
      )}

      {showTabletCapture && (
        <CameraCapture
          mode="tablet_capture"
          assignmentId={selectedAssignmentId}
          assignmentTitle={selectedAssignmentTitle}
          onClose={() => {
            setShowTabletCapture(false);
            fetchRecentSubmissions();
          }}
        />
      )}

      {showFileUpload && (
        <FileUpload
          onClose={() => {
            setShowFileUpload(false);
            fetchRecentSubmissions();
          }}
        />
      )}
    </div>
  );
};