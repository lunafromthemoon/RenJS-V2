import RJS from '../core/RJS';
export declare function preparePath(path: string, game: RJS): string;
export declare function preloadBackground(bgName: string, game: RJS): void;
export declare function preloadCGS(cgName: string, game: RJS): void;
export declare function preloadAudio(audioName: string, audioType: 'music' | 'sfx', game: RJS): void;
export declare function preloadCharacter(chName: string, game: RJS): void;
export declare function preloadExtra(asset: string, type: string, game: RJS): void;
export declare function guid(): string;
export declare function loadStyle(href: string, callback?: () => any): void;
