require('./index.scss')

// import * from './busi'
require.ensure([], function(){
    require('./busi').aa();
});

console.log(' list/index.js');
