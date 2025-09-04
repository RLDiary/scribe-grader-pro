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

export const Uploads = () => {
  const uploadHistory = [
    {
      id: 1,
      fileName: "Math_Quiz_3_Class_A.pdf",
      assignment: "Algebra Quiz #3",
      uploadedAt: "2024-01-15 14:30",
      status: "processed",
      studentCount: 28,
      processingTime: "45s",
    },
    {
      id: 2,
      fileName: "Science_Test_Biology.pdf",
      assignment: "Biology Midterm",
      uploadedAt: "2024-01-15 10:15",
      status: "processing",
      studentCount: 32,
      processingTime: "2m 30s",
    },
    {
      id: 3,
      fileName: "English_Essay_Photos.zip",
      assignment: "Creative Writing",
      uploadedAt: "2024-01-14 16:45",
      status: "failed",
      studentCount: 0,
      error: "Unclear handwriting detected",
    },
  ];

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
            <Button className="w-full">
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
            <Button variant="secondary" className="w-full">
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
            <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
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
            {uploadHistory.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{upload.fileName}</span>
                    {getStatusIcon(upload.status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{upload.assignment}</span>
                    <span>•</span>
                    <span>{upload.uploadedAt}</span>
                    {upload.studentCount > 0 && (
                      <>
                        <span>•</span>
                        <span>{upload.studentCount} students</span>
                      </>
                    )}
                  </div>
                  {upload.error && (
                    <p className="text-sm text-destructive">{upload.error}</p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {upload.processingTime && (
                    <span className="text-sm text-muted-foreground">
                      {upload.processingTime}
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};