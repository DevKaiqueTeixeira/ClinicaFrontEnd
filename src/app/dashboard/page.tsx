"use client";

import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    User,
    Calendar,
    ClipboardList,
    LogOut,
    Bell,
    Menu,
    X,
    Plus,
    Edit,
    Trash2,
    Heart,
    PawPrint,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// ============================================
// DADOS MOCK
// ============================================


// ============================================
// COMPONENTE PRINCIPAL - DASHBOARD CLIENTE
// ============================================
type Cliente = {
    nome: string;
    email: string;
};
export default function DashboardCliente() {
    const [cliente, setCliente] = useState<Cliente | null>(null);

    useEffect(() => {
        async function buscarUsuario() {
            const res = await fetch("http://localhost:8080/clientes/user", {
                credentials: "include",
            });

            if (!res.ok) {
                console.log("Não autenticado");
                return;
            }

            const data = await res.json();
            setCliente(data);
        }

        buscarUsuario();
    }, []);
    const router = useRouter();
    useEffect(() => {
        async function verificar() {
            const res = await fetch("http://localhost:8080/clientes/user", {
                credentials: "include",
            });

            if (!res.ok) {
                router.push("/login");
            }
        }

        verificar();
    }, []);
    const [pets, setPets] = useState([
        {
            id: 1,
            nome: "Rex",
            tipo: "Cachorro",
            raca: "Golden Retriever",
            idade: "3 anos",
            foto: "🐕",
        },
        {
            id: 2,
            nome: "Mimi",
            tipo: "Gato",
            raca: "Persa",
            idade: "2 anos",
            foto: "🐈",
        },
    ]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [showAgendarModal, setShowAgendarModal] = useState(false);
    const [showPetModal, setShowPetModal] = useState(false);
    const [editingConsulta, setEditingConsulta] = useState<number | null>(null);

    const [consultas, setConsultas] = useState([
        {
            id: 1,
            petId: 1,
            petNome: "Rex",
            tipo: "Consulta de Rotina",
            data: "2026-04-15",
            hora: "14:30",
            veterinario: "Dr. Carlos Silva",
            status: "confirmado",
            observacoes: "Checkup geral",
        },
        {
            id: 2,
            petId: 2,
            petNome: "Mimi",
            tipo: "Vacinação",
            data: "2026-04-18",
            hora: "10:00",
            veterinario: "Dra. Ana Santos",
            status: "pendente",
            observacoes: "Vacina antirrábica",
        },
        {
            id: 3,
            petId: 1,
            petNome: "Rex",
            tipo: "Exame",
            data: "2026-04-10",
            hora: "16:00",
            veterinario: "Dr. Pedro Costa",
            status: "concluido",
            observacoes: "Exame de sangue - tudo normal",
        },
    ]);

    const [formConsulta, setFormConsulta] = useState({
        petId: "",
        tipo: "",
        data: "",
        hora: "",
        observacoes: "",
    });

    const [formPet, setFormPet] = useState({
        nome: "",
        tipo: "",
        raca: "",
        idade: "",
    });
    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
        setSidebarOpen(false);

        if (menu === "agendar consulta") {
            setShowAgendarModal(true);
        }


    };

    const handleAgendarConsulta = () => {
        if (!formConsulta.petId || !formConsulta.tipo || !formConsulta.data || !formConsulta.hora) {
            toast.error("Preencha todos os campos obrigatórios!");
            return;
        }

        const pet = pets.find((p) => p.id === Number(formConsulta.petId));

        if (editingConsulta) {
            // Editar consulta existente
            setConsultas(
                consultas.map((c) =>
                    c.id === editingConsulta
                        ? {
                            ...c,
                            petId: Number(formConsulta.petId),
                            petNome: pet?.nome || "",
                            tipo: formConsulta.tipo,
                            data: formConsulta.data,
                            hora: formConsulta.hora,
                            observacoes: formConsulta.observacoes,
                        }
                        : c
                )
            );
            toast.success("Consulta atualizada com sucesso!");
            setEditingConsulta(null);
        } else {
            // Nova consulta
            const novaConsulta = {
                id: consultas.length + 1,
                petId: Number(formConsulta.petId),
                petNome: pet?.nome || "",
                tipo: formConsulta.tipo,
                data: formConsulta.data,
                hora: formConsulta.hora,
                veterinario: "A definir",
                status: "pendente",
                observacoes: formConsulta.observacoes,
            };
            setConsultas([novaConsulta, ...consultas]);
            toast.success("Consulta agendada com sucesso!");
        }

        setShowAgendarModal(false);
        setFormConsulta({ petId: "", tipo: "", data: "", hora: "", observacoes: "" });
    };

    const handleEditarConsulta = (consulta: any) => {
        setFormConsulta({
            petId: consulta.petId.toString(),
            tipo: consulta.tipo,
            data: consulta.data,
            hora: consulta.hora,
            observacoes: consulta.observacoes,
        });
        setEditingConsulta(consulta.id);
        setShowAgendarModal(true);
    };

    const handleCancelarConsulta = (id: number) => {
        setConsultas(consultas.filter((c) => c.id !== id));
        toast.success("Consulta cancelada!");
    };

    const handleCadastrarPet = () => {
        if (!formPet.nome || !formPet.tipo) {
            toast.error("Preencha pelo menos nome e tipo!");
            return;
        }

        const emojis: any = {
            Cachorro: "🐕",
            Gato: "🐈",
            Coelho: "🐰",
            Pássaro: "🦜",
            Hamster: "🐹",
        };

        const novoPet = {
            id: pets.length + 1,
            nome: formPet.nome,
            tipo: formPet.tipo,
            raca: formPet.raca,
            idade: formPet.idade,
            foto: emojis[formPet.tipo] || "🐾",
        };

        setPets([...pets, novoPet]);
        toast.success(`${formPet.nome} cadastrado com sucesso!`);
        setShowPetModal(false);
        setFormPet({ nome: "", tipo: "", raca: "", idade: "" });
    };

    const consultasPendentes = consultas.filter((c) => c.status === "pendente" || c.status === "confirmado");

    return (
        <div className="h-screen flex overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
            <Toaster position="top-center" richColors />

            {/* SIDEBAR / NAVBAR */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gradient-to-b from-orange-500 to-orange-600
          shadow-2xl transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="p-4 border-b border-white/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                    <PawPrint className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-white font-bold text-sm">PetCare</h1>
                                    <p className="text-orange-100 text-[10px]">Minha Conta</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

                        <motion.button
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleMenuClick("perfil")}
                            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${activeMenu === "perfil"
                                    ? "bg-white text-orange-600 shadow-lg"
                                    : "text-white hover:bg-white/20"
                                }
              `}
                        >
                            <User size={18} />
                            <span>Meu Perfil</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowPetModal(true)}
                            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${activeMenu === "meus pets"
                                    ? "bg-white text-orange-600 shadow-lg"
                                    : "text-white hover:bg-white/20"
                                }
              `}
                        >
                            <Heart size={18} />
                            <span>Meus Pets</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleMenuClick("agendar consulta")}
                            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${activeMenu === "agendar consulta"
                                    ? "bg-white text-orange-600 shadow-lg"
                                    : "text-white hover:bg-white/20"
                                }
              `}
                        >
                            <Calendar size={18} />
                            <span>Agendar Consulta</span>
                        </motion.button>


                        <div className="pt-4 mt-4 border-t border-white/20">
                            <motion.button
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                    await fetch("http://localhost:8080/auth/logout", {
                                        method: "POST",
                                        credentials: "include",
                                    });

                                    window.location.href = "/login";
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-red-500/30 transition-all duration-200"
                            >
                                <LogOut size={18} />
                                <span>Sair</span>
                            </motion.button>
                        </div>
                    </nav>

                    {/* User Profile Card */}
                    <div className="p-4 border-t border-white/20">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <User size={20} className="text-white" />
                                </div>
                                {cliente ? (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium text-xs truncate">{cliente.nome}</p>
                                            <p className="text-orange-100 text-[10px] truncate">{cliente.email}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p>Carregando...</p>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Minhas Consultas</h2>
                                <p className="text-xs text-gray-500">Gerencie seus agendamentos</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bell size={20} className="text-gray-600" />
                                {consultasPendentes.length > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-7xl mx-auto space-y-4">
                        {/* Meus Pets */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                    <Heart size={18} className="text-orange-600" />
                                    Meus Pets
                                </h3>
                                <button
                                    onClick={() => setShowPetModal(true)}
                                    className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
                                >
                                    <Plus size={14} />
                                    Adicionar Pet
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {pets.map((pet) => (
                                    <motion.div
                                        key={pet.id}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 text-center border border-orange-200"
                                    >
                                        <div className="text-3xl mb-2">{pet.foto}</div>
                                        <p className="text-sm font-semibold text-gray-800">{pet.nome}</p>
                                        <p className="text-xs text-gray-500">{pet.tipo}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Botão Principal Agendar */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowAgendarModal(true)}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            <span className="font-semibold">Agendar Nova Consulta</span>
                        </motion.button>

                        {/* Lista de Consultas */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-base font-bold text-gray-800">Todas as Consultas</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {consultas.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Calendar size={48} className="mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">Nenhuma consulta agendada</p>
                                    </div>
                                ) : (
                                    consultas.map((consulta) => (
                                        <motion.div
                                            key={consulta.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-orange-300 transition-all"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${consulta.status === "confirmado"
                                                    ? "bg-green-100"
                                                    : consulta.status === "pendente"
                                                        ? "bg-yellow-100"
                                                        : "bg-gray-100"
                                                    }`}
                                            >
                                                {consulta.status === "confirmado" ? (
                                                    <CheckCircle size={18} className="text-green-600" />
                                                ) : consulta.status === "pendente" ? (
                                                    <AlertCircle size={18} className="text-yellow-600" />
                                                ) : (
                                                    <XCircle size={18} className="text-gray-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {consulta.petNome} - {consulta.tipo}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{consulta.veterinario}</p>
                                                    </div>
                                                    <span
                                                        className={`text-[10px] px-2 py-1 rounded-full font-medium ${consulta.status === "confirmado"
                                                            ? "bg-green-100 text-green-700"
                                                            : consulta.status === "pendente"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-gray-100 text-gray-700"
                                                            }`}
                                                    >
                                                        {consulta.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        <span>
                                                            {new Date(consulta.data).toLocaleDateString("pt-BR")} às {consulta.hora}
                                                        </span>
                                                    </div>
                                                </div>
                                                {consulta.observacoes && (
                                                    <p className="text-xs text-gray-600 mb-2">{consulta.observacoes}</p>
                                                )}
                                                {consulta.status !== "concluido" && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditarConsulta(consulta)}
                                                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1"
                                                        >
                                                            <Edit size={12} />
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelarConsulta(consulta.id)}
                                                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1"
                                                        >
                                                            <Trash2 size={12} />
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Agendar/Editar Consulta */}
            <AnimatePresence>
                {showAgendarModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowAgendarModal(false);
                                setEditingConsulta(null);
                                setFormConsulta({ petId: "", tipo: "", data: "", hora: "", observacoes: "" });
                            }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                                        {editingConsulta ? "Editar Consulta" : "Agendar Consulta"}
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Pet *</label>
                                            <select
                                                value={formConsulta.petId}
                                                onChange={(e) => setFormConsulta({ ...formConsulta, petId: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            >
                                                <option value="">Selecione um pet</option>
                                                {pets.map((pet) => (
                                                    <option key={pet.id} value={pet.id}>
                                                        {pet.nome} ({pet.tipo})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Tipo de Consulta *
                                            </label>
                                            <select
                                                value={formConsulta.tipo}
                                                onChange={(e) => setFormConsulta({ ...formConsulta, tipo: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            >
                                                <option value="">Selecione o tipo</option>
                                                <option value="Consulta de Rotina">Consulta de Rotina</option>
                                                <option value="Vacinação">Vacinação</option>
                                                <option value="Exame">Exame</option>
                                                <option value="Emergência">Emergência</option>
                                                <option value="Cirurgia">Cirurgia</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Data *</label>
                                            <input
                                                type="date"
                                                value={formConsulta.data}
                                                onChange={(e) => setFormConsulta({ ...formConsulta, data: e.target.value })}
                                                min={new Date().toISOString().split("T")[0]}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Horário *</label>
                                            <input
                                                type="time"
                                                value={formConsulta.hora}
                                                onChange={(e) => setFormConsulta({ ...formConsulta, hora: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Observações
                                            </label>
                                            <textarea
                                                value={formConsulta.observacoes}
                                                onChange={(e) =>
                                                    setFormConsulta({ ...formConsulta, observacoes: e.target.value })
                                                }
                                                rows={3}
                                                placeholder="Descreva os sintomas ou motivo da consulta..."
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => {
                                                setShowAgendarModal(false);
                                                setEditingConsulta(null);
                                                setFormConsulta({ petId: "", tipo: "", data: "", hora: "", observacoes: "" });
                                            }}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleAgendarConsulta}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                                        >
                                            {editingConsulta ? "Salvar" : "Agendar"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Modal Cadastrar Pet */}
            <AnimatePresence>
                {showPetModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowPetModal(false);
                                setFormPet({ nome: "", tipo: "", raca: "", idade: "" });
                            }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Cadastrar Novo Pet</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Nome *</label>
                                            <input
                                                type="text"
                                                value={formPet.nome}
                                                onChange={(e) => setFormPet({ ...formPet, nome: e.target.value })}
                                                placeholder="Ex: Rex"
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo *</label>
                                            <select
                                                value={formPet.tipo}
                                                onChange={(e) => setFormPet({ ...formPet, tipo: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            >
                                                <option value="">Selecione o tipo</option>
                                                <option value="Cachorro">Cachorro</option>
                                                <option value="Gato">Gato</option>
                                                <option value="Coelho">Coelho</option>
                                                <option value="Pássaro">Pássaro</option>
                                                <option value="Hamster">Hamster</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Raça</label>
                                            <input
                                                type="text"
                                                value={formPet.raca}
                                                onChange={(e) => setFormPet({ ...formPet, raca: e.target.value })}
                                                placeholder="Ex: Golden Retriever"
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Idade</label>
                                            <input
                                                type="text"
                                                value={formPet.idade}
                                                onChange={(e) => setFormPet({ ...formPet, idade: e.target.value })}
                                                placeholder="Ex: 3 anos"
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={() => {
                                                setShowPetModal(false);
                                                setFormPet({ nome: "", tipo: "", raca: "", idade: "" });
                                            }}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleCadastrarPet}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                                        >
                                            Cadastrar
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
            )}
        </div>
    );
}