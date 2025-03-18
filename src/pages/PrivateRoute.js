import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('authToken'); // Verifique o token no localStorage

  // Se não houver token, redirecione para a página de login
  return token ? element : <Navigate to="/login-administrativo" replace />;
};

export default PrivateRoute;
