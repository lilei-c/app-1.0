<template>
  <div>
    <div>
      <mt-header fixed title="设施类型">
        <router-link to="" slot="left">
          <goback></goback>
        </router-link>
        <router-link to="/" icon="more" slot="right">
          <mt-button icon="more"></mt-button>
        </router-link>
      </mt-header>
      <div style="text-align: left;">
        <div class="point" v-for="item in items" :key="item.id">
          <router-link v-if="!item.child" :to="'/vehlist/'+item.id" style="text-decoration:none;">
            <div>
              <img class="icon" :src="item.icon">
              <div style="color: gray; font-size: 12px;">{{ item.text }}</div>
            </div>
          </router-link>
          <div v-else @click="showLayer(item.child)">
            <img class="icon" :src="item.icon">
            <div style="color: gray; font-size: 12px;">{{ item.text }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="layerDisplay" class="layer" @click="hideLayer">
      <div class="layer-window" @click="forHideLayer">
        <div class="point" style="width:33%" v-for="item in layerData" :key="item.id">
          <router-link :to="'/vehlist/'+item.id" style="text-decoration:none;">
            <div>
              <img class="icon" :src="item.icon">
              <div style="color: gray; font-size: 12px;">{{ item.text }}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vehtypes from "../assets/vehtypes";

export default {
  name: "login",
  data() {
    return {
      msg: "collecttype",
      items: vehtypes.vehtypes,
      layerDisplay: false,
      layerData: []
    };
  },
  methods: {
    showLayer: function(data) {
      this.layerDisplay = true;
      this.layerData = data;
    },
    hideLayer: function() {
      this.layerDisplay = false;
    },
    forHideLayer: function(e) {
      event.stopPropagation();
    }
  },
  created: function() {
    vehtypes;
  }
};
</script>

<style scoped>
.point {
  display: inline-block;
  width: 25%;
  margin-bottom: 16px;
  text-align: center;
}

.icon {
  width: 50%;
}

.layer {
  height: 100%;
  width: 100%;
  background-color: gray;
  opacity: 0.96;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  display: flex;
}

.layer-window {
  background-color: white;
  width: 92%;
  height: 48%;
  border-radius: 20px;
  margin: auto;
  overflow: scroll;
  padding: 16px 0;
}
</style>
