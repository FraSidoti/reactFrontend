import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
  IonCard,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonSearchbar,
  IonChip,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import {
  notificationsOutline,
  logOutOutline,
  carOutline,
  personOutline,
  calendarOutline,
  checkmarkOutline,
  closeOutline
} from 'ionicons/icons';
import { praticheMock, Pratica, getStatoLabel, getStatoColor } from '../data/mockData';
import { notificationService, Notification } from '../services/notificationService';

export function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStato, setFiltroStato] = useState<string>('tutti');
  const [filtroAssegnazione, setFiltroAssegnazione] = useState<'tutte' | 'assegnate' | 'non_assegnate'>('assegnate');
  const [pratiche, setPratiche] = useState(praticheMock);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotificationCount);
    const unsubscribeNotifications = notificationService.subscribeNotifications(setNotifications);
    
    return () => {
      unsubscribe();
      unsubscribeNotifications();
    };
  }, []);

  const handleAccettaPratica = (praticaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPratiche(pratiche.map(p => 
      p.id === praticaId ? { ...p, assegnata: true } : p
    ));
    notificationService.decrementCount();
    toast.success('Pratica accettata e assegnata all\'officina');
  };

  const handleRifiutaPratica = (praticaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPratiche(pratiche.filter(p => p.id !== praticaId));
    notificationService.decrementCount();
    toast.success('Pratica rifiutata');
  };

  const handleLogout = () => {
    toast.success('Logout effettuato');
    navigate('/');
  };

  const handlePraticaClick = (pratica: Pratica) => {
    navigate(`/pratica/${pratica.id}`);
  };

  // Filtro pratiche
  const praticheFiltrate = pratiche.filter(pratica => {
    const matchSearch = 
      pratica.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pratica.targa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pratica.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStato = filtroStato === 'tutti' || pratica.stato === filtroStato;
    
    const matchAssegnazione = 
      filtroAssegnazione === 'tutte' ||
      (filtroAssegnazione === 'assegnate' && pratica.assegnata) ||
      (filtroAssegnazione === 'non_assegnate' && !pratica.assegnata);
    
    return matchSearch && matchStato && matchAssegnazione;
  });

  // Statistiche
  const stats = {
    totale: pratiche.filter(p => p.assegnata).length,
    in_attesa: pratiche.filter(p => p.stato === 'in_attesa' && p.assegnata).length,
    in_lavorazione: pratiche.filter(p => p.stato === 'in_lavorazione' && p.assegnata).length,
    in_attesa_riconsegna: pratiche.filter(p => p.stato === 'in_attesa_riconsegna' && p.assegnata).length,
    non_assegnate: pratiche.filter(p => !p.assegnata).length,
  };

  return (
    <IonPage>
      {/* Testata App (Header Mobile: #005461 | Web: #088395) */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="[--background:#005461] md:[--background:#088395] text-white">
          <IonTitle>Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => navigate('/notifiche')} className="relative">
              <IonIcon icon={notificationsOutline} slot="icon-only" />
              {notificationCount > 0 && (
                <IonBadge color="danger" className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 rounded-full text-[10px] px-1.5 py-0.5">
                  {notificationCount}
                </IonBadge>
              )}
            </IonButton>
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* Contenuto scrollabile (Sfondo Mobile: #EDEDCE | Web: #F4F4F4) */}
      <IonContent className="[--background:#EDEDCE] md:[--background:#F4F4F4]">
        
        {/* Sfondo curva testata (Mobile: #005461 | Web: #088395) */}
        <div className="bg-[#005461] md:bg-[#088395] px-4 pb-8 pt-2 rounded-b-[2rem] shadow-sm mb-4">
          <h2 className="text-white text-xl font-medium">Officina Autorizzata</h2>
          {/* Testo secondario (Mobile: #629FAD | Web: #EBF4F6) */}
          <p className="text-[#629FAD] md:text-[#EBF4F6] text-sm mt-1">Gestione pratiche e riparazioni</p>
        </div>

        <div className="px-4 pb-8 -mt-6">
          {/* Card Statistiche a Griglia */}
          <IonGrid className="ion-no-padding mb-4">
            <IonRow className="gap-2">
              <IonCol className="p-0">
                <IonCard className="m-0 shadow-sm rounded-xl bg-white">
                  <IonCardContent className="p-3 text-center">
                    <p className="text-xs text-[#296374] md:text-[#10546D] font-medium mb-1">In Attesa</p>
                    <p className="text-2xl font-bold text-[#0C7779] md:text-[#5F9598]">{stats.in_attesa}</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol className="p-0">
                <IonCard className="m-0 shadow-sm rounded-xl bg-white">
                  <IonCardContent className="p-3 text-center">
                    <p className="text-xs text-[#296374] md:text-[#10546D] font-medium mb-1">In Lavor.</p>
                    <p className="text-2xl font-bold text-[#249E94] md:text-[#09637E]">{stats.in_lavorazione}</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol className="p-0">
                <IonCard className="m-0 shadow-sm rounded-xl bg-white">
                  <IonCardContent className="p-3 text-center">
                    <p className="text-xs text-[#296374] md:text-[#10546D] font-medium mb-1">Pronte</p>
                    <p className="text-2xl font-bold text-[#3BC1A8] md:text-[#088395]">{stats.in_attesa_riconsegna}</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Filtro Assegnazione Nativo (Mobile Checked: #0C7779 | Web Checked: #088395) */}
          <IonSegment
            value={filtroAssegnazione}
            onIonChange={(e) => setFiltroAssegnazione(e.detail.value as any)}
            className="mb-4 bg-white rounded-lg shadow-sm [--background-checked:#0C7779] md:[--background-checked:#088395] [--color-checked:#ffffff]"
          >
            <IonSegmentButton value="assegnate">
              Assegnate ({stats.totale})
            </IonSegmentButton>
            <IonSegmentButton value="non_assegnate">
              Da Assegnare ({stats.non_assegnate})
            </IonSegmentButton>
          </IonSegment>

          {/* Barra Ricerca Nativa */}
          <IonSearchbar
            placeholder="Cerca numero, targa o cliente..."
            value={searchTerm}
            onIonInput={(e) => setSearchTerm(e.detail.value!)}
            className="ion-no-padding mb-2 [--border-radius:10px] [--box-shadow:none] [--background:#ffffff]"
          />

          {/* Chips Filtro Stato orizzontali */}
          <div className="flex overflow-x-auto gap-2 pb-4 hide-scrollbar">
            {['tutti', 'in_attesa', 'in_lavorazione', 'in_attesa_riconsegna'].map((stato) => (
              <IonChip
                key={stato}
                onClick={() => setFiltroStato(stato)}
                className={`px-4 flex-shrink-0 ${
                  filtroStato === stato 
                    ? 'bg-[#005461] md:bg-[#088395] text-white' 
                    : 'bg-white text-[#296374] md:text-gray-600 border border-[#629FAD] md:border-gray-200'
                }`}
              >
                {stato === 'tutti' ? 'Tutte' : stato === 'in_attesa' ? 'In Attesa' : stato === 'in_lavorazione' ? 'In Lavorazione' : 'Pronte'}
              </IonChip>
            ))}
          </div>

          {/* Lista Pratiche */}
          <div className="mt-2 space-y-4">
            {praticheFiltrate.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <IonIcon icon={carOutline} className="text-4xl text-[#629FAD] md:text-gray-300 mb-2" />
                <p className="text-[#296374] md:text-gray-500 font-medium">Nessuna pratica trovata</p>
              </div>
            ) : (
              praticheFiltrate.map((pratica) => (
                <IonCard 
                  key={pratica.id} 
                  className={`m-0 shadow-sm rounded-xl border border-gray-100 bg-white ${pratica.assegnata ? 'active:opacity-70' : ''}`}
                  onClick={() => pratica.assegnata && handlePraticaClick(pratica)}
                >
                  <IonCardContent className="p-4">
                    {/* Header Card */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#0C2C55] md:text-gray-800">{pratica.numero}</span>
                        {!pratica.assegnata && (
                          <span className="bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Da Assegnare
                          </span>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatoColor(pratica.stato)}`}>
                        {getStatoLabel(pratica.stato)}
                      </span>
                    </div>
                    
                    {/* Dettagli Griglia */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                      <div className="flex items-start gap-2">
                        <IonIcon icon={carOutline} className="text-[#0C7779] md:text-[#088395] text-lg mt-0.5" />
                        <div>
                          <p className="text-xs text-[#296374] md:text-gray-500 font-medium">Veicolo</p>
                          <p className="font-semibold text-[#0C2C55] md:text-gray-800">{pratica.veicolo.marca} {pratica.veicolo.modello}</p>
                          <p className="text-xs text-[#629FAD] md:text-gray-500">{pratica.veicolo.targa}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <IonIcon icon={personOutline} className="text-[#0C7779] md:text-[#088395] text-lg mt-0.5" />
                        <div>
                          <p className="text-xs text-[#296374] md:text-gray-500 font-medium">Cliente</p>
                          <p className="font-semibold text-[#0C2C55] md:text-gray-800 line-clamp-1">{pratica.automobilista.nome} {pratica.automobilista.cognome}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 col-span-2">
                        <IonIcon icon={calendarOutline} className="text-[#0C7779] md:text-[#088395] text-lg mt-0.5" />
                        <div className="flex-1 flex justify-between items-center">
                          <div>
                            <p className="text-xs text-[#296374] md:text-gray-500 font-medium">Data Apertura</p>
                            <p className="font-semibold text-[#0C2C55] md:text-gray-800">{new Date(pratica.dataApertura).toLocaleDateString('it-IT')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#296374] md:text-gray-500 font-medium">Importo</p>
                            <p className="font-semibold text-[#0C7779] md:text-[#088395]">€{pratica.preventivo.importoTotale.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Pulsanti Azione (Solo per Non Assegnate) */}
                    {!pratica.assegnata && (
                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                        <IonButton
                          expand="block"
                          className="flex-1 [--background:#0C7779] md:[--background:#088395] [--border-radius:8px]"
                          onClick={(e) => handleAccettaPratica(pratica.id, e)}
                        >
                          <IonIcon icon={checkmarkOutline} slot="start" />
                          Accetta
                        </IonButton>
                        <IonButton
                          expand="block"
                          fill="outline"
                          className="flex-1 [--color:#9A6463] md:[--color:#9A6463] [--border-color:#9A6463] [--border-radius:8px]"
                          onClick={(e) => handleRifiutaPratica(pratica.id, e)}
                        >
                          <IonIcon icon={closeOutline} slot="start" />
                          Rifiuta
                        </IonButton>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              ))
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
