import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PathService } from '@shared/services/path.service';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  constructor(
    private location: Location,
    public pathService: PathService,
    ) { }

  ngOnInit(): void {
  }

  previousPage() {
    this.location.back();
  }
}
