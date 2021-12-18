<template>
    <div class="headerCont">
        <div class="header">
            <div class="breadth">
                <div class="logoImg">
                    <img :src="logo" alt='' /> 
                    <el-divider direction="vertical"></el-divider>
                    <span>Faucet</span> 
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            logo: require("@/assets/images/FILSWAN_logo_02.png")
        };
    },
    computed: {
    },
    watch: {
        $route: function (to, from) {
        }
    },
    methods: {
    },
    mounted() {
    }
};
</script>
<style lang="scss" scoped>
.headerCont{
    min-height: 0.65rem;
    background-color: #fff;
}
.header{
    padding: 0.25rem 0.64rem;
    background: #fff;
    box-shadow: 0 1px 4px 0 rgba(35, 35, 35, 0.16);
    display: flex;
    flex-direction: row;
    margin-bottom: 0;
    -webkit-transition: position .4s, padding 0s;
    transition: position .4s, padding 0s;
    @media screen and (max-width:1024px){
        
    }
    @media screen and (max-width: 600px){
        padding: 0.25rem 4%;
    }
    .logoImg{
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 40px;
        max-width: 1320px;
        margin: auto;
        font-size: 20px;
        color: #333;
        font-weight: bold;
        @media screen and (max-width: 600px){
            font-size: 17px;
            height: 30px;
        }
        img{
            display: block;
            height: 100%;
            max-width: 100%;
            margin: 0;
        }
        span{
            display: block;
            line-height: 1;
            font-size: inherit;
            letter-spacing: 1px;
            @media screen and (max-width: 600px){
                margin-top: 3px;
            }
        }
    }
}
.header_scroll{
    padding: 0.2rem 7% 0.2rem 11% !important;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 2px 4px rgba(16, 28, 79, 0.5);
    z-index: 999;
}

</style>
