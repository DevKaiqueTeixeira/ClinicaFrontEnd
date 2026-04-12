import { motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Heart,
  LogOut,
  Menu,
  PawPrint,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import { formatConsultaDate } from "../dashboard.data";
import type { Cliente, Consulta, Pet } from "../dashboard.types";
import { SidebarButton, StatCard, StatusBadge } from "./DashboardUI";

export function DashboardSidebar({
  sidebarOpen,
  activeMenu,
  cliente,
  onCloseSidebar,
  onMenuClick,
  onOpenPets,
  onLogout,
}: {
  sidebarOpen: boolean;
  activeMenu: string;
  cliente: Cliente;
  onCloseSidebar: () => void;
  onMenuClick: (menu: string) => void;
  onOpenPets: () => void;
  onLogout: () => void;
}) {
  return (
    <motion.aside
      initial={{ x: -220, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={[
        "fixed inset-y-0 left-0 z-50 w-72 border-r border-teal-800/30",
        "bg-gradient-to-b from-teal-800 to-teal-900 text-white shadow-2xl",
        "transition-transform duration-300 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-white/15 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <PawPrint size={22} />
              </div>
              <div>
                <p className="text-lg leading-tight">PetCare</p>
                <p className="text-xs text-teal-100/80">Painel do cliente</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={onCloseSidebar}
              className="rounded-lg p-2 text-teal-50 transition hover:bg-white/15 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4 text-sm">
          <SidebarButton
            label="Resumo"
            active={activeMenu === "dashboard"}
            onClick={() => onMenuClick("dashboard")}
            icon={<Calendar size={17} />}
          />
          <SidebarButton
            label="Meu perfil"
            active={activeMenu === "perfil"}
            onClick={() => onMenuClick("perfil")}
            icon={<User size={17} />}
          />
          <SidebarButton
            label="Meus pets"
            active={activeMenu === "pets"}
            onClick={onOpenPets}
            icon={<Heart size={17} />}
          />
          <SidebarButton
            label="Agendar consulta"
            active={activeMenu === "agendar"}
            onClick={() => onMenuClick("agendar")}
            icon={<Plus size={17} />}
          />

          <div className="pt-4">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-teal-50 transition hover:bg-red-500/25"
            >
              <LogOut size={17} />
              <span>Sair da conta</span>
            </button>
          </div>
        </nav>

        <div className="border-t border-white/15 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <User size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{cliente.nome}</p>
              <p className="truncate text-xs text-teal-100/80">{cliente.email}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export function DashboardHeader({
  consultasPendentes,
  onOpenSidebar,
}: {
  consultasPendentes: number;
  onOpenSidebar: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={onOpenSidebar}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-2xl text-slate-900">Minha jornada com o pet</h1>
            <p className="text-sm text-slate-500">Gerencie consultas, dados e pets com facilidade.</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Notificacoes"
          className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100"
        >
          <Bell size={18} />
          {consultasPendentes > 0 ? (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
          ) : null}
        </button>
      </div>
    </header>
  );
}

export function DashboardStats({
  consultasPendentes,
  totalPets,
  consultasConcluidas,
}: {
  consultasPendentes: number;
  totalPets: number;
  consultasConcluidas: number;
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <StatCard label="Consultas pendentes" value={String(consultasPendentes)} icon={<AlertCircle size={17} />} />
      <StatCard label="Pets cadastrados" value={String(totalPets)} icon={<Heart size={17} />} />
      <StatCard label="Consultas concluidas" value={String(consultasConcluidas)} icon={<CheckCircle size={17} />} />
    </section>
  );
}

export function PetsSection({ pets, onAddPet }: { pets: Pet[]; onAddPet: () => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl text-slate-900">Meus pets</h2>
        <button
          type="button"
          onClick={onAddPet}
          className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-800"
        >
          <Plus size={14} />
          Adicionar pet
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pets.map((pet) => (
          <motion.article
            key={pet.id}
            whileHover={{ y: -3 }}
            className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-amber-50/45 p-4"
          >
            <div className="mb-3 text-3xl">{pet.foto}</div>
            <p className="text-sm font-semibold text-slate-800">{pet.nome}</p>
            <p className="text-xs text-slate-500">{pet.tipo}</p>
            <p className="mt-2 text-xs text-slate-500">{pet.raca || "Raca nao informada"}</p>
            <p className="text-xs text-slate-500">{pet.idade || "Idade nao informada"}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function ConsultasSection({
  consultas,
  onAddConsulta,
  onEditConsulta,
  onCancelConsulta,
}: {
  consultas: Consulta[];
  onAddConsulta: () => void;
  onEditConsulta: (consulta: Consulta) => void;
  onCancelConsulta: (id: number) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
        <h2 className="text-xl text-slate-900">Consultas</h2>
        <button
          type="button"
          onClick={onAddConsulta}
          className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-600"
        >
          <Plus size={14} />
          Nova consulta
        </button>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {consultas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Nenhuma consulta cadastrada ainda.
          </div>
        ) : (
          consultas.map((consulta) => (
            <motion.article
              key={consulta.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {consulta.petNome} - {consulta.tipo}
                  </p>
                  <p className="text-xs text-slate-500">{consulta.veterinario}</p>
                </div>
                <StatusBadge status={consulta.status} />
              </div>

              <div className="mb-2 flex flex-wrap gap-4 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} />
                  {formatConsultaDate(consulta.data)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  {consulta.hora}
                </span>
              </div>

              {consulta.observacoes ? <p className="text-xs text-slate-600">{consulta.observacoes}</p> : null}

              {consulta.status !== "concluido" ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEditConsulta(consulta)}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                  >
                    <Edit size={12} />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onCancelConsulta(consulta.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
                  >
                    <Trash2 size={12} />
                    Cancelar
                  </button>
                </div>
              ) : null}
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
}
