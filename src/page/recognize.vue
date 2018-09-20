<template>
    <div>
        <head-top></head-top>
        <gramtable></gramtable>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import tendency from '../components/tendency'
    import dtime from 'time-formater'
    import {userCount, orderCount, getUserCount, getOrderCount, adminDayCount, adminCount} from '@/api/getData'
    import Gramtable from "../components/gramtable";
    export default {
        data(){
            return {
                userCount: null,
                orderCount: null,
                adminCount: null,
                allUserCount: null,
                allOrderCount: null,
                allAdminCount: null,
                sevenDay: [],
                sevenDate: [[],[],[]],
            }
        },
        components: {
            Gramtable,
            headTop,
            tendency,
        },
        mounted(){
            this.initData();
            for (let i = 6; i > -1; i--) {
                const date = dtime(new Date().getTime() - 86400000*i).format('YYYY-MM-DD')
                this.sevenDay.push(date)
            }
            this.getSevenData();
        },
        computed: {

        },
        methods: {

        }

    }
</script>

<style lang="less">
    @import '../style/mixin';
    .data_section{
        padding: 20px;
        margin-bottom: 40px;
        .section_title{
            text-align: center;
            font-size: 30px;
            margin-bottom: 10px;
        }
        .data_list{
            text-align: center;
            font-size: 14px;
            color: #666;
            border-radius: 6px;
            background: #E5E9F2;
            .data_num{
                color: #333;
                font-size: 26px;

            }
            .head{
                border-radius: 6px;
                font-size: 22px;
                padding: 4px 0;
                color: #fff;
                display: inline-block;
            }
        }
        .today_head{
            background: #FF9800;
        }
        .all_head{
            background: #20A0FF;
        }
    }
    .wan{
        .sc(16px, #333)
    }
</style>
