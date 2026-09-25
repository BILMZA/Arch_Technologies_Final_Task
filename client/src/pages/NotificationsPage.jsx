import NotificationPanel from "../components/notifications/NotificationPanel";

export const NotificationsPage = ({ onUserClick }) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-6 px-3 sm:px-0">
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <NotificationPanel onUserClick={onUserClick} />
      </div>
    </div>
  );
};

export default NotificationsPage;
