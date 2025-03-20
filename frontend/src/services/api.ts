import { getToken } from './auth.service';


const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export function getFullImageUrl(path: string): string {
  console.log("getFullImageUrl recebeu path:", path);
  

  if (!path) {
    console.log("Retornando imagem padrão porque o path está vazio");
    return "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80";
  }
  
 
  if (path.startsWith('http://') || path.startsWith('https://')) {
    console.log("Retornando path original por ser uma URL completa:", path);
    return path;
  }
  
  // Tratamento especial para nomes de arquivo sem path - assume que estão em /uploads
  if (!path.includes('/')) {
    console.log("Adicionando path /uploads/ ao nome do arquivo:", path);
    path = `/uploads/${path}`;
  }
  
  // Verificar se o caminho da imagem já inclui a extensão WebP
  // Se não for o caso, adicione a extensão
  if (!path.toLowerCase().endsWith('.webp') && 
      !path.toLowerCase().endsWith('.jpg') && 
      !path.toLowerCase().endsWith('.jpeg') && 
      !path.toLowerCase().endsWith('.png') && 
      !path.toLowerCase().endsWith('.gif')) {
    console.log("Adicionando extensão .webp ao nome do arquivo:", path);
    path = `${path}.webp`;
  }
  
  // Remover a barra inicial se existir para evitar URLs com barras duplas
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Anexar a URL base
  const fullUrl = `${BASE_URL}/${normalizedPath}`;
  console.log("URL completa gerada:", fullUrl);
  
  // Teste extra: remover espaços e caracteres inválidos
  const cleanUrl = fullUrl.trim().replace(/\s+/g, '%20');
  
  // Verificar se a URL aponta para uma imagem WebP para depuração
  if (cleanUrl.toLowerCase().endsWith('.webp')) {
    console.log("🎉 URL do formato WebP detectada:", cleanUrl);
  } else {
    console.log("⚠️ URL não é do formato WebP:", cleanUrl);
  }
  
  return cleanUrl;
}

export const getAuthHeader = () => {
  const userInfo = localStorage.getItem('userInfo');
  const token = userInfo ? JSON.parse(userInfo).token : null;
  
  return token 
    ? { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    : { 'Content-Type': 'application/json' };
};


export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  // Add authorization header if user is logged in
  const token = getToken();
  
 
  const isFormData = options.body instanceof FormData;
  
  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  console.log('Request URL:', url);
  console.log('Request method:', options.method || 'GET');
  console.log('Request headers:', headers);
  
  if (isFormData) {
    console.log('Enviando FormData:', 
      Array.from((options.body as FormData).entries())
        .map(([key, value]) => `${key}: ${value instanceof File ? `File(${value.name})` : value}`)
    );
  } else if (options.body) {
    console.log('Enviando payload:', options.body);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('Response status:', response.status);
    
    // Handle non-200 responses
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('API error:', error);
      throw new Error(error.message || `${response.status}: ${response.statusText}`);
    }

 
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}