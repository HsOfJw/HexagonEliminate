var Util = require("Util");

cc.Class({
    extends: cc.Component,

    // onLoad () {},

    bombEffectArr: null,

    start () {
        this.bombEffectArr = [];
    },

    //播放爆炸动画
    playBombEffect(idArr){
        if(!idArr || idArr.length <= 0){
            return;
        }

        if(!Game.GameLogic){
            return;
        }

        var hexagonMgr = Game.GameLogic.GetHexagonMgr();

        if(!hexagonMgr){
            return;
        }

        var prefab = Util.GetPrefab("prefab/BombNode");
        if(!prefab)return;

        //添加炸弹特效
        for(var i = 0;i < idArr.length;i ++){
            var id = idArr[i];
            var bombNode = cc.instantiate(prefab);
            var hexagonNode = hexagonMgr.getHexagonNodeByID(id);
            bombNode.x = hexagonNode.x;
            bombNode.y = hexagonNode.y;
            bombNode.parent = hexagonNode.parent;
            this.bombEffectArr.push(bombNode);
            var anim = Util.GetComponent(bombNode, cc.Animation);
            if(anim){
                anim.play("bomb");

                if(i == (idArr.length - 1)){
                    anim.on('finished', this.bombPlayFinished, this);
                }
            }
            hexagonMgr.removeHexagonNodeByID(id);
        }
    },

    //炸弹特效播放完毕
    bombPlayFinished(){
        if(!this.bombEffectArr || this.bombEffectArr.length <= 0){
            return;
        }

        for(var i = 0;i < this.bombEffectArr.length;i ++){
            var bombNode = this.bombEffectArr[i];
            bombNode.destroy();
        }

        this.bombEffectArr.length = 0;
    },

    // update (dt) {},
});
