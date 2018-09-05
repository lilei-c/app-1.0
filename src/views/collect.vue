<template>
  <div class="hello">
    <mt-header fixed :title="'设施采集（'+vehtypename+'）'">
      <router-link to="" slot="left">
        <goback></goback>
      </router-link>
      <router-link to="/" icon="more" slot="right">
        <mt-button icon="more"></mt-button>
      </router-link>
    </mt-header>
    <el-amap vid="amap" :center="center" :zoom="zoom" class="amapp" :events="events">
      <el-amap-marker :position="cp.position" :visible="cp.visible" :draggable="cp.draggable"></el-amap-marker>
    </el-amap>
    <div style="position:  relative;margin: 8px;height: 160px;">
      <img style="max-height: 160px;max-width: 260px;" :src="img64Mini" id="img" />
      <div style="bottom: 0;right: 0;position: absolute;">
        <input id="h5-take-picture" type="file" accept="image/*" multiple style="display:none;">
        <mt-button style="display: block;margin-bottom: 8px;" type="primary" @click="selectPictrue">照片</mt-button>
        <mt-button style="display: block;" type="primary" @click="takePictrue">拍照</mt-button>
      </div>
    </div>
    <mt-field label="设施名称" placeholder="请输入设施名称" v-model="vehname"></mt-field>
    <mt-field v-show="isTrashCan()" label="垃圾桶数量" placeholder="请输入垃圾桶数量" type="number" v-model="trashCanNum"></mt-field>
    <mt-button class="bottom" type="primary" @click="addveh">提交</mt-button>
  </div>
</template>

<script>
import Vue from "vue";
import VueAMap from "vue-amap";
import { Toast } from "mint-ui";
import axios from "axios";
import { vehapi } from "../api/veh";
import vehtypes from "../assets/vehtypes";

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: "f9a0f1b84767cdcdb58668b29b240208",
  v: "1.4.4"
});

const img64MaxLength = 65000;

export default {
  data: function() {
    let self = this;
    return {
      vehtypename: "",
      zoom: 14,
      center: [this.$route.params.lng, this.$route.params.lat],
      address: "",
      cp: {
        position: [this.$route.params.lng, this.$route.params.lat],
        visible: true,
        draggable: false
      },
      events: {},
      vehname: "",
      img64: "",
      img64Mini: "",
      vehtype: this.$route.params.typeid,
      trashCanNum: "" //垃圾桶专用参数
    };
  },
  mounted: function() {
    this.vehtypename = vehtypes.getVehName(this.$route.params.typeid);

    //当h5+调用失败时，启用h5，（供h5测试用）
    let self = this;
    document.getElementById("h5-take-picture").addEventListener(
      "change",
      function() {
        var reader = new FileReader();
        reader.onload = function(e) {
          self.img64 = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
      },
      false
    );
  },
  watch: {
    img64: async function() {
      this.img64Mini = await img64Minify(this.img64, 500, 400, 0.7);
      console.log(
        `img64:${this.img64.length} img64Mini:${this.img64Mini.length}`
      );
    }
  },
  methods: {
    takePictrue: async function() {
      try {
        this.img64 = await captureImage();
      } catch (error) {
        console.log(error);
        this.h5TakePitcure();
      }
    },
    selectPictrue: async function() {
      try {
        this.img64 = await galleryImg();
      } catch (error) {
        console.log(error);
        this.h5TakePitcure();
      }
    },
    //当h5+调用失败时，启用h5，（供h5测试用）
    h5TakePitcure: function() {
      document.getElementById("h5-take-picture").click();
    },
    isTrashCan: function() {
      return this.$route.params.typeid == 9;
    },
    addveh: function() {
      if (!this.img64Mini)
        return Toast({
          message: "请拍摄设施照片",
          position: "middle",
          duration: 1000
        });
      if (!this.vehname)
        return Toast({
          message: "请输入设施名称",
          position: "middle",
          duration: 1000
        });
      if (this.img64Mini.length > img64MaxLength)
        return Toast({
          message: "该照片太大，请重新选择",
          position: "middle",
          duration: 1000
        });
      if (this.isTrashCan() && this.trashCanNum <= 0) {
        return Toast({
          message: "请输入垃圾桶数量",
          position: "middle",
          duration: 1000
        });
      }

      const data = {
        name: this.vehname,
        vehtype: this.vehtype,
        lng: this.$route.params.lng,
        lat: this.$route.params.lat,
        img: this.img64Mini,
        trashCanNum: this.trashCanNum //垃圾桶专用参数
      };

      vehapi
        .addveh(data)
        .then(m => {
          console.log(111);
          console.log(m);
          console.log(2222);
          if (m && m.status == 200 && !m.data) {
            Toast({
              message: "添加成功",
              position: "middle",
              duration: 1000
            });
            return this.$router.go(-1);
          }
          return Toast({
            message: "系统繁忙",
            position: "middle",
            duration: 1000
          });
        })
        .catch(e => {
          console.log(e);
          return Toast({
            message: "系统繁忙.",
            position: "middle",
            duration: 1000
          });
        });
      console.log(data);
    }
  }
};

// async function fileToImg64(file) {
//   return new Promise(s => {
//     let reader = new FileReader();
//     reader.onload = function(e) {
//       s(e.target.result);
//     };
//     reader.readAsDataURL(file);
//   });
// }

async function img64Minify(img64, width, height, ratio) {
  return new Promise(s => {
    let image = new Image();
    image.onload = function() {
      let img64Mini = compress(image, width, height, ratio);
      if (img64Mini.length > img64MaxLength) {
        img64Mini = compress(image, width, height, ratio * 0.9);
      }
      if (img64Mini.length > img64MaxLength) {
        img64Mini = compress(image, width, height, ratio * 0.7);
      }
      s(img64Mini);
    };
    image.src = img64;
    console.log(image);
  });
}

function compress(img, width, height, ratio) {
  var canvas, ctx, img64;
  canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  img64 = canvas.toDataURL("image/jpeg", ratio);
  return img64;
}
</script>

<style scoped>
.amapp {
  height: 220px;
}

.bottom {
  width: 100%;
  margin: 8px 0px;
}
</style>

