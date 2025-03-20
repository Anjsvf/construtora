import { useState, useEffect } from 'react';
import {  Calendar } from 'lucide-react';
import { getProjects } from '../services/projects.service';
import { getFullImageUrl } from '../services/api';
import ImageViewer from '../components/ImageViewer';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  status?: 'Em andamento' | 'Concluído';
  lastUpdate?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        const data = await getProjects();
        
        // Usar os projetos diretamente do backend, sem gerar status aleatório
        setProjects(data);
        
      } catch (err) {
        console.error('Failed to load projects:', err);
        setError('Falha ao carregar projetos. Por favor, tente novamente mais tarde.');
        // Fallback data if API fails
        setProjects([
          {
            _id: '1',
            title: "Edifício Comercial Aurora",
            description: "Centro Empresarial com 20 andares localizado no coração da cidade. Projeto com certificação LEED e tecnologias sustentáveis.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'Concluído' as const,
            lastUpdate: new Date().toISOString().split('T')[0]
          },
          {
            _id: '2',
            title: "Residencial Jardins",
            description: "Condomínio de alto padrão com 150 unidades, área de lazer completa e segurança 24 horas.",
            image: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'Em andamento' as const,
            lastUpdate: new Date().toISOString().split('T')[0]
          },
          {
            _id: '3',
            title: "Shopping Center Plaza",
            description: "Centro comercial com 200 lojas, praça de alimentação e 6 salas de cinema.",
            image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'Concluído' as const,
            lastUpdate: new Date().toISOString().split('T')[0]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Nossos Projetos</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Conheça alguns dos nossos principais projetos em andamento e já realizados
          </p>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <ImageViewer
                    src={getFullImageUrl(project.image)}
                    alt={project.title}
                  />
                  
                  {/* Status badge */}
                  {project.status && (
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Concluído' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {new Date(project.createdAt).getFullYear()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  {/* Data de criação e atualização */}
                  <div className="flex flex-col space-y-2 text-sm text-gray-500">
                    {project.status === 'Em andamento' && project.lastUpdate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Conclusão prevista: {new Date(project.lastUpdate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}