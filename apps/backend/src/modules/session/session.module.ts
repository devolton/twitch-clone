import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionResolver } from './session.resolver';
import {VerificationService} from "../auth/verification/verification.service";
import {VerificationModule} from "../auth/verification/verification.module";

@Module({
  imports: [VerificationModule],
  providers: [SessionResolver, SessionService],
})
export class SessionModule {}
