import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Camera,
  FileText,
  BarChart3
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Dashboard = () => {
  const stats = [
    {
      title: "Total Students",
      value: "156",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Assignments Graded",
      value: "43",
      change: "+8%",
      changeType: "positive" as const,
      icon: CheckCircle,
    },
    {
      title: "Pending Reviews",
      value: "7",
      change: "-23%",
      changeType: "positive" as const,
      icon: Clock,
    },
    {
      title: "Average Score",
      value: "84.2%",
      change: "+5.1%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Graded Math Quiz #3",
      class: "Algebra II",
      students: 28,
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      action: "Uploaded Science Test",
      class: "Biology",
      students: 32,
      time: "4 hours ago",
      status: "processing",
    },
    {
      id: 3,
      action: "Generated Report",
      class: "Chemistry",
      students: 25,
      time: "1 day ago",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-hero rounded-xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Ms. Johnson!</h1>
          <p className="text-lg mb-6 opacity-90">
            Ready to grade some assignments? Let's make learning more efficient with AI-powered grading.
          </p>
          <div className="flex space-x-4">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Camera className="mr-2 h-5 w-5" />
              Scan New Assignment
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <BarChart3 className="mr-2 h-5 w-5" />
              View Reports
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
          <img 
            src={heroImage} 
            alt="AI Grading" 
            className="h-full w-full object-cover rounded-r-xl"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{activity.action}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{activity.class}</span>
                      <span>•</span>
                      <span>{activity.students} students</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === "completed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Camera className="mr-2 h-4 w-4" />
              Scan Assignment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Students
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};