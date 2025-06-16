import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'encuesta/:secuencialParticipante',
    title: 'Encuesta',
    loadComponent: () => import('./pages-encuesta/encuesta/encuesta.component'),
  },
  {
    path: 'user-form',
    title: 'Formulario Usuario',
    loadComponent: () => import('./pages-encuesta/user-form/user-form.component'),
  },
  {
    path: 'radar/:secuencialParticipante',
    title: 'Radar',
    loadComponent: () => import('./pages-encuesta/grafica/grafica.component'),
  },
  // comodín para todo lo demás
  {
    path: '**',
    redirectTo: '/user-form',
    pathMatch: 'full',
  },
];
