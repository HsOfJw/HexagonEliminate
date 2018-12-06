window.Game = window.Game || {};

//从后台拉取的配置
Game.ConfigData = null;

//从微信获取的用户信息
Game.UserInfo = null;

window.Game.GlobalVar = {
    //是否有存档
    IsHaveGameArchive: false,

    //是否首次进入首页
    IsFirstEnterHomePage: true,

    shareTicket: null,

    //是否正在新手引导
    IsGuide: false,

    canClick: false,

    showForHelp: false,

    userID: 0,

    gameOver: false,
};

window.GameConfig = {

    MinDistance: 40,
    ShareText: "六角消消乐2048",
    ClearDataFlag: "0817",

    Share_Text1: "分享到群里才能领取奖励",
    Share_Text2: "分享失败",

    JWLogoDuration: 1.5,

    UniversalNum        : 1,    //万能方块的数量
    ReplaceUINum        : 1,    //更换UI的数量
    BombNum             : 1,    //炸弹的数量

    openNewbieGuide: false,     //是否打开新手引导


    InitMaxNumType      : 1,     //随机生成方块的初始最大类型
    MaxNumType          : 9,    //生成方块的最大的数字类型

    Resurrection2048Num: 3,     //复活时生成2048的个数

    ReceivePropNum      : 1,    //每局可以领取的道具的数量
    ReceiveBombNum      : 4,    //每局可以领取的炸弹的数量

    SoundSwitch: true,          //是否打开声音

    DebugMode: false,           //是否为调试模式

    NewbieGuideMoveDuration: 1.5,   //新手引导手指移动的时间

    Bomb_Circle_Num: 2,     //炸弹的作用范围
    Hexagon_2048_Circle_Num: 1,    //2048的作用范围

    TrasureChestCreateConditions    : 3,   //创建宝箱的条件(合成次数)
    TrasureChestProbability         : 20,  //宝箱出现的几率(百分值)

    TrasureChestAnimCount: 3,      //宝箱晃动次数

    TrasureChestAnimInterval: 3,    //宝箱晃动间隔(s)

    //弹窗动画的时间
    PopUp_Duration: 0.2,

    //合成特效的执行时间
    SynthesiEffectDuration: 0.4,

    //点击旋转方块的时间
    HexagonNodeRotateDuration: 0.5,

    //分数特效时间
    Score_Effect_Scale_Duration: 0.3,   //放大的时间
    Score_Effect_Delay_Time: 0.3,   //放大后延时
    Score_Effect_Move_Duration: 0.5,    //上移的时间
    Score_Effect_Move_Height: 30,    //上移的高度


    GameID: 33,

    GameListID: 3301,

    AppID: "wx2668677937e0fda6",

    GetGameADAddr: 'https://gather.51weiwan.com/hz/general/plan1',

    //用户信息按钮
    UserInfoBtn: 'http://gather.51weiwan.com//uploads//file//20180816//9dd0623f1b5a3501f17da1bb5dfa0936.png',
    //登录接口
    LoginAddr: "https://gather.51weiwan.com/api/login/index",
    //获取配置的接口
    GetConfigAddr: "https://gather.51weiwan.com/api/app/getConfig",
    //获取跳转游戏列表
    GetGameList: 'https://gather.51weiwan.com/api/app/redirectlist',

    //上传分数的接口
    UploadScoreAddr: "https://gather.51weiwan.com/api/game/saveData",
    //获取排行榜的接口
    GetRankListAddr: "https://gather.51weiwan.com/api/game/rank",
    //被分享者入库的接口
    UserShareAddr: "https://gather.51weiwan.com/liujiao/share/userShare",
    //获取用户分享列表的接口
    GetShareUserInfo: "https://gather.51weiwan.com/liujiao/share/shareInfo",

};
