import { Component, OnInit } from '@angular/core';
import { ErrorMessageService } from '@shared/services/error-message.service';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {
  constructor(public errorService: ErrorMessageService) {}

  ngOnInit(): void {
  }
}
