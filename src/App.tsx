import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { Layout } from './components/Layout';
import { Navigation } from './components/Navigation';
import { PrivateRoute } from './components/PrivateRoute';
import { HomePage } from './pages/HomePage';
import { ScanPage } from './pages/ScanPage';
import { MapPage } from './pages/MapPage';
import { StampsPage } from './pages/StampsPage';
import { AuthPage } from './pages/AuthPage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout
          header={<Navigation />}
          footer={
            <div>
              <p>&copy; 2024 デジタルスタンプラリー. All rights reserved.</p>
              <p>街を歩いて、新しい発見をしよう！</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/scan" element={
              <PrivateRoute>
                <ScanPage />
              </PrivateRoute>
            } />
            <Route path="/map" element={
              <PrivateRoute>
                <MapPage />
              </PrivateRoute>
            } />
            <Route path="/stamps" element={
              <PrivateRoute>
                <StampsPage />
              </PrivateRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
