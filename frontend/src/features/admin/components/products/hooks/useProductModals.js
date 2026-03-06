import { useState, useCallback } from "react";

/**
 * Custom hook para manejar estados de modales
 * @returns {Object} Estados y funciones para controlar modales
 */
export const useProductModals = () => {
  // Modal de creación con 2 pasos
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [createdProductId, setCreatedProductId] = useState(null);

  // Modal de edición de imágenes
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Handlers de modal de creación
  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
    setCreateStep(1);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
    setCreateStep(1);
    setCreatedProductId(null);
  }, []);

  const goToImagesStep = useCallback((productId) => {
    setCreatedProductId(productId);
    setCreateStep(2);
  }, []);

  // Handlers de modal de imágenes
  const openImagesModal = useCallback((productId) => {
    setEditingProductId(productId);
    setIsImagesModalOpen(true);
  }, []);

  const closeImagesModal = useCallback(() => {
    setEditingProductId(null);
    setIsImagesModalOpen(false);
  }, []);

  return {
    // Estados de modal de creación
    isCreateModalOpen,
    createStep,
    createdProductId,
    openCreateModal,
    closeCreateModal,
    goToImagesStep,

    // Estados de modal de imágenes
    isImagesModalOpen,
    editingProductId,
    openImagesModal,
    closeImagesModal,
  };
};
