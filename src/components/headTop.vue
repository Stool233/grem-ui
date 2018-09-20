<template>
    <div class="header_container">

		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/manage' }">{{$t('m.Home')}}</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta" key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-dropdown @command="handleCommand" menu-align='start'>
			<!--<img :src="baseImgPath + adminInfo.avatar" class="avator">-->
      <img src="../assets/img/default.jpg" class="avator">
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="home">{{$t('m.Home')}}</el-dropdown-item>
				<el-dropdown-item command="singout">{{$t('m.Exit')}}</el-dropdown-item>
        <el-dropdown-item command="changeLang">{{$t('m.ChangeLanguage')}}</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
    </div>
</template>

<script>
	import {signout} from '@/api/getData'
	import {baseImgPath} from '@/config/env'
	import {mapActions, mapState} from 'vuex'

    export default {
    	data(){
    		return {
    			baseImgPath,
    		}
    	},
    	created(){
    		if (!this.adminInfo.id) {
    			this.getAdminData()
    		}
    	},
    	computed: {
    		...mapState(['adminInfo']),
    	},
		methods: {
			...mapActions(['getAdminData']),
			async handleCommand(command) {
				if (command == 'home') {
					this.$router.push('/manage');
				}else if(command == 'singout'){
					const res = await signout()
					if (res.status == 1) {
						this.$message({
	                        type: 'success',
	                        message: '退出成功'
	                    });
	                    this.$router.push('/');
					}else{
						this.$message({
	                        type: 'error',
	                        message: res.message
	                    });
					}
				} else if (command === 'changeLang') {
          this.$confirm('Are you sure to change languages?', 'Tip', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            if ( this.lang === 'zh-CN' ) {
              this.lang = 'en-US';
              this.$i18n.locale = this.lang;//关键语句
            }else {
              this.lang = 'zh-CN';
              this.$i18n.locale = this.lang;//关键语句
            }
          }).catch(() => {
            this.$message({
              type: 'info',
            });
          });
        }
			},
      changeLangEvent() {
        this.$confirm('Are you sure to change languages?', 'Tip', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          if ( this.lang === 'zh-CN' ) {
            this.lang = 'en-US';
            this.$i18n.locale = this.lang;//关键语句
          }else {
            this.lang = 'zh-CN';
            this.$i18n.locale = this.lang;//关键语句
          }
        }).catch(() => {
          this.$message({
            type: 'info',
          });
        });
      }
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 37px;
	}
	.el-dropdown-menu__item{
        text-align: center;
    }
</style>
