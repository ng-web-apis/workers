import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {WorkerPipe} from './pipes/worker.pipe';
import {WorkerExecutor} from './services/worker-executor.service';

@NgModule({
    imports: [CommonModule],
    declarations: [WorkerPipe],
    exports: [WorkerPipe],
    providers: [WorkerExecutor],
})
export class WorkerModule {}
