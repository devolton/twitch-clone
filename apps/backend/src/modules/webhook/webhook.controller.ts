import {Controller, HttpCode, Headers, Post, Body, HttpStatus, UnauthorizedException, RawBody} from '@nestjs/common';
import {WebhookService} from './webhook.service';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {
    }

    @Post('livekit')
    @HttpCode(HttpStatus.OK)
    async receiveWebhookLivekit(
        @Body() body: string,
        @Headers('Authorization') authorization: string
    ) {
        if (!authorization) {
            throw new UnauthorizedException('Authorization header is missing!');
        }
        return await this.webhookService.receiveWebhookLivekit(body, authorization);
    }

    @Post('stripe')
    @HttpCode(HttpStatus.OK)
    async receiveWebhookStripe(@RawBody() rawBody: string, @Headers('stripe-signature') signature: string) {
        if (!signature) {
            throw new UnauthorizedException("Stripe signature is missing!");
        }
        const event = this.webhookService.constructTypeEvent(rawBody, signature);
        await this.webhookService.receiveWebhookStripe(event);

    }
}
