window.Game = window.Game || {};

//分数配置表
window.Game.ScoreTable = {
    //基础分
    BasisScore: {
        1   : 16,
        2   : 32,
        3   : 64,
        4   : 128,
        5   : 256,
        6   : 512,
        7   : 1024,
        8   : 2048,
        9   : 4096,
        10  : 8192,
        11  : 16384,
    },
    //合成数量倍率
    SnythesiNumRotio: {
        2   : 0.5,
        3   : 1,
        4   : 2,
        5   : 4,
        6   : 8,
        7   : 16,
        8   : 32,
    },
    //合成次数倍率
    SnythesiCountRotio: {
        0   : 1,
        1   : 1,
        2   : 2,
        3   : 4,
        4   : 8,
        5   : 16,
        6   : 32,
    }
};