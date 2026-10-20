import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProjetosPage } from './pages/ProjetosPage';
import { ProjetoDetalhePage } from './pages/ProjetoDetalhesPage';
import { VotarPage } from './pages/VotarPage'; 
import { BottomNav } from './components/BottomNav';
import { VotosPage } from './pages/VotosPage';
import { EventosPage } from './pages/EventoPage';
import MapaPage  from './pages/MapaPage';

export default function App(){
  const { pathname } = useLocation()
  const esconderNav = pathname.startsWith('/projetos/')
  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<Navigate to="/projetos" replace />} />
        <Route path='/projetos' element={<ProjetosPage/>}/>
        <Route path='/projetos/:id' element={<ProjetoDetalhePage/>}/>
        <Route path="/eventos" element={<EventosPage/>} />
        <Route path="/mapa" element={<MapaPage/>} />
        <Route path='/votos' element={<VotosPage/>} />
        <Route path='/projetos/:id/votar' element={<VotarPage/>}/>
      </Routes>
      {!esconderNav && <BottomNav/>}
    </div>
  )
}