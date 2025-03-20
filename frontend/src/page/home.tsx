import { useState, useEffect } from 'react';
import { ArrowRight, Building, Users, Clock, Award, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/projects.service';
import { getActiveBanner } from '../services/banner.service';
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

// Hero Section Component
const HeroBanner = ({ imageUrl }: { imageUrl: string }) => {
  console.log("HeroBanner renderizando com URL:", imageUrl);
  
  // Estilo inline para garantir que funcione
  const backgroundStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '600px',
    width: '100%',
    position: 'relative' as const
  };

  return (
    <div style={backgroundStyle}>
      {/* Overlay escuro */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}></div>
      
      {/* Conteúdo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          padding: '0 16px',
          maxWidth: '800px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Construindo Sonhos, Realizando Projetos
          </h1>
          <p style={{
            fontSize: '1.5rem',
            marginBottom: '2rem'
          }}>
            Excelência em construção civil há mais de 20 anos
          </p>
          <Link
            to="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              transition: 'background-color 0.3s'
            }}
          >
            Solicite um Orçamento
            <ArrowRight style={{ marginLeft: '0.5rem', height: '1.25rem', width: '1.25rem' }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [bannerImage, setBannerImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // Fetch projects from API
        const projects = await getProjects();
        
        // Usar os projetos diretamente do backend, sem gerar status aleatório
        // Os primeiros 3 projetos são exibidos na página inicial
        setRecentProjects(projects.slice(0, 3));
        
        // Fetch active banner
        try {
          const banner = await getActiveBanner();
          console.log("Banner carregado:", banner);
          
          if (banner && banner.image) {
            const fullImageUrl = getFullImageUrl(banner.image);
            console.log("Definindo URL do banner:", fullImageUrl);
            setBannerImage(fullImageUrl);
          }
        } catch (bannerError) {
          console.error('Failed to load banner:', bannerError);
          // Não define a imagem fallback, depende do backend para fornecer
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Falha ao carregar projetos. Por favor, tente novamente mais tarde.');
        
        // Fallback para projetos padrão com imagens do backend
        // Aqui assumimos que você tem algumas imagens padrão no backend
        setRecentProjects([
          {
            _id: '1',
            image: "default-commercial-building.jpg", // Use seu caminho padrão do backend
            title: "Edifício Comercial Aurora",
            description: "Centro Empresarial com 20 andares",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'Concluído' as const,
            lastUpdate: new Date().toISOString().split('T')[0]
          },
          {
            _id: '2',
            image: "default-residential.jpg", // Use seu caminho padrão do backend
            title: "Residencial Jardins",
            description: "Condomínio de alto padrão",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'Em andamento' as const,
            lastUpdate: new Date().toISOString().split('T')[0]
          },
          {
            _id: '3',
            image: "default-mall.jpg", // Use seu caminho padrão do backend
            title: "Shopping Center Plaza",
            description: "Centro comercial com 200 lojas",
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
    
    fetchData();
  }, []);

  // Adicione um log antes de renderizar
  console.log("Renderizando Home com bannerImage:", bannerImage);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Só renderiza se tiver imagem do banner */}
      {bannerImage ? (
        <HeroBanner imageUrl={bannerImage} />
      ) : (
        <div className="bg-blue-700 h-64 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-3xl font-bold mb-2">Construindo Sonhos, Realizando Projetos</h1>
            <p className="text-xl mb-4">Excelência em construção civil há mais de 20 anos</p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-blue-700 font-bold py-2 px-4 rounded"
            >
              Solicite um Orçamento
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Por que nos escolher?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Projetos Inovadores</h3>
              <p className="text-gray-600">Soluções modernas e sustentáveis para cada projeto</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Equipe Qualificada</h3>
              <p className="text-gray-600">Profissionais experientes e dedicados</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pontualidade</h3>
              <p className="text-gray-600">Compromisso com prazos e cronogramas</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualidade</h3>
              <p className="text-gray-600">Excelência em cada detalhe da construção</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Projetos Recentes</h2>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentProjects.map((project) => {
                const projectImageUrl = getFullImageUrl(project.image);
                console.log(`Imagem do projeto ${project.title}:`, projectImageUrl);
                return (
                  <div key={project._id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                    <div className="w-full h-48 relative">
                      <ImageViewer 
                        src={projectImageUrl} 
                        alt={project.title}
                      />
                      
                      {/* Badge de status no canto superior direito */}
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
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      
                      {/* Data da última atualização */}
                      {project.lastUpdate && (
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Atualizado em: {project.lastUpdate.split('T')[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              Ver todos os projetos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}