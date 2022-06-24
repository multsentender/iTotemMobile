import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from '@shared/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { PathService } from '@shared/services/path.service';
import { MatMessage } from '@shared/services/message.service';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageComponent implements OnInit {

  constructor(
    public messageService: MessageService,
    public pathService: PathService,
    public translate: TranslateService,
    @Inject(MAT_SNACK_BAR_DATA) public data: MatMessage
  ) { }

  ngOnInit(): void {
  }

  closeMessage() {
    this.messageService.closeMessage();
  }
}
