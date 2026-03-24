import { Bell, AlertTriangle, CheckCircle, Info, Trash2, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";

const mockAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Budget Alert: Food Category",
    message: "You've spent 85% of your food budget for this month. Consider reducing expenses.",
    timestamp: "2026-03-24T10:30:00",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Savings Goal Achieved",
    message: "Congratulations! You've reached your monthly savings goal of $500.",
    timestamp: "2026-03-23T15:45:00",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Bill Reminder",
    message: "Your internet bill of $79.99 is due in 3 days.",
    timestamp: "2026-03-23T09:00:00",
    read: true,
  },
  {
    id: 4,
    type: "warning",
    title: "Unusual Spending Detected",
    message: "Your spending on transportation is 40% higher than usual this week.",
    timestamp: "2026-03-22T18:20:00",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "Income Received",
    message: "Your salary of $3,500 has been deposited to your account.",
    timestamp: "2026-03-22T08:00:00",
    read: true,
  },
  {
    id: 6,
    type: "error",
    title: "Budget Exceeded: Utilities",
    message: "You've exceeded your utilities budget by $20. Review your expenses.",
    timestamp: "2026-03-21T14:30:00",
    read: true,
  },
  {
    id: 7,
    type: "success",
    title: "Smart Saving Tip",
    message: "Based on your spending pattern, you could save $150/month by reducing dining out.",
    timestamp: "2026-03-20T11:00:00",
    read: true,
  },
  {
    id: 8,
    type: "info",
    title: "Weekly Summary Ready",
    message: "Your weekly financial summary is ready to view. Check your progress!",
    timestamp: "2026-03-19T07:00:00",
    read: true,
  },
];

export function Alerts() {
  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "warning":
        return "default";
      case "success":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const handleDelete = (id: number) => {
    // This would call your MongoDB backend API
    console.log("Delete alert:", id);
  };

  const handleMarkAsRead = (id: number) => {
    // This would call your MongoDB backend API
    console.log("Mark as read:", id);
  };

  const unreadCount = mockAlerts.filter(alert => !alert.read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
            <p className="text-gray-600 mt-2">Stay updated with your financial activities</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="text-lg px-4 py-2">
              {unreadCount} Unread
            </Badge>
            <Button variant="outline">Mark All as Read</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAlerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockAlerts.filter(a => a.type === "warning").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Important</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockAlerts.filter(a => a.type === "error").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>Your recent alerts and updates from the system</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`transition-all ${!alert.read ? 'border-l-4 border-l-blue-600 bg-blue-50' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                              {!alert.read && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(alert.timestamp)}
                              </span>
                              <Badge variant={getBadgeVariant(alert.type)} className="text-xs capitalize">
                                {alert.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {!alert.read && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleMarkAsRead(alert.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(alert.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Customize what alerts you want to receive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Budget Alerts</p>
                  <p className="text-sm text-gray-600">Get notified about budget usage</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Savings Tips</p>
                  <p className="text-sm text-gray-600">Receive personalized saving suggestions</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Bill Reminders</p>
                  <p className="text-sm text-gray-600">Reminders for upcoming bills</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Transaction Updates</p>
                  <p className="text-sm text-gray-600">Alerts for new transactions</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
