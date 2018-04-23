<template>
  <div>
    <p>这是一个子组件</p>
    <p>{{childData.name}}</p>
    <p>{{childData.age}}</p>
  </div>
</template>
<script>
require("./test.scss");
export default {
  name: "test",
  data() {
    return {
      childData: {
        name: "张三",
        age: "12"
      }
    };
  },
  mounted() {
    console.log("子组件已挂载");
  },
  methods: {}
};
</script>
<style lang="scss" scoped>

</style>

