/**
 * ANGULAR IMPLEMENTATION NOTES:
 * - Implement as standalone component
 * - Use router-outlet for child routes
 */

import { Outlet } from "react-router";
import { Toaster } from 'sonner';
import { IonPage, IonContent } from '@ionic/react';

export function RootLayout() {
  return (
    <IonPage>
      <IonContent>
        <Outlet />
        <Toaster position="top-right" richColors />
      </IonContent>
    </IonPage>
  );
}
