<template>
  <mt-button slot="left" @click="goback" icon="back"> </mt-button>
</template>

<script>
export default {
  name: "goback",
  methods: {
    goback: function() {
      console.log("正在使用组件");
      this.$router.go(-1);
    }
  },
  created: function() {
    console.log(1);
  }
};
</script>
