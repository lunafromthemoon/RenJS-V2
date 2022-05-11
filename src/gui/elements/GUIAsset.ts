export interface GUIAsset {
    key: string;
    file: string;
    type: 'audio' | 'image' | 'spritesheet';
    w: number;
    h: number;
}
