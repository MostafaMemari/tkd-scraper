import { Inject, Injectable } from '@nestjs/common';
import { GuestGateway } from './ports/guest.gateway';

@Injectable()
export class GuestService {
  constructor(@Inject('GuestGateway') private readonly gateway: GuestGateway) {}

  createGuestSession() {
    return this.gateway.createGuestSession();
  }
}
