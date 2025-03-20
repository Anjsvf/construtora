import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { Edit, X, Plus } from 'lucide-react';
import ImageViewer from '../ImageViewer';
import { createProject, updateProject, deleteProject } from '../../services/projects.service';
import { getFullImageUrl } from '../../services/api';

interface ApiProject {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface FormDataType {
  title: string;
  description: string;
}

interface ProjectManagerProps {
  recentProjects: ApiProject[];
  isLoading: boolean;
  onProjectsUpdate: () => Promise<void>;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({
  recentProjects,
  isLoading,
  onProjectsUpdate
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [formData, setFormData] = useState<FormDataType>({ title: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddProject = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData({ title: '', description: '' });
    setProjectFile(null);
    setImagePreview('');
  };

  const handleEditProject = (project: ApiProject) => {
    setShowForm(true);
    setEditingId(project._id);
    setFormData({ title: project.title, description: project.description });
    setImagePreview(getFullImageUrl(project.image));
    setProjectFile(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      if (editingId) {
        await updateProject(editingId, formData, projectFile || undefined);
      } else {
        if (!projectFile) {
          alert('Por favor, selecione uma imagem para o projeto.');
          setIsUploading(false);
          return;
        }
        await createProject(formData, projectFile);
      }
      await onProjectsUpdate();
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '' });
      setImagePreview('');
      setProjectFile(null);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Erro ao salvar o projeto. Por favor, tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveProject = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await deleteProject(id);
        await onProjectsUpdate();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Erro ao excluir o projeto. Por favor, tente novamente.');
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProjectFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Gerenciar Projetos da Página Inicial</h3>
        <button
          onClick={handleAddProject}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="-ml-0.5 mr-2 h-4 w-4" />
          Adicionar Projeto
        </button>
      </div>
      {showForm && (
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="project-image" className="block text-sm font-medium text-gray-700">
                  Imagem do Projeto
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="project-image"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5 text-gray-600" />
                    Selecionar imagem
                  </button>
                  <span className="ml-5 text-sm text-gray-500">
                    {isUploading ? 'Carregando...' : projectFile ? 'Imagem selecionada' : editingId ? 'Opcional' : 'Obrigatório'}
                  </span>
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <div className="mt-2 h-40 w-full bg-gray-100 rounded-md overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="pt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300"
              >
                {isUploading ? 'Salvando...' : editingId ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <div key={project._id} className="bg-gray-50 rounded-lg overflow-hidden shadow">
                <div className="h-48 w-full relative">
                  <ImageViewer src={getFullImageUrl(project.image)} alt={project.title} />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleRemoveProject(project._id)}
                      className="bg-white p-1.5 rounded-full shadow hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900">{project.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;