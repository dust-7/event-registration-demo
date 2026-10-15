import { Route, Routes } from 'react-router-dom';
import RootLayout from './RootLayout';
import PublicPage from '../features/public/PublicPage';
import AdminPage from '../features/admin/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<PublicPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
