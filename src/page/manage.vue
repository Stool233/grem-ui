<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%;">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
					<el-menu-item index="manage"><i class="el-icon-menu"></i>{{$t('m.Home')}}</el-menu-item>
					<el-submenu index="2">
						<template slot="title"><i class="el-icon-document"></i>{{$t('m.DataManagement')}}</template>
                    </el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="el-icon-plus"></i>{{$t('m.DataAnalysis')}}</template>
						<el-menu-item index="recognize">{{$t('m.CarbapenemaseDetection')}}</el-menu-item>
					</el-submenu>
					<!--<el-submenu index="4">-->
						<!--<template slot="title"><i class="el-icon-star-on"></i>图表</template>-->
						<!--&lt;!&ndash; <el-menu-item index="newMember">用户数据</el-menu-item> &ndash;&gt;-->
					<!--</el-submenu>-->
					<!--<el-submenu index="5">-->
						<!--<template slot="title"><i class="el-icon-edit"></i>编辑</template>-->
						<!--&lt;!&ndash; <el-menu-item index="uploadImg">上传图片</el-menu-item> &ndash;&gt;-->
						<!--&lt;!&ndash;<el-menu-item index="vueEdit">文本编辑</el-menu-item>&ndash;&gt;-->
					<!--</el-submenu>-->
					<el-submenu index="6">
						<template slot="title"><i class="el-icon-setting"></i>{{$t('m.Setting')}}</template>
						<!--<el-menu-item index="adminSet">{{$t('m.SettingAdmin')}}</el-menu-item>-->
						<!-- <el-menu-item index="sendMessage">发送通知</el-menu-item> -->
					</el-submenu>
					<el-submenu index="7">
						<template slot="title"><i class="el-icon-warning"></i>{{$t('m.Description')}}</template>
						<el-menu-item index="explain">{{$t('m.Description')}}</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
    export default {
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			},
      methods: {

      }
		},
    }
</script>


<style lang="less" scoped>
	@import '../style/mixin';
	.manage_page{

	}
</style>
