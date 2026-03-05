/**
 * ANGULAR IMPLEMENTATION NOTES FOR ENTIRE APPLICATION:
 * * ARCHITECTURE:
 * - Use standalone components throughout (no NgModules)
 * - Implement signals for reactive state management
 * - Create dedicated services for business logic
 * * SERVICES TO CREATE:
 * 1. AuthService - Handle authentication, login/logout, token management
 * 2. PraticheService - Manage pratiche state with signals, CRUD operations
 * 3. NotificationService - Handle real-time notifications for new pratiche
 * 4. StateService - Manage global application state with signals
 * * SIGNAL USAGE:
 * - pratiche = signal<Pratica[]>([])
 * - notifiche = signal<number>(0)
 * - isAuthenticated = signal<boolean>(false)
 * - currentUser = signal<User | null>(null)
 * * ROUTING:
 * - Implement route guards (AuthGuard)
 * - Use lazy loading for feature modules
 * - Protect dashboard routes
 */

import { router } from './routes';
import { setupIonicReact, IonApp } from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import { RouterProvider } from 'react-router';

setupIonicReact();

function App() {
  return (
    <IonApp>
      <RouterProvider router={router} />
    </IonApp>
  );
}

export default App;
