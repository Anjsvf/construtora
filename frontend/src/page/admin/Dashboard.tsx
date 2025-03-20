import  { useState, useEffect } from 'react';
import { getProjects } from '../../services/projects.service';
import { getActiveBanner } from '../../services/banner.service';
import { getFullImageUrl } from '../../services/api';


import AdminHeader from '../../components/admin//AdminHeader';
import StatsCards from '../../components/admin/StatsCards';
import BannerManager from '../../components/admin/BannerManager';
import ProjectsStatusTable from '../../components/admin/ProjectsStatusTable';
import ProjectManager from '../../components/admin/ProjectManager';


interface ProjectStatus {
  _id: string;
  name: string;
  status: 'Em andamento' | 'Concluído';
  progress: number;
  lastUpdate: string;
}

interface ApiProject {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  status?: 'Em andamento' | 'Concluído';
  lastUpdate?: string;
}

export default function AdminDashboard() {

  const [projectsStatus, setProjectsStatus] = useState<ProjectStatus[]>([]);

  const [recentProjects, setRecentProjects] = useState<ApiProject[]>([]);
  const [bannerImage, setBannerImage] = useState<string>('');
  const [activeBannerId, setActiveBannerId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
   
      const projectsData = await getProjects();
      setRecentProjects(projectsData);

      
      const statusList: ProjectStatus[] = projectsData.map((project) => {
        const status = project.status || 'Em andamento';
        const lastUpdate = project.lastUpdate
          ? new Date(project.lastUpdate).toISOString().split('T')[0]
          : new Date(project.updatedAt).toISOString().split('T')[0];
        const progress = status === 'Concluído' ? 100 : Math.floor(Math.random() * 90) + 10;
        return {
          _id: project._id,
          name: project.title,
          status: status,
          progress,
          lastUpdate: lastUpdate,
        };
      });
      setProjectsStatus(statusList);

      try {
        const banner = await getActiveBanner();
        if (banner && banner.image) {
          setBannerImage(getFullImageUrl(banner.image));
          setActiveBannerId(banner._id);
        }
      } catch (error) {
        console.error('Error loading banner:', error);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = (updatedProjects: ProjectStatus[]) => {
    setProjectsStatus(updatedProjects);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminHeader />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      
        <StatsCards projectCount={recentProjects.length} />

 
        <BannerManager 
          bannerImage={bannerImage}
          activeBannerId={activeBannerId}
          isLoading={isLoading}
          onBannerUpdate={fetchData}
        />

     
        <ProjectsStatusTable 
          projectsStatus={projectsStatus}
          isLoading={isLoading}
          onStatusUpdate={handleStatusUpdate}
        />

       
        <ProjectManager 
          recentProjects={recentProjects}
          isLoading={isLoading}
          onProjectsUpdate={fetchData}
        />
      </div>
    </div>
  );
}