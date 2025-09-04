import { 
  BarChart3, 
  BookOpen, 
  Camera, 
  CheckSquare, 
  FileText, 
  Home, 
  Settings, 
  Upload, 
  Users 
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Assignments", href: "/assignments", icon: BookOpen },
  { name: "Uploads", href: "/uploads", icon: Upload },
  { name: "Grading", href: "/grading", icon: CheckSquare },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Classes & Students", href: "/students", icon: Users },
  { name: "Resources", href: "/resources", icon: FileText },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-card border-r border-border flex-shrink-0">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};