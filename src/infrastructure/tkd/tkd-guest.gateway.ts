import { Injectable } from '@nestjs/common';

import { GuestGateway } from 'src/modules/guest/ports/guest.gateway';
import { TkdSessionService } from './session/tkd-session.service';
import { TkdStudentSearchService } from './search/tkd-student-search.service';

@Injectable()
export class TkdGuestGateway implements GuestGateway {
  constructor(
    private readonly session: TkdSessionService,
    private readonly student: TkdStudentSearchService,
  ) {}

  async createGuestSession(): Promise<string> {
    const { cookie } = await this.session.createGuestSession();
    // const tokens = await this.session.createSearchSession(cookie);
    const search = await this.student.search({ cookie });

    return search;
  }
}
