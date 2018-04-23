require('./index.scss')

import Vue from 'vue'
// import { default as busi } from './busi.js'
import Test from '@/view/vue/test'

require.ensure([], function(){
    const busi  = require('./busi');
    busi.aa();
});

// console.log(busi.a)

console.log('这是 list/index.js')

new Vue({
    el: '#wrapper',
    data:{
        data:123456
    },
    components: {
        test: Test
    }
})