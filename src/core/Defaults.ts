export interface DefaultsInterface {
    name: string;

    defaultTextStyle: {
        font: string;
        fill: string;
        align: string;
    };
    settings: {
        textSpeed: number;
        autoSpeed: number;
        bgmv: number;
        sfxv: number;
        muted: boolean;
    };

    limits: {
        textSpeed: number[];
        autoSpeed: number[];
        bgmv: number[];
        sfxv: number[];
    };

    positions: {
        LEFT: {x: number;y: number};
        OUTLEFT: {x: number;y: number};
        CENTER: {x: number;y: number};
        RIGHT: {x: number;y: number};
        OUTRIGHT: {x: number;y: number};
    };

    // miliseconds for fade transitions
    fadetime: number;
    skiptime: number;
    // miliseconds to wait before continuing
    timeout: number;
    // avoid continuous clicking by waiting a few miliseconds before accepting new "clicks"
    clickCooldown: number;

    transitions: {
        ch: string;
        bg: string;
        cgs: string;
        bgm: string;
    };
}

export const defaults = {
    // name of the game
    name: 'RenJS-GAME',

    defaultTextStyle: {
        font: 'bold 16pt Arial',
        fill: '#FFFFFF',
        align: 'left'
    },
    settings: {
        textSpeed: 50,
        autoSpeed: 150,
        bgmv: 1,
        sfxv: 1,
        muted: false
    },

    limits: {
        textSpeed: [10,150],
        autoSpeed: [50,300],
        bgmv: [0,1],
        sfxv: [0,1]
    },

    positions : {
        LEFT: {x:800/6,y:600},
        OUTLEFT: {x:-(800/6),y:600},
        CENTER: {x:800/2,y:600},
        RIGHT: {x:(800/6)*5,y:600},
        OUTRIGHT: {x:(800/6)*7,y:600}
    },

    // miliseconds for fade transitions
    fadetime : 750,
    skiptime: 50,
    // miliseconds to wait before continuing
    timeout : 5000,
    // avoid continuous clicking by waiting a few miliseconds before accepting new "clicks"
    clickCooldown: 200,

    transitions: {
        ch: 'CUT',
        bg: 'FADE',
        cgs: 'FADE',
        bgm: 'FADE'
    }

}
