import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function RolesPage() {
  const { t } = useTranslation();
  const roles = [
    {
      name: "admin",
      descKey: "roles.adminDesc" as const,
      permissionKeys: [
        "roles.permissions.adminManage",
        "roles.permissions.adminSummary",
        "roles.permissions.adminBookings",
      ] as const,
    },
    {
      name: "owner",
      descKey: "roles.ownerDesc" as const,
      permissionKeys: [
        "roles.permissions.ownerSummary",
        "roles.permissions.ownerGrouped",
        "roles.permissions.ownerDelete",
      ] as const,
    },
    {
      name: "user",
      descKey: "roles.userDesc" as const,
      permissionKeys: [
        "roles.permissions.userCreate",
        "roles.permissions.userView",
        "roles.permissions.userDeleteOwn",
      ] as const,
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{t("roles.title")}</h1>
      <p className="text-gray-600 mb-6">{t("roles.intro")}</p>
      <div className="space-y-4">
        {roles.map((role, index) => (
          <motion.div
            key={role.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 bg-white border border-gray-200 rounded"
          >
            <h2 className="font-medium text-gray-900 capitalize mb-1">
              {t(`roles.${role.name}`)}
            </h2>
            <p className="text-sm text-gray-600 mb-3">{t(role.descKey)}</p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {role.permissionKeys.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
