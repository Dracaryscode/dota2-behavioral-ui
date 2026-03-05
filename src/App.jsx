import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Brain, Target } from 'lucide-react';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. React llama a tu API de Python en el puerto 8000
    axios.get('http://localhost:8000/api/rendimiento')
      .then(response => {
        // Transformamos los datos para que Recharts los entienda fácil
        const formattedData = response.data.map((match, index) => ({
          name: `P${index + 1}`, // Partida 1, Partida 2...
          kda: match.kda,
          media_movil: match.kda_rolling_avg,
          heroe: match.hero_name
        }));
        setData(formattedData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al conectar con la API:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-xl text-slate-600 font-medium animate-pulse">Cargando análisis cognitivo...</p>
      </div>
    );
  }

  // 2. Calculamos KPIs rápidos
  const avgKda = (data.reduce((acc, curr) => acc + curr.kda, 0) / data.length).toFixed(2);
  const currentTrend = data[data.length - 1]?.media_movil.toFixed(2);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado para los Psicólogos */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Brain className="text-blue-600" size={32} />
            Dashboard de Análisis Conductual
          </h1>
          <p className="text-slate-500 mt-2">
            Monitoreo de rendimiento técnico y umbrales de fatiga en sesiones prolongadas.
          </p>
        </header>

        {/* Tarjetas de Resumen (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Target size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Capacidad Técnica Promedio (KDA)</p>
              <p className="text-2xl font-bold text-slate-800">{avgKda}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><Activity size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Estabilidad Actual (Media Móvil)</p>
              <p className="text-2xl font-bold text-slate-800">{currentTrend}</p>
            </div>
          </div>
        </div>

        {/* El Gráfico Principal */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Línea de Tiempo: Tendencia Cognitiva vs. Fatiga</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                
                {/* Línea de Fatiga (Media Móvil) */}
                <Line 
                  type="monotone" 
                  name="Estado Cognitivo Estable (Tendencia)"
                  dataKey="media_movil" 
                  stroke="#e11d48" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }} 
                />
                
                {/* Línea de Rendimiento por Partida */}
                <Line 
                  type="monotone" 
                  name="Rendimiento Instantáneo (KDA)"
                  dataKey="kda" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#94a3b8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-500 mt-4 italic">
            * Criterio Clínico: Una caída sostenida de la línea roja (tendencia) por debajo del promedio indica un posible inicio de fatiga mental.
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;