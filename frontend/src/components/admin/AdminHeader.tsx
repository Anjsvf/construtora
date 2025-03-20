import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogOut } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Painel Administrativo</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-700 hover:text-blue-600"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;