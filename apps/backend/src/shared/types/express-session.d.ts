import 'express-session'
import { type SessionMetadata} from "./session-metadata.types";

declare module 'express-session' {
    interface SessionData {
        userId?:number,
        createdAt?:Date | String,
        metadata:SessionMetadata,
    }
}