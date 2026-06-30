type Props = {
  size?: "sm" | "md";
};

export default function ProBadge({ size = "md" }: Props) {
  const styles = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full bg-blue-100 text-blue-700 ${styles[size]}`}
    >
      ✦ Pro
    </span>
  );
}