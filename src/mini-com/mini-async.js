// mini async，满足大部分的需求了~~
var Async = (function(){

  return {
      parallel: function(tasks, callback){
          var _tasks = tasks,
              _tasksNum = tasks.length,
              _num = tasks.length,
              _paramList = [],
              _errorThrow = false,
              _errCallback = function(err, param){
                  if(!_errorThrow){
                      _errorThrow = true;
                      callback(err, param);
                  }
              };

          // 得用_num，不能用 _tasksNum，如果函数不是异步的，直接就回调回来，把_tasksNum 减1，就悲剧了。。
          for(var i = 0; i < _num; i++){
              (function(i){
                  tasks[i](function(err, param){
                      if(err){
                          _errCallback(err, _paramList);
                      }else{
                          _tasksNum--;
                          _paramList[i] = param;
                          if(!_tasksNum) callback(null, _paramList);
                      }
                  });
              })(i);
          }
      }
  }
})();
