import { Observable } from 'rxjs';

export interface TimestampObservableCache {
    expires?: Date;
    observable: Observable<unknown>;
}