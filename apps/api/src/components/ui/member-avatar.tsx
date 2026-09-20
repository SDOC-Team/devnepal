export function MemberAvatar({
  member,
  size = 56,
}: {
  member: { avatarUrl: string | null; displayName: string };
  size?: number;
}) {
  if (member.avatarUrl === null) {
    return (
      <span
        className="grid flex-none place-items-center rounded-circle border border-border bg-primary/5 font-heading text-primary"
        aria-hidden="true"
        style={{ width: size, height: size, fontSize: Math.round(size / 2.6) }}
      >
        {member.displayName.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  return (
    // biome-ignore lint/performance/noImgElement: avatars are locally served files with varying keys; next/image adds no value here
    <img
      src={member.avatarUrl}
      alt={member.displayName}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className="rounded-circle object-cover"
      style={{ width: size, height: size }}
    />
  );
}
