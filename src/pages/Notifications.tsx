import React, { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DotLoader from "@/components/ui/loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  RefreshCw, 
  AlertCircle,
  MessageSquare,
  User
} from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotifications();

  const [selectedType, setSelectedType] = useState<string>("all");

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "mentions":
        return <User className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "message":
        return "bg-blue-50 border-blue-200";
      case "alert":
        return "bg-red-50 border-red-200";
      case "mentions":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTimeAgo = (date: string) => {
    //date is database timestamp
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const filteredNotifications = selectedType === "all" 
    ? notifications 
    : notifications.filter(n => n.type.toLowerCase() === selectedType.toLowerCase());

  const notificationTypes = [
    { value: "all", label: "All", count: notifications.length },
    { value: "message", label: "Messages", count: notifications.filter(n => n.type.toLowerCase() === "message").length },
    { value: "alert", label: "Alerts", count: notifications.filter(n => n.type.toLowerCase() === "alert").length },
    { value: "Mentions", label: "Mentions", count: notifications.filter(n => n.type.toLowerCase() === "mentions").length },
  ];

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <DotLoader />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : "All caught up! No unread notifications."
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
          <Button
            variant="outline"
            onClick={refreshNotifications}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {notificationTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.value)}
            className="whitespace-nowrap"
          >
            {type.label}
            <Badge variant="secondary" className="ml-2">
              {type.count}
            </Badge>
          </Button>
        ))}
      </div>

      <Separator />

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {selectedType === "all" 
                ? "You're all caught up! Check back later for new updates."
                : `No ${selectedType} notifications found.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all duration-200 hover:shadow-md ${
                !notification.read ? "ring-2 ring-blue-500 ring-opacity-20" : ""
              } ${getNotificationColor(notification.type)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <Badge variant="default" className="text-xs bg-blue-500">
                              New
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-900 mb-2">
                          {typeof notification.data === 'string' 
                            ? notification.data 
                            : (notification.data as any).message
                          }
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatTimeAgo(notification.createdAt)}</span>
                          {notification.read && (
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="flex-shrink-0 h-8 w-8 p-0 hover:bg-blue-100"
                        >
                          <Check className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Loading indicator for refresh */}
      {loading && notifications.length > 0 && (
        <div className="flex items-center justify-center py-4">
          <DotLoader />
        </div>
      )}
    </div>
  );
}