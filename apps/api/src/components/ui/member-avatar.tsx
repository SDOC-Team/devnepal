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
        className="public-discovery__monogram"
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
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
    />
  );
}
