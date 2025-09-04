import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  BarChart3, 
  Calendar, 
  Clock,
  Camera,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AssignmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAssignmentDetails();
      fetchSubmissions();
    }
  }, [id]);

  const fetchAssignmentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setAssignment(data);
    } catch (error) {
      console.error('Error fetching assignment:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .eq('assignment_id', id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const stats = {
    totalSubmissions: submissions.length,
    processedSubmissions: submissions.filter(s => s.status === 'processed').length,
    averageScore: 82.4,
    highestScore: 97,
    lowestScore: 65,
    scoreDistribution: [
      { range: '90-100', count: 8, percentage: 32 },
      { range: '80-89', count: 12, percentage: 48 },
      { range: '70-79', count: 4, percentage: 16 },
      { range: '60-69', count: 1, percentage: 4 }
    ]
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center space-y-4 mt-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
        <div>
          <h2 className="text-xl font-semibold">Assignment Not Found</h2>
          <p className="text-muted-foreground">The assignment you're looking for doesn't exist.</p>
        </div>
        <Button onClick={() => navigate('/assignments')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assignments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/assignments')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
          <p className="text-muted-foreground mt-1">
            Created {new Date(assignment.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold">{stats.processedSubmissions}</p>
                <p className="text-sm text-muted-foreground">Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">{stats.highestScore}%</p>
                <p className="text-sm text-muted-foreground">Highest Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.scoreDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium">{item.range}</div>
                <div className="flex-1 bg-muted rounded-full h-6 relative">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    {item.count} students ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Submission Gallery ({submissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No submissions uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {submissions.map((submission, index) => (
                <Dialog key={submission.id}>
                  <DialogTrigger asChild>
                    <div className="relative group cursor-pointer">
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-transparent hover:border-primary/50 transition-colors">
                        <div className="text-center space-y-2">
                          <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
                          <p className="text-xs font-medium truncate px-2">
                            {submission.file_name}
                          </p>
                        </div>
                        <Badge 
                          variant={submission.status === 'processed' ? 'default' : 'secondary'}
                          className="absolute top-2 right-2 text-xs"
                        >
                          {submission.status}
                        </Badge>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">{submission.file_name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>Uploaded: {new Date(submission.uploaded_at).toLocaleString()}</span>
                          <Badge variant={submission.status === 'processed' ? 'default' : 'secondary'}>
                            {submission.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Placeholder for actual image - in real implementation, you'd display the actual image */}
                      <div className="bg-muted rounded-lg aspect-[3/4] flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                          <p className="text-muted-foreground">Student Submission Preview</p>
                          <p className="text-xs text-muted-foreground">
                            Image would be displayed here in full implementation
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.slice(0, 5).map((submission) => (
              <div key={submission.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{submission.file_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Uploaded via {submission.upload_method?.replace('_', ' ')} • {new Date(submission.uploaded_at).toLocaleString()}
                  </p>
                </div>
                <Badge variant={submission.status === 'processed' ? 'default' : 'secondary'}>
                  {submission.status}
                </Badge>
              </div>
            ))}
            {submissions.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No activity yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};