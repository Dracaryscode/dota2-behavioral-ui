import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Brain, Target, Filter, List } from 'lucide-react';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [selectedHero, setSelectedHero] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/rendimiento')
      .then(response => {
        const rawData = response.data.map((match, index) => ({
          ...match,
          name: `P${index + 1}`,
          media_movil: match.kda_rolling_avg
        }));
        
        setData(rawData);
        setFilteredData(rawData);
        
        // Extraer lista única de héroes para el filtro
        const uniqueHeroes = [...new Set(rawData.map(item => item.hero_name))];
        setHeroes(uniqueHeroes.sort());
        
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al conectar con la API:", error);
        setLoading(false);
      });
  }, []);

  // Efecto para filtrar los datos cuando el psicólogo cambia el dropdown
  useEffect(() => {
    if (selectedHero === 'Todos') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(match => match.hero_name === selectedHero));
    }
  }, [selectedHero, data]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 animate-pulse">Cargando análisis cognitivo...</div>;
  }

  // KPIs Dinámicos (cambian según el filtro)
  const avgKda = filteredData.length > 0 ? (filteredData.reduce((acc, curr) => acc + curr.kda, 0) / filteredData.length).toFixed(2) : 0;
  const currentTrend = filteredData.length > 0 ? filteredData[filteredData.length - 1]?.media_movil.toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado y Filtros */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Brain className="text-blue-600" size={32} />
              Dashboard de Análisis Conductual
            </h1>
            <p className="text-slate-500 mt-2">Monitoreo de rendimiento técnico y umbrales de fatiga.</p>
          </div>
          
          {/* El nuevo Filtro Interactivo */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <Filter size={20} className="text-slate-400" />
            <select 
              className="bg-transparent border-none text-slate-700 font-medium focus:outline-none cursor-pointer"
              value={selectedHero}
              onChange={(e) => setSelectedHero(e.target.value)}
            >
              <option value="Todos">Todos los Personajes</option>
              {heroes.map(hero => (
                <option key={hero} value={hero}>{hero}</option>
              ))}
            </select>
          </div>
        </header>

        {/* Tarjetas de Resumen Dinámicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Target size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Capacidad Promedio (KDA)</p>
              <p className="text-2xl font-bold text-slate-800">{avgKda}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><Activity size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Estabilidad Actual (SMA)</p>
              <p className="text-2xl font-bold text-slate-800">{currentTrend}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><List size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Muestra Analizada</p>
              <p className="text-2xl font-bold text-slate-800">{filteredData.length} Partidas</p>
            </div>
          </div>
        </div>

        {/* Gráfico Principal */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Tendencia Cognitiva vs. Fatiga</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" name="Tendencia Base" dataKey="media_movil" stroke="#e11d48" strokeWidth={3} dot={false} />
                <Line type="monotone" name="Rendimiento (KDA)" dataKey="kda" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NUEVO: Tabla de Auditoría Clínica */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Registro Detallado de Sesiones</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Sesión</th>
                  <th className="pb-3 font-medium">Personaje</th>
                  <th className="pb-3 font-medium">Kills</th>
                  <th className="pb-3 font-medium">Deaths</th>
                  <th className="pb-3 font-medium">Assists</th>
                  <th className="pb-3 font-medium">KDA Exacto</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {filteredData.slice().reverse().map((match, i) => (
                  <tr key={match.match_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-medium text-slate-900">{match.name}</td>
                    <td className="py-3">{match.hero_name}</td>
                    <td className="py-3 text-emerald-600">{match.kills}</td>
                    <td className="py-3 text-rose-600">{match.deaths}</td>
                    <td className="py-3 text-blue-600">{match.assists}</td>
                    <td className="py-3 font-semibold">{match.kda.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;