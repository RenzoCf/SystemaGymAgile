import React, { useEffect, useState, useMemo } from 'react';
import { API_URL } from "../config"; // Ajusta la ruta (../) según donde esté el archivo
// ======================
// ÍCONOS SVG LOCALES
// ======================
const RefreshCcw = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-7.75 3.5m0 0V3m0 3h7"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 7.75-3.5m0 0V21m0-3h-7"/></svg>
);
const Dumbbell = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4L9.6 9.6M18 10V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2zM4 14h4M16 14h4M4 10H0M24 10h-4"/></svg>
);
const TrendingUp = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 10.5 12.5 5 18"/><polyline points="18 7 22 7 22 11"/></svg>
);
const Zap = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const Users = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M17 14c-2.3 0-4.2-1.7-4.7-4m6.3-5.3c-.9-1.2-2.3-2-4-2s-3.1.8-4 2"/><path d="M12 3v1m0 16v1m-4-8H3m18 0h-4"/></svg>
);
const Flame = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21l-4-4-4 4V13h8zM12 13v-3m0-4v-1"/></svg>
);
const BookOpen = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const LinkIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3.5-3.5a5 5 0 0 0-7.07-7.07L12 13.07"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3.5 3.5a5 5 0 0 0 7.07 7.07L12 10.93"/></svg>
);
const LogOut = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const DollarSign = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const CheckCircle = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const HistoryIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const API_URL = "http://localhost:5000";
const LOGOUT_REDIRECT_URL = "/";

// --- Helpers (FUNCION CORREGIDA PARA FECHAS) ---
const formatDate = (dateString) => {
  if (!dateString) {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);
    return nextMonth.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  if (typeof dateString === 'string' && dateString.includes('-') && dateString.length === 10) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day); 
    return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    return today.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
};

// --- Componentes Reutilizables ---
const DashboardNavbar = ({ username, onLogout }) => (
  <header className="bg-white shadow-xl sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Flame className="text-pink-600 h-7 w-7" />
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">FITNESS DASHBOARD</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium hidden sm:block">¡Hola, {username || 'Cliente'}!</span>
        <button onClick={onLogout} className="px-4 py-2 bg-pink-600 text-white font-semibold rounded-full text-sm hover:bg-pink-700 transition duration-150 shadow-lg shadow-pink-300/50">
          <LogOut className='inline h-4 w-4 mr-1'/> Cerrar Sesión
        </button>
      </div>
    </div>
  </header>
);

const LearningCard = ({ item }) => {
  const typeColorClass = item.type === 'Video' ? 'bg-red-500' : 'bg-indigo-500';

  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
      <div className="h-32 bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundColor: item.category === 'Nutrición' ? '#F97316' : item.category === 'Cardio' ? '#4F46E5' : '#EC4899', backgroundSize: 'cover' }}>
        <span className="text-white font-black text-xl drop-shadow-lg">{item.category}</span>
      </div>
      <div className="p-4">
        <span className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full mb-2 ${typeColorClass}`}>{item.type}</span>
        <h4 className="text-lg font-bold text-gray-900 line-clamp-2">{item.title}</h4>
        <div className="mt-3 text-sm font-semibold text-pink-600 flex items-center">
          <LinkIcon className="h-4 w-4 mr-1"/> Leer/Ver Contenido
        </div>
      </div>
    </a>
  );
};

// --- Componente Principal ---
export default function Dashboard() {
  const simulatedAPI = {
    getMembership: (id) => {
      if (id === "123") {
        return { id: 2, active: true, name: "Plan Pro Intermedio", expiresAt: "2026-03-25" };
      }
      return null;
    },
    getLearningContent: () => {
      return [
        { id: 1, title: "Guía Rápida: Los 5 errores más comunes al usar la cinta.", type: "Artículo", category: "Cardio", link: "https://behumax.com/errores-comunes-al-usar-una-cinta-de-correr/?srsltid=AfmBOoo8AViJZeQ15u6KPKwR961ic6tq7udQUhswI15gs6245CBnznx3", image: "" },
        { id: 2, title: "Receta Post-Entreno: Batido de Proteína y Frutos Rojos.", type: "Video", category: "Nutrición", link: "https://www.hsnstore.com/blog/recetas-fitness/meriendas-saludables/smoothie-de-frutos-rojos-y-whey-protein/?srsltid=AfmBOooRxHogKABjEHK-NfS0U6I1wjM7vz06fy8MXFz7_Bhq039T2rvh", image: "" },
        { id: 3, title: "Técnica Perfecta: Cómo hacer sentadillas sin lesionarte.", type: "Artículo", category: "Fuerza", link: "https://www.fisioterapia-online.com/videos/como-hacer-una-sentadilla-correctamente-sin-hacerse-dano-en-la-espalda-y-rodillas", image: "" },
      ];
    },
  };

  const [user, setUser] = useState({ username: '', role: 'user', id: null });
  const [plans, setPlans] = useState([]);
  const [membership, setMembership] = useState(null);
  const [learningContent, setLearningContent] = useState([]);
  // ⭐ Nuevo estado para el historial
  const [paymentHistory, setPaymentHistory] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, options);
      if (!response.ok && response.status !== 404) {
        let errorData = {};
        try { errorData = await response.json(); } catch(e) {}
        let errorMsg = `Error ${response.status}: Ha ocurrido un problema.`;
        setErrorMessage(errorData?.error || errorMsg);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error en la llamada de red/API:', error);
      if (endpoint.includes('/membership')) return simulatedAPI.getMembership(user.id);
      setErrorMessage(`Error de conexión`);
      return null;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username') || 'Andrea';
    const id = params.get('id') || '123';
    setUser({ username, id, role: 'user' });

    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      // 1. Cargar Planes
      const loadedPlans = await apiCall('/api/plans/landing');
      if (loadedPlans) setPlans(loadedPlans);

      setLearningContent(simulatedAPI.getLearningContent());

      // 2. Cargar Membresía y Historial si existe usuario
      if (id) {
        const loadedMembership = await apiCall(`/api/user/${id}/membership`);
        setMembership(loadedMembership);

        // ⭐ Cargar Historial de Pagos
        const loadedHistory = await apiCall(`/api/user/${id}/payments`);
        if (loadedHistory && Array.isArray(loadedHistory)) {
          setPaymentHistory(loadedHistory);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    window.location.href = LOGOUT_REDIRECT_URL;
  };

  const handlePlanClick = (plan) => {
    const message = `Hola, estoy interesado en adquirir el plan: ${plan.name} (S/ ${plan.price}). Mi usuario es: ${user.username}`;
    window.open(`https://wa.me/51900000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  const membershipStatus = useMemo(() => {
    if (isLoading) return { message: 'Cargando...', active: false, statusText: 'Cargando', color: 'text-gray-500 bg-gray-100' };
    
    if (membership && membership.active) {
      const dateText = formatDate(membership.expiresAt);
      return { 
        message: membership.name, 
        active: true, 
        statusText: 'ACTIVA', 
        color: 'text-green-600 bg-green-100', 
        details: dateText, 
        id: membership.id 
      };
    }

    return { message: 'Sin Membresía', active: false, statusText: 'INACTIVA', color: 'text-red-600 bg-red-100', details: 'No disponible' };
  }, [membership, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCcw className="animate-spin text-pink-600 h-10 w-10" />
        <p className="ml-3 text-lg font-medium text-gray-700">Cargando Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
      <DashboardNavbar username={user.username} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-md" role="alert">
            <strong className="font-bold">Nota: </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {/* SECCIÓN 1: MEMBRESÍA ACTUAL */}
        <section className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
          <div className="w-full lg:w-1/2 bg-white rounded-3xl shadow-2xl p-8 transform transition duration-500 hover:shadow-pink-400/50">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
              <Zap className="h-8 w-8 text-pink-600 mr-3" />
              Tu Experiencia Fitness
            </h2>

            <div className={`p-6 rounded-2xl ${membershipStatus.active ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-800'} shadow-xl transition duration-300`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{membershipStatus.message}</h3>
                <span className={`px-4 py-1 text-xs font-extrabold rounded-full ${membershipStatus.active ? 'bg-white text-pink-600' : 'bg-red-500 text-white'}`}>{membershipStatus.statusText}</span>
              </div>

              <p className="text-sm font-medium opacity-80 mb-4">
                {membershipStatus.active ? `Estás entrenando con el ${membershipStatus.message}. ¡Sigue así!` : '¡Mejora tu entrenamiento! Elige un plan para empezar.'}
              </p>

              <div className="border-t border-white border-opacity-30 pt-3 flex justify-between items-center">
                <p className={`text-sm ${membershipStatus.active ? 'opacity-90' : 'text-gray-600'}`}>Vencimiento: <span className="font-semibold">{membershipStatus.details}</span></p>
                <a href="#planes" className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-150 ${membershipStatus.active ? 'bg-white text-pink-600 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  {membershipStatus.active ? 'Ver mi plan' : 'Ver Planes'}
                </a>
              </div>
            </div>
          </div>
          
          {/* ⭐ SECCIÓN 1.5: HISTORIAL DE PAGOS (NUEVO) */}
          <div className="w-full lg:w-1/2 bg-white rounded-3xl shadow-2xl p-8 transform transition duration-500 hover:shadow-indigo-400/50 flex flex-col">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
              <HistoryIcon className="h-8 w-8 text-indigo-600 mr-3" />
              Historial de Pagos
            </h2>
            
            <div className="flex-grow overflow-y-auto max-h-64 pr-2">
              {paymentHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-4">
                   <p>No tienes pagos registrados aún.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-3 rounded-tl-lg">Fecha</th>
                      <th className="px-3 py-3">Concepto</th>
                      <th className="px-3 py-3">Monto</th>
                      <th className="px-3 py-3 rounded-tr-lg">Método</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((pay) => (
                      <tr key={pay.id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-3 py-3 font-medium text-gray-900">
                          {formatDate(pay.payment_date)}
                        </td>
                        <td className="px-3 py-3 text-gray-600">
                          {pay.plans?.name || "Pago de plan"}
                        </td>
                        <td className="px-3 py-3 font-bold text-green-600">
                          S/ {pay.amount}
                        </td>
                        <td className="px-3 py-3">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                            {pay.payment_method}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: CONTENIDO */}
        {simulatedAPI.getLearningContent().length > 0 && (
          <section>
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10"><BookOpen className="inline h-7 w-7 text-indigo-600 mr-2"/>Tu Zona de Aprendizaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {simulatedAPI.getLearningContent().map(item => (<LearningCard key={item.id} item={item} />))}
            </div>
          </section>
        )}

        {/* SECCIÓN 3: PLANES */}
        <section id="planes">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10"><DollarSign className="inline h-7 w-7 text-pink-600 mr-2"/>Nuestros Planes</h2>
          
          {plans.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 mb-4">📋 No hay planes disponibles en este momento</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-10">
              {plans.map((plan) => {
                const Icon = plan.name.includes("Básico") ? Dumbbell : plan.name.includes("Intermedio") ? TrendingUp : Users;
                const isCurrentPlan = membershipStatus.active && membershipStatus.id === plan.id;

                return (
                  <div key={plan.id} 
                    className={`w-full sm:w-80 bg-white rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition duration-500 ease-in-out hover:shadow-lg 
                    ${isCurrentPlan 
                        ? 'border-4 border-green-500 transform scale-[1.05] shadow-green-500/30' 
                        : plan.highlight 
                            ? 'border-4 border-pink-600 transform scale-[1.05] shadow-pink-500/50' 
                            : 'border border-gray-100 hover:scale-[1.02]' 
                    }`}>
                    
                    <div>
                      <div className="flex justify-center mb-3">
                        {isCurrentPlan ? (
                           <span className="flex items-center text-xs font-black text-white bg-green-500 rounded-full px-4 py-1.5 uppercase tracking-widest">
                             <CheckCircle className="h-4 w-4 mr-1"/> Tu Plan Actual
                           </span>
                        ) : plan.highlight ? (
                           <span className="block text-xs font-black text-white bg-pink-600 rounded-full px-4 py-1.5 uppercase tracking-widest">
                             ¡Más Popular!
                           </span>
                        ) : null}
                      </div>

                      <div className={`text-center mb-4 ${isCurrentPlan ? 'text-green-500' : plan.highlight ? 'text-pink-600' : 'text-indigo-500'}`}>
                        <Icon className="h-12 w-12 mx-auto" />
                      </div>
                      
                      <h3 className="text-3xl font-bold text-gray-900 text-center mb-2">{plan.name}</h3>
                      <p className="text-sm text-gray-500 text-center mb-6">{plan.desc}</p>

                      <div className="text-center my-6">
                        <p className={`text-5xl font-black tracking-tight leading-none ${isCurrentPlan ? 'text-green-600' : 'text-pink-600'}`}>S/ {plan.price}</p>
                        <p className="text-lg font-medium text-gray-500">{plan.duration}</p>
                      </div>

                      <ul className="space-y-4 mb-8 flex-grow">
                        {plan.specs?.map((spec, i) => (
                          <li key={i} className="flex items-start text-base text-gray-700">
                            <svg className={`h-6 w-6 mr-2 flex-shrink-0 ${isCurrentPlan ? 'text-green-500' : 'text-pink-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                        onClick={() => !isCurrentPlan && handlePlanClick(plan)} 
                        disabled={isCurrentPlan}
                        className={`w-full py-3.5 font-bold rounded-full transition duration-300 shadow-lg 
                        ${isCurrentPlan 
                            ? 'bg-green-100 text-green-700 cursor-default' 
                            : plan.highlight 
                                ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-pink-400/50' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-400/50'
                        }`}>
                        {isCurrentPlan ? "Plan Activo" : "¡Quiero este plan!"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}