// mini版的backbone，有朝一日用到的功能足够多，那就。。用回正统的版本吧。。。
var Backbone = (function($){

    var View = function(){};
    View.extend = function(properties, classProperties){

        var ViewBase = Class.create({
            _travese: function(){
                var events = this.events;
                for(var key in events){
                    var tmp = key.split(/\s+/);
                    var eventType = tmp[0];
                    var selector = tmp[1];
                    var handler = this[events[key]];
                    this.$(selector).on(eventType, $.proxy(handler, this));
                }
            },
            initialize: function(options){
                options = options || properties;

                // 将属性全都拷贝到this上，@todo 确认这里是否这样实现
                var excludes = ['$el', '$'];
                for(var key in options){
                    if(excludes.indexOf(key)==-1){
                        this[key] = options[key];
                    }
                }

                this.$el = $(this.el);
                this.$ = $.proxy(this.$el.find, this.$el);

                this._travese();

                options.initialize && options.initialize.call(this);
            },
            render: function(){
                // @todo 如何实现？
                return this;
            },
            listenTo: function(other, eventType, callback){
                // $(other).on(event, $.proxy(callback, this));
                $(other).on(eventType, $.proxy(function(evt){
                    callback.apply(this, Array.prototype.slice.call(arguments, 1));
                }, this));
                // @todo 此处所带的参数
            },
            stopListening: function(){
                // @todo 实现，但好像没有必要
            }
        });
        return ViewBase;
    };

    var Model = {};
    Model.extend = function(properties, classProperties){

        var ModelBase = Class.create({
            initialize: function(attributes, options){

                this.isChanged = false; // 属性是否改变过
                this.changed = {};  // @todo 变化过的属性

                this.previous = ''; // @todo 属性值被修改之前的值
                this.previousAttributes = {};   // @todo 修改之前的属性键值对

                this._attributes = $.extend({}, properties.defaults, attributes);  // 存储初始化时的属性值
                this.attributes = $.extend({}, properties.defaults, attributes);   // 存储当前属性值

                this.validate = properties.validate;    // @todo 需要考虑 Model.extend 创建类时，传入的 validate ，以及创建实例时，传入的validate

                properties.initialize && properties.initialize.call(this);   // @todo 确认下：创建实例时，传进来的initialize用不用管
            },
            set: function(key, value){
                var _value = this.attributes[key];

                this.attributes[key] = value;
                if(this.attributes[key]!=this._attributes[key]){
                    this.isChanged = true;
                }

                if(_value!=value){
                    $(this).trigger('change', [this]);    // @todo 传的参数确认??
                    $(this).trigger('change:'+key, [this, value]);   // 两个参数：model本身、修改后的value
                }
            },
            get: function(key){
                return this.attributes[key];
            },
            on: function(eventType, handler){
                $(this).on(eventType, function(evt){
                    handler.apply(this, Array.prototype.slice.call(arguments, 1));
                });
                // @todo 实现backbone版
                // $(this).on(eventType, handler);
            },
            off: function(eventType, handler){
                // @todo 实现
                $(this).off(eventType, handler);
            },
            save: function(attributes){
                // 如果有自定义的 validate 方法，且返回的值为false（非法值），则不save
                var ret ;
                if(this.validate && (ret = this.validate(attributes))){
                    $(this).trigger('invalid', [this, ret])
                    return;
                }
                // @todo 保存数据到服务器
            },
            hasChanged: function(){ // 是否已经发生变化
                // @todo 
            }
        });
        return ModelBase;
    };

    return {
        Model: Model,
        View: View
    };

})($);
