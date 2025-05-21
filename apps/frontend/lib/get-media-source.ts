import {MEDIA_URL} from "@/lib/constants/url.constant";

export function getMediaSource(path: string | undefined | null) {
    return MEDIA_URL + (path ?? '');
}