import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton
} from '@ionic/react';
import { 
  arrowBackOutline, 
  carOutline, 
  personOutline, 
  callOutline, 
  mailOutline, 
  documentTextOutline, 
  calendarOutline,
  timeOutline,
  alertCircleOutline
} from 'ionicons/icons';
import { Pratica, getStatoLabel, getStatoColor } from '../data/mockData';

interface PraticaDetailProps {
  pratica: Pratica;
  onBack: () => void;
  onGestioneStato: () => void;
  onContattoCliente: () => void;
}

export function PraticaDetail({ pratica, onBack, onGestioneStato, onContattoCliente }: PraticaDetailProps) {
  const [activeTab, setActiveTab] = useState('preventivo');

  return (
    <IonPage>
      {/* Header Mobile Nativo: #005461 | Web: #088395 */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="[--background:#005461] md:[--background:#088395] text-white">
          <IonButtons slot="start">
            <IonButton onClick={onBack} className="active:scale-95 transition-transform text-white">
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle className="font-bold text-white">{pratica.numero}</IonTitle>
          <IonButtons slot="end" className="mr-4">
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${getStatoColor(pratica.stato)} shadow-sm`}>
              {getStatoLabel(pratica.stato)}
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* Contenuto della pagina Mobile: #EDEDCE | Web: #F4F4F4 */}
      <IonContent className="[--background:#EDEDCE] md:[--background:#F4F4F4]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonna Principale (Tabs e Dettagli) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Segment Nativo Ionic per le Tab (Sostituisce le vecchie Tabs web) */}
              <IonSegment
                value={activeTab}
                onIonChange={(e) => setActiveTab(e.detail.value as string)}
                className="bg-white rounded-lg shadow-sm [--background-checked:#0C7779] md:[--background-checked:#088395] [--color-checked:#ffffff]"
              >
                <IonSegmentButton value="preventivo">Preventivo</IonSegmentButton>
                <IonSegmentButton value="veicolo">Veicolo</IonSegmentButton>
                <IonSegmentButton value="cronologia">Cronologia</IonSegmentButton>
              </IonSegment>

              {/* TAB: PREVENTIVO */}
              {activeTab === 'preventivo' && (
                <IonCard className="m-0 border-transparent shadow-sm bg-white rounded-xl">
                  <IonCardHeader>
                    <IonCardTitle className="flex items-center gap-2 text-[#0C2C55] md:text-gray-900 text-lg">
                      <IonIcon icon={documentTextOutline} className="text-[#0C7779] md:text-gray-500" />
                      Preventivo Perito
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#629FAD]/30 md:border-gray-200">
                      <div>
                        <p className="text-xs md:text-sm text-[#296374] md:text-gray-600">ID Preventivo</p>
                        <p className="font-medium text-[#0C2C55] md:text-gray-900">{pratica.preventivo.id}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-[#296374] md:text-gray-600">Data Emissione</p>
                        <p className="font-medium text-[#0C2C55] md:text-gray-900">{new Date(pratica.preventivo.dataEmissione).toLocaleDateString('it-IT')}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-[#296374] md:text-gray-600">Tempo Stimato</p>
                        <p className="flex items-center gap-2 font-medium text-[#0C2C55] md:text-gray-900">
                          <IonIcon icon={timeOutline} className="text-[#629FAD] md:text-gray-400" />
                          {pratica.preventivo.tempoStimato}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-[#296374] md:text-gray-600">Importo Totale</p>
                        <p className="text-2xl font-bold text-[#0C7779] md:text-[#088395]">€{pratica.preventivo.importoTotale.toFixed(2)}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-[#0C2C55] md:text-gray-800 mb-3">Interventi Previsti</h3>
                      <div className="space-y-3">
                        {pratica.preventivo.interventi.map((intervento, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-[#EDEDCE]/50 md:bg-gray-50 rounded-lg border border-[#629FAD]/20 md:border-transparent active:scale-[0.98] transition-transform">
                            <div className="flex-1">
                              <p className="text-[#0C2C55] md:text-gray-800 font-medium">{intervento.descrizione}</p>
                            </div>
                            <p className="text-lg font-bold text-[#296374] md:text-gray-900">€{intervento.costo.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {pratica.preventivo.note && (
                      <div className="pt-4 border-t border-[#629FAD]/30 md:border-gray-200">
                        <p className="text-sm text-[#296374] md:text-gray-600 mb-2 font-medium">Note del Perito</p>
                        <div className="bg-[#249E94]/10 md:bg-[#EBF4F6] border border-[#629FAD] md:border-[#7AB2B2] rounded-lg p-4">
                          <p className="text-sm text-[#0C2C55] md:text-gray-800">{pratica.preventivo.note}</p>
                        </div>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              )}

              {/* TAB: VEICOLO */}
              {activeTab === 'veicolo' && (
                <IonCard className="m-0 border-transparent shadow-sm bg-white rounded-xl">
                  <IonCardHeader>
                    <IonCardTitle className="flex items-center gap-2 text-[#0C2C55] md:text-gray-900 text-lg">
                      <IonIcon icon={carOutline} className="text-[#0C7779] md:text-gray-500" />
                      Informazioni Veicolo
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#296374] md:text-gray-600">Targa</p>
                        <p className="text-xl font-bold text-[#0C2C55] md:text-gray-900">{pratica.veicolo.targa}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#296374] md:text-gray-600">Anno</p>
                        <p className="text-xl font-bold text-[#0C2C55] md:text-gray-900">{pratica.veicolo.anno}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#296374] md:text-gray-600">Marca</p>
                        <p className="text-xl font-bold text-[#0C2C55] md:text-gray-900">{pratica.veicolo.marca}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#296374] md:text-gray-600">Modello</p>
                        <p className="text-xl font-bold text-[#0C2C55] md:text-gray-900">{pratica.veicolo.modello}</p>
                      </div>
                    </div>

                    {pratica.noteInterne && (
                      <div className="mt-6 pt-4 border-t border-[#629FAD]/30 md:border-gray-200">
                        <p className="text-sm text-[#296374] md:text-gray-600 mb-2 font-medium">Note Interne Officina</p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                          <IonIcon icon={alertCircleOutline} className="text-yellow-600 text-xl flex-shrink-0" />
                          <p className="text-sm text-yellow-800">{pratica.noteInterne}</p>
                        </div>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              )}

              {/* TAB: CRONOLOGIA */}
              {activeTab === 'cronologia' && (
                <IonCard className="m-0 border-transparent shadow-sm bg-white rounded-xl">
                  <IonCardHeader>
                    <IonCardTitle className="flex items-center gap-2 text-[#0C2C55] md:text-gray-900 text-lg">
                      <IonIcon icon={calendarOutline} className="text-[#0C7779] md:text-gray-500" />
                      Cronologia Attività
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="space-y-4">
                      {pratica.cronologia.map((evento, index) => (
                        <div key={index} className="relative pl-8 pb-6 last:pb-0">
                          {/* Linea verticale nativa */}
                          {index < pratica.cronologia.length - 1 && (
                            <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-[#629FAD] md:bg-gray-200" />
                          )}
                          
                          {/* Pallino Dinamico (Colori Web/Mobile) */}
                          <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${
                            evento.stato === 'pronto' ? 'bg-[#0C7779] md:bg-[#088395] border-[#0C7779] md:border-[#088395]' :
                            evento.stato === 'in_riparazione' ? 'bg-[#249E94] md:bg-[#7AB2B2] border-[#249E94] md:border-[#7AB2B2]' :
                            evento.stato === 'ricevuto' ? 'bg-[#0C7779] md:bg-[#088395] border-[#0C7779] md:border-[#088395]' :
                            evento.stato === 'riconsegnato' ? 'bg-[#0C2C55] md:bg-[#10546D] border-[#0C2C55] md:border-[#10546D]' :
                            'bg-[#629FAD] md:bg-[#5F9598] border-[#629FAD] md:border-[#5F9598]'
                          }`} />
                          
                          <div className="active:opacity-70 transition-opacity">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatoColor(evento.stato)} border`}>
                                {getStatoLabel(evento.stato)}
                              </div>
                              <span className="text-xs text-[#296374] md:text-gray-500 font-medium">
                                {new Date(evento.data).toLocaleDateString('it-IT')} - {new Date(evento.data).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {evento.nota && <p className="text-sm font-medium text-[#0C2C55] md:text-gray-800 mb-1">{evento.nota}</p>}
                            {evento.operatore && (
                              <p className="text-xs text-[#629FAD] md:text-gray-500">Operatore: {evento.operatore}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </IonCardContent>
                </IonCard>
              )}
            </div>

            {/* Sidebar Laterale / Colonna Bassa (Automobilista e Azioni Rapide) */}
            <div className="space-y-6 pb-8 lg:pb-0">
              
              {/* Card Cliente */}
              <IonCard className="m-0 border-transparent shadow-sm bg-white rounded-xl">
                <IonCardHeader>
                  <IonCardTitle className="flex items-center gap-2 text-[#0C2C55] md:text-gray-900 text-lg">
                    <IonIcon icon={personOutline} className="text-[#0C7779] md:text-gray-500" />
                    Automobilista
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-[#296374] md:text-gray-600">Nome Completo</p>
                    <p className="text-lg font-bold text-[#0C2C55] md:text-gray-900">{pratica.automobilista.nome} {pratica.automobilista.cognome}</p>
                  </div>
                  <div className="h-px w-full bg-[#629FAD]/30 md:bg-gray-200 my-2" />
                  <div>
                    <p className="text-sm text-[#296374] md:text-gray-600 mb-2">Contatti</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-[#0C2C55] md:text-gray-800 font-medium active:opacity-60 transition-opacity">
                        <IonIcon icon={callOutline} className="text-[#629FAD] md:text-gray-400" />
                        <span>{pratica.automobilista.telefono}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#0C2C55] md:text-gray-800 font-medium active:opacity-60 transition-opacity">
                        <IonIcon icon={mailOutline} className="text-[#629FAD] md:text-gray-400" />
                        <span className="break-all">{pratica.automobilista.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-[#629FAD]/30 md:bg-gray-200 my-2" />
                  
                  {/* Pulsante Contatta Cliente Nativo */}
                  <button 
                    className="w-full py-2.5 rounded-lg font-medium flex justify-center items-center gap-2 bg-[#005461] md:bg-white text-white md:text-[#088395] border-transparent md:border-[#088395] border hover:bg-[#0C2C55] active:bg-[#0C2C55] md:active:bg-[#088395]/10 active:scale-95 transition-all shadow-sm md:shadow-none"
                    onClick={onContattoCliente}
                  >
                    <IonIcon icon={callOutline} />
                    Contatta Cliente
                  </button>
                </IonCardContent>
              </IonCard>

              {/* Card Azioni */}
              <IonCard className="m-0 border-transparent shadow-sm bg-white rounded-xl">
                <IonCardHeader>
                  <IonCardTitle className="text-[#0C2C55] md:text-gray-900 text-lg">Azioni Rapide</IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="space-y-3">
                  <button 
                    className="w-full py-3 rounded-lg font-bold bg-[#0C7779] md:bg-[#088395] text-white hover:bg-[#005461] active:bg-[#005461] md:hover:bg-[#09637E] active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:pointer-events-none" 
                    onClick={onGestioneStato}
                    disabled={pratica.stato === 'riconsegnato'}
                  >
                    Aggiorna Stato Veicolo
                  </button>
                  
                  {pratica.stato === 'pronto' && (
                    <button 
                      className="w-full py-3 rounded-lg font-bold bg-transparent border-2 border-[#0C7779] text-[#0C7779] md:border-gray-300 md:text-gray-700 active:bg-[#629FAD]/20 active:scale-95 transition-all" 
                      onClick={onContattoCliente}
                    >
                      Notifica Riconsegna
                    </button>
                  )}
                </IonCardContent>
              </IonCard>
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
