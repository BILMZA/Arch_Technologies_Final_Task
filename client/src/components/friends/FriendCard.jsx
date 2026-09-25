import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { UserIcon } from "../common/Icons";

export const FriendCard = ({ friend, onUserClick }) => {
  const friendId = friend._id || friend.id || friend;
  const friendName = friend.name || "User";

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar
          src={friend.profilePicture}
          name={friendName}
          size="md"
          onClick={() => onUserClick?.(friendId)}
        />
        <div className="min-w-0">
          <h4
            onClick={() => onUserClick?.(friendId)}
            className="text-sm font-semibold text-slate-900 truncate hover:text-indigo-600 transition-colors cursor-pointer"
          >
            {friendName}
          </h4>
          {friend.email && (
            <p className="text-xs text-slate-400 truncate">{friend.email}</p>
          )}
          {friend.bio && (
            <p className="text-xs text-slate-600 truncate mt-0.5 max-w-xs">
              {friend.bio}
            </p>
          )}
        </div>
      </div>

      <Button
        variant="secondary"
        size="xs"
        onClick={() => onUserClick?.(friendId)}
        icon={<UserIcon className="w-3.5 h-3.5" />}
      >
        View
      </Button>
    </div>
  );
};

export default FriendCard;
