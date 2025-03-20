import { apiRequest } from './api';
import { getToken } from './auth.service';

export interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  status?: 'Em andamento' | 'Concluído';
  lastUpdate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  title: string;
  description: string;
}

// Get all projects
export const getProjects = async (): Promise<Project[]> => {
  return apiRequest('/projects');
};

// Get a single project by ID
export const getProjectById = async (id: string): Promise<Project> => {
  return apiRequest(`/projects/${id}`);
};

// Create a new project with image upload
export const createProject = async (
  data: ProjectInput, 
  imageFile: File
): Promise<Project> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('image', imageFile);

  return apiRequest('/projects', {
    method: 'POST',
    body: formData
  });
};

// Update an existing project
export const updateProject = async (
  id: string, 
  data: ProjectInput, 
  imageFile?: File
): Promise<Project> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  return apiRequest(`/projects/${id}`, {
    method: 'PUT',
    body: formData
  });
};

// Update project status
export const updateProjectStatus = async (
  id: string,
  status: 'Em andamento' | 'Concluído'
): Promise<Project> => {
  console.log(`Enviando requisição de atualização para projeto: ${id}, status: ${status}`);
  try {
    const token = getToken();
    console.log('Token encontrado:', token ? 'Sim' : 'Não');

    const result = await apiRequest<Project>(`/projects/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({ status })
    });
    
    console.log('Resultado da atualização de status:', result);
    return result;
  } catch (error) {
    console.error('Erro na função updateProjectStatus:', error);
    throw error;
  }
};

// Update project's last update date
export const updateProjectDate = async (
  id: string,
  date: string
): Promise<Project> => {
  console.log(`Enviando requisição de atualização de data para projeto: ${id}, data: ${date}`);
  try {
    const token = getToken();
    console.log('Token encontrado:', token ? 'Sim' : 'Não');

    const result = await apiRequest<Project>(`/projects/${id}/update-date`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({ date })
    });
    
    console.log('Resultado da atualização de data:', result);
    return result;
  } catch (error) {
    console.error('Erro na função updateProjectDate:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/projects/${id}`, {
    method: 'DELETE'
  });
}; 