<template>
    <div class="gramgrid">
      <ul class="circles-wrap">
        <li :class="circle.chose ? 'circle' : 'circle-empty'"
            v-for="(circle, index) in circles" @click="changeShow(index)">
          <div class="circle-index">
            {{ circle.position }}
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
    import Bus from '../util/bus';
    export default {
        name: "gramgrid",
        data () {
          return {
            circles: []
          }
        },
        mounted () {
          for (let i = 0; i < 96; i++) {
            this.circles.push(
              {
                position: String.fromCharCode('A'.charCodeAt(0) + (i / 12)) + (i % 12 + 1),
                chose: false
              }
            )
          }
        },
        methods: {
          changeShow: function (index) {
            this.circles[index].chose = !this.circles[index].chose;
            this.handleFlags();
          },
          handleFlags: function () {
            //console.log("emit");
            Bus.$emit('on-circles', this.circles);
          }
        },
        watch: {

        }
    }
</script>

<style scoped>
  .gramgrid {
    width: 370px;
    text-align:center;
    margin:0 auto;
  }
  .circles-wrap {
    width: 435px;
    height: 295px;
    margin-bottom: 40px;
    padding: 0;
    background: #F5F5F5;
    list-style: none;
  }
  .circle {
    float: left;
    width: 30px;
    height: 30px;
    font-size: 5px;
    background: cornflowerblue;
    text-align: center;
    border: 1px solid darkgrey;
    /*box-shadow: 1px 1px 1px;*/
    /*text-shadow: 1px 1px 1px #F4F4F4;*/
    cursor: pointer;
    border-radius: 50%;
    margin : 2px;
  }
  .circle-empty {
    float: left;
    width: 30px;
    height: 30px;
    font-size: 5px;
    background: #F5F5F5;
    text-align: center;
    border: 1px solid darkgrey;
    /*box-shadow: 1px 1px 1px;*/
    /*text-shadow: 1px 1px 1px #F4F4F4;*/
    cursor: pointer;
    border-radius: 50%;
    margin : 2px;
  }
  .circle-index {
    position: relative;
    top: 6px;
  }
</style>
