(function(){
    function foliageReact(react){
        react.DOM.__dynamic = function(factory, initial) {
            var component;
            var result = react.createElement(react.createClass({
                getInitialState : function (){
                    return initial;},
                render: function(){
                    component = this;
                    return factory(this.state)(react.DOM);
                }
            }));
            result.__proto__.__next = function(state){
                if(component){
                    component.setState(state);
                }

            };
            return result;
        };

        function makeReactInstance(create){
            return react.createClass({render:function(){return create(react.DOM)}})();
        };
        
        return {
                in: function(element, create){
                    var id = element.substring(1);
                    react.renderComponent(makeReactInstance(create), document.getElementById(id));
                },
            text: function(create) {
                return react.renderComponentToStaticMarkup(makeReactInstance(create));
            }

            }
        };
    
    

    if (typeof define !== 'undefined') {
        define(['react'], foliageReact);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = foliageReact(require('react'));
    }
})();
