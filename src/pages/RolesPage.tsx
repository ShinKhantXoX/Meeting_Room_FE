import { motion } from "framer-motion";

export default function RolesPage() {
  const roles = [
    {
      name: "admin",
      description: "Full access to the application.",
      permissions: [
        "Manage users (create, edit roles, delete)",
        "View summary",
        "Create and delete any booking",
      ],
    },
    {
      name: "owner",
      description: "Elevated access for viewing and managing bookings.",
      permissions: [
        "View summary",
        "View bookings grouped by user",
        "Delete any booking",
      ],
    },
    {
      name: "user",
      description: "Basic access for personal booking management.",
      permissions: [
        "Create bookings",
        "View all bookings",
        "Delete own bookings only",
      ],
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Role Definitions</h1>
      <p className="text-gray-600 mb-6">
        This page describes what each role can do in the application.
      </p>
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
              {role.name}
            </h2>
            <p className="text-sm text-gray-600 mb-3">{role.description}</p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {role.permissions.map((perm) => (
                <li key={perm}>{perm}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
