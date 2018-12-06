var HexagonCom = require("HexagonCom");
var BaseNode = require("BaseNode");
var Util = require("Util");
var HexagonType = require("HexagonType");

cc.Class({
    extends: BaseNode,

    ctor(){
        this.setName("HexagonNode");

        var hexagonCom = this.addComponent("HexagonCom");
        var sprite = this.addComponent(cc.Sprite);

        if(arguments.length > 0){
            hexagonCom.setType(arguments[0]);
            this.updateTexture();
        }
    },

    init(){
        this.x = 0;
        this.y = 0;

        this.opacity = 255;
        this.active = true;
        this.scale = 1;
        this.rotation = 0;
        
        this.setSynthesiPosHint(false);
        //获取指定节点的指定组件
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            hexagonCom.init();
        }
    },

    start () {

    },

    updateTexture(){
        var type = this.getType();

        if(type > HexagonType.HT_Min && type < HexagonType.HT_Max){
            var sprite = Util.GetComponent(this, cc.Sprite);
            if(sprite){
                sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/gamescene/grid_" + type + ".png"));
            }
        }
    },

    doBomb(){
        
    },
    
    doPlace(gridSprite){
        if(!gridSprite){
            return;
        }

        this.rotation = 0;
        this.parent = gridSprite.parent;

        this.x = gridSprite.x;
        this.y = gridSprite.y;

        this.setSynthesiPosHint(false);
    },

    doSynthesi(){
        var type = this.getType();
        var newType = type + 1;
        this.setType(newType);

        this.updateTexture();
    },

    setIsCanPlace(value){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            hexagonCom.setIsCanPlace(value);
        }
    },

    setCanPlaceGridID(value){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            hexagonCom.setCanPlaceGridID(value);
        }
    },

    setIsPriorityCheck(value){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            hexagonCom.setIsPriorityCheck(value);
        }
    },

    getCanPlaceGridID(){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            return hexagonCom.getCanPlaceGridID();
        }
        return 0;
    },


    getIsPriorityCheck(){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            return hexagonCom.getIsPriorityCheck();
        }
        return false;
    },

    getIsCanPlace(){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            return hexagonCom.getIsCanPlace();
        }
        return false;
    },


    setSynthesiPosHint(isHint){
        if(isHint){
            var scaleAction1 = new cc.scaleTo(0.2, 1, 1);
            var scaleAction2 = new cc.scaleTo(0.2, 1.1, 1.1);
            var sequence = new cc.sequence(scaleAction1, scaleAction2);
            var synthesiPosHint = Util.CreateSprite("SynthesiPosHint", cc.url.raw("resources/gamescene/hint.png"));
            this.addChild(synthesiPosHint);
            synthesiPosHint.runAction(cc.repeatForever(sequence));
            this.zIndex = 10;
        }else{
            var synthesiPosHint = this.getChildByName("SynthesiPosHint")
            if(synthesiPosHint){
                synthesiPosHint.destroy();
            }
        }
    },

    setType(type){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            hexagonCom.setType(type);
        }
    },

    setID(id){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            hexagonCom.setID(id);
        }
    },

    setCheckTag(tag){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            hexagonCom.setCheckTag(tag);
        }
    },

    setIsSynthesiNode(value){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            hexagonCom.setIsSynthesiNode(value);
        }
    },

    getCheckTag(){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            return hexagonCom.getCheckTag();
        }
        return false;
    },

    getIsSynthesiNode(){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            return hexagonCom.getIsSynthesiNode();
        }
        return false;
    },

    getType(){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            return hexagonCom.getType();
        }
        return null;
    },

    getID(){
        var hexagonCom = Util.GetComponent(this, "HexagonCom");
        if(hexagonCom){
            return hexagonCom.getID();
        }
        return 0;
    },

    // update (dt) {},
});
