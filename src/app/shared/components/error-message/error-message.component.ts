import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ErrorMessageService } from '@shared/services/error-message.service';
import { mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {
  public errors: string[] = []

  constructor(
    public errorService: ErrorMessageService,
    private translate: TranslateService) {
      this.errorService.errors.pipe(
        mergeMap(val => {
          if(val.length > 0)
            return this.translate.get(val)
          return of(val)
        })
      ).subscribe(el => this.errors = Object.values(el))
    }

  ngOnInit(): void {
  }
}
