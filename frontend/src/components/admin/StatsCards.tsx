import React from 'react';
import { Building2, Users, FileText, Settings } from 'lucide-react';

interface StatsCardsProps {
  projectCount: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ projectCount }) => {
  const stats = [
    { name: 'Projetos Ativos', value: projectCount.toString(), icon: Building2 },
    { name: 'Funcionários', value: '324', icon: Users },
    { name: 'Relatórios', value: '56', icon: FileText },
    { name: 'Configurações', value: '3', icon: Settings },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {React.createElement(stat.icon, { className: 'h-6 w-6 text-blue-600' })}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;