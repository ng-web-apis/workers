import {CommonModule} from '@angular/common';
import {inject, InjectFlags, NgModule} from '@angular/core';
import {WorkerPipe} from './pipes/worker.pipe';
import {WorkerExecutor} from './services/worker-executor.service';

@NgModule({
    imports: [CommonModule],
    declarations: [WorkerPipe],
    exports: [WorkerPipe],
    providers: [
        {
            provide: WorkerExecutor,
            useFactory(): WorkerExecutor {
                const instance = inject(WorkerExecutor, InjectFlags.Optional);

                return instance || new WorkerExecutor();
            },
        },
    ],
})
export class WorkerModule {}
