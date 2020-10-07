import {Subject} from 'rxjs';

export class AnyNextSubject<T> extends Subject<T> {
    next(value?: any) {
        super.next(value);
    }
}
