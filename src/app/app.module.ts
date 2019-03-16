import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {AuthService} from './services/auth/auth.service';
import { HomePageModule } from './home/home.module';
import { FooterModule } from './footer/footer.module';
import { ModalsModule } from './modals/modals.module';
import { SearchModalsModule } from './search_modal/search_modal.module';
import { AddListingModule } from './add_listing_modal/add_listing_modal.module';
// import { WantListModalModule } from './want_list_modal/want_list_modal.module';
import { SettingsService } from './services/settings/settings.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, HomePageModule, FooterModule, ModalsModule, SearchModalsModule, AddListingModule],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    SettingsService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
