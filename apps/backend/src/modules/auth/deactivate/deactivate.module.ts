import {Module} from '@nestjs/common';
import {DeactivateService} from './deactivate.service';
import {DeactivateResolver} from './deactivate.resolver';
import {MailModule} from "../../libs/mail/mail.module";

@Module({
    imports: [MailModule],
    providers: [DeactivateResolver, DeactivateService],
})
export class DeactivateModule {
}
