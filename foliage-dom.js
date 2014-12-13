(function(){
    function foliageDom(_) {
        function trigger(node, event, payload){
            var handler = node.attr['on'+event];
            handler && handler(payload);
        };
        
        function text(node){
            return _.foldl(node.children, function(text, current){
                return (_.isObject(current) || 
                        _.isFunction(current) || 
                        _.isArray(current)) ?
                    text :
                    text + current;
            }, "");
        };

        function find(node, pattern) {
            function findPath(currentPattern){
                return function(nodeToCheck) {
                    var matchers = {
                        '#':function(node){
                            var expectedId = currentPattern.substring(1);
                            return (node.attr && 
                                    node.attr.id && 
                                    node.attr.id === expectedId);
                        },
                        '.':function(node){
                            var c = currentPattern.substring(1);
                            return (node.attr && 
                                    node.attr.class && 
                                    _.contains(node.attr.class, c));
                        }
                    }
                    var doMatch = matchers[currentPattern.substring(0,1)];
                    
                    if(doMatch) {
                        return doMatch(nodeToCheck) ? nodeToCheck : undefined;
                    }
                    else {
                        return nodeToCheck.name === currentPattern ? nodeToCheck : undefined;
                    }
                }
            }
            
            var path = pattern.split(' ');

            var resolvePath = function(candidates, path){
                var found = _(candidates).
                    map(findPath(path[0])).
                    filter(function(val){return val !== undefined});
                if(path.length > 1) {
                    return resolvePath(found.pluck('children').flatten().value(), path.slice(1));
                }
                return found.value();
            }
            var res = resolvePath([node], path);
            return res[0];
        };

        function e(name) {
            return function(attr){
                var children = _.toArray(arguments).slice(1);
                children = _.foldl(children, function(acc, next, index){
                    if(_.isFunction(next.attach)) {
                        next.attach(acc, index);
                    }
                    return acc;
                }, children);
                return {
                    name: name,
                    attr: attr,
                    children:children
                };
            }
        };
        var result = {
            find: find,
            text: text,
            trigger: trigger
        };

        result.__dynamic = function(factory, initial) {
            var elementsToUpdate;
            var indexToUpdate;
            return {
                attach:function (elements, index) {
                    elementsToUpdate = elements;
                    indexToUpdate = index;
                    elements[index] = factory(initial)(result);
                },
                __next: function(next) {
                    elementsToUpdate[indexToUpdate] = factory(next)(result);
                }
            }
        };

        return _.reduce(
	    ['a', 
             'abbr',
             'address',
             'area',
             'article',
             'aside',
             'audio',
             'b',
             'base',
             'bdi',
             'bdo',
             'big',
             'blockquote',
             'body',
             'br',
             'button',
             'canvas',
             'caption',
             'cite',
             'code',
             'col',
             'colgroup',
             'data',
             'datalist',
             'dd',
             'del',
             'details',
             'dfn',
             'dialog',
             'div',
             'dl',
             'dt',
             'em',
             'embed',
             'fieldset',
             'figcaption',
             'figure',
             'footer',
             'form',
             'h1',
             'h2',
             'h3',
             'h4',
             'h5',
             'h6',
             'head',
             'header',
             'hr',
             'html',
             'i',
             'iframe',
             'img',
             'input',
             'ins',
             'kbd',
             'keygen',
             'label',
             'legend',
             'li',
             'link',
             'main',
             'map',
             'mark',
             'menu',
             'menuitem',
             'meta',
             'meter',
             'nav',
             'noscript',
             'object',
             'ol',
             'optgroup',
             'option',
             'output',
             'p',
             'param',
             'picture',
             'pre',
             'progress',
             'q',
             'rp',
             'rt',
             'ruby',
             's',
             'samp',
             'script',
             'section',
             'select',
             'small',
             'source',
             'span',
             'strong',
             'style',
             'sub',
             'summary',
             'sup',
             'table',
             'tbody',
             'td',
             'textarea',
             'tfoot',
             'th',
             'thead',
             'time',
             'title',
             'tr',
             'track',
             'u',
             'ul',
             'var',
             'video',
             'wbr'],
	    function(res, name) {
	        res[name] = e(name);
	        return res;
	    },
	    result);
    }

    if (typeof define !== 'undefined') {
        define(['lodash'], foliageDom);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = foliageDom(require('lodash'));
    }
})();
