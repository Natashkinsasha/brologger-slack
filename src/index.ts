import { Transport, TransportOptions, TransportError } from 'brologger';
import axios, {AxiosError} from 'axios';
import SlackTransportError from "./SlackTransportError";

export interface SlackMessage {
    token?: string,
    channel?: string,
    text: string,
    as_user?: boolean,
    attachments?: readonly SlackMessageAttachment[],
    blocks?: readonly any[],
    icon_emoji?: string,
    icon_url?: string,
    link_names?: boolean,
    mrkdwn?: boolean,
    parse?: string,
    reply_broadcast?: boolean,
    thread_ts?: string,
    unfurl_links?: boolean,
    unfurl_media?: boolean,
    username?: string,
}

export interface SlackMessageAttachment {
    fallback?: string,
    color?: string,
    pretext?: string,
    author_name?: string,
    author_link?: string,
    author_icon?: string,
    title?: string,
    title_link?: string,
    text?: string,
    fields?: readonly SlackAttachmentField[],
    image_url?: string,
    thumb_url?: string,
    footer?: string,
    footer_icon?: string,
    ts?: number,
}

export interface SlackAttachmentField {
    title?: string,
    value?: string,
    short?: boolean
}

interface SlackTransportOptions extends TransportOptions {
    webhookUrl: string;
    messageFormat?: (level: string, message?: string, infoObject?: object, meta?: object) => SlackMessage;
}

export default class SlackTransport extends Transport {

    constructor(private readonly options: SlackTransportOptions) {
        super({ ...options });
    }

    public async log(level: string, message?: string, infoObject?: object, meta?: object) {
        const slackMessage = this.options.messageFormat
            ? this.options.messageFormat(level, message, infoObject, meta)
            : this.prepareDefaultMessage(level, message, infoObject, meta);
        await axios
            .post(this.options.webhookUrl, slackMessage)
            .catch((err: AxiosError)=>{
                throw new SlackTransportError(JSON.stringify(err.response?.data || err.message));
            });
    }

    private prepareDefaultMessage(
        level: string,
        message?: string,
        infoObject?: any,
        meta?: any
    ): SlackMessage {
        const objectSnippet = infoObject && `\`\`\`\n${JSON.stringify(infoObject)}\n\`\`\``;
        const metaSnippet = infoObject && `\`\`\`\n${JSON.stringify(meta)}\n\`\`\``;
        const text: string = [level, [message, objectSnippet, metaSnippet]
            .filter((data) => data !== undefined)
            .join('\n')].join(': ');
        return { text };
    }
}



