// Generated by CoffeeScript 1.11.1
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  c3.Plot = (function(superClass) {
    extend(Plot, superClass);

    function Plot() {
      this.max_y = bind(this.max_y, this);
      this.min_y = bind(this.min_y, this);
      this.max_x = bind(this.max_x, this);
      this.min_x = bind(this.min_x, this);
      this.rescale = bind(this.rescale, this);
      this.scale = bind(this.scale, this);
      this._style = bind(this._style, this);
      this._draw = bind(this._draw, this);
      this._update = bind(this._update, this);
      this._size = bind(this._size, this);
      this._init = bind(this._init, this);
      return Plot.__super__.constructor.apply(this, arguments);
    }

    Plot.version = 0.1;

    Plot.prototype.type = 'plot';

    Plot.prototype.layers = [];

    Plot.prototype.axes = [];

    Plot.prototype.data = [];

    Plot.prototype.h = void 0;

    Plot.prototype.v = void 0;

    Plot.prototype.x = void 0;

    Plot.prototype.y = void 0;

    Plot.prototype.h_domain = void 0;

    Plot.prototype.v_domain = void 0;

    Plot.prototype.margins = void 0;

    Plot.prototype.crop_margins = true;

    Plot.prototype.layer_options = void 0;

    Plot.prototype.axis_options = void 0;

    Plot.prototype._init = function() {
      var axes_group, axis, i, len, ref, self;
      if (this.h == null) {
        this.h = d3.scale.linear();
      }
      if (this.v == null) {
        this.v = d3.scale.linear();
      }
      if (this.axes) {
        axes_group = this.svg.select('g.axes', ':first-child').singleton();
        this.axes_selection = axes_group.select('g.axis', null, true).options(this.axis_options).bind(this.axes, function(axis) {
          return axis.uid;
        });
        self = this;
        this.axes_selection["new"].each(function(axis) {
          axis.anchor = this;
          if (axis.scale == null) {
            axis.scale = axis instanceof c3.Axis.X ? self.h : self.v;
          }
          return axis.init();
        });
      }
      this.layers_svg = this.content.select('svg.layers', null, true).singleton();
      this.layers_selection = this.layers_svg.select('g.layer').bind(this.layers, function(layer) {
        return layer.uid;
      }).options(this.layer_options, function(layer) {
        return layer.options;
      });
      self = this;
      this.layers_selection.all.order();
      this.layers_selection["new"].each(function(layer) {
        return layer.init(self, d3.select(this));
      });
      if (!this.rendered) {
        if (this.margins == null) {
          this.margins = {};
        }
        if (typeof this.margins === 'number') {
          this.margins = {
            top: this.margins,
            bottom: this.margins,
            left: this.margins,
            right: this.margins
          };
        } else {
          c3.util.defaults(this.margins, {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          });
        }
        if (this.axes != null) {
          ref = this.axes;
          for (i = 0, len = ref.length; i < len; i++) {
            axis = ref[i];
            this.margins[axis.orient] += axis.axis_size;
          }
        }
        this.background = this.content.select('rect.background', ':first-child').singleton().options({
          styles: {
            visibility: 'hidden',
            'pointer-events': 'all'
          }
        }).style();
      }
    };

    Plot.prototype._size = function() {
      var axis, i, j, layer, len, len1, ref, ref1;
      this.content.height = this.height - this.margins.top - this.margins.bottom;
      this.content.width = this.width - this.margins.left - this.margins.right;
      if (this.content.height <= 0) {
        this.content.height = 1;
      }
      if (this.content.width <= 0) {
        this.content.width = 1;
      }
      c3.d3.set_range(this.h, [0, this.content.width]);
      c3.d3.set_range(this.v, [this.content.height, 0]);
      this.layers_svg.all.attr('height', this.content.height).attr('width', this.content.width);
      if (this.crop_margins != null) {
        switch (this.crop_margins) {
          case true:
            this.layers_svg.all.style('overflow', 'hidden');
            break;
          case false:
            this.layers_svg.all.style('overflow', 'visible');
            break;
          case 'x':
            this.layers_svg.all.style({
              'overflow-x': 'hidden',
              'overflow-y': 'visible'
            });
            break;
          case 'y':
            this.layers_svg.all.style({
              'overflow-x': 'visible',
              'overflow-y': 'hidden'
            });
        }
      }
      ref = this.layers;
      for (i = 0, len = ref.length; i < len; i++) {
        layer = ref[i];
        layer.size(this.content.width, this.content.height);
      }
      if (this.margins.left || this.margins.top) {
        this.content.all.attr('transform', "translate(" + this.margins.left + "," + this.margins.top + ")");
      }
      if (this.axes) {
        ref1 = this.axes;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          axis = ref1[j];
          axis.height = this.content.height;
          axis.width = this.content.width;
          axis._size();
          axis.content.all.attr('transform', (function() {
            switch (axis.orient) {
              case 'left':
                return "translate(" + this.margins.left + "," + this.margins.top + ")";
              case 'right':
                return "translate(" + (this.width - this.margins.right) + "," + this.margins.top + ")";
              case 'top':
                return "translate(" + this.margins.left + "," + this.margins.top + ")";
              case 'bottom':
                return "translate(" + this.margins.left + "," + (this.height - this.margins.bottom) + ")";
            }
          }).call(this));
        }
      }
      this.background.all.attr('width', this.content.width).attr('height', this.content.height);
    };

    Plot.prototype._update = function(origin) {
      var i, layer, len, ref;
      this.axes_selection.update();
      this.layers_selection.update();
      ref = this.layers;
      for (i = 0, len = ref.length; i < len; i++) {
        layer = ref[i];
        layer.update(origin);
      }
      if (!this.rendered) {
        this.scale('render');
      }
    };

    Plot.prototype._draw = function(origin) {
      var axis, i, j, layer, len, len1, ref, ref1;
      ref = this.layers;
      for (i = 0, len = ref.length; i < len; i++) {
        layer = ref[i];
        layer.draw(origin);
      }
      if (this.axes) {
        ref1 = this.axes;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          axis = ref1[j];
          axis.draw();
        }
      }
    };

    Plot.prototype._style = function(style_new) {
      var i, layer, len, ref;
      this.axes_selection.style();
      this.layers_selection.style();
      ref = this.layers;
      for (i = 0, len = ref.length; i < len; i++) {
        layer = ref[i];
        layer.style(style_new);
        layer.rendered = true;
      }
    };

    Plot.prototype.scale = function(origin) {
      var h_domain, i, layer, len, ref, ref1, refresh, v_domain;
      refresh = false;
      if (this.h_domain != null) {
        h_domain = typeof this.h_domain === 'function' ? this.h_domain.call(this) : this.h_domain;
        if (h_domain[0] === 'auto') {
          h_domain[0] = this.min_x();
        }
        if (h_domain[1] === 'auto') {
          h_domain[1] = this.max_x();
        }
        if (h_domain[0] !== this.h.domain()[0] || h_domain[1] !== this.h.domain()[1]) {
          this.h.domain(h_domain);
          if ((ref = this.orig_h) != null) {
            ref.domain(h_domain);
          }
          refresh = true;
        }
      }
      if (this.v_domain != null) {
        v_domain = typeof this.v_domain === 'function' ? this.v_domain.call(this) : this.v_domain;
        if (v_domain[0] === 'auto') {
          v_domain[0] = this.min_y();
        }
        if (v_domain[1] === 'auto') {
          v_domain[1] = this.max_y();
        }
        if (v_domain[0] !== this.v.domain()[0] || v_domain[1] !== this.v.domain()[1]) {
          this.v.domain(v_domain);
          refresh = true;
        }
      }
      ref1 = this.layers;
      for (i = 0, len = ref1.length; i < len; i++) {
        layer = ref1[i];
        refresh = layer.scale() || refresh;
      }
      return refresh;
    };

    Plot.prototype.rescale = function() {
      if (this.scale()) {
        this.draw('rescale');
      }
      return this;
    };

    Plot.prototype.min_x = function() {
      return d3.min(this.layers, function(l) {
        return l.min_x();
      });
    };

    Plot.prototype.max_x = function() {
      return d3.max(this.layers, function(l) {
        return l.max_x();
      });
    };

    Plot.prototype.min_y = function() {
      return d3.min(this.layers, function(l) {
        return l.min_y();
      });
    };

    Plot.prototype.max_y = function() {
      return d3.max(this.layers, function(l) {
        return l.max_y();
      });
    };

    return Plot;

  })(c3.Chart);

  c3.Plot.Selectable = (function(superClass) {
    extend(Selectable, superClass);

    function Selectable() {
      this.select = bind(this.select, this);
      this._size = bind(this._size, this);
      this._init = bind(this._init, this);
      return Selectable.__super__.constructor.apply(this, arguments);
    }

    Selectable.version = 0.1;

    Selectable.prototype.type = 'selectable';

    Selectable.prototype.selectable = 'hv';

    Selectable.prototype.drag_selections = true;

    Selectable.prototype.selection = void 0;

    Selectable.prototype._init = function() {
      Selectable.__super__._init.apply(this, arguments);
      if (this.selectable === true) {
        this.selectable = 'hv';
      } else if (this.selectable === false) {
        this.selectable = '';
      }
      return this.svg.all.classed('h', indexOf.call(this.selectable, 'h') >= 0).classed('v', indexOf.call(this.selectable, 'v') >= 0);
    };

    Selectable.prototype._size = function() {
      Selectable.__super__._size.apply(this, arguments);
      if (this.brush == null) {
        this.brush = d3.svg.brush();
        if (indexOf.call(this.selectable, 'h') >= 0) {
          this.brush.x(this.h);
        }
        if (indexOf.call(this.selectable, 'v') >= 0) {
          this.brush.y(this.v);
        }
        this.brush.on('brush', (function(_this) {
          return function() {
            var extent;
            extent = !_this.brush.empty() ? _this.brush.extent() : null;
            if (extent !== _this.prev_extent) {
              _this.select(extent);
              _this.trigger('select', extent);
            }
            return _this.prev_extent = extent;
          };
        })(this));
        this.brush.on('brushend', (function(_this) {
          return function() {
            var extent;
            extent = !_this.brush.empty() ? _this.brush.extent() : null;
            _this.select(extent);
            return _this.trigger('selectend', extent);
          };
        })(this));
        this.brush_selection = this.content.select('g.brush').singleton();
        this.brush(this.brush_selection.all);
        if (indexOf.call(this.selectable, 'v') >= 0) {
          this.brush_selection.select('rect.n', ':first-child').singleton().all.classed('unbrush', true).attr('y', 0);
          this.brush_selection.select('rect.s', ':first-child').singleton().all.classed('unbrush', true);
          this.brush_selection.all.selectAll('g.brush > rect').attr('width', this.content.width);
          if (indexOf.call(this.selectable, 'h') < 0) {
            this.brush_selection.all.selectAll('g.resize > rect').attr('width', this.content.width);
          }
        }
        if (indexOf.call(this.selectable, 'h') >= 0) {
          this.brush_selection.select('rect.w', ':first-child').singleton().all.classed('unbrush', true).attr('x', 0);
          this.brush_selection.select('rect.e', ':first-child').singleton().all.classed('unbrush', true);
          this.brush_selection.all.selectAll('g.brush > rect').attr('height', this.content.height);
          if (indexOf.call(this.selectable, 'v') < 0) {
            this.brush_selection.all.selectAll('g.resize > rect').attr('height', this.content.height);
          }
        }
      }
      this.brush_selection.all.selectAll('rect.extent, g.resize').style('pointer-events', !this.drag_selections ? 'none' : '');
      return this.select(this.selection);
    };

    Selectable.prototype.select = function(selection) {
      var h_selection, v_selection;
      this.selection = selection;
      if ((this.selection != null) && this.selection.length) {
        h_selection = indexOf.call(this.selectable, 'v') >= 0 ? [this.selection[0][0], this.selection[1][0]] : this.selection;
        v_selection = indexOf.call(this.selectable, 'h') >= 0 ? [this.selection[0][1], this.selection[1][1]] : this.selection;
        this.brush.extent(this.selection);
      } else {
        h_selection = this.h.domain();
        v_selection = this.v.domain();
        this.brush.extent(indexOf.call(this.selectable, 'h') >= 0 && indexOf.call(this.selectable, 'v') >= 0 ? [[0, 0], [0, 0]] : [0, 0]);
      }
      this.brush(this.brush_selection.all);
      if (indexOf.call(this.selectable, 'h') >= 0) {
        this.brush_selection.all.select('.unbrush[class~=w]').attr('width', this.h(h_selection[0]));
        this.brush_selection.all.select('.unbrush[class~=e]').attr('width', Math.abs(this.h(this.h.domain()[1]) - this.h(h_selection[1]))).attr('x', this.h(h_selection[1]));
      }
      if (indexOf.call(this.selectable, 'v') >= 0) {
        this.brush_selection.all.select('.unbrush[class~=n]').attr('height', this.v(v_selection[1]));
        this.brush_selection.all.select('.unbrush[class~=s]').attr('height', Math.abs(this.v(this.v.domain()[0]) - this.v(v_selection[0]))).attr('y', this.v(v_selection[0]));
        if (indexOf.call(this.selectable, 'h') >= 0) {
          this.brush_selection.all.selectAll('.unbrush[class~=n], .unbrush[class~=s]').attr('x', this.h(h_selection[0])).attr('width', this.h(h_selection[1]) - this.h(h_selection[0]));
        }
      }
      return delete this.prev_extent;
    };

    return Selectable;

  })(c3.Plot);

  c3.Plot.Zoomable = (function(superClass) {
    extend(Zoomable, superClass);

    function Zoomable() {
      this._draw = bind(this._draw, this);
      this.focus = bind(this.focus, this);
      this._size = bind(this._size, this);
      this._init = bind(this._init, this);
      return Zoomable.__super__.constructor.apply(this, arguments);
    }

    Zoomable.version = 0.0;

    Zoomable.prototype.type = 'zoomable';

    Zoomable.prototype.snap_to_all = 0.01;

    Zoomable.prototype.zoom_extent = void 0;

    Zoomable.prototype._init = function() {
      var last_touch_event, touchstart;
      if (this.rendered) {
        return Zoomable.__super__._init.apply(this, arguments);
      } else {
        Zoomable.__super__._init.apply(this, arguments);
        if (this.zoomable !== 'h') {
          throw "Only horizontal zooming is currently supported";
        }
        this.orig_h = this.h.copy();
        this.zoomer = d3.behavior.zoom().on('zoom', (function(_this) {
          return function() {
            return _this.trigger('zoom', _this.focus(_this.h.domain()));
          };
        })(this));
        this.prev_zoomend_domain = this.h.domain().slice(0);
        this.zoomer.on('zoomend', (function(_this) {
          return function() {
            var ref, ref1;
            if (_this.h.domain()[0] !== ((ref = _this.prev_zoomend_domain) != null ? ref[0] : void 0) || _this.h.domain()[1] !== ((ref1 = _this.prev_zoomend_domain) != null ? ref1[1] : void 0)) {
              _this.trigger('zoomend', _this.h.domain());
              return _this.prev_zoomend_domain = _this.h.domain().slice(0);
            }
          };
        })(this));
        this.zoomer(this.content.all);
        this.content.all.on('dblclick.zoom', null);
        last_touch_event = void 0;
        touchstart = function() {
          if (last_touch_event && d3.event.touches.length === 1 && d3.event.timeStamp - last_touch_event.timeStamp < 500 && Math.abs(d3.event.touches[0].screenX - last_touch_event.touches[0].screenX) < 10 && Math.abs(d3.event.touches[0].screenY - last_touch_event.touches[0].screenY) < 10) {
            d3.event.stopPropagation();
            last_touch_event = void 0;
          }
          return last_touch_event = d3.event;
        };
        this.layers_svg.all.on('touchstart.zoom', touchstart);
        this.background.all.on('touchstart.zoom', touchstart);
        this.content.all.on('mousedown.zoomable', function() {
          return d3.select('html').classed('grabbing', true);
        }).on('mouseup.zoomable', function() {
          return d3.select('html').classed('grabbing', false);
        });
        return window.addEventListener('mouseup', function() {
          return d3.select('html').classed('grabbing', false);
        });
      }
    };

    Zoomable.prototype._size = function() {
      var current_extent;
      Zoomable.__super__._size.apply(this, arguments);
      c3.d3.set_range(this.orig_h, [0, this.content.width]);
      current_extent = this.h.domain();
      this.h.domain(this.orig_h.domain());
      this.zoomer.x(this.h);
      if (this.zoom_extent != null) {
        if (this.zoom_extent === 'integer') {
          this.zoomer.scaleExtent([1, 1 / (this.content.width / this.orig_h.domain()[1])]);
        } else {
          this.zoomer.scaleExtent([1, this.zoom_extent]);
        }
      } else {
        this.zoomer.scaleExtent([1, 2e308]);
      }
      return this.focus(current_extent);
    };

    Zoomable.prototype.focus = function(extent) {
      var axis, base, base1, domain, domain_width, i, j, layer, left_diff, len, len1, new_domain, ref, ref1, ref2, ref3, right_diff, scale, threshold, translate;
      if (this.rendered) {
        if ((extent == null) || !extent.length) {
          extent = this.orig_h.domain();
        }
        extent = extent.slice(0);
        domain = this.orig_h.domain();
        domain_width = domain[1] - domain[0];
        extent[0] = (ref = typeof (base = extent[0]).getTime === "function" ? base.getTime() : void 0) != null ? ref : extent[0];
        extent[1] = (ref1 = typeof (base1 = extent[1]).getTime === "function" ? base1.getTime() : void 0) != null ? ref1 : extent[1];
        if (extent[0] < domain[0]) {
          extent[1] += domain[0] - extent[0];
          extent[0] = domain[0];
        }
        if (extent[1] > domain[1]) {
          extent[0] -= extent[1] - domain[1];
          extent[1] = domain[1];
        }
        if (extent[0] < domain[0]) {
          extent[0] = domain[0];
          extent[1] = domain[1];
        }
        if (extent[0] - domain[0] < domain_width * this.snap_to_all && domain[1] - extent[1] < domain_width * this.snap_to_all) {
          extent[0] = domain[0];
          extent[1] = domain[1];
        }
        scale = domain_width / (extent[1] - extent[0]);
        translate = (domain[0] - extent[0]) * scale * (this.content.width / domain_width);
        this.zoomer.translate([translate, 0]).scale(scale);
        this.layers_svg.all.selectAll('.scaled').attr('transform', 'translate(' + translate + ' 0)scale(' + scale + ' 1)');
        new_domain = this.h.domain().slice(0);
        if (this.prev_domain == null) {
          this.prev_domain = domain;
        }
        threshold = (new_domain[1] - new_domain[0]) / 1000000;
        left_diff = Math.abs(new_domain[0] - this.prev_domain[0]) / threshold > 1;
        right_diff = Math.abs(new_domain[1] - this.prev_domain[1]) / threshold > 1;
        if (left_diff || right_diff) {
          ref2 = this.layers;
          for (i = 0, len = ref2.length; i < len; i++) {
            layer = ref2[i];
            if (layer.rendered) {
              if (typeof layer.zoom === "function") {
                layer.zoom();
              }
            }
          }
          if (this.axes) {
            ref3 = this.axes;
            for (j = 0, len1 = ref3.length; j < len1; j++) {
              axis = ref3[j];
              if (!(axis.scale && axis instanceof c3.Axis.X)) {
                continue;
              }
              axis.scale.domain(new_domain);
              axis._draw();
            }
          }
          this.prev_domain = new_domain;
          this.trigger('redraw', 'focus');
          this.trigger('restyle', true);
        }
        if (domain[0] === extent[0] && domain[1] === extent[1]) {
          return null;
        } else {
          return new_domain;
        }
      }
    };

    Zoomable.prototype._draw = function(origin) {
      Zoomable.__super__._draw.apply(this, arguments);
      if (origin === 'render' && this.rendered) {
        this.prev_domain = [0, 0];
        return this.focus(this.h.domain());
      }
    };

    return Zoomable;

  })(c3.Plot);

  c3.Axis = (function(superClass) {
    extend(Axis, superClass);

    Axis.version = 0.1;

    Axis.prototype.type = 'axis';

    Axis._next_uid = 0;

    Axis.prototype.scale = void 0;

    Axis.prototype.orient = void 0;

    Axis.prototype.grid = false;

    Axis.prototype.label = void 0;

    Axis.prototype.ticks = true;

    Axis.prototype.tick_label = true;

    Axis.prototype.tick_values = void 0;

    Axis.prototype.tick_count = void 0;

    Axis.prototype.tick_size = 6;

    Axis.prototype.path_size = 2;

    Axis.prototype.axis_size = void 0;

    function Axis(opt) {
      this._draw = bind(this._draw, this);
      this._init = bind(this._init, this);
      Axis.__super__.constructor.apply(this, arguments);
      this.uid = c3.Axis._next_uid++;
    }

    Axis.prototype._init = function() {
      if (this.scale == null) {
        this.scale = d3.scale.linear();
      }
      this.content.all.classed('axis', true);
      this.content.all.classed(this.orient, true);
      return this.axis = d3.svg.axis().orient(this.orient);
    };

    Axis.prototype._draw = function() {
      if (this.scale) {
        this.axis.scale(this.scale).outerTickSize(this.path_size).innerTickSize(this.ticks ? this.tick_size : 0).tickValues(this.tick_values).tickFormat((function() {
          if (!this.ticks) {
            return "";
          } else {
            switch (this.tick_label) {
              case false:
                return "";
              case true:
                return null;
              default:
                return this.tick_label;
            }
          }
        }).call(this));
        if (this.tick_count != null) {
          this.axis.ticks(this.tick_count);
        }
        this.content.all.call(this.axis);
      }
      if (this.label) {
        this.text_label = this.content.all.selectAll('text.label').data([this.label]);
        this.text_label.enter().append('text').attr('class', 'label');
        this.text_label.text(this.label).text(this.label);
      }
      if (this.grid) {
        this.content.all.selectAll('g.tick line.grid').remove();
        return this.content.all.selectAll('g.tick').append('line').classed('grid', true).attr('x2', (function() {
          switch (this.orient) {
            case 'left':
              return this.width;
            case 'right':
              return -this.width;
            default:
              return 0;
          }
        }).call(this)).attr('y2', (function() {
          switch (this.orient) {
            case 'bottom':
              return -this.height;
            case 'top':
              return this.height;
            default:
              return 0;
          }
        }).call(this));
      }
    };

    return Axis;

  })(c3.Chart);

  c3.Axis.X = (function(superClass) {
    extend(X, superClass);

    function X() {
      this._draw = bind(this._draw, this);
      this._size = bind(this._size, this);
      this._init = bind(this._init, this);
      return X.__super__.constructor.apply(this, arguments);
    }

    X.prototype.type = 'x';

    X.prototype.orient = 'bottom';

    X.prototype._init = function() {
      X.__super__._init.apply(this, arguments);
      return this.axis_size != null ? this.axis_size : this.axis_size = (!this.ticks ? 0 : Math.max(this.tick_size, this.path_size) + (this.tick_label ? 20 : 0)) + (this.label ? 24 : 0);
    };

    X.prototype._size = function() {
      if (this.orient === 'top') {
        this.content.all.attr('transform', "translate(0," + this.height + ")");
      }
      if (this.scale) {
        return c3.d3.set_range(this.scale, [0, this.width]);
      }
    };

    X.prototype._draw = function() {
      X.__super__._draw.apply(this, arguments);
      if (this.label != null) {
        return this.text_label.attr({
          x: (this.width / 2) | 0,
          y: this.orient === 'bottom' ? this.axis_size : '',
          dy: '-0.5em'
        });
      }
    };

    return X;

  })(c3.Axis);

  c3.Axis.Y = (function(superClass) {
    extend(Y, superClass);

    function Y() {
      this._draw = bind(this._draw, this);
      this._size = bind(this._size, this);
      this._init = bind(this._init, this);
      return Y.__super__.constructor.apply(this, arguments);
    }

    Y.prototype.type = 'y';

    Y.prototype.orient = 'left';

    Y.prototype._init = function() {
      Y.__super__._init.apply(this, arguments);
      return this.axis_size != null ? this.axis_size : this.axis_size = (!this.ticks ? 0 : Math.max(this.tick_size, this.path_size)) + (this.tick_label ? 42 : 0) + (this.label ? 20 : 0);
    };

    Y.prototype._size = function() {
      if (this.orient === 'left') {
        this.content.all.attr('transform', "translate(" + this.width + ",0)");
      }
      if (this.scale) {
        return c3.d3.set_range(this.scale, [this.height, 0]);
      }
    };

    Y.prototype._draw = function() {
      Y.__super__._draw.apply(this, arguments);
      if (this.label != null) {
        return this.text_label.attr({
          x: this.orient === 'left' ? -this.axis_size : this.axis_size,
          y: (this.height / 2) | 0,
          dy: this.orient === 'left' ? '1em' : '-1em',
          transform: "rotate(-90," + (this.orient === 'left' ? -this.axis_size : this.axis_size) + "," + ((this.height / 2) | 0) + ")"
        });
      }
    };

    return Y;

  })(c3.Axis);

}).call(this);

//# sourceMappingURL=c3-plot.js.map
