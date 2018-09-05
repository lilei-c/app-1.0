//export

const vehtypes = [
    {
        id: "2",
        icon: require("../assets/vehtype/toilet.png"),
        text: "公厕"
    },
    {
        id: "",
        icon: require("../assets/vehtype/垃圾桶.png"),
        text: "垃圾收集点",
        child: [
            {
                id: "27",
                icon: require("../assets/vehtype/三立方箱.png"),
                text: "三立方箱"
            }, {
                id: "9",
                icon: require("../assets/vehtype/垃圾桶.png"),
                text: "垃圾桶"
            }, {
                id: "30",
                icon: require("../assets/vehtype/垃圾压缩箱.png"),
                text: "垃圾压缩箱"
            }, {
                id: "29",
                icon: require("../assets/vehtype/散点.png"),
                text: "散点"
            }, {
                id: "28",
                icon: require("../assets/vehtype/塑料袋收集点.png"),
                text: "塑料袋收集点"
            }
        ]
    },
    {
        id: "0",
        icon: require("../assets/vehtype/垃圾中转站.png"),
        text: "垃圾中转站"
    },
    {
        id: "10",
        icon: require("../assets/vehtype/停车场.png"),
        text: "停车场"
    },
    {
        id: "4",
        icon: require("../assets/vehtype/取水点.png"),
        text: "取水点"
    },
    {
        id: "3",
        icon: require("../assets/vehtype/环卫所.png"),
        text: "环卫所"
    },
    {
        id: "14",
        icon: require("../assets/vehtype/环卫休息室.png"),
        text: "环卫岗亭"
    },
    {
        id: "25",
        icon: require("../assets/vehtype/地下通道.png"),
        text: "地下通道"
    },
    {
        id: "26",
        icon: require("../assets/vehtype/学校.png"),
        text: "学校"
    },

    {
        id: "7",
        icon: require("../assets/vehtype/加油站.png"),
        text: "加油站"
    },
    {
        id: "5",
        icon: require("../assets/vehtype/施工工地.png"),
        text: "施工工地"
    },
    {
        id: "1",
        icon: require("../assets/vehtype/公交站.png"),
        text: "公交站"
    },
    {
        id: "11",
        icon: require("../assets/vehtype/维修站.png"),
        text: "维修站"
    },
    {
        id: "15",
        icon: require("../assets/vehtype/菜市场.png"),
        text: "菜市场"
    },
    {
        id: "16",
        icon: require("../assets/vehtype/火车站.png"),
        text: "火车站"
    },
    {
        id: "17",
        icon: require("../assets/vehtype/汽车站.png"),
        text: "汽车站"
    },
    {
        id: "18",
        icon: require("../assets/vehtype/广场.png"),
        text: "广场"
    }
];

//const vehtypes = []
const getVehName = function (typeid) {
    let vehtype = vehtypes.find(m => m.id == typeid);
    if (!vehtype) {
        let childs = [];
        vehtypes.forEach(m => {
            if (m.child) childs = childs.concat(m.child);
        });
        vehtype = childs.find(m => m.id == typeid);
    }
    if (vehtype)
        return vehtype.text;
    return ''
}
export default {
    vehtypes: vehtypes, getVehName: getVehName
}
