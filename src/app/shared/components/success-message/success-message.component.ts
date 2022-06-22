import { Component, OnInit } from '@angular/core';
import { SuccessMessageService } from '@shared/services/success-message.service';
import { TranslateService } from '@ngx-translate/core';
import { PathService } from '@shared/services/path.service';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss']
})
export class SuccessMessageComponent implements OnInit {
  public show: boolean = false;

  constructor(
    public successService: SuccessMessageService,
    public pathService: PathService,
    public translate: TranslateService,
    ) {
      this.successService.show.subscribe((val: boolean) => this.show = val)
    }

  ngOnInit(): void {
  }

  closeMessage() {
    this.successService.closeMessage();
  }
}
