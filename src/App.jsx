import { Routes, Route, Navigate } from 'react-router-dom';
import { ProjetosPage } from './pages/ProjetosPage';
import { BottomNav } from './components/BottomNav';

export default function App(){
  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<Navigate to="/projetos" replace />} />
        <Route path='/projetos' element={<ProjetosPage/>}/>
        <Route path="/eventos" element={<p className="vazio">Em breve</p>} />   {/* placeholders */}
        <Route path="/mapa" element={<p className="vazio">Em breve</p>} />
        <Route path="/votos" element={<p className="vazio">Em breve</p>} />
      </Routes>
      <BottomNav/>
    </div>
  )
}