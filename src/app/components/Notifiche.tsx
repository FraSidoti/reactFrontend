/**
 * ANGULAR IMPLEMENTATION NOTES:
 * - Implement as standalone component
 * - Inject NotificationService
 * - Use signals for reactive state
 */

import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Bell, BellOff, Check, CheckCheck, FileText, MessageSquare, AlertCircle } from 'lucide-react';
import { notificationService, Notification } from '../services/notificationService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export function Notifiche() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<'tutte' | 'non_lette'>('tutte');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const unsubscribe = notificationService.subscribeNotifications(setNotifications);
    const unsubscribeCount = notificationService.subscribe(setNotificationCount);
    return () => {
      unsubscribe();
      unsubscribeCount();
    };
  }, []);

  const handleBack = () => navigate('/dashboard');

  const handleNotificationClick = (notification: Notification) => {
    notificationService.markAsRead(notification.id);
    if (notification.praticaId) {
      navigate(`/pratica/${notification.praticaId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleMarkAllAsRead = () => notificationService.clearAll();

  const notificheFiltrate = filtroTipo === 'tutte' 
    ? notifications 
    : notifications.filter(n => !n.letta);
  const nonLetteCount = notifications.filter(n => !n.letta).length;

  const getNotificationIcon = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'nuova_pratica': return <FileText className="h-5 w-5 text-[#0C7779] md:text-[#088395]" />;
      case 'stato_modificato': return <AlertCircle className="h-5 w-5 text-[#296374] md:text-[#09637E]" />;
      case 'messaggio': return <MessageSquare className="h-5 w-5 text-[#249E94] md:text-[#7AB2B2]" />;
      default: return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTipoLabel = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'nuova_pratica': return 'Nuova Pratica';
      case 'stato_modificato': return 'Stato Modificato';
      case 'messaggio': return 'Messaggio';
      default: return 'Notifica';
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEDCE] md:bg-[#F4F4F4] transition-colors">
      {/* Header (Mobile: #005461 | Web: #088395) */}
      <div className="bg-[#005461] md:bg-[#088395] border-b border-[#296374] md:border-[#09637E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="bg-white/10 hover:bg-white/20 active:bg-white/30 active:scale-95 transition-all text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl text-white">Notifiche</h1>
                <p className="text-[#629FAD] md:text-[#EBF4F6] mt-1">
                  {nonLetteCount > 0 
                    ? `${nonLetteCount} ${nonLetteCount === 1 ? 'notifica non letta' : 'notifiche non lette'}`
                    : 'Tutte le notifiche lette'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {nonLetteCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  className="bg-white/10 hover:bg-white/20 active:bg-white/30 active:scale-95 transition-all text-white border border-white/30"
                >
                  <CheckCheck className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Segna tutte come lette</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtri */}
        <Card className="mb-6 bg-white border-transparent shadow-sm">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Button
                className={`flex-1 transition-all active:scale-95 ${
                  filtroTipo === 'tutte' 
                    ? 'bg-[#0C7779] md:bg-[#088395] text-white border-transparent hover:bg-[#005461] active:bg-[#005461]' 
                    : 'bg-white text-[#296374] md:text-gray-600 border border-[#629FAD] md:border-gray-200 active:bg-[#629FAD]/20'
                }`}
                onClick={() => setFiltroTipo('tutte')}
              >
                Tutte ({notifications.length})
              </Button>
              <Button
                className={`flex-1 transition-all active:scale-95 ${
                  filtroTipo === 'non_lette' 
                    ? 'bg-[#0C7779] md:bg-[#088395] text-white border-transparent hover:bg-[#005461] active:bg-[#005461]' 
                    : 'bg-white text-[#296374] md:text-gray-600 border border-[#629FAD] md:border-gray-200 active:bg-[#629FAD]/20'
                }`}
                onClick={() => setFiltroTipo('non_lette')}
              >
                Non Lette ({nonLetteCount})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista Notifiche */}
        <div className="space-y-3">
          {notificheFiltrate.length === 0 ? (
            <Card className="bg-white border-transparent shadow-sm">
              <CardContent className="py-16 text-center">
                <BellOff className="h-16 w-16 mx-auto mb-4 text-[#629FAD] md:text-gray-300" />
                <p className="text-xl text-[#296374] md:text-gray-500 mb-2">
                  {filtroTipo === 'non_lette' ? 'Nessuna notifica non letta' : 'Nessuna notifica'}
                </p>
                <p className="text-sm text-[#629FAD] md:text-gray-400">
                  {filtroTipo === 'non_lette' 
                    ? 'Tutte le notifiche sono state lette'
                    : 'Le nuove notifiche appariranno qui'}
                </p>
              </CardContent>
            </Card>
          ) : (
            notificheFiltrate.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                  !notification.letta 
                    ? 'border-l-4 border-l-[#0C7779] md:border-l-[#088395] bg-[#249E94]/10 md:bg-[#EBF4F6]/30 active:bg-[#249E94]/20' 
                    : 'border-l-4 border-l-transparent bg-white active:bg-gray-50'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icona */}
                    <div className={`p-3 rounded-full ${
                      !notification.letta ? 'bg-[#0C7779]/10 md:bg-[#088395]/10' : 'bg-[#EDEDCE] md:bg-gray-100'
                    }`}>
                      {getNotificationIcon(notification.tipo)}
                    </div>

                    {/* Contenuto */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className={`font-semibold ${
                            !notification.letta ? 'text-[#0C2C55] md:text-[#088395]' : 'text-[#296374] md:text-gray-700'
                          }`}>
                            {notification.titolo}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className="text-xs border-[#629FAD] md:border-[#7AB2B2] text-[#0C7779] md:text-[#10546D]"
                          >
                            {getTipoLabel(notification.tipo)}
                          </Badge>
                        </div>
                        {!notification.letta && (
                          <div className="w-3 h-3 bg-[#0C7779] md:bg-[#088395] rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>

                      <p className={`text-sm mb-3 ${
                        !notification.letta ? 'text-[#0C2C55] md:text-gray-800' : 'text-[#296374] md:text-gray-600'
                      }`}>
                        {notification.messaggio}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#629FAD] md:text-gray-500">
                          {new Date(notification.data).toLocaleString('it-IT', {
                            day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>

                        {!notification.letta && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              notificationService.markAsRead(notification.id);
                            }}
                            className="text-[#0C7779] md:text-[#088395] hover:text-[#005461] active:bg-[#629FAD]/20 active:scale-95 transition-all h-auto py-1 px-2"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Segna letta
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
