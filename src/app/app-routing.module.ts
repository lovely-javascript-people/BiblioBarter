import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/Greet', pathMatch: 'full' },
  { path: 'Matches', loadChildren: './home/home.module#HomePageModule' },
  { path: 'Matches/Home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'Profile', loadChildren: './profile/profile.module#ProfileModule' },
  { path: 'Matches/Profile', loadChildren: './profile/profile.module#ProfileModule' },
  { path: 'Greet', loadChildren: './greet/greet.module#GreetPageModule' },
  { path: 'callback', redirectTo: '/Matches', pathMatch: 'full'},
  { path: 'login', redirectTo: '/Matches', pathMatch: 'full'},
  { path: 'peer-profile', loadChildren: './profile/peerProfile/peer-profile/peer-profile.module#PeerProfilePageModule' },
  { path: 'Chat', loadChildren: './chat/chat.module#ChatPageModule'},
  { path: 'Settings', loadChildren: './modals/modals.module#ModalsModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
