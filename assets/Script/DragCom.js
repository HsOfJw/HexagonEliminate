var Util = require("Util");
var BaseCom = require("BaseCom");
var ObjectType = require("ObjectType");

cc.Class({
    extends: BaseCom,

    properties: {
        dragNode: cc.Node,

        type: 0,
    },

    bIsHit: null,
    bIsMoving: null,

    bIsCanDrag: null,

    onLoad () {
        this.bIsHit = false;
        this.bIsMoving = false;
        this.bIsCanDrag = true;

        this.dragNode.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this));
        this.dragNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoved.bind(this));
        this.dragNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
    },

    start () {

    },

    setIsCanDrag(isCanDrag){
        this.bIsCanDrag = isCanDrag;
    },

    touchStart(event){
        if(this.type != ObjectType.OT_Common && Game.GlobalVar.IsGuide){
            return false;
        }
        
        var pos = this.node.parent.convertTouchToNodeSpace(event);
        var box = this.node.parent.getBoundingBox();
        if(pos.x >= 0 && pos.x <= box.width && pos.y >=0 && pos.y <= box.height){
            cc.log("hit");
            this.bIsHit = true;
        }

        return false;
    },

    touchMoved(event){
        if(!this.bIsHit){
            return;
        }

        if(!this.bIsCanDrag){
            return false;
        }

        if(!this.bIsMoving){
            var touchpos = this.node.parent.convertTouchToNodeSpace(event);
            var box = this.node.parent.getBoundingBox();
            if(touchpos.x < 0 || touchpos.x > box.width || touchpos.y < 0 || touchpos.y > box.height){
                var pos = this.node.parent.convertTouchToNodeSpace(event);
                pos.x -= this.node.width * 0.5;
                this.node.setPosition(pos);

                this.bIsMoving = true;

                this.setDirtyFlag(true);
            }
        }else{
            var pos = this.node.parent.convertTouchToNodeSpace(event);
            pos.x -= this.node.width * 0.5;
            this.node.setPosition(pos);
        }
        
    },

    touchEnd(){
        if(!this.bIsHit){
            return;
        }

        this.bIsHit = false;

        if(!this.bIsMoving){
            this.dispatchEvent(Game.MessageType.DragCom_Clicked_Event, this.type);
            return;
        }

        this.bIsMoving = false;

        this.setDirtyFlag(false);

        this.dispatchEvent(Game.MessageType.DragCom_Touch_End, this.type);

        this.resetPos();
    },

    resetPos(){
        this.node.position = cc.v2(0, 0);
    },

    setDirtyFlag(dirtyFlag){
        var children = this.node.children;
        for(var i = 0;i < children.length;i ++){
            var child = children[i];
            if(child){
                child.setMyChangedDirtyFlag(dirtyFlag);
            }
        }
    },

    // update (dt) {},
});
