<template>
    <div :class="{'footer_position': positionStyle, 'footer': 1==1}">
        <div class="breadth">
            <div class="footer_all">
                <img :src="footer_logo" alt="">
                <p>{{$t('footer.copy')}}</p>
            </div>
        </div>
        <div id="version">v2.0.10</div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            footer_logo: require('@/assets/images/FILSWAN_logo_01.png'),
        };
    },
    props: ['positionStyle'],
    computed: {
        language() {
            return this.$store.getters.language
        }
    },
    methods: {
    },
    mounted() {
    }
};
</script>
<style  lang="scss" scoped>
.footer{
    position: relative;
    background-color: #101c4f;
    .footer_all{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0.35rem 0.64rem;
        max-width: 1320px;
        margin: auto;
        @media screen and (max-width: 600px){
            padding: 0.35rem 4%;
        }
        img{
            display: block;
            height: 35px;
            @media screen and (max-width: 600px){
                height: 25px;
            }
        }
        p{
            display: inline-block;
            font-size: 14px;
            margin: 5px 0 0 0.25rem;
            color: rgba(133, 138, 149, 1);
            white-space: nowrap;
            line-height: 1;
            @media screen and (max-width: 600px){
                font-size: 12px;
            }
        }
        .language{
            display: flex;
            align-items: center;
            padding: 0 0.15rem;
            .act{
                padding: 0.1rem 0.2rem;
                background: #fff;
                border-radius: 0.05rem;
            }
        }
    }
    #version{
        position: absolute;
        right: 5px;
        bottom: 5px;
        font-size: 12px;
        color: #1a2a6a;
    }
}
.footer_position{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
}
@media screen and (max-width:768px){
.footer{
}
    
}
@media screen and (max-width: 600px){
.footer{
    .pcShow{
        display: none;
    }
    .mobileShow{
        display: block;
    }
}
}
</style>
