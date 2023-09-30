<template>
  <WolvesList/>
  <PacksList/>
</template>

<script>
import WolvesList from './components/WolvesList.vue'
import PacksList from './components/PacksList.vue'

export default {
  name: 'App',
  components: {
    WolvesList,
    PacksList
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
