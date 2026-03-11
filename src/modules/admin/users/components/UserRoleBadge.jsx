const roleConfig = {
  admin: {
    label: "Admin",
    className: "bg-chile/10 dark:bg-chile/15 text-chile",
  },
  waiter: {
    label: "Mesero",
    className: "bg-mostaza/10 dark:bg-mostaza/15 text-mostaza",
  },
  kitchen: {
    label: "Cocina",
    className: "bg-blue-500/10 dark:bg-blue-500/15 text-blue-500",
  },
  client: {
    label: "Cliente",
    className: "bg-hoja/10 dark:bg-hoja/15 text-hoja",
  },
};

export default function UserRoleBadge({ role }) {
  const config = roleConfig[role] || {
    label: role,
    className: "bg-charcoal/10 text-charcoal/60",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
}
