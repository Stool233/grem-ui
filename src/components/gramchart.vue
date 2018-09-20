<template>
    <div class="gramchart">
      <schart :canvasId="canvasId"
              :type="type"
              :width="width"
              :height="height"
              :data="data"
              :options="options">

      </schart>
    </div>

</template>

<script>
    import Schart from 'vue-schart'
    export default {
        name: "gramchart",
        props: {
          data: {
            type: Array
          }
        },
        data() {
          return {
            canvasId: 'myCanvas',
            type: 'line',
            width: 500,
            height: 400,
            options: {
              padding: 50,
              title: 'Total sales of stores in recent years'
            }
          }
        },
        components: {
          Schart
        }
    }
</script>

<style scoped>

</style>
