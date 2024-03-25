import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { SecondComponent } from './components/second/second.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [MsalGuard]
    },
    {
        path: 'second',
        component: SecondComponent,
        canActivate: [MsalGuard]
    }
];
