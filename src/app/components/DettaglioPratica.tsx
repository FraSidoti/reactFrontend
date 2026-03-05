/**
 * ANGULAR IMPLEMENTATION NOTES:
 * - Implement as standalone component
 * - Use ActivatedRoute to get pratica ID from URL params
 * - Inject PraticaService to fetch pratica data
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
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
  IonList,
  IonItem,
  IonLabel,
  IonNote
} from '@ionic/react';
import { 
  arrowBackOutline, 
  carOutline, 
  calendarOutline, 
  personOutline, 
  callOutline, 
  documentTextOutline, 
  timeOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  chatbubbleOutline,
  downloadOutline,
  notificationsOutline,
  logOutOutline,
  listOutline,
  shieldCheckmarkOutline,
  mailOutline
} from 'ionicons/icons';
import { praticheMock, Pratica, getStatoLabel, getStatoColor } from '../data/mockData';
import { notificationService } from '../services/notificationService';
import { Textarea } from './ui/textarea';

export function DettaglioPratica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pratica, setPratica] = useState<any | null>(null);
  const [showComunicazione, setShowComunicazione] = useState(false);
  const [messaggioCliente, setMessaggioCliente] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const found = praticheMock.find(p => p.id === id);
    setPratica(found || null);
    
    const unsubscribe = notificationService.subscribe(setNotificationCount);
    return () => unsubscribe();
  }, [id]);

  const handleBack = () => navigate('/dashboard');
  const handleLogout = () => navigate('/');
  const handleNotifiche = () => navigate('/notifiche');

  const handleCambioStato = (nuovoStato: string) => {
    if (pratica) {
      setPratica({ ...pratica, stato: nuovoStato });
      toast.success(`Stato aggiornato a: ${getStatoLabel(nuovoStato as Pratica['stato'])}`);
    }
  };

  const handleInviaComunicazione = () => {
    if (!messaggioCliente.trim()) {
      toast.error('Inserisci un messaggio');
      return;
    }
    toast.success('Comunicazione inviata al cliente');
    setMessaggioCliente('');
    setShowComunicazione(false);
  };

  if (!pratica) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar className="[--background:#005461] text-white">
            <IonButtons slot="start"><IonButton onClick={handleBack} className="text-white"><IonIcon icon={arrowBackOutline} /></IonButton></IonButtons>
            <IonTitle>Errore</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="[--background:#EDEDCE]">
          <div className="flex h-full items-center justify-center p-4">
            <IonCard className="w-full text-center py-12 bg-white rounded-xl shadow-sm border-transparent">
              <IonIcon icon={alertCircleOutline} className="text-6xl text-[#629FAD] mb-4" />
              <p className="text-xl text-[#296374] mb-6 font-medium">Pratica non trovata</p>
              <button onClick={handleBack} className="px-6 py-2.5 bg-[#0C7779] text-white rounded-lg font-medium shadow-md active:scale-95 transition-all">
                Torna Indietro
              </button>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const getStatoSuccessivo = (statoCorrente: string): string | null => {
    const flusso = ['non_assegnata', 'in_attesa', 'in_lavorazione', 'in_attesa_riconsegna', 'completata'];
    const index = flusso.indexOf(statoCorrente);
    return index < flusso.length - 1 ? flusso[index + 1] : null;
  };

  const statoSuccessivo = getStatoSuccessivo(pratica.stato);

  return (
    <IonPage>
      {/* HEADER NATIVO */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="[--background:#005461] md:[--background:#088395] text-white">
          <IonButtons slot="start">
            <IonButton onClick={handleBack} className="active:scale-95 transition-transform text-white">
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle className="font-bold text-white text-center text-sm md:text-lg">
            Pratica {pratica.numero || pratica.id}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleNotifiche} className="relative active:scale-95 text-white">
              <IonIcon icon={notificationsOutline} slot="icon-only" />
              {notificationCount > 0 && (
                <IonBadge color="danger" className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 rounded-full text-[10px] px-1.5 py-0.5">
                  {notificationCount}
                </IonBadge>
              )}
            </IonButton>
            <IonButton onClick={handleLogout} className="active:scale-95 text-white">
              <IonIcon icon={logOutOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="[--background:#EDEDCE] md:[--background:#F4F4F4]">
        
        {/* HERO SECTION (Info Principali) */}
        <div className="bg-[#005461] md:bg-[#088395] px-4 pb-12 pt-4 rounded-b-[2.5rem] shadow-sm text-center relative">
          <p className="text-[#629FAD] md:text-[#EBF4F6] text-sm font-medium mb-3 uppercase tracking-wider">Stato Attuale</p>
          
          {/* BADGE STATO AD ALTO CONTRASTO */}
          <div className="inline-block px-6 py-2 rounded-full text-sm font-black shadow-lg mb-6 bg-[#EDEDCE] text-[#0C2C55] uppercase tracking-wide border-2 border-white/20">
            {getStatoLabel(pratica.stato)}
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              €{pratica.preventivo?.importoTotale ? pratica.preventivo.importoTotale.toLocaleString('it-IT', { minimumFractionDigits: 2 }) : '0,00'}
            </h2>
            <p className="text-[#629FAD] md:text-[#EBF4F6] text-sm mt-1 font-medium flex items-center gap-1">
              <IonIcon icon={documentTextOutline} /> Preventivo Totale
            </p>
          </div>
        </div>

        {/* CONTENUTO DELLA PAGINA */}
        <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 pb-12">
          
          {/* QUICK ACTIONS */}
          <div className="flex gap-3 mb-6">
            {statoSuccessivo ? (
              <button
                onClick={() => handleCambioStato(statoSuccessivo)}
                className="flex-1 bg-[#0C7779] md:bg-[#088395] text-white py-3.5 rounded-2xl shadow-lg font-bold flex flex-col items-center justify-center gap-1 active:bg-[#005461] active:scale-[0.97] transition-all border border-[#0C7779]/20"
              >
                <IonIcon icon={checkmarkCircleOutline} className="text-2xl" />
                <span className="text-[11px] md:text-xs uppercase tracking-wider">Avanza Stato</span>
              </button>
            ) : (
              <button className="flex-1 bg-gray-100 text-gray-400 py-3.5 rounded-2xl shadow-sm font-bold flex flex-col items-center justify-center gap-1 opacity-80 cursor-not-allowed border border-gray-200">
                <IonIcon icon={checkmarkCircleOutline} className="text-2xl" />
                <span className="text-[11px] md:text-xs uppercase tracking-wider">Completata</span>
              </button>
            )}
            
            <button
              onClick={() => setShowComunicazione(!showComunicazione)}
              className="flex-1 bg-white text-[#0C7779] md:text-[#088395] py-3.5 rounded-2xl shadow-lg font-bold flex flex-col items-center justify-center gap-1 active:bg-gray-50 active:scale-[0.97] transition-all border border-[#0C7779]/20"
            >
              <IonIcon icon={chatbubbleOutline} className="text-2xl" />
              <span className="text-[11px] md:text-xs uppercase tracking-wider">Contatta</span>
            </button>
          </div>

          {/* FORM COMUNICAZIONE */}
          {showComunicazione && (
            <IonCard className="m-0 mb-6 bg-white border border-[#0C7779]/30 rounded-2xl shadow-md">
              <IonCardContent className="p-5">
                <label className="block text-sm font-bold text-[#0C2C55] mb-2 flex items-center gap-2">
                  <IonIcon icon={mailOutline} className="text-[#0C7779]" /> Messaggio per il cliente
                </label>
                <Textarea
                  value={messaggioCliente}
                  onChange={(e) => setMessaggioCliente(e.target.value)}
                  placeholder="Scrivi qui il messaggio..."
                  rows={4}
                  className="bg-[#EDEDCE]/30 border-[#629FAD]/50 focus-visible:ring-[#0C7779] rounded-xl mb-3 text-[#0C2C55]"
                />
                <div className="flex gap-2">
                  <button onClick={handleInviaComunicazione} className="flex-1 py-2.5 bg-[#0C7779] text-white rounded-xl font-bold active:scale-95 transition-all">Invia</button>
                  <button onClick={() => setShowComunicazione(false)} className="flex-1 py-2.5 bg-gray-100 text-[#296374] rounded-xl font-bold active:scale-95 transition-all">Annulla</button>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* INFO GENERALI (IonList) */}
          <IonCard className="m-0 mb-6 rounded-2xl shadow-sm bg-white overflow-hidden border-transparent">
            <div className="bg-[#249E94]/10 md:bg-[#EBF4F6] px-5 py-3 border-b border-[#0C7779]/10">
              <h3 className="text-[#0C7779] md:text-[#088395] font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <IonIcon icon={listOutline} className="text-lg" /> Info Generali
              </h3>
            </div>
            <IonList lines="full" className="bg-transparent py-0">
              <IonItem className="[--background:transparent]">
                <IonIcon icon={carOutline} slot="start" className="text-[#629FAD] md:text-gray-400" />
                <IonLabel className="text-[#296374] font-medium text-sm">Veicolo</IonLabel>
                <IonNote slot="end" className="text-[#0C2C55] md:text-gray-900 font-bold">{pratica.veicolo?.marca || 'N/D'} {pratica.veicolo?.modello || ''}</IonNote>
              </IonItem>
              <IonItem className="[--background:transparent]">
                <IonLabel className="text-[#296374] font-medium text-sm ml-8">Targa</IonLabel>
                <IonNote slot="end" className="text-[#0C2C55] md:text-gray-900 font-bold">{pratica.veicolo?.targa || 'N/D'}</IonNote>
              </IonItem>
              <IonItem className="[--background:transparent]">
                <IonIcon icon={personOutline} slot="start" className="text-[#629FAD] md:text-gray-400" />
                <IonLabel className="text-[#296374] font-medium text-sm">Cliente</IonLabel>
                <IonNote slot="end" className="text-[#0C2C55] md:text-gray-900 font-bold">{pratica.automobilista?.nome || 'N/D'} {pratica.automobilista?.cognome || ''}</IonNote>
              </IonItem>
              <IonItem className="[--background:transparent]" button onClick={() => window.open(`tel:${pratica.automobilista?.telefono}`)}>
                <IonIcon icon={callOutline} slot="start" className="text-[#0C7779]" />
                <IonLabel className="text-[#296374] font-medium text-sm">Telefono</IonLabel>
                <IonNote slot="end" className="text-[#0C7779] font-bold underline">{pratica.automobilista?.telefono || 'N/D'}</IonNote>
              </IonItem>
              <IonItem className="[--background:transparent]" lines="none">
                <IonIcon icon={calendarOutline} slot="start" className="text-[#629FAD] md:text-gray-400" />
                <IonLabel className="text-[#296374] font-medium text-sm">Data Arrivo</IonLabel>
                <IonNote slot="end" className="text-[#0C2C55] md:text-gray-900 font-bold">
                  {pratica.dataApertura ? new Date(pratica.dataApertura).toLocaleDateString('it-IT') : 'N/D'}
                </IonNote>
              </IonItem>
            </IonList>
          </IonCard>

          {/* RIPARAZIONE */}
          <IonCard className="m-0 mb-6 rounded-2xl shadow-sm bg-white overflow-hidden border-transparent">
            <div className="bg-[#249E94]/10 md:bg-[#EBF4F6] px-5 py-3 border-b border-[#0C7779]/10">
              <h3 className="text-[#0C7779] md:text-[#088395] font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <IonIcon icon={shieldCheckmarkOutline} className="text-lg" /> Riparazione
              </h3>
            </div>
            <IonCardContent className="p-5">
              <div className="mb-4">
                <p className="text-xs text-[#296374] font-bold uppercase tracking-wider mb-2">Note Interne / Danni</p>
                <p className="text-[#0C2C55] bg-[#EDEDCE]/40 p-3 rounded-xl border border-[#629FAD]/20 leading-relaxed text-sm">
                  {pratica.noteInterne || pratica.descrizione || 'Nessuna nota o descrizione disponibile.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs text-[#629FAD] font-bold uppercase tracking-wider mb-1">ID Preventivo</p>
                  <p className="text-[#0C2C55] font-bold text-sm">{pratica.preventivo?.id || 'N/D'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-xs text-[#629FAD] font-bold uppercase tracking-wider mb-1">Tempo Stimato</p>
                  <p className="text-[#0C2C55] font-bold text-sm flex items-center gap-1">
                    <IonIcon icon={timeOutline} /> {pratica.preventivo?.tempoStimato || 'N/D'}
                  </p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* TIMELINE */}
          <IonCard className="m-0 mb-6 rounded-2xl shadow-sm bg-white overflow-hidden border-transparent">
            <div className="bg-[#249E94]/10 md:bg-[#EBF4F6] px-5 py-3 border-b border-[#0C7779]/10">
              <h3 className="text-[#0C7779] md:text-[#088395] font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <IonIcon icon={timeOutline} className="text-lg" /> Timeline Pratica
              </h3>
            </div>
            <IonCardContent className="p-6">
              <div className="space-y-6">
                {[
                  { stato: 'non_assegnata', label: 'Ricevuta' },
                  { stato: 'in_attesa', label: 'Assegnata' },
                  { stato: 'in_lavorazione', label: 'In Lavorazione' },
                  { stato: 'in_attesa_riconsegna', label: 'Pronta' },
                  { stato: 'completata', label: 'Completata' },
                ].map((item, index) => {
                  const flusso = ['non_assegnata', 'in_attesa', 'in_lavorazione', 'in_attesa_riconsegna', 'completata'];
                  const currentIndex = flusso.indexOf(pratica.stato);
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div key={item.stato} className="flex items-start gap-4 relative">
                      {/* Linea verticale */}
                      {index !== 4 && (
                        <div className={`absolute left-3.5 top-8 w-[2px] h-full -ml-[1px] ${isCompleted ? 'bg-[#0C7779]' : 'bg-gray-100'}`} />
                      )}
                      
                      {/* Pallino */}
                      <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        isCompleted ? 'bg-[#0C7779] border-[#0C7779] text-white' : 'bg-white border-gray-300 text-gray-300'
                      }`}>
                        {isCompleted ? <IonIcon icon={checkmarkCircleOutline} className="text-lg" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                      </div>
                      
                      {/* Testo */}
                      <div className="pt-1">
                        <p className={`font-bold text-sm ${isCurrent ? 'text-[#0C7779]' : isCompleted ? 'text-[#0C2C55]' : 'text-gray-400'}`}>
                          {item.label}
                        </p>
                        {isCurrent && <p className="text-xs text-[#249E94] font-medium mt-0.5">Stato attuale</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </IonCardContent>
          </IonCard>

          {/* BOTTONE SCARICA PDF */}
          <button className="w-full bg-white border-2 border-[#0C7779] text-[#0C7779] py-3.5 rounded-2xl shadow-sm font-bold flex items-center justify-center gap-2 active:bg-[#629FAD]/10 active:scale-[0.98] transition-all">
            <IonIcon icon={downloadOutline} className="text-xl" />
            Scarica Preventivo PDF
          </button>

        </div>
      </IonContent>
    </IonPage>
  );
}
