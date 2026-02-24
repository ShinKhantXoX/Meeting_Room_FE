import { useTranslation } from "react-i18next";
import UserList from "../components/UserList";

export default function AdminPage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{t("users.title")}</h1>
      <UserList />
    </div>
  );
}
