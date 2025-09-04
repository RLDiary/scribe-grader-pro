import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Edit,
  Brain,
  FileText,
  Clock
} from "lucide-react";

export const Grading = () => {
  const gradingQueue = [
    {
      id: 1,
      student: "Emma Wilson",
      assignment: "Algebra Quiz #3",
      subject: "Mathematics",
      uploadedAt: "2024-01-15 14:30",
      status: "ai_graded",
      aiScore: 85,
      confidence: 92,
      flaggedItems: 2,
      totalQuestions: 15,
    },
    {
      id: 2,
      student: "James Chen",
      assignment: "Biology Midterm",
      subject: "Science",
      uploadedAt: "2024-01-15 10:15",
      status: "needs_review",
      aiScore: 72,
      confidence: 65,
      flaggedItems: 5,
      totalQuestions: 25,
    },
    {
      id: 3,
      student: "Sarah Davis",
      assignment: "Creative Writing Essay",
      subject: "English",
      uploadedAt: "2024-01-14 16:45",
      status: "manual_required",
      aiScore: null,
      confidence: 45,
      flaggedItems: 8,
      totalQuestions: 3,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ai_graded":
        return "bg-success/10 text-success";
      case "needs_review":
        return "bg-warning/10 text-warning";
      case "manual_required":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ai_graded":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "needs_review":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "manual_required":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ai_graded":
        return "AI Graded";
      case "needs_review":
        return "Needs Review";
      case "manual_required":
        return "Manual Required";
      default:
        return "Processing";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grading Review</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve AI-generated grades, resolve flagged items
        </p>
      </div>

      {/* Grading Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">AI Confidence</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">87.3%</div>
              <p className="text-xs text-muted-foreground">Average across all grades</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-sm font-medium text-muted-foreground">Ready to Approve</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">High confidence grades</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span className="text-sm font-medium text-muted-foreground">Needs Review</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Medium confidence</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium text-muted-foreground">Manual Grading</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Low confidence</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grading Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Grading Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gradingQueue.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg">{item.student}</h3>
                      <Badge variant="outline">{item.subject}</Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{getStatusText(item.status)}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.assignment}</p>
                    <p className="text-xs text-muted-foreground">Uploaded: {item.uploadedAt}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Review
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Grade
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">AI Confidence</span>
                      <span className="font-medium">{item.confidence}%</span>
                    </div>
                    <Progress value={item.confidence} className="h-2" />
                  </div>

                  {item.aiScore !== null && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">AI Score</span>
                        <span className="font-bold text-lg">{item.aiScore}%</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Flagged Items</span>
                      <span className={`font-medium ${item.flaggedItems > 0 ? 'text-warning' : 'text-success'}`}>
                        {item.flaggedItems} of {item.totalQuestions}
                      </span>
                    </div>
                    {item.flaggedItems > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Unclear handwriting, complex answers
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Bulk Actions</h3>
              <p className="text-sm text-muted-foreground">
                Apply actions to multiple graded assignments
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve All High Confidence
              </Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Generate Reports
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};