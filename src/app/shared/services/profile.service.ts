import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AgentLoginInfo } from '../models/agentLoginInfo';

@Injectable()
export class ProfileService {
  profile: BehaviorSubject<AgentLoginInfo> = new BehaviorSubject<AgentLoginInfo>({})

  constructor() { }
}
