/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
// Triggered Functions
const testResponse = function(event){
	k.debug('Successful trigger');
	k.debug({event});
	k.getAttrs({
		props:['trigger_test'],
		callback:(attributes,sections,casc)=>{
			k.debug({attributes});
		}
	});
};
k.registerFuncs({testResponse});