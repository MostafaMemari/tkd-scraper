import { Controller, Get } from '@nestjs/common';
import { GuestService } from './guest.service';

@Controller('guest')
export class GuestController {
  constructor(private readonly service: GuestService) {}

  @Get('session')
  createSession() {
    return this.service.createGuestSession();
  }
}
