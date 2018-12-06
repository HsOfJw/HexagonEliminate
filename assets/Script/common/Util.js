//查找数组里是否包含某个元素
function IsContainElement(arr, item){
    if(arr){
        for(var i = 0;i < arr.length; i++){
            if(arr[i] == item){
                return true;
            }
        }
    }
    return false;
};

//从一个数组里随机取一个元素
function RandomElement(arr){
    if(arr){
        var len = arr.length;

        var minIndex = 0;
        var maxIndex = len - 1;

        var index = RandomNum(minIndex, maxIndex);

        return arr[index];
    }

    return null;
};

//深拷贝数组
function CopyArray(arr){
    return arr.concat();
};

//是否为数字 包括字符串数字
function IsNumber(val){

    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
};

//根据传入的最大字符个数截取字符串
function GetByteVal(val, max) {
    var returnValue = '';
    var byteValLen = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null)
            byteValLen += 2;
        else
            byteValLen += 1;
        if (byteValLen > max)
            break;
        returnValue += val[i];
    }
    return returnValue;
};


function IsString(val){
    return typeof(val) == "string";
};

function IsObject(val){
    return (typeof(val) == "object") && ((val instanceof Array) == false);
};

//从数组里移除一个元素
function RemoveItem(arr, item){
    if(IsArray(arr)){
        for(var i = 0;i < arr.length;i ++){
            if(arr[i] == item){
                arr.splice(i, 1);
                return;
            }
        }
    }
};

function GetPrefab(path){
    return cc.loader.getRes(path);
};

//设置精灵节点的图片
function SetNodeTexture(node, filename){
    var sprite = node.getComponent(cc.Sprite);
    if(sprite){
        sprite.spriteFrame = new cc.SpriteFrame(cc.url.raw(filename));
    }
};

//
function SetNodeSprteFrame(node, spriteFrame){
    var sprite = node.getComponent(cc.Sprite);
    if(sprite){
        sprite.spriteFrame = spriteFrame;
    }
}

//设置文本节点的内容
function SetNodeText(node, text){
    if(node){
        if(IsNumber(text) || IsString(text)){
            var label = node.getComponent(cc.Label);
            if(label){
                label.string = text;
            }
        }
    }
};

function LoadHeadImg(node, url){
    cc.loader.load({
        url: url, type: 'jpg'
    }, (err, texture) => {
        node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    });
};

function CreateSprite(name, texture){
    var node = new cc.Node(name);
    if(node){
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = new cc.SpriteFrame(texture);
    }
    return node;
}

function CreateSpriteWithFrame(name, spriteFrame){
    var node = new cc.Node(name);
    if(node){
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
        return node;
    }
    return null;
}

//获取指定节点的指定组件
function GetComponent(node, component){
    if(node && component){
        return node.getComponent(component);
    }
    return null;
}

//添加组件
function AddComponent(node, component){
    if(node && component){
        return node.addComponent(component);
    }
    return null;
};

//移除组件
function RemoveComponent(node, component){
    if(node && component){
        node.removeComponent(component);
    }
};

function SetWidgetTarget(node, target){
    if(node && target){
        var widgetCom = node.getComponent(cc.Widget);
        if(widgetCom){
            widgetCom.target = target;
        }
    }
}

//添加序列帧特效
function AddAutoRemoveEffect(node, prefabPath, name){
    if(node && prefabPath){
        var prefab = cc.loader.getRes(prefabPath);
        if(prefab){
            var Anim_Node = cc.instantiate(prefab);
            Anim_Node.x = node.x;
            Anim_Node.y = node.y;
            Anim_Node.zIndex = node.zIndex + 1;
            Anim_Node.parent = node.parent;
            var anim = this.GetComponent(Anim_Node, cc.Animation);
            if(anim){
                anim.play(name);
                anim.on('finished', function(){
                    Anim_Node.destroy();
                });
            }
        }
    }
}

//注册按钮点击事件
function RegBtnClickEvent(button, callback){
    // cc.assert(button, "button is null");
    // cc.assert(callback, "callback is null");

    if(button && callback){
        button.on("click", callback);
    }
}

//取消按钮的点击事件
function CancelClickEvent(button){
    if(button){
        button.off("click");
    }
}

