import React, { useState } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Bell, 
  BellOff,
  Smartphone,
  Globe,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export function PWAManager() {
  const {
    isInstalled,
    isOnline,
    isUpdateAvailable,
    registration,
    installPWA,
    updatePWA,
    syncOfflineData,
    requestNotificationPermission,
    sendNotification,
  } = usePWA();

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Verificar permissão de notificação
  React.useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleRequestNotificationPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
  };

  const handleTestNotification = () => {
    sendNotification('FinanceAI', {
      body: 'Teste de notificação do FinanceAI!',
      tag: 'test-notification',
    });
  };

  const handleSyncOfflineData = async () => {
    await syncOfflineData();
    // Mostrar notificação de sucesso
    sendNotification('FinanceAI', {
      body: 'Sincronização em background iniciada!',
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Status do PWA
          </CardTitle>
          <CardDescription>
            Gerencie as funcionalidades do Progressive Web App
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status de Instalação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isInstalled ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <span>Instalação</span>
            </div>
            <Badge variant={isInstalled ? "default" : "secondary"}>
              {isInstalled ? "Instalado" : "Não instalado"}
            </Badge>
          </div>

          {/* Status de Conectividade */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span>Conectividade</span>
            </div>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          {/* Status de Atualização */}
          {isUpdateAvailable && (
            <Alert>
              <RefreshCw className="h-4 w-4" />
              <AlertDescription>
                Uma nova versão está disponível. 
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal"
                  onClick={updatePWA}
                >
                  Clique aqui para atualizar
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Status do Service Worker */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Service Worker</span>
            </div>
            <Badge variant={registration ? "default" : "secondary"}>
              {registration ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Ações do PWA */}
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
          <CardDescription>
            Funcionalidades disponíveis do PWA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Instalar PWA */}
          {!isInstalled && (
            <Button 
              onClick={installPWA} 
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Instalar FinanceAI
            </Button>
          )}

          {/* Sincronizar dados offline */}
          <Button 
            onClick={handleSyncOfflineData} 
            className="w-full"
            variant="outline"
            disabled={!isOnline}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar Dados Offline
          </Button>

          {/* Notificações */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notificationPermission === 'granted' ? (
                  <Bell className="h-4 w-4 text-green-500" />
                ) : (
                  <BellOff className="h-4 w-4 text-gray-500" />
                )}
                <span>Notificações</span>
              </div>
              <Badge variant={notificationPermission === 'granted' ? "default" : "secondary"}>
                {notificationPermission === 'granted' ? "Permitidas" : "Negadas"}
              </Badge>
            </div>

            {notificationPermission !== 'granted' && (
              <Button 
                onClick={handleRequestNotificationPermission} 
                className="w-full"
                variant="outline"
                size="sm"
              >
                <Bell className="h-4 w-4 mr-2" />
                Solicitar Permissão
              </Button>
            )}

            {notificationPermission === 'granted' && (
              <Button 
                onClick={handleTestNotification} 
                className="w-full"
                variant="outline"
                size="sm"
              >
                <Bell className="h-4 w-4 mr-2" />
                Testar Notificação
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações do PWA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Informações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>FinanceAI</strong> é um Progressive Web App que permite:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Instalação no dispositivo</li>
            <li>Funcionamento offline</li>
            <li>Notificações push</li>
            <li>Sincronização automática</li>
            <li>Atualizações automáticas</li>
          </ul>
          
          {!isOnline && (
            <Alert>
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                Você está offline. Algumas funcionalidades podem estar limitadas.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 