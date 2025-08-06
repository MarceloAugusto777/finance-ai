import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    registration: null,
  });

  useEffect(() => {
    // Verificar se o PWA está instalado
    const checkInstallation = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
      
      setPwaState(prev => ({ ...prev, isInstalled }));
    };

    // Verificar conectividade
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }));

    // Registrar Service Worker
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('✅ Service Worker registrado:', registration);

          // Verificar atualizações
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setPwaState(prev => ({ ...prev, isUpdateAvailable: true }));
                }
              });
            }
          });

          setPwaState(prev => ({ ...prev, registration }));

          // Aguardar o Service Worker estar pronto
          await navigator.serviceWorker.ready;
          console.log('✅ Service Worker pronto');

        } catch (error) {
          console.error('❌ Erro ao registrar Service Worker:', error);
        }
      }
    };

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', checkInstallation);

    // Inicializar
    checkInstallation();
    registerSW();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', checkInstallation);
    };
  }, []);

  // Função para instalar o PWA
  const installPWA = async () => {
    if (pwaState.registration) {
      try {
        await pwaState.registration.showNotification('FinanceAI', {
          body: 'Instalando FinanceAI...',
          icon: '/icons/icon-192x192.png',
        });
        
        // Aqui você pode adicionar lógica adicional para instalação
        console.log('📱 PWA instalado');
      } catch (error) {
        console.error('❌ Erro ao instalar PWA:', error);
      }
    }
  };

  // Função para atualizar o PWA
  const updatePWA = async () => {
    if (pwaState.registration && pwaState.isUpdateAvailable) {
      try {
        // Enviar mensagem para o Service Worker para pular espera
        if (pwaState.registration.waiting) {
          pwaState.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Recarregar a página após a atualização
        window.location.reload();
      } catch (error) {
        console.error('❌ Erro ao atualizar PWA:', error);
      }
    }
  };

  // Função para sincronizar dados offline
  const syncOfflineData = async () => {
    if (pwaState.registration && 'sync' in pwaState.registration) {
      try {
        await pwaState.registration.sync.register('background-sync');
        console.log('🔄 Sincronização em background registrada');
      } catch (error) {
        console.error('❌ Erro ao registrar sincronização:', error);
      }
    }
  };

  // Função para solicitar permissão de notificações
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('🔔 Permissão de notificação:', permission);
      return permission;
    }
    return 'denied';
  };

  // Função para enviar notificação
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options,
      });
    }
  };

  return {
    ...pwaState,
    installPWA,
    updatePWA,
    syncOfflineData,
    requestNotificationPermission,
    sendNotification,
  };
} 