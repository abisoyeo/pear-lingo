import { BellIcon } from "lucide-react";
// import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";
import { useAuth } from "../../context/AuthContext";

const UnreadNotificationBadge = () => {
  // const {
  //   unreadData,
  //   hasUnreadMessages,
  //   sendNotification,
  //   isSendingNotification,
  // } = useUnreadNotifications();
  // const { authUser } = useAuth();

  // const handleSendNotification = () => {
  //   if (hasUnreadMessages && authUser?.id) {
  //     sendNotification({
  //       userId: authUser.id,
  //       unreadData: {
  //         unreadCount: unreadData.unreadCount,
  //         senderNames: "Your friends", // This would be more specific in a real implementation
  //       },
  //     });
  //   }
  // };

  // if (!hasUnreadMessages) {
  //   return null;
  // }

  return (
    <div className="relative">
      {/* <button
        // onClick={handleSendNotification}
        // disabled={isSendingNotification}
        className="btn btn-ghost btn-circle btn-sm relative"
        // title={`${unreadData?.unreadCount || 0} unread messages`}
      >
        <BellIcon className="size-5" />
        <span className="absolute -top-1 -right-1 badge badge-error badge-sm">
          {unreadData?.unreadCount || 0} 
        </span>
      </button> */}
      {/* {isSendingNotification && (
        <div className="absolute top-full right-0 mt-2 bg-base-200 p-2 rounded-lg shadow-lg text-xs">
          Sending notification...
        </div>
      )} */}
    </div>
  );
};

export default UnreadNotificationBadge;
