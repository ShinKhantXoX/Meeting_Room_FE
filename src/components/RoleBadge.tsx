type Role = "admin" | "owner" | "user";

const styles: Record<Role, string> = {
  admin: "bg-red-100 text-red-800",
  owner: "bg-blue-100 text-blue-800",
  user: "bg-green-100 text-green-800",
};

export default function RoleBadge({ role }: { role: string }) {
  const r =
    (role.toLowerCase() as Role) in styles
      ? (role.toLowerCase() as Role)
      : "user";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[r]}`}>
      {r}
    </span>
  );
}
