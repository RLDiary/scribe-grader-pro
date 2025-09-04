import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Share,
  Brain,
  Target,
  BookOpen,
  AlertCircle
} from "lucide-react";

export const Reports = () => {
  const studentReports = [
    {
      id: 1,
      student: "Emma Wilson",
      class: "Algebra II",
      overallScore: 87,
      trend: "up",
      trendValue: "+5%",
      skillGaps: [
        { skill: "Quadratic Equations", confidence: 65, priority: "high" },
        { skill: "Graphing Functions", confidence: 78, priority: "medium" },
      ],
      strengths: ["Linear Equations", "Basic Algebra"],
      lastReport: "2024-01-15",
    },
    {
      id: 2,
      student: "James Chen",
      class: "Biology",
      overallScore: 72,
      trend: "down",
      trendValue: "-3%",
      skillGaps: [
        { skill: "Cell Structure", confidence: 45, priority: "high" },
        { skill: "Photosynthesis", confidence: 58, priority: "high" },
        { skill: "Genetics", confidence: 71, priority: "medium" },
      ],
      strengths: ["Classification", "Ecosystems"],
      lastReport: "2024-01-14",
    },
  ];

  const classAnalytics = {
    averageScore: 81.4,
    totalStudents: 156,
    improvementRate: 12.5,
    commonStruggles: [
      { topic: "Advanced Algebra", percentage: 68 },
      { topic: "Complex Problem Solving", percentage: 54 },
      { topic: "Word Problems", percentage: 47 },
    ],
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive";
      case "medium":
        return "bg-warning/10 text-warning";
      case "low":
        return "bg-success/10 text-success";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Reports</h1>
          <p className="text-muted-foreground mt-2">
            Detailed analytics and personalized learning insights
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share Reports
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Class Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Class Average</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{classAnalytics.averageScore}%</div>
              <p className="text-xs text-success">+2.1% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium text-muted-foreground">Total Students</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{classAnalytics.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="text-sm font-medium text-muted-foreground">Improvement Rate</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{classAnalytics.improvementRate}%</div>
              <p className="text-xs text-success">Students showing progress</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">AI Insights</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">Personalized recommendations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Struggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Class-wide Learning Gaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classAnalytics.commonStruggles.map((struggle, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{struggle.topic}</span>
                  <span className="text-sm text-muted-foreground">
                    {struggle.percentage}% of students need help
                  </span>
                </div>
                <Progress value={struggle.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Individual Student Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {studentReports.map((report) => (
              <div key={report.id} className="p-6 rounded-lg border">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg">{report.student}</h3>
                      <Badge variant="outline">{report.class}</Badge>
                      <div className="flex items-center space-x-1">
                        {report.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={`text-sm font-medium ${
                          report.trend === "up" ? "text-success" : "text-destructive"
                        }`}>
                          {report.trendValue}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last report: {report.lastReport} • Overall Score: {report.overallScore}%
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Full Report
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skill Gaps */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Priority Learning Areas</h4>
                    <div className="space-y-2">
                      {report.skillGaps.map((gap, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{gap.skill}</span>
                              <Badge className={getPriorityColor(gap.priority)}>
                                {gap.priority}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Confidence: {gap.confidence}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Strong Areas</h4>
                    <div className="space-y-2">
                      {report.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center p-3 bg-success/5 rounded-lg border-l-2 border-success">
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Study Recommendations */}
                <div className="mt-4 p-4 bg-primary-subtle rounded-lg">
                  <h4 className="font-medium text-sm mb-2">AI-Generated Study Plan</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Focus 60% study time on quadratic equations practice</li>
                    <li>• Complete 3 interactive graphing exercises weekly</li>
                    <li>• Review Khan Academy: "Advanced Algebra Concepts"</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};