# ![ng-web-apis logo](projects/demo/src/assets/logo.svg) Web Workers API for Angular

> Part of <img src="projects/demo/src/assets/web-api.svg" align="top"> [Web APIs for Angular](https://ng-web-apis.github.io/)

[![npm version](https://img.shields.io/npm/v/@ng-web-apis/workers.svg)](https://npmjs.com/package/@ng-web-apis/workers)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@ng-web-apis/workers)](https://bundlephobia.com/result?p=@ng-web-apis/workers)
[![Travis (.com)](https://img.shields.io/travis/com/ng-web-apis/workers)](https://travis-ci.com/ng-web-apis/workers)
[![Coveralls github](https://img.shields.io/coveralls/github/ng-web-apis/workers)](https://coveralls.io/github/ng-web-apis/workers?branch=master)
[![angular-open-source-starter](https://img.shields.io/badge/made%20with-angular--open--source--starter-d81676?logo=angular)](https://github.com/TinkoffCreditSystems/angular-open-source-starter)

This is a library for comfortable use of
[Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
with Angular.

## Install

If you do not have [@ng-web-apis/common](https://github.com/ng-web-apis/common):

```
npm i @ng-web-apis/common
```

Now install the package:

```
npm i @ng-web-apis/workers
```

## How it use

You can create worker with service and use it in a template with `AsyncPipe`:

```typescript
import {WorkerExecutor, WebWorker} from '@ng-web-apis/workers';

@Component({
    template: `
        Computed Result: {{ worker | async }}
        <form (ngSubmit)="worker.next(input.value)">
            <input #input />
            <button type="submit">Send to worker</button>
        </form>
    `,
})
class SomeComponent {
    readonly worker: WebWorker<number, number>;

    constructor(workerExecutor: WorkerExecutor) {
        this.worker = workerExecutor.createWorker(this.compute);
    }

    compute(data: number): number {
        return data ** 2;
    }
}
```

It's the same with `WorkerPipe` only:

```typescript
import {WorkerModule} from '@ng-web-apis/workers';
import {NgModule} from '@angular/core';

@NgModule({
    imports: [WorkerModule],
    declarations: [SomeComponent],
})
class SomeModule {}
```

```typescript
import {WorkerExecutor, WebWorker} from '@ng-web-apis/workers';
import {FormControl} from '@angular/forms';

@Component({
    template: `
        Computed Result: {{ control.value | waWorker: changeData | async }}

        <input [formControl]="control" />
    `,
})
class SomeComponent {
    control = new FormControl('');

    changeData(data: number): number {
        return `${data} (changed)`;
    }
}
```

## See also

Other [Web APIs for Angular](https://ng-web-apis.github.io/) by [@ng-web-apis](https://github.com/ng-web-apis)

## Open-source

Do you also want to open-source something, but hate the collateral work?
Check out this [Angular Open-source Library Starter](https://github.com/TinkoffCreditSystems/angular-open-source-starter)
we’ve created for our projects. It got you covered on continuous integration,
pre-commit checks, linting, versioning + changelog, code coverage and all that jazz.
