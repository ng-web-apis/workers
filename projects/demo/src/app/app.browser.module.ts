import {
    APP_BASE_HREF,
    CommonModule,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {WorkerModule} from '@ng-web-apis/workers';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routes';
import {ClockComponent} from './clock.component';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule.withServerTransition({appId: 'demo'}),
        AppRoutingModule,
        WorkerModule,
    ],
    declarations: [AppComponent, ClockComponent],
    providers: [
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy,
        },
        {
            provide: APP_BASE_HREF,
            useValue: '',
        },
    ],
})
export class AppBrowserModule {}
