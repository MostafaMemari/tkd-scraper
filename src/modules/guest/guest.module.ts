import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { TkdModule } from '../../infrastructure/tkd/tkd.module';
import { Module } from '@nestjs/common';
import { TkdGuestGateway } from 'src/infrastructure/tkd/tkd-guest.gateway';

@Module({
  imports: [TkdModule],
  controllers: [GuestController],
  providers: [
    GuestService,
    {
      provide: 'GuestGateway',
      useExisting: TkdGuestGateway,
    },
  ],
})
export class GuestModule {}
