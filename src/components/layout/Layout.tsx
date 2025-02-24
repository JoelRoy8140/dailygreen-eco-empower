
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Book,
  Map,
  Globe,
  User,
  Menu,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Task History", href: "/history", icon: Calendar },
  { name: "Guides", href: "/guides", icon: Book },
  { name: "Impact Map", href: "/map", icon: Map },
  { name: "Community", href: "/community", icon: Globe },
  { name: "Profile", href: "/profile", icon: User },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100">
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="text-xl font-bold text-sage-900">
                DailyGreen
              </Link>
            </div>
            <div className="flex justify-around md:justify-end w-full md:w-auto space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col md:flex-row items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.href
                      ? "text-sage-900 bg-sage-100"
                      : "text-sage-600 hover:text-sage-900 hover:bg-sage-50"
                  }`}
                >
                  <item.icon className="h-5 w-5 md:mr-2" />
                  <span className="text-xs md:text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pb-20 md:pb-4 md:pt-20">
        {children}
      </main>
    </div>
  );
}
