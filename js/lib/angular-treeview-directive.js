(function(l) {
    l.module("angularTreeview", []).directive("treeModel", function($compile) {
        return {
            restrict: "A",
            link: function(a, g, c) {
                var e = c.treeModel,
                    h = c.nodeLabel || "label",
                    d = c.nodeChildren || "children",
                    k = '<ul><li data-ng-repeat="node in ' + e + '"><i class="expanded" data-ng-show="node.' + d + '.length && node.expanded" data-ng-click="selectNodeHead(node, $event)"></i><i class="collapsed" data-ng-show="node.' + d + '.length && !node.expanded" data-ng-click="selectNodeHead(node, $event)"></i><i class="normal" data-ng-hide="node.' +
                    d + '.length"></i> <span data-ng-class="node.selected" data-ng-click="selectNodeLabel(node, $event); lala(node);">{{node.' + h + '}}</span><div data-ng-show="node.expanded" data-tree-model="node.' + d + '" data-node-id=' + (c.nodeId || "id") + " data-node-label=" + h + " data-node-children=" + d + "></div></li></ul>";
                e && e.length && (c.angularTreeview ? (a.$watch(e, function(m, b) {
                    g.empty().html($compile(k)(a))
                }, !1), a.selectNodeHead = a.selectNodeHead || function(a, b) {
                    b.stopPropagation && b.stopPropagation();
                    b.preventDefault && b.preventDefault();
                    b.cancelBubble = !0;
                    b.returnValue = !1;
                    a.expanded = !a.expanded
                }, a.selectNodeLabel = a.selectNodeLabel || function(c, b) {
                    b.stopPropagation && b.stopPropagation();
                    b.preventDefault && b.preventDefault();
                    b.cancelBubble = !0;
                    b.returnValue = !1;
                    a.currentNode && a.currentNode.selected && (a.currentNode.selected = void 0);
                    c.selected = "selected";
                    a.currentNode = c
                }) : g.html($compile(k)(a)))
            }
        }
    })
})(angular);