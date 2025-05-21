import {Module} from '@nestjs/common';
import {PasswordRecoveryService} from './password-recovery.service';
import {PasswordRecoveryResolver} from './password-recovery.resolver';
import {MailModule} from "../../libs/mail/mail.module";

@Module({
    imports: [MailModule],
    providers: [PasswordRecoveryResolver, PasswordRecoveryService],
})
export class PasswordRecoveryModule {
}