//注册按钮点击事件
function RegTouchEndEvent(button, callback){
    if(button && callback){
        button.on(cc.Node.EventType.TOUCH_END, callback);
    }
}

function SetButtonInteractable(btn, interactable){
    if(btn){
        var com = btn.getComponent(cc.Button);
        if(com){
            com.interactable = interactable;
        }
    }
};


//注册键盘按下事件
function RegKeyUpEvent(callback){
    if(callback){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, callback);
    }
}

function RegBtnTouchBeginEvent(button, callback){
    if(button && callback){
        button.on(cc.Node.EventType.TOUCH_START, callback);
    }
}



//屏幕适配
function ScreenAdaptation(node){
    // if(node){
    //     if(cc.director.getWinSize().height / cc.director.getWinSize().width - 16 / 9 > 0.1){ 
    //         node.scale = cc.director.getWinSize().width / 750;
    //     }
    // }
}

function Sort(arr){
    var compare = function (x, y) {
        if (x < y) {
            return 1;
        } else if (x > y) {
            return -1;
        } else {
            return 0;
        }
    };

    arr.sort(compare);
}

//根据gid对节点进行排序
function NodeSort(arr){
    var compare = function (node_a, node_b) {
        if (node_a.gid < node_b.gid) {
            return 1;
        } else if (node_a.gid > node_b.gid) {
            return -1;
        } else {
            return 0;
        }
    };

    arr.sort(compare);
}

function RandomNum(min, max){
    return parseInt(Math.random()*(max-min+1)+min,10);
}

function  GetDistance(p1, p2){
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

function IsArray(obj) {
    return typeof obj == 'object' && obj.constructor == Array;
}

//去重
function RemoveDuplicate(arr){
    if(IsArray(arr)){
        var newArr = [];
        for(var i = 0;i < arr.length;i ++){
            if(newArr.indexOf(arr[i]) < 0){
                newArr.push(arr[i]);
            }
        }
        return newArr;
    }
    return arr;
}

//去掉包含在arr2中的元素
function RemoveDuplicateArray(arr1, arr2){
    if(IsArray(arr1) && IsArray(arr2)){
        var newArr = [];
        for(var j = 0; j < arr2.length; j ++){
            var index = arr1.indexOf(arr2[j]);
            if(index >= 0){
                arr1.splice(index, 1);
            }
        }
        return newArr;
    }
};

//根据指定的概率返回true
function RandomPercentage(percentile){
    var value = RandomNum(1, 100);

    if(value <= percentile){
        return true;
    }
    return false;
};

//随机生成guid
function GUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}


function loadRemoteImg(node, url){
    cc.loader.load({
        url: url, type: 'jpg'
    }, (err, texture) => {
        node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    });
};

module.exports = {
    IsContainElement: IsContainElement,
    SetNodeTexture: SetNodeTexture,
    CreateSprite: CreateSprite,
    NodeSort: NodeSort,
    Sort: Sort,
    SetNodeText: SetNodeText,
    RegBtnClickEvent: RegBtnClickEvent,
    CancelClickEvent: CancelClickEvent,
    RegTouchEndEvent: RegTouchEndEvent,
    RegKeyUpEvent: RegKeyUpEvent,
    RegBtnTouchBeginEvent: RegBtnTouchBeginEvent,
    ScreenAdaptation: ScreenAdaptation,
    GetComponent: GetComponent,
    AddComponent: AddComponent,
    RemoveComponent: RemoveComponent,
    CreateSpriteWithFrame: CreateSpriteWithFrame,
    SetNodeSprteFrame: SetNodeSprteFrame,
    RandomNum: RandomNum,
    GetDistance: GetDistance,
    IsArray: IsArray,
    RemoveDuplicate: RemoveDuplicate,
    RemoveItem: RemoveItem,
    AddAutoRemoveEffect: AddAutoRemoveEffect,
    RandomPercentage: RandomPercentage,
    LoadHeadImg: LoadHeadImg,
    RandomElement: RandomElement,
    CopyArray: CopyArray,
    IsNumber: IsNumber,
    GetPrefab: GetPrefab,
    GUID: GUID,
    IsObject: IsObject,
    SetWidgetTarget: SetWidgetTarget,
    SetButtonInteractable: SetButtonInteractable,
    GetByteVal: GetByteVal,
    loadRemoteImg: loadRemoteImg,
}