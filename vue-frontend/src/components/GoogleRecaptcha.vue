<template>
    <div ref="grecaptcha">
    </div>
</template>
<script>
export default {
  methods: {
    loaded() {
      let _this = this
       window.grecaptcha.render(this.$refs.grecaptcha, {
        sitekey: process.env.GOOGLE_RECAPTCHA_KEY,
        callback: res => { 
          res.length > 0 ?  this.$emit("getValidateCode", true) :  this.$emit("getValidateCode", false)
        }
      });
    }
  },
  mounted() {
    let _this = this
    setTimeout(function(){
      window.ReCaptchaLoaded = _this.loaded()
    }, 1000)
  },
};
</script>
<style>

</style>
