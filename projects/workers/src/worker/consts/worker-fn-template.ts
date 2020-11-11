export const WORKER_BLANK_FN = `
function(fn){
    function isFunction(type){
        return type === 'function';
    }

    self.addEventListener('message', function(e) {
        var result = fn.call(null, e.data);
        if(result && [typeof result.then, typeof result.catch].every(isFunction)){
            result.then(function(res){
                postMessage({result: res});
            }).catch(function(error){
                postMessage({error: error});
            })
        } else {
            postMessage({result: result});
        }
    })
}
`;
