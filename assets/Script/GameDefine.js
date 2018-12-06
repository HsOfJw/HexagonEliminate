//随机生成方块的位置类型
var PosType = cc.Enum({
    PT_Horizontal: 1,   //水平方向
    PT_LeftDonw: 2,     //左下方向
    PT_RightDonw: 3,    //右下方向
});

module.exports = {
    PosType: PosType,
};