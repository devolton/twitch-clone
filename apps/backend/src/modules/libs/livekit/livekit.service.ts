import {Inject, Injectable} from '@nestjs/common';
import {IngressClient, RoomServiceClient, WebhookReceiver} from "livekit-server-sdk";
import {LiveKitOptionsSymbol, TypeLiveKitOptions} from "./types/livekit.types";

@Injectable()
export class LivekitService {
    private roomService: RoomServiceClient;
    private ingressClient: IngressClient;
    private webhookReceiver: WebhookReceiver;

    constructor(@Inject(LiveKitOptionsSymbol) private readonly options: TypeLiveKitOptions) {
        this.roomService = new RoomServiceClient(this.options.apiUrl, this.options.apiKey, this.options.apiSecret);
        this.ingressClient = new IngressClient(this.options.apiUrl);
        this.webhookReceiver = new WebhookReceiver(this.options.apiKey, this.options.apiSecret);
    }

    get ingress(): IngressClient {
        return this.createProxy(this.ingressClient);
    }

    get room(): RoomServiceClient {
        return this.createProxy(this.roomService);
    }

    get reciever(): WebhookReceiver {
        return this.createProxy(this.webhookReceiver);
    }

    private createProxy<T extends object>(target: T) {
        return new Proxy(target, {
            get: (obj, prop) => {
                const value = obj[prop as keyof T];
                if (typeof value === 'function') {
                    return value.bind(obj);
                }
                return value;

            }
        })
    }


}
