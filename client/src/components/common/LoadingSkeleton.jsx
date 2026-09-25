
export const PostSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs mb-4 animate-pulse">
    {/* Author header */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-slate-200 rounded w-1/4" />
        <div className="h-2.5 bg-slate-100 rounded w-1/6" />
      </div>
      <div className="w-14 h-5 bg-slate-100 rounded-full" />
    </div>

    {/* Content lines */}
    <div className="space-y-2 mb-4">
      <div className="h-3.5 bg-slate-200 rounded w-5/6" />
      <div className="h-3.5 bg-slate-100 rounded w-4/6" />
    </div>

    {/* Media placeholder */}
    <div className="h-64 bg-slate-100 rounded-xl mb-4" />

    {/* Actions */}
    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
      <div className="flex items-center gap-4">
        <div className="h-7 w-16 bg-slate-100 rounded-lg" />
        <div className="h-7 w-16 bg-slate-100 rounded-lg" />
      </div>
      <div className="h-7 w-10 bg-slate-100 rounded-lg" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden mb-6 animate-pulse">
    <div className="h-36 bg-slate-200" />
    <div className="px-6 pb-6 pt-0 relative">
      <div className="w-24 h-24 rounded-full bg-slate-300 ring-4 ring-white -mt-12 mb-4" />
      <div className="h-5 bg-slate-200 rounded w-1/3 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-1/4 mb-4" />
      <div className="h-3 bg-slate-100 rounded w-2/3" />
    </div>
  </div>
);

export default PostSkeleton;
