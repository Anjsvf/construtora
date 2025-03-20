import React, { useState } from 'react';
import { updateProjectStatus, updateProjectDate } from '../../services/projects.service';

interface ProjectStatus {
  _id: string;
  name: string;
  status: 'Em andamento' | 'Concluído';
  progress: number;
  lastUpdate: string;
}

interface ProjectsStatusTableProps {
  projectsStatus: ProjectStatus[];
  isLoading: boolean;
  onStatusUpdate: (updatedProjects: ProjectStatus[]) => void;
}

const ProjectsStatusTable: React.FC<ProjectsStatusTableProps> = ({
  projectsStatus,
  isLoading,
  onStatusUpdate
}) => {
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleUpdateProjectStatus = async (
    projectId: string,
    newStatus: 'Em andamento' | 'Concluído'
  ) => {
    try {
      await updateProjectStatus(projectId, newStatus);
      const updatedProjects = projectsStatus.map((p) =>
        p._id === projectId
          ? { ...p, status: newStatus, lastUpdate: new Date().toISOString().split('T')[0] }
          : p
      );
      onStatusUpdate(updatedProjects);
      alert(`Status do projeto atualizado para "${newStatus}" com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar status do projeto:', error);
      let errorMessage = 'Erro ao atualizar o status do projeto.';
      if (error instanceof Error) {
        errorMessage += ' Detalhes: ' + error.message;
      }
      alert(errorMessage + ' Por favor, tente novamente.');
    }
  };

  const openDateModal = (projectId: string, currentDate: string) => {
    setSelectedProjectId(projectId);
    setSelectedDate(currentDate);
    setShowDateModal(true);
  };

  const handleUpdateDate = async () => {
    if (!selectedProjectId || !selectedDate) return;
    try {
      await updateProjectDate(selectedProjectId, selectedDate);
      const updatedProjects = projectsStatus.map((p) =>
        p._id === selectedProjectId ? { ...p, lastUpdate: selectedDate } : p
      );
      onStatusUpdate(updatedProjects);
      setShowDateModal(false);
      alert(`Data do projeto atualizada para "${selectedDate}" com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar data do projeto:', error);
      let errorMessage = 'Erro ao atualizar a data do projeto.';
      if (error instanceof Error) {
        errorMessage += ' Detalhes: ' + error.message;
      }
      alert(errorMessage + ' Por favor, tente novamente.');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Projetos Recentes</h3>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projeto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Atualização
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : projectsStatus.length > 0 ? (
                    projectsStatus.map((project) => (
                      <tr key={project._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              project.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {project.status}
                          </span>
                          <div className="mt-2 flex space-x-2">
                            <button
                              onClick={() => handleUpdateProjectStatus(project._id, 'Em andamento')}
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                project.status === 'Em andamento'
                                  ? 'bg-blue-600 text-white cursor-default'
                                  : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                              }`}
                              disabled={project.status === 'Em andamento'}
                            >
                              Em andamento
                            </button>
                            <button
                              onClick={() => handleUpdateProjectStatus(project._id, 'Concluído')}
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                project.status === 'Concluído'
                                  ? 'bg-green-600 text-white cursor-default'
                                  : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                              }`}
                              disabled={project.status === 'Concluído'}
                            >
                              Concluído
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{project.lastUpdate}</div>
                          <button
                            onClick={() => openDateModal(project._id, project.lastUpdate)}
                            className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                          >
                            Editar data
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum projeto encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Date Change Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Editar data de atualização</h3>
            <div className="mb-4">
              <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                id="date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDateModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsStatusTable;