import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProjetosPage } from './pages/ProjetosPage';
import { ProjetoDetalhePage } from './pages/ProjetoDetalhesPage';
import { QrScannerPage } from './pages/QrScannerPage';
import { BottomNav } from './components/BottomNav';

export default function App(){
  const { pathname } = useLocation()
  const esconderNav = pathname.startsWith('/projetos/')
  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<Navigate to="/projetos" replace />} />
        <Route path='/projetos' element={<ProjetosPage/>}/>
        <Route path='/projetos/:id' element={<ProjetoDetalhePage/>}/>
        <Route path="/eventos" element={<p className="vazio">Em breve</p>} />   {/* placeholders */}
        <Route path="/mapa" element={<p className="vazio">Em breve</p>} />
        <Route path="/votos" element={<p className="vazio">Em breve</p>} />
        <Route path='/projetos/:id/votar' element={<QrScannerPage/>}/>
      </Routes>
      {!esconderNav && <BottomNav/>}
    </div>
  )
}