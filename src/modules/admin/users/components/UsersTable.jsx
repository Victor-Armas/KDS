import { useState } from "react";
import {
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Shield,
  KeyRound,
} from "lucide-react";
import { useToggleUserActive, useDeleteUser } from "../hooks/useUsers";
import { useAuth } from "@/context/AuthContext";
import UserRoleBadge from "./UserRoleBadge";
import ConfirmModal from "@/shared/ConfirmModal";
import ModalResetPassword from "./ModalResetPassword";

export default function UsersTable({ users, isFetching, onEdit }) {
  const { user: currentUser } = useAuth();
  const toggleActive = useToggleUserActive();
  const deleteUser = useDeleteUser();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div
        className={`rounded-2xl border overflow-hidden transition-opacity duration-200
        bg-softwhite dark:bg-[#1a1816]
        border-cream dark:border-white/6
        shadow-sm dark:shadow-black/20
        ${isFetching ? "opacity-60" : "opacity-100"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cream dark:border-white/6">
                {["Usuario", "Rol", "Estado", "Miembro desde", "Acciones"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-[10px] uppercase font-black tracking-widest text-charcoal/40 dark:text-white/30 ${i === 4 ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-cream dark:divide-white/5">
              {users.length > 0 ? (
                users.map((u) => {
                  const isSelf = u.id === currentUser?.id;

                  return (
                    <tr
                      key={u.id}
                      className="group hover:bg-cream/30 dark:hover:bg-white/3 transition-colors"
                    >
                      {/* Usuario */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-chile/10 dark:bg-chile/15 flex items-center justify-center shrink-0 font-bold text-chile text-sm">
                            {u.full_name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-charcoal dark:text-stone-100 leading-tight">
                              {u.full_name || "Sin nombre"}
                            </p>
                            {isSelf && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-chile bg-chile/10 px-1.5 py-0.5 rounded-md">
                                Tú
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Rol */}
                      <td className="px-5 py-3.5">
                        <UserRoleBadge role={u.role} />
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${u.is_active ? "text-hoja" : "text-charcoal/35 dark:text-white/25"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${u.is_active ? "bg-hoja" : "bg-charcoal/25 dark:bg-white/20"}`}
                          />
                          {u.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-charcoal/40 dark:text-white/30 font-medium">
                          {formatDate(u.created_at)}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end items-center gap-2">
                          {/* Toggle activo */}
                          {!isSelf && (
                            <button
                              onClick={() =>
                                toggleActive.mutate({
                                  id: u.id,
                                  is_active: !u.is_active,
                                })
                              }
                              disabled={toggleActive.isPending}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer border ${
                                u.is_active
                                  ? "text-hoja border-hoja/25 bg-hoja/8 dark:bg-hoja/12 hover:bg-chile/10 hover:text-chile hover:border-chile/25 dark:hover:bg-chile/12"
                                  : "text-charcoal/40 dark:text-white/30 border-charcoal/15 dark:border-white/10 bg-charcoal/5 dark:bg-white/5 hover:text-hoja hover:border-hoja/25 hover:bg-hoja/8 dark:hover:bg-hoja/10"
                              }`}
                            >
                              {u.is_active ? (
                                <>
                                  <ToggleRight size={13} /> Activo
                                </>
                              ) : (
                                <>
                                  <ToggleLeft size={13} /> Inactivo
                                </>
                              )}
                            </button>
                          )}

                          {/* Reset contraseña */}
                          {!isSelf && (
                            <button
                              onClick={() => setResetTarget(u)}
                              title="Cambiar contraseña"
                              className="p-2 rounded-lg text-charcoal/30 dark:text-white/25 hover:text-mostaza hover:bg-mostaza/10 dark:hover:bg-mostaza/15 transition-all cursor-pointer"
                            >
                              <KeyRound size={15} />
                            </button>
                          )}

                          {/* Editar */}
                          <button
                            onClick={() => onEdit(u)}
                            title="Editar"
                            className="p-2 rounded-lg text-charcoal/30 dark:text-white/25 hover:text-mostaza hover:bg-mostaza/10 dark:hover:bg-mostaza/15 transition-all cursor-pointer"
                          >
                            <Edit2 size={15} />
                          </button>

                          {/* Eliminar */}
                          {!isSelf && (
                            <button
                              onClick={() => setDeleteTarget(u)}
                              title="Eliminar"
                              className="p-2 rounded-lg text-charcoal/30 dark:text-white/25 hover:text-chile hover:bg-chile/10 dark:hover:bg-chile/15 transition-all cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}

                          {/* Protección propia */}
                          {isSelf && (
                            <div
                              title="Tu cuenta está protegida"
                              className="p-2 text-charcoal/15 dark:text-white/10"
                            >
                              <Shield size={15} />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-16 text-center">
                    <p className="text-sm text-charcoal/30 dark:text-white/25 font-medium">
                      No se encontraron usuarios
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteUser.mutate(deleteTarget?.id)}
        title="Eliminar Usuario"
        message={`¿Eliminar a "${deleteTarget?.full_name}"? Esta acción borrará su cuenta permanentemente y no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      <ModalResetPassword
        isOpen={!!resetTarget}
        onClose={() => setResetTarget(null)}
        user={resetTarget}
      />
    </>
  );
}
