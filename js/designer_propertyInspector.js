var bo;
(function (bo) {
    var propertyInspector = (function () {
        function propertyInspector(designer, canvas) {
            this.designer = designer;
            this.canvas = canvas;
            this.canvasElement = $(canvas);
            this.activeElement = null;
            this.propertyNodes = {};
            this.boundingBox = null;
            this.propertyInspector = this.buildPropertyInspector(canvas, this.canvasElement);
            this.propertyViewContainer = this.buildPropertyViewContainer(this.propertyInspector);
            this.titleBar = this.buildTitleBar(this.propertyViewContainer);
            this.propertyView = this.buildPropertyView(this.propertyViewContainer);
            this.updatePosition(0);
        }
        propertyInspector.prototype.updatePosition = function (xchange) {
            this.propertyInspector.css("left", parseInt(this.propertyInspector.css("left")) + xchange);
            this.boundingBox = this.propertyInspector[0].getBoundingClientRect();
        };
        propertyInspector.prototype.update = function (activeElement) {
            var self = this;
            var same = this.activeElement == activeElement;
            this.activeElement = activeElement;
            if (this.activeElement == null)
                return;
            if (same) {
                for (var _i = 0, _a = activeElement.properties; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (!item.readonly) {
                        this.propertyNodes[item.name].val(item.get(activeElement));
                    }
                }
            }
            else {
                this.propertyView.html('');
                var table = $("<table>");
                $("<thead><tr><th>key</th><th>value</th><td></thead>").appendTo(table);
                var tBody = $("<tbody>").appendTo(table);
                for (var _b = 0, _c = activeElement.properties; _b < _c.length; _b++) {
                    var item = _c[_b];
                    var row = $("<tr></tr>");
                    var editor = null;
                    if (item.type == "text" || item.type == "number") {
                        var editor = $("<input type='text' name='" + item.name + "'' value='" + item.get(activeElement) + "'>");
                    }
                    else if (item.type == "options") {
                        var editor = $("<select name='" + item.name + "'' value='" + item.get(activeElement) + "'>");
                        for (var _d = 0, _e = item.options; _d < _e.length; _d++) {
                            var option = _e[_d];
                            editor.append($("<option value='" + option + "'>" + option + "</option>"));
                        }
                    }
                    if (!item.readonly) {
                        editor.on("change", { "objectProperty": item.name }, function (event) {
                            var data = self.activeElement[event.data.objectProperty];
                            self.activeElement[event.data.objectProperty] = (data === parseInt(data, 10)) ? parseInt($(this).val()) : $(this).val();
                            self.designer.updateCanvas();
                        });
                    }
                    row.append($("<td>" + item.text + "</td>"))
                        .append($("<td></td>").append(editor))
                        .appendTo(table);
                    this.propertyNodes[item.name] = editor;
                }
                this.propertyView.append(table);
            }
        };
        propertyInspector.prototype.buildPropertyViewContainer = function (propertyInspector) {
            return $('<div></div>')
                .addClass("designerPropertyContainer")
                .appendTo(propertyInspector);
        };
        propertyInspector.prototype.buildPropertyInspector = function (canvas, canvasElement) {
            return $('<div></div>')
                .addClass("designerUtilityWindow")
                .css({
                "left": this.canvas.getBoundingClientRect().right + 5,
                "top": this.canvas.getBoundingClientRect().top
            })
                .insertAfter(this.canvasElement);
        };
        propertyInspector.prototype.buildTitleBar = function (propertyViewContainer) {
            return $('<div>Property Inspector</div>')
                .addClass("designerPropertyTitle")
                .prependTo(this.propertyInspector)
                .on("dblclick", function () {
                propertyViewContainer.toggle();
            });
        };
        propertyInspector.prototype.buildPropertyView = function (propertyViewContainer) {
            return $('<div></div>')
                .addClass("designerPropertyContent")
                .appendTo(propertyViewContainer);
            ;
        };
        return propertyInspector;
    }());
    bo.propertyInspector = propertyInspector;
})(bo || (bo = {}));
//# sourceMappingURL=designer_propertyInspector.js.map