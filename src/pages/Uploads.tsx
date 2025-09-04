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
import { supabase } from "@/integrations/supabase/client";

export const Uploads = () => {
  const [showMobileScan, setShowMobileScan] = useState(false);
  const [showTabletCapture, setShowTabletCapture] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentUploads();
  }, []);

  const fetchRecentUploads = async () => {
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
      setRecentUploads(data || []);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold">Upload Assignments</h1>
        <p className="text-muted-foreground mt-2">
          Scan or upload student answer sheets for AI-powered grading
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
                Use your phone or tablet to scan answer sheets directly
              </p>
            </div>
            <Button className="w-full" onClick={() => {
              console.log('Mobile Scan button clicked'); // Debug log
              setShowMobileScan(true);
            }}>
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
            <Button variant="secondary" className="w-full" onClick={() => setShowTabletCapture(true)}>
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
            <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => setShowFileUpload(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Scanning Instructions */}
      <Card className="bg-primary-subtle border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <FileText className="mr-2 h-5 w-5" />
            Mobile Scanning Tips
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

      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading uploads...</p>
            ) : recentUploads.length === 0 ? (
              <p className="text-center text-muted-foreground">No uploads yet. Start by uploading your first assignment!</p>
            ) : (
              recentUploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{upload.file_name}</span>
                    {getStatusIcon(upload.status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{upload.assignments?.title || 'Untitled Assignment'}</span>
                    <span>•</span>
                    <span>{new Date(upload.uploaded_at).toLocaleString()}</span>
                    {upload.student_count > 0 && (
                      <>
                        <span>•</span>
                        <span>{upload.student_count} students</span>
                      </>
                    )}
                  </div>
                  {upload.error_message && (
                    <p className="text-sm text-destructive">{upload.error_message}</p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {upload.processing_time && (
                    <span className="text-sm text-muted-foreground">
                      {upload.processing_time}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      upload.status
                    )}`}
                  >
                    {upload.status}
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

      {/* Camera and Upload Modals */}
      {showMobileScan && (
        <>
          {console.log('Rendering mobile scan modal')} {/* Debug log */}
          <CameraCapture
            mode="mobile_scan"
            onClose={() => {
              console.log('Closing mobile scan modal'); // Debug log
              setShowMobileScan(false);
              fetchRecentUploads();
            }}
          />
        </>
      )}

      {showTabletCapture && (
        <CameraCapture
          mode="tablet_capture"
          onClose={() => {
            setShowTabletCapture(false);
            fetchRecentUploads();
          }}
        />
      )}

      {showFileUpload && (
        <FileUpload
          onClose={() => {
            setShowFileUpload(false);
            fetchRecentUploads();
          }}
        />
      )}
    </div>
  );
};