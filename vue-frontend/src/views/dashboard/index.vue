<template>
    <div class="faucets">
        <div class="breadth">
            <div class="top">
                <h1>Request testnet USDC</h1>
                <div class="desc">Get testnet USDC for an account on the supported blockchain testnet <b>Polygon Mumbai</b> so you can create and test your own oracle and Chainlinked smart contract.</div>
                <a href="https://docs.filswan.com/development-resource/swan-token-contract/acquire-testnet-usdc" target="_blank">Learn more</a>
            </div>
            <div class="formTx">
                <el-form :inline="true" :model="ruleForm" class="demo-form-inline" @submit.native.prevent>
                    <el-form-item label="Network">
                        <el-select v-model="ruleForm.asset" placeholder="" >
                            <el-option label="Polygon Mumbai" value="Mumbai">
                                <template slot="label">
                                    <img src="https://smartcontract.imgix.net/icons/polygon.svg?auto=compress%2Cformat" />
                                    Polygon Mumbai
                                </template>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Testnet account address">
                        <el-input :class="{'inputTip':ruleForm.address_tip, 'input': 1==1}" v-model="ruleForm.address" placeholder="Ex: 0xA878795d2C93985444f1e2A077FA324d59C759b0" clearable @clear="ethChange" @input="ethChange"></el-input>
                        <p v-if="ruleForm.address_tip" class="tipStyle"><i class="el-icon-warning"></i> Please enter a valid ethereum address.</p>
                        <p v-if="ruleForm.amount_tip" class="amountStyle">
                            USDC balance: {{ruleForm.usdcBalance}} USDC
                            <br />
                            MATIC balance: {{ruleForm.maticBalance}} MATIC
                        </p>
                    </el-form-item>
                    <el-form-item label="Request type">
                        <el-checkbox-group v-model="ruleForm.checkedRequestType">
                            <el-checkbox v-for="amount in ruleForm.contract_amount" :label="amount.token" :key="amount.token" border disabled>{{amount.labal}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="Verification Code">
                        <el-input placeholder="" v-model="ruleForm.verification_code" class="verification">
                            <template slot="append">
                                <div class="verification_loading" v-loading="ruleForm.verification_loading">
                                    <img :src="ruleForm.verification_link" @click="refish" class="captcha-img">
                                </div>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button 
                            :type="ruleForm.address && !ruleForm.address_tip && ruleForm.verification_code?'primary':'info'" 
                            :disabled="ruleForm.address && !ruleForm.address_tip && ruleForm.verification_code?false:true" 
                            @click="onSubmit">Send request</el-button>
                    </el-form-item>
                </el-form>

                <div class="need">
                    <img src="@/assets/images/Help.svg" />
                    <p class="Box-sc-1vpmd2a-0 Text-sc-9ymwu5-0 ecbXGb">
                        Need more testnet MATIC? Get MATIC from <a href="https://faucet.matic.network/" rel="noopener noreferrer" target="_blank">Polygon Mumbai Faucet</a>
                    </p>
                </div>
            </div>
            <div class="contactus">
                Do you need help? Please <a href="mailto:team@filswan.com">contact us</a>.
            </div>
        </div>

        <el-dialog title="" :visible.sync="transformVisible" :width="bodyWidth"
            custom-class="transform" :close-on-click-modal="false" :close-on-press-escape="false"
            :show-close="false" center>
             <!-- finish-status="success" -->
            <el-steps :active="active" align-center>
                <el-step title="Enter address" icon="el-icon-success"></el-step>
                <el-step title="Transaction initiated" :icon="active == 1?'el-icon-loading':'el-icon-success'"></el-step>
                <el-step title="Waiting for confirmation" :icon="active == 2?'el-icon-loading':active < 2?'':'el-icon-success'"></el-step>
                <el-step title="Token transferred" :icon="active > 3?'el-icon-success':''"></el-step>
            </el-steps>
            <div class="trans_cont" v-if="active == 1">
                <h1>Transaction initiated</h1>
                <h4>Sending 100 testnet USDC and 0.05 testnet MATIC to your account, please wait a moment.</h4>
            </div>
            <div class="trans_cont" v-else-if="active == 2">
                <h1>Waiting for confirmation</h1>
                <h4>Transactions have been initiated. Waiting for confirmation.</h4>
                <div class="cont">
                    <div>
                        <span>Request type</span>
                        Transaction hash
                    </div>
                    <div>
                        <span>100 testnet USDC <br /> 0.05 testnet MATIC</span>
                        <a :href="'https://mumbai.polygonscan.com/tx/'+txhash" rel="noopener noreferrer" target="_blank">{{txhash}}</a>
                    </div>
                </div>
            </div>
            <div class="trans_cont" v-else-if="active > 2">
                <h1>Request complete</h1>
                <h4>Congratulations, {{currencyResults}} was sent to your account.</h4>
                <div class="cont">
                    <div>
                        <span>Request type</span>
                        Transaction hash
                    </div>
                    <div>
                        <span>100 testnet USDC <br /> 0.05 testnet MATIC</span>
                        <a :href="'https://mumbai.polygonscan.com/tx/'+txhash" rel="noopener noreferrer" target="_blank">{{txhash}}</a>
                    </div>
                </div>
            </div>
            <el-alert v-if="responseErr.length>0" type="error" center :closable="false">
                <template slot="title">
                    <span v-for="(name, index) in responseErr" :key="index" style="display: block;">{{name}}</span>
                </template>
            </el-alert>
            <div slot="footer" class="dialog-footer">
                <el-button 
                    :type="active > 3?'primary':'info'" 
                    :disabled="active > 3?false:true"
                    @click="transformVisible = false">Close</el-button>
            </div>
        </el-dialog>

        
        <el-dialog title="" :visible.sync="tipVisible" :width="bodyWidth"
            custom-class="transTip" :close-on-click-modal="false" :close-on-press-escape="false" center>
            <div class="tip" v-if="tipIndex == 1">You have already used this faucet, please try again after 24 hours.</div>
            <div class="tip" v-else-if="tipIndex == 2">An error occured, please try again later.</div>
            <div class="tip" v-else-if="tipIndex == 3">
                <span v-for="(name, index) in responseErr" :key="index" style="display: block;">{{name}}</span>
            </div>
        </el-dialog>
    </div>
</template>

<script>
let _this
import axios from 'axios'
export default {
    data() {
        return {
            bodyWidth: document.body.clientWidth<=600?'98%':'700px',
            ruleForm: {
                asset: 'Mumbai',
                address: '',
                address_tip: false,
                amount_tip: false,
                maticBalance: '',
                usdcBalance: '',
                checkedRequestType: ['USDC', 'MATIC'],
                contract_amount: [{
                    labal: '100 test USDC',
                    token: 'USDC'
                }, {
                    labal: '0.05 test MATIC',
                    token: 'MATIC'
                }],
                verification_code: '',
                verification_link: process.env.BASE_API+'code',
                verification_loading: false
            },
            transformVisible: false,
            tipVisible: false,
            tipIndex: 1,
            active: 1,
            txhash: '',
            responseErr: [],
            currencyResults: ''
        };
    },
    components: {},
    computed: {},
    watch: {
        $route: function (to, from) {
        }
    },
    mounted() {
        _this = this
    },
    methods: {
        async onSubmit() {
            _this.responseErr = []
            _this.tx_hash = ''
            if (_this.$web3.utils.isAddress(_this.ruleForm.address)) {
                const allowedToWithdraw = await _this.$faucetContract.methods.allowedToWithdraw(_this.ruleForm.address).call()
    
                if (allowedToWithdraw) {
                    try {
                        // send request for tokens
                        const paramsObject = {
                            account: _this.ruleForm.address, 
                            tokens: [process.env.TOKEN_ADDRESS, process.env.MATIC_TOKEN_ADDRESS], 
                            amounts: [_this.$web3.utils.toWei('100', 'ether'), _this.$web3.utils.toWei('0.05', 'ether')],
                            verification_code: _this.ruleForm.verification_code
                        }
                        const response = await _this.sendRequest(process.env.BASE_API, paramsObject)
                        //console.log(response)

                        // if success, update balance and display tx_hash
                        if (response) {
                            await _this.resultProcess(response)
                            if(!_this.txhash) {
                                _this.errPopupWindow(3, true, false)
                                return false
                            }
                            _this.amount_tip = false
                            _this.active = 2
                            _this.ethChange()
                            _this.checkTransaction(_this.txhash)
                        }
                    } catch (err) {
                        console.log('allowedToWithdraw err:', err)
                        _this.errPopupWindow(2, true, false)
                    }
                } else {
                    _this.errPopupWindow(1, true, false)
                }
            }
        },
        resultProcess(response) {
            let currency = []
            response.forEach(res => {
                switch(res.result){
                    case 0:
                        if(res.address === process.env.TOKEN_ADDRESS) {
                            currency.push('100 testnet USDC')
                        }else {
                            currency.push('0.05 testnet MATIC')
                        }
                        break;
                    case -1:
                        if(_this.responseErr.indexOf(res.err) === -1) _this.responseErr.push(res.err)
                        break;
                    default:
                        if(res.tx_hash) _this.txhash = res.tx_hash
                        break;
                }
            })
            _this.currencyResults = currency.join(" and ")
        },
        async sendRequest(apiLink, jsonObject) {
            try {
                _this.active = 1
                _this.transformVisible = true
                const response = await axios.post(apiLink, jsonObject, {
                    headers: { 'Content-Type': 'application/json' },
                })
                return response.data
            } catch (err) {
                // Handle Error Here
                // console.error(err, err.response, err.response.status)
                if(err.response.status == 505) {
                    _this.$message.error('Verification Code Error.');
                    _this.transformVisible = false
                    _this.refish()
                    return false
                }
                _this.errPopupWindow(2, true, false)
            }
        },
        timeout (delay) {
            return new Promise((res) => setTimeout(res, delay))
        },
        async ethChange() {
            if (_this.$web3.utils.isAddress(_this.ruleForm.address)) {
                const matic = await _this.$web3.eth.getBalance(_this.ruleForm.address)
                _this.ruleForm.maticBalance = _this.$web3.utils.fromWei(matic, 'ether')

                const tokens = await _this.$tokenContract.methods.balanceOf(_this.ruleForm.address).call()
                const decimal = await _this.$tokenContract.methods.decimals().call()
                // console.log('decimal:', decimal)
                // console.log('usdc:', tokens, _this.$web3.utils.fromWei(tokens, 'ether'))

                await _this.formatWithDecimal(tokens, decimal)
                
                _this.ruleForm.address_tip = false
                _this.ruleForm.amount_tip = true
            }else if(_this.ruleForm.address == ''){
                _this.ruleForm.address_tip = false
                _this.ruleForm.amount_tip = false
            } else {
                _this.ruleForm.address_tip = true
                _this.ruleForm.amount_tip = false
            }
        },
        formatWithDecimal(value, decimal) {
            let tokens = value
            if(tokens.length>decimal) {
                _this.ruleForm.usdcBalance = tokens.slice(tokens.length-decimal) > 0?
                    tokens.slice(0, tokens.length-decimal).concat(`.`, tokens.slice(tokens.length-decimal).replace(/(0+)\b/gi,""))
                    :
                    tokens.slice(0, tokens.length-decimal)
            }else if(tokens === '0') {
                _this.ruleForm.usdcBalance = '0'
            }else {
                let odd = ''
                for(let i = 0; i < decimal - tokens.length; i++){
                    odd += '0'
                }
                _this.ruleForm.usdcBalance = '0.' + String(odd + tokens).replace(/(0+)\b/gi,"")
            }
        },
        checkTransaction(txhash) {
            _this.$web3.eth.getTransactionReceipt(txhash).then(
                async (receipt) => {
                    console.log('checking ... ');
                    await _this.timeout(2000)
                    if (!receipt) { 
                        _this.checkTransaction(txhash)
                    }
                    else {
                        _this.active = 4
                    }
                },
                err => { 
                    console.error(err); 
                    _this.errPopupWindow(2, true, false)
                }
            );
        },
        errPopupWindow(index, tips, popup) {
            this.tipIndex = index
            this.tipVisible = tips
            this.transformVisible = popup
            this.refish()
        },
        async refish() {
            _this.ruleForm.verification_loading = true
            await _this.timeout(500)
            let time = (new Date()).getTime()
            _this.ruleForm.verification_link = `${process.env.BASE_API}code?_v=${time}`
            _this.ruleForm.verification_loading = false
        }
    },
};
</script>

<style lang="scss" scoped>
.faucets{
    padding: 0.5rem 0.64rem;
    max-width: 1320px;
    margin: auto;
    @media screen and (max-width: 600px){
        padding: 0.5rem 4%;
    }
    .breadth{
        .top{
            max-width: 640px;
            overflow: hidden;
            h1{
                line-height: 1.2;
                margin: 8px 0px 0.3rem;
                font-size: 0.4rem;
                letter-spacing: -0.02em;
                color: rgb(26, 43, 107);
                @media screen and (max-width: 600px){
                    font-size: 24px;
                }
            }
            .desc{
                margin: 0.25rem 0px 0px;
                font-size: 0.18rem;
                line-height: 1.7;
                color: rgb(61, 69, 86);
                word-break: break-word;
                @media screen and (max-width: 600px){
                    font-size: 14px;
                }
            }
            a{
                float: left;
                margin: 0px;
                font-size: 0.16rem;
                line-height: 24px;
                color: #506fd7;
                &:hover{
                    text-decoration: underline;
                }
                @media screen and (max-width: 600px){
                    font-size: 13px;
                }
            }
        }
        .formTx{
            margin: 0.32rem 0px;
            padding: 0.25rem;
            border: 1px solid rgb(231, 232, 234);
            background-color: #fff;
            border-radius: 0.04rem;
            box-shadow: none;
            .el-form /deep/{
                .el-form-item{
                    display: flex;
                    flex-wrap: wrap;
                    .el-form-item__label{
                        display: block;
                        width: 100%;
                        text-align: left;
                    }
                    .el-form-item__content{
                        width: 100%;
                        .el-select{
                            width: 100%;
                            @media screen and (min-width: 768px) {
                                width: 265px;
                            }
                        }
                        .el-checkbox{
                            width: 100%;
                            height: auto;
                            padding: 25px;
                            margin: 0 0 10px 0;
                            @media screen and (min-width: 768px) {
                                width: 265px;
                                margin: 0 33px 0 0;
                            }
                        }
                        .el-checkbox.is-bordered.is-checked {
                            border-color: #506fd7;
                            background-color: rgba(80, 111, 215, 0.05);
                        }
                        .el-checkbox__input.is-checked+.el-checkbox__label{
                            color: #506fd7;
                        }
                        .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
                            background-color: #506fd7;
                            border-color: #506fd7;
                            display: none;
                        }
                        .input{
                            width: 100%;
                            max-width: 600px;
                            .el-input__inner {
                            }
                        }
                        .inputTip{
                            .el-input__inner {
                                border-color: #ec1217;
                            }
                        }
                        .tipStyle{
                            color: #ec1217;
                            line-height: 2;
                            font-size: 12px;
                            i{
                                font-size: 14px;
                            }
                        }
                        .amountStyle{
                            color: #797979;
                            line-height: 1.5;
                            font-size: 12px;
                        }
                        .el-button--primary{
                            background-color: #506fd7;
                            border-color: #506fd7;
                            &:hover{
                                // opacity: .9;
                                background-color: #2f59e3;
                                border-color: #2f59e3;
                            }
                        }
                        .recaptcha{
                            margin: 5px 0px;
                            width: 304px;
                            height: 78px;
                            background-color: rgb(249, 249, 249);
                            border-radius: 2px;
                        }
                    }
                    .verification{
                        max-width: 400px;
                        .el-input-group__append{
                            height: 38px;
                            padding: 0;
                            .verification_loading{
                                min-width: 150px;
                                height: 38px;
                                padding: 0 10px;
                                img{
                                    display: block;
                                    height: 100%;
                                    cursor: pointer;
                                }
                                .el-loading-mask{
                                    .el-loading-spinner{
                                        margin-top: -15px;
                                        .circular, svg{
                                            width: 30px;
                                            height: 30px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    &:nth-child(1){
                        @media screen and (min-width: 768px) {
                            width: 290px;
                            float: left;
                        }
                    }
                    @media screen and (max-width: 768px){
                        width: 100%;
                        float: none;
                    }
                }
            }
            .need{
                display: flex;
                align-items: center;
                margin: 0.25rem 0px 0px;
                img{
                    margin: 0 12px 0px 0px;
                    max-width: 100%;
                    height: auto;
                    max-height: 100%;
                    display: unset;
                    min-width: 24px;
                    @media screen and (max-width: 600px){
                        display: none;
                    }
                }
                p{
                    margin: 0;
                    font-size: 16px;
                    line-height: 24px;
                    color: rgb(109, 115, 128);
                    @media screen and (max-width: 600px){
                        font-size: 14px;
                    }
                }
                a{
                    margin: 0;
                    font-size: inherit;
                    color: #506fd7;
                    text-decoration: none;
                    &:hover{
                        text-decoration: underline;
                    }
                }
            }
        }
        .contactus{
            font-size: 14px;
            a{
                color: #506fd7;
                text-decoration: underline;
            }
        }
    }
}
.el-dialog__wrapper /deep/ {  
    display: flex;
    align-items: center;
    .transform{
        margin: auto !important;
        border-radius: 0.06rem;
        .el-dialog__header{
            display: none;
        }
        .el-dialog__body{
            padding: 0.6rem 0.6rem 0.3rem;
            @media screen and (max-width: 600px){
                padding: 0.6rem 2% 0.3rem;
            }
            .el-steps{
                .el-step{
                    .el-step__title{
                        font-size: 12px;
                        line-height: 2;
                        word-break: break-word;
                        @media screen and (max-width: 600px){
                            margin-bottom: 10px;
                            line-height: 1.3;
                        }
                    }
                    .el-step__icon{
                        width: auto;
                        min-width: 20px;
                        height: 20px;
                        font-size: 12px;
                        i{
                            font-size: 18px;
                        }
                    }
                    .el-step__line{
                        top: 9px;
                    }
                    .el-step__head.is-finish{
                        .el-step__line{
                            background-color: #409EFF;
                        }
                    }
                    &:nth-child(1){
                        .el-step__head, .el-step__main{
                            text-align: left;
                            .el-step__icon{
                                justify-content: flex-start;
                            }
                        }
                        .el-step__line{
                            left: 0;
                        }
                    }
                    &:nth-child(2), &:nth-child(3){
                        text-align: center;
                    }
                    
                    &:nth-child(4){
                        .el-step__head, .el-step__main{
                            text-align: right;
                        }
                        .el-step__line{
                            display: block;
                            right: 0;
                        }
                    }
                }
            }
            .trans_cont{
                text-align: center;
                @media screen and (max-width: 600px){
                    padding: 0 2%;
                }
                h1{
                    margin: 0.32rem 0px 0.24rem;       
                    font-size: 32px;
                    line-height: 1.5;
                    font-weight: 500;
                    letter-spacing: -0.02em;
                    color: rgb(26, 43, 107);
                    @media screen and (max-width: 1200px){ 
                        font-size: 24px;
                    }
                    @media screen and (max-width: 600px){
                        font-size: 18px;
                    }
                }
                h4{
                    margin: 8px 0px 0px;
                    font-size: 16px;
                    font-weight: normal;
                    line-height: 1.5;
                    color: rgb(109, 115, 128);
                    word-break: break-word;
                    @media screen and (max-width: 600px){
                        font-size: 14px;
                    }
                    @media screen and (max-width: 441px){
                        font-size: 12px;
                    }
                }
                .cont{
                    margin: 0.16rem 0px;
                    border: 1px solid rgb(231, 232, 234);
                    -webkit-box-align: center;
                    align-items: center;
                    border-radius: 4px;
                    text-align: left;
                    padding: 24px;
                    flex-direction: row;
                    @media screen and (max-width: 600px){
                        padding: 0.2rem; 
                    }
                    div{
                        display: flex;
                        justify-content: flex-start;
                        align-items: flex-start;
                        flex-wrap: wrap;    
                        margin: 8px 0px 0px;
                        font-size: 14px;
                        line-height: 22px;
                        color: rgb(26, 43, 107);
                        span{
                            width: 30%;
                            @media screen and (max-width: 600px){
                                width: 100%;
                                font-weight: 600;
                            }
                        }
                        a{
                            word-break: break-all;
                            width: 70%;
                            @media screen and (max-width: 600px){
                                width: 100%;
                            }
                        }
                    }
                }
            }
        }
        .el-dialog__footer{
            display: flex;
            justify-content: center;
            padding: 0 0.6rem 0.4rem;
            @media screen and (max-width: 600px){
                padding: 0 4% 0.4rem;
            }
            .el-button{
                display: block;
            }
        }
    }
    .transTip{
        margin: auto !important;
        border-radius: 0.06rem;
        .el-dialog__body{
            text-align: center;
            padding: 30px 20px 40px;
            .tip{
                font-size: 14px;
                line-height: 1.8;
            }
        }
    }
}
</style>