"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft, CheckCheck, Loader2 } from "lucide-react";
import {
  getNotificationsApi,
  deleteAllNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "@/api/notifications";
import NotificationCard from "@/components/notifications/notification-card";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsPage() {
  const goBack = useGoBack();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("unread");
const [deleteLoading, setDeleteLoading] = useState(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["notifications", activeTab],
    queryFn: ({ pageParam = 1 }) => getNotificationsApi(pageParam, activeTab).then((res) => res.data?.data),
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.pagination.current_page < lastPage.pagination.last_page) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationReadApi(id),
    onSuccess: (res) => {
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["unread-count"] });
        toast.success("Marked as read");
      } else {
        toast.error(res.error || "Failed to mark as read");
      }
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsReadApi(),
    onSuccess: (res) => {
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["unread-count"] });
        toast.success("Notifications cleared");
      } else {
        toast.error(res.error || "Failed to clear notifications");
      }
    },
  });

  async function handleDeleteAll() {
    setDeleteLoading(true);
    const res = await deleteAllNotificationsApi();
    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      toast.success("All notifications deleted");
    } else {
      toast.error(res.error || "Failed to delete notifications");
    }
    setDeleteLoading(false);
  }

  const allNotifications = data?.pages.flatMap((page) => page?.data ?? []) ?? [];
  
  // Client-side filtering as a fallback/guard
  const notifications = allNotifications.filter((n) => 
    activeTab === "unread" ? !n.read_at : !!n.read_at
  );
  
  const totalCount = data?.pages[0]?.pagination.total ?? 0;

  return (
    <section className="p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hover:bg-muted" onClick={goBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-muted-foreground text-sm">
              You will receive notifications about your requests here
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "unread" && notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
            >
              {markAllReadMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCheck className="w-3 h-3" />
              )}
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-destructive hover:text-destructive"
              onClick={handleDeleteAll}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
              Delete All
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 h-11 bg-bg p-1">
          <TabsTrigger value="unread" className="data-[state=active]:bg-primary!">
            Unread 
          </TabsTrigger>
          <TabsTrigger value="read" className="data-[state=active]:bg-primary!">
            Read 
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <p className="text-red-500 font-medium">Failed to load {activeTab} notifications</p>
              <Button variant="outline" onClick={() => queryClient.refetchQueries({ queryKey: ["notifications", activeTab] })}>
                Retry
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center">
                <CheckCheck className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">No {activeTab} notifications</p>
              <p className="text-sm text-muted-foreground">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={(id) => markReadMutation.mutate(id)}
                />
              ))}

              {hasNextPage && (
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Load more"
                  )}
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
