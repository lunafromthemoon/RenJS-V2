declare type Token = {
    text: string;
    tag?: never;
} | {
    text?: never;
    tag: string;
};
/** converts text into a list of tokens that can be used to construct styles */
export declare function tokenizeTextStyle(text: string, regex?: string): Token[];
export {};
