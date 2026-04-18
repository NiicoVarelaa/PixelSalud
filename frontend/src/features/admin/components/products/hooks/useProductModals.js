import { useState, useCallback } from "react";

export const useProductModals = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [createdProductId, setCreatedProductId] = useState(null);

  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

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

  const openImagesModal = useCallback((productId) => {
    setEditingProductId(productId);
    setIsImagesModalOpen(true);
  }, []);

  const closeImagesModal = useCallback(() => {
    setEditingProductId(null);
    setIsImagesModalOpen(false);
  }, []);

  return {
    createdProductId,
    createStep,
    editingProductId,
    isCreateModalOpen,
    isImagesModalOpen,
    closeCreateModal,
    closeImagesModal,
    goToImagesStep,
    openCreateModal,
    openImagesModal,
  };
};
