<template>
    <div class="wrapper" id="wrapper" ref="area">
        <div class="landing">
            <v-head></v-head>
            <div class="content">
                <transition name="move" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
            <v-foot :positionStyle="positionStyle"></v-foot>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vFoot from './Footer.vue';
import elementResizeDetectorMaker from "element-resize-detector"
export default {
    data() {
        return {
            bodyWidth: document.body.clientWidth<=1024?true:false,
            positionStyle: false
        };
    },
    components: {
        vHead,
        vFoot
    },
    computed: {
        headertitle() {
            return this.$store.getters.headertitle
        },
        routerMenu() {
            return this.$store.getters.routerMenu
        },
    },
    watch: {
        $route: function (to, from) {
        }
    },
    mounted() {
        this.footer_style()
    },
    methods: {
      footer_style() {
        //   this.positionStyle = false
        //   let wrapperH = document.querySelector("#wrapper").clientHeight
        //   let areaHomeH = document.querySelector("#areaHome").clientHeight
        //   this.positionStyle = areaHomeH < wrapperH ? true : false
        //   console.log(areaHomeH, wrapperH, this.positionStyle)

        let _this = this
        _this.positionStyle = false

        let erd = elementResizeDetectorMaker();
        erd.listenTo(this.$refs.area, (element) => { 
            // 这里的this.$refs.fan指定要监听的元素对象
            let width = element.offsetWidth;
            let height = element.offsetHeight;
            let clientHeight = document.documentElement.clientHeight;
            _this.$nextTick(() => {
            // console.log('element', clientHeight, height);

            if(height < clientHeight){
                // document.body.style.height = clientHeight + 'px'
                _this.positionStyle = true
            }else{
                // document.body.style.height = '100%'
                _this.positionStyle = false
            }

            })
        })
      }
    },
};
</script>

<style lang="scss" scoped>
.wrapper{
    .content{
        .el-backtop{
            background-color: #45a2ff;
        }
        .el-backtop, .el-calendar-table td.is-today{
            color: #fff;
        }
    }
    &::-webkit-scrollbar-track {
        background: #f7f7f7;
    }
    &::-webkit-scrollbar {
        width: 6px;
        background: #ccc;
    }
    &::-webkit-scrollbar-thumb {
        background: #ccc;
    }
}
</style>