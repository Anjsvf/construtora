import { apiRequest } from './api';

export interface Banner {
  _id: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get the active banner
export const getActiveBanner = async (): Promise<Banner | null> => {
  try {
    const response = await apiRequest<Banner>('/banner');
    console.log('Banner API response:', response);
    return response;
  } catch (error) {
    console.error('Banner API error:', error);
    // Retornamos null em vez de propagar o erro quando não há banner ativo
    if (error instanceof Error && error.message === 'No active banner found') {
      return null;
    }
    throw error;
  }
};

// Get all banners (admin only)
export const getAllBanners = async (): Promise<Banner[]> => {
  return apiRequest('/banner/all');
};

// Upload a new banner (admin only)
export const uploadBanner = async (imageFile: File): Promise<Banner> => {
  // Create FormData for file upload
  const formData = new FormData();
  formData.append('image', imageFile);
  
  console.log('Enviando arquivo:', imageFile.name, imageFile.type, imageFile.size);
  
  try {
    const result = await apiRequest<Banner>('/banner', {
      method: 'POST',
      body: formData
    });
    console.log('Upload bem-sucedido:', result);
    return result;
  } catch (error) {
    console.error('Erro detalhado do upload:', error);
    throw error;
  }
};

// Update banner status (admin only)
export const updateBannerStatus = async (
  id: string, 
  isActive: boolean
): Promise<Banner> => {
  return apiRequest(`/banner/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isActive })
  });
};

// Delete a banner (admin only)
export const deleteBanner = async (id: string): Promise<{ message: string }> => {
  return apiRequest(`/banner/${id}`, {
    method: 'DELETE'
  });
};

// Função de teste para upload sem autenticação
export const testUpload = async (imageFile: File): Promise<any> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  console.log('Teste: Enviando arquivo:', imageFile.name, imageFile.type, imageFile.size);
  
  try {
    // Note o uso de fetch diretamente, sem passar pelo apiRequest que adiciona autenticação
    const response = await fetch('http://localhost:5000/api/banner/test-upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Teste de upload bem-sucedido:', result);
    return result;
  } catch (error) {
    console.error('Erro no teste de upload:', error);
    throw error;
  }
}; 