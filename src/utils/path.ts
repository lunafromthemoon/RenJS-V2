import {i18nInterface} from '../core/RJSGameConfig';

export function preparePath(path: string, i18n?: i18nInterface){
    if (i18n){
        return path.replace('LANG', i18n.current);
    } else {
        return path;
    }
}
