import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';

interface ImageViewerProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIconSize?: number;
}

/**
 * Componente para exibir imagens com suporte a WebP e fallback.
 * Oferece tratamento de erros e indicador visual durante o carregamento.
 */
const ImageViewer: React.FC<ImageViewerProps> = ({ 
  src, 
  alt, 
  className = 'w-full h-full object-cover',
  fallbackIconSize = 12 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);
  
  // Verificar suporte a WebP quando o componente é montado
  useEffect(() => {
    // Função para detectar suporte a WebP
    const checkWebPSupport = () => {
      const elem = document.createElement('canvas');
      
      if (!!(elem.getContext && elem.getContext('2d'))) {
        // Foi possível criar um elemento canvas
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      
      // Canvas não é suportado, então WebP provavelmente também não
      return false;
    };
    
    setSupportsWebP(checkWebPSupport());
  }, []);
  
  // Função para lidar com erros de carregamento de imagem
  const handleError = () => {
    console.error(`Falha ao carregar imagem: ${src}`);
    setIsLoading(false);
    setHasError(true);
    
    // Se a imagem é WebP e o navegador pode não ter suporte
    if (src.toLowerCase().endsWith('.webp') && supportsWebP === false) {
      console.warn('Navegador pode não suportar WebP. Considere fornecer uma versão JPG/PNG alternativa.');
    }
  };
  
  // Quando a imagem é carregada com sucesso
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    
    // Log para depurar quais imagens estão realmente sendo carregadas
    if (src.toLowerCase().endsWith('.webp')) {
      console.log(`✅ Imagem WebP carregada com sucesso: ${src}`);
      
      // Se carregou WebP mas nossa detecção diz que não é suportado, atualizar
      if (supportsWebP === false) {
        console.log('Atualizando detecção de suporte a WebP para verdadeiro');
        setSupportsWebP(true);
      }
    } else {
      console.log(`✅ Imagem carregada com sucesso (não WebP): ${src}`);
    }
  };

  // Se temos informação que o browser não suporta WebP e a imagem é WebP,
  // tentar substituir por uma versão JPG/PNG se disponível (convertendo manualmente a URL)
  const getImageSrc = () => {
    if (supportsWebP === false && src.toLowerCase().endsWith('.webp')) {
      // Tentativa de encontrar versão alternativa (apenas uma sugestão, não garantimos que existe)
      const alternativeSrc = src.replace(/\.webp$/i, '.jpg');
      console.warn(`Substituindo imagem WebP por alternativa: ${alternativeSrc}`);
      return alternativeSrc;
    }
    return src;
  };

  // Se houver erro, mostrar componente de fallback
  if (hasError) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <Building className={`h-${fallbackIconSize} w-${fallbackIconSize} text-gray-400`} />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <img
        src={getImageSrc()}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
};

export default ImageViewer; 