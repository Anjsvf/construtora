import React, { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Image, Plus } from 'lucide-react';
import ImageViewer from '../ImageViewer';
import { uploadBanner, deleteBanner, testUpload } from '../../services/banner.service';
// import { getActiveBanner } from '../../services/banner.service';
// import { getFullImageUrl } from '../../services/api';

interface BannerManagerProps {
  bannerImage: string;
  activeBannerId: string;
  isLoading: boolean;
  onBannerUpdate: () => Promise<void>;
}

const BannerManager: React.FC<BannerManagerProps> = ({
  bannerImage,
  activeBannerId,
  isLoading,
  onBannerUpdate
}) => {
  const navigate = useNavigate();
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingBanner, setDeletingBanner] = useState(false);

  const handleBannerFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBanner = async () => {
    if (!bannerFile) {
      alert('Por favor, selecione uma imagem para o banner.');
      return;
    }
    const token = localStorage.getItem('@ConstrutoraBecker:token');
    if (!token) {
      alert('Você precisa estar autenticado para fazer upload de imagens.');
      navigate('/login');
      return;
    }
    setIsUploading(true);
    try {
      await uploadBanner(bannerFile);
      await onBannerUpdate();
      setShowBannerForm(false);
      setBannerPreview('');
      setBannerFile(null);
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert('Erro ao salvar o banner. Por favor, tente novamente.');
      if (error instanceof Error && error.message.includes('Not authorized')) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        navigate('/login');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!activeBannerId) return;
    if (window.confirm('Tem certeza que deseja excluir o banner atual?')) {
      setDeletingBanner(true);
      try {
        await deleteBanner(activeBannerId);
        await onBannerUpdate();
        alert('Banner excluído com sucesso!');
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Erro ao excluir o banner. Por favor, tente novamente.');
      } finally {
        setDeletingBanner(false);
      }
    }
  };

  const handleTestUpload = async () => {
    if (!bannerFile) {
      alert('Por favor, selecione uma imagem para o teste.');
      return;
    }
    setIsUploading(true);
    try {
      const result = await testUpload(bannerFile);
      alert(`Teste de upload bem-sucedido! Arquivo: ${result.filename}`);
    } catch (error) {
      console.error('Erro no teste de upload:', error);
      alert(`Erro no teste de upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Gerenciar Banner da Página Inicial</h3>
        <div className="flex space-x-2">
          {activeBannerId && (
            <button
              onClick={handleDeleteBanner}
              disabled={deletingBanner}
              className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="-ml-0.5 mr-2 h-4 w-4" />
              {deletingBanner ? 'Excluindo...' : 'Excluir Banner'}
            </button>
          )}
          <button
            onClick={() => setShowBannerForm(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Image className="-ml-0.5 mr-2 h-4 w-4" />
            {activeBannerId ? 'Alterar Banner' : 'Adicionar Banner'}
          </button>
        </div>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <div className="bg-gray-50 rounded-lg overflow-hidden shadow">
          <div className="h-64 w-full relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : bannerImage ? (
              <ImageViewer src={bannerImage} alt="Banner da página inicial" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Nenhum banner ativo. Clique em "Adicionar Banner" para criar um.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showBannerForm && (
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <div className="sm:col-span-6 mb-4">
            <label htmlFor="banner-image" className="block text-sm font-medium text-gray-700">
              Imagem do Banner
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="banner-image"
                ref={bannerFileInputRef}
                onChange={handleBannerFileChange}
                accept="image/*"
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => bannerFileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5 text-gray-600" />
                Selecionar imagem
              </button>
              <span className="ml-5 text-sm text-gray-500">
                {isUploading ? 'Carregando...' : bannerPreview ? 'Imagem selecionada' : 'Formatos: JPG, PNG, etc.'}
              </span>
            </div>
            {bannerPreview && (
              <div className="mt-2">
                <div className="mt-2 h-40 w-full bg-gray-100 rounded-md overflow-hidden">
                  <img src={bannerPreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowBannerForm(false)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleTestUpload}
              disabled={!bannerFile || isUploading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Testar Upload
            </button>
            <button
              type="button"
              onClick={handleSaveBanner}
              disabled={!bannerFile || isUploading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Salvando...' : 'Salvar Banner'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;