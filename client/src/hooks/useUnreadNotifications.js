// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   handleToastSuccess,
//   handleToastError,
// } from "../utils/toastDisplayHandler";

// export const useUnreadNotifications = () => {
//   const queryClient = useQueryClient();

//   // Get unread message count
//   const {
//     data: unreadData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["unreadCount"],
//     // queryFn: getUnreadMessageCount,
//     refetchInterval: 30000, // Refetch every 30 seconds
//     refetchIntervalInBackground: true,
//   });

//   // Send email notification for unread messages
//   const sendNotificationMutation = useMutation({
//     mutationFn: ({ userId, unreadData }) =>
//       sendUnreadNotification(userId, unreadData),
//     onSuccess: () => {
//       handleToastSuccess("Unread notification sent successfully");
//     },
//     onError: handleToastError,
//   });

//   // Send Stream reminder for unread messages
//   const sendReminderMutation = useMutation({
//     mutationFn: (userId) => sendUnreadReminderNotification(userId),
//     onSuccess: () => {
//       handleToastSuccess("Unread reminder sent successfully");
//       queryClient.invalidateQueries(["unreadCount"]);
//     },
//     onError: handleToastError,
//   });

//   // Check if user has unread messages
//   const hasUnreadMessages = unreadData?.unreadCount > 0;

//   // Get sender names for notification
//   const getSenderNames = () => {
//     if (!unreadData?.channels) return "";
//     const senderNames = unreadData.channels
//       .map((channel) => channel.senderName)
//       .filter(Boolean)
//       .slice(0, 3); // Limit to first 3 senders
//     return senderNames.join(", ");
//   };

//   return {
//     unreadData,
//     isLoading,
//     error,
//     hasUnreadMessages,
//     sendNotification: sendNotificationMutation.mutate,
//     sendReminder: sendReminderMutation.mutate,
//     isSendingNotification: sendNotificationMutation.isPending,
//     isSendingReminder: sendReminderMutation.isPending,
//     getSenderNames,
//   };
// };
