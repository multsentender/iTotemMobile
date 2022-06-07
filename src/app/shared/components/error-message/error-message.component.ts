import { Component, OnInit } from '@angular/core';
import { ErrorMessageService } from '@shared/services/error-message.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {
  env = environment;
  
  constructor(public errorService: ErrorMessageService) {}

  ngOnInit(): void {
  }
}
