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

const PET_ICON_MAP: Record<string, string> = {
  Cachorro: "🐕",
  Gato: "🐈",
  Coelho: "🐇",
  Passaro: "🦜",
  Hamster: "🐹",
};

function getPetIcon(especie: string): string {
  return PET_ICON_MAP[especie] ?? "🐾";
}

function formatPeso(peso: number): string {
  return Number.isFinite(peso) ? `${peso.toFixed(2)} kg` : "Peso nao informado";
}

export function DashboardSidebar({
  sidebarOpen,
  activeMenu,
  cliente,
  showPerfilWarning,
  onCloseSidebar,
  onMenuClick,
  onOpenPets,
  onLogout,
}: {
  sidebarOpen: boolean;
  activeMenu: string;
  cliente: Cliente;
  showPerfilWarning: boolean;
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
        "fixed inset-y-0 left-0 z-50 w-72 border-r border-orange-200",
        "bg-white text-zinc-800 shadow-[0_18px_48px_rgba(29,22,16,0.14)]",
        "transition-transform duration-300 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      ].join(" ")}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-zinc-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-200 bg-orange-100 text-orange-700">
                <PawPrint size={22} />
              </div>
              <div>
                <p className="text-lg leading-tight font-semibold tracking-tight text-zinc-900">PetCare</p>
                <p className="max-w-[180px] truncate text-[11px] font-semibold uppercase tracking-wide text-orange-700">
                  BEM VINDO : {cliente.nome}
                </p>
                <p className="text-xs text-zinc-500">Painel do cliente</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={onCloseSidebar}
              className="rounded-lg p-2 text-orange-700 transition hover:bg-orange-50 lg:hidden"
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
            label={
              <span className="inline-flex items-center gap-2">
                Meu perfil
                {showPerfilWarning ? (
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                    !
                  </span>
                ) : null}
              </span>
            }
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
              className="flex w-full items-center gap-2 rounded-xl border border-orange-200 px-3 py-2 text-left text-orange-700 transition hover:border-orange-300 hover:bg-orange-50"
            >
              <LogOut size={17} />
              <span>Sair da conta</span>
            </button>
          </div>
        </nav>

        <div className="border-t border-zinc-200 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/70 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700">
              <User size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-800">{cliente.nome}</p>
              <p className="truncate text-xs text-zinc-600">{cliente.email}</p>
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
    <header className="sticky top-0 z-20 border-b border-zinc-300 bg-white/88 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={onOpenSidebar}
            className="rounded-lg border border-zinc-300 p-2 text-zinc-700 transition hover:bg-zinc-100 lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Minha jornada com o pet</h1>
            <p className="text-sm text-zinc-600">Gerencie consultas, dados e pets com uma visao completa.</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Notificacoes"
          className="relative rounded-xl border border-zinc-300 bg-white p-2 text-zinc-700 transition hover:bg-zinc-100"
        >
          <Bell size={18} />
          {consultasPendentes > 0 ? (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
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

export function PetsSection({
  pets,
  onAddPet,
  onEditPet,
  onDeletePet,
}: {
  pets: Pet[];
  onAddPet: () => void;
  onEditPet: (pet: Pet) => void;
  onDeletePet: (id: number) => void;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-[0_16px_36px_rgba(18,18,18,0.08)] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Meus pets</h2>
        <button
          type="button"
          onClick={onAddPet}
          className="inline-flex items-center gap-1 rounded-lg bg-orange-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-800"
        >
          <Plus size={14} />
          Adicionar pet
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
          Nenhum pet cadastrado ainda.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pets.map((pet) => (
            <motion.article
              key={pet.id}
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-linear-to-br from-white via-orange-50/50 to-zinc-100 p-4"
            >
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-orange-400" />
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-3xl">
                {getPetIcon(pet.especie)}
              </div>
              <p className="text-sm font-semibold text-zinc-800">{pet.nome}</p>
              <p className="text-xs text-zinc-500">{pet.especie}</p>
              <p className="mt-2 text-xs text-zinc-500">{pet.raca || "Raca nao informada"}</p>
              <p className="text-xs text-zinc-500">{pet.sexo || "Sexo nao informado"}</p>
              <p className="text-xs text-zinc-500">{formatPeso(pet.peso)} - {pet.porte || "Porte nao informado"}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEditPet(pet)}
                  className="inline-flex items-center gap-1 rounded-lg bg-zinc-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800"
                >
                  <Edit size={12} />
                  Atualizar
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePet(pet.id)}
                  className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orange-600"
                >
                  <Trash2 size={12} />
                  Excluir
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}

export function ConsultasSection({
  consultas,
  onAddConsulta,
  onEditConsulta,
  onCancelConsulta,
  canCreateConsulta,
}: {
  consultas: Consulta[];
  onAddConsulta: () => void;
  onEditConsulta: (consulta: Consulta) => void;
  onCancelConsulta: (id: number) => void;
  canCreateConsulta: boolean;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white shadow-[0_16px_36px_rgba(18,18,18,0.08)]">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 sm:px-5">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Consultas</h2>
        <button
          type="button"
          onClick={onAddConsulta}
          disabled={!canCreateConsulta}
          className={[
            "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition",
            canCreateConsulta
              ? "bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
              : "cursor-not-allowed bg-zinc-300 text-zinc-500",
          ].join(" ")}
        >
          <Plus size={14} />
          Nova consulta
        </button>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {consultas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
            Nenhuma consulta cadastrada ainda.
          </div>
        ) : (
          consultas.map((consulta) => (
            <motion.article
              key={consulta.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-zinc-200 bg-zinc-50/90 p-4 shadow-[0_8px_18px_rgba(16,16,16,0.05)]"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-800">
                    {consulta.petNome} - {consulta.tipo}
                  </p>
                  <p className="text-xs text-zinc-500">{consulta.veterinario}</p>
                </div>
                <StatusBadge status={consulta.status} />
              </div>

              <div className="mb-2 flex flex-wrap gap-4 text-xs text-zinc-600">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} />
                  {formatConsultaDate(consulta.data)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  {consulta.hora}
                </span>
              </div>

              {consulta.observacoes ? <p className="text-xs text-zinc-600">{consulta.observacoes}</p> : null}

              {consulta.status === "pendente" || consulta.status === "confirmado" ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEditConsulta(consulta)}
                    className="inline-flex items-center gap-1 rounded-lg bg-zinc-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800"
                  >
                    <Edit size={12} />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onCancelConsulta(consulta.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orange-600"
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
