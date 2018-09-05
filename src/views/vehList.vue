<template>
  <div>
    <mt-header fixed :title="'设施类型（'+vehtypename+'）'">
      <router-link to="" slot="left">
        <goback></goback>
      </router-link>
      <router-link to="/" icon="more" slot="right">
        <mt-button icon="more"></mt-button>
      </router-link>
    </mt-header>
    <el-amap vid="amap" :amap-manager="amapManager" :center="center" :zoom="zoom" class="amapp" :events="events">
      <el-amap-marker :position="centerMarkerPosition"></el-amap-marker>
      <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index"></el-amap-marker>
    </el-amap>
    <div style="margin:4px 0 0 0;">
      <mt-button size="normal" type="primary" @click="getCurrentPosition">定位</mt-button>
    </div>
    <div class="middle">
      <mt-cell v-for="item in list.filter(veh => veh.dis <= 2000)" :key="item.ID" :title="item.FACILITY_NAME" :label="item.FACILITY_CODE" :value="((item.dis||item.dis==0)?item.dis+' 米':'')"></mt-cell>
    </div>
    <router-link :to="'/collect/'+this.$route.params.typeid+'/'+this.centerMarkerPosition[0]+'/'+this.centerMarkerPosition[1]">
      <mt-button class="bottom" size="normal" type="primary">采集</mt-button>
    </router-link>
  </div>
</template>

<script>
import Vue from "vue";
import VueAMap from "vue-amap";
import { Toast } from "mint-ui";
import vehtypes from "../assets/vehtypes";
import axios from "axios";
import { vehapi } from "../api/veh";

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: "f9a0f1b84767cdcdb58668b29b240208",
  v: "1.4.4"
});

let amapManager = new VueAMap.AMapManager();

export default {
  data: function() {
    let self = this;
    return {
      amapManager,
      vehtypename: "",
      loading: false,
      zoom: 14,
      center: [112.904403, 28.206517],
      centerMarkerPosition: [112.904403, 28.206517],
      events: {
        mapmove(e) {
          const centerLng = amapManager.getMap().getCenter().lng;
          const centerLat = amapManager.getMap().getCenter().lat;
          console.log(
            "center" + self.center + ";" + centerLng + "," + centerLat
          );
          self.centerMarkerPosition = [centerLng, centerLat];
        }
      },
      markers: [],
      list: []
    };
  },
  created: async function() {
    this.vehtypename = vehtypes.getVehName(this.$route.params.typeid);

    //再次进入页面时，获取上次定位位置
    if (localStorage) {
      let lnglat = localStorage.getItem("theLastPosition");
      if (lnglat) {
        lnglat = lnglat.split(",");
        if (lnglat.length == 2) {
          this.center = this.centerMarkerPosition = lnglat;
          console.log("theLastPosition");
          console.log(this.centerMarkerPosition);
        }
      }
    }

    try {
      let vehs = await vehapi.getveh(this.$route.params.typeid);
      //设施列表
      this.list = vehs.filter(veh => veh.POSITION_LON && veh.POSITION_LAT);
      // //设施地图点 style-1
      // this.markers = this.list.map(veh => {
      //   return {
      //     position: [veh.POSITION_LON, veh.POSITION_LAT]
      //   };
      // });
      //设施地图点 style-2
      this.list.forEach(veh => {
        let circleMarker = new AMap.CircleMarker({
          center: [veh.POSITION_LON, veh.POSITION_LAT],
          radius: 8,
          strokeColor: "white",
          strokeWeight: 2,
          strokeOpacity: 0.5,
          fillColor: "rgba(0,0,255,1)",
          fillOpacity: 0.5,
          zIndex: 10,
          bubble: true,
          cursor: "pointer",
          clickable: true
        });
        circleMarker.setMap(amapManager.getMap());
      });
    } catch (error) {
      console.log(error);
      Toast({
        message: "网络状态不佳",
        position: "middle",
        duration: 1000
      });
    }

    this.getCurrentPosition();

    this.getDis();
  },
  methods: {
    getCurrentPosition: async function() {
      try {
        let xx = await getGeocodeX();
        //alert(xx);
        console.log(xx);

        this.center = xx;
        this.centerMarkerPosition = xx;
        Toast({
          message: "定位成功",
          position: "middle",
          duration: 1000
        });
      } catch (error) {
        Toast({
          message: "定位失败",
          position: "middle",
          duration: 1000
        });
        //当h5+调用失败时，启用h5，（供h5测试用）
        function showPosition(position) {
          alert(
            "纬度: " +
              position.coords.latitude +
              "<br>经度: " +
              position.coords.longitude
          );
        }
        function showError(error) {
          let result = "";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              result = "用户拒绝对获取地理位置的请求。";
              break;
            case error.POSITION_UNAVAILABLE:
              result = "位置信息是不可用的。";
              break;
            case error.TIMEOUT:
              result = "请求用户地理位置超时。";
              break;
            case error.UNKNOWN_ERROR:
              result = "未知错误。";
              break;
          }
          alert(result);
        }
        if (navigator.geolocation) {
          try {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
          } catch (error) {
            console(error);
          }
        }
      }
      //amapManager.getMap().setCenter(xx);
    },
    getDis: function() {
      if (!this.list) return;
      this.list.forEach(veh => {
        veh.dis = "";
        try {
          let lnglat1 = new AMap.LngLat(
            this.centerMarkerPosition[0],
            this.centerMarkerPosition[1]
          );
          let lnglat2 = new AMap.LngLat(veh.POSITION_LON, veh.POSITION_LAT);
          let dis = Math.round(lnglat1.distance(lnglat2));
          veh.dis = dis;
        } catch (error) {
          console.log(error);
        }
      });
      this.list.sort((a, b) => {
        return a.dis - b.dis;
      });
      console.log(this.list);
    }
  },
  watch: {
    centerMarkerPosition: function() {
      //
      this.getDis();
      //
      if (localStorage)
        localStorage.setItem("theLastPosition", this.centerMarkerPosition);
    }
  }
};
</script>

<style scoped>
.amapp {
  height: 220px;
}
.middle {
  overflow: scroll;
  display: block;
  overflow: auto;
  bottom: 70px;
  position: absolute;
  width: 95%;
  top: 328px;
}
.bottom {
  position: absolute;
  width: 95%;
  margin: 8px 0px;
  bottom: 0;
}
</style>
