import UserList from "../components/UserList";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">User management</h1>
      <UserList />
    </div>
  );
}
