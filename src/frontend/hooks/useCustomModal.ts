import { useState, useCallback } from 'react';

interface ShowModalProps {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  buttons?: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'destructive' | 'cancel';
  }>;
  icon?: string;
}

interface ProcessedModalProps {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  buttons: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'destructive' | 'cancel';
  }>;
  icon?: string;
}

export const useCustomModal = () => {
  const [modalConfig, setModalConfig] = useState<ProcessedModalProps | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showModal = useCallback((config: ShowModalProps) => {
    const defaultButtons = config.buttons?.length 
      ? config.buttons.map(button => ({
          text: button.text,
          style: button.style,
          onPress: button.onPress || (() => {}),
        }))
      : [{ text: 'OK', onPress: () => {} }];

    setModalConfig({
      ...config,
      buttons: defaultButtons,
    });
    setIsVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setModalConfig(null);
    }, 300); // Wait for animation to complete
  }, []);

  // Helper functions for common modal types
  const showSuccess = useCallback((title: string, message: string, onPress?: () => void) => {
    showModal({
      title,
      message,
      type: 'success',
      buttons: [{ text: 'Genial!', onPress }],
    });
  }, [showModal]);

  const showError = useCallback((title: string, message: string, onPress?: () => void) => {
    showModal({
      title,
      message,
      type: 'error',
      buttons: [{ text: 'Entendido', onPress }],
    });
  }, [showModal]);

  const showWarning = useCallback((title: string, message: string, onPress?: () => void) => {
    showModal({
      title,
      message,
      type: 'warning',
      buttons: [{ text: 'OK', onPress }],
    });
  }, [showModal]);

  const showInfo = useCallback((title: string, message: string, onPress?: () => void) => {
    showModal({
      title,
      message,
      type: 'info',
      buttons: [{ text: 'OK', onPress }],
    });
  }, [showModal]);

  const showConfirm = useCallback((
    title: string, 
    message: string, 
    onConfirm?: () => void, 
    onCancel?: () => void,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ) => {
    showModal({
      title,
      message,
      type: 'warning',
      buttons: [
        { text: cancelText, onPress: onCancel, style: 'cancel' },
        { text: confirmText, onPress: onConfirm, style: 'destructive' },
      ],
    });
  }, [showModal]);

  return {
    modalConfig,
    isVisible,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
};

export default useCustomModal;
