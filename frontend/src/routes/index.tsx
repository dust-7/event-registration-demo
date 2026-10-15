import { Route, Routes } from 'react-router-dom';
import RootLayout from './RootLayout';
import HomePage from '../features/home/HomePage';
import AdminPage from '../features/admin/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
