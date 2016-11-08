// Generated by CoffeeScript 1.11.1
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  c3.Graph = (function(superClass) {
    extend(Graph, superClass);

    function Graph() {
      return Graph.__super__.constructor.apply(this, arguments);
    }

    Graph.version = 0.1;

    Graph.prototype.type = 'graph';

    return Graph;

  })(c3.Chart);

  c3.Sankey = (function(superClass) {
    extend(Sankey, superClass);

    function Sankey() {
      this._style = bind(this._style, this);
      this._draw = bind(this._draw, this);
      this._layout = bind(this._layout, this);
      this._update = bind(this._update, this);
      this._size = bind(this._size, this);
      this._init = bind(this._init, this);
      return Sankey.__super__.constructor.apply(this, arguments);
    }

    Sankey.version = 0.1;

    Sankey.prototype.type = 'sankey';

    Sankey.prototype.data = [];

    Sankey.prototype.links = [];

    Sankey.prototype.key = void 0;

    Sankey.prototype.value = void 0;

    Sankey.prototype.link_source = void 0;

    Sankey.prototype.link_target = void 0;

    Sankey.prototype.link_key = void 0;

    Sankey.prototype.link_value = void 0;

    Sankey.prototype.safe = true;

    Sankey.prototype.iterations = 32;

    Sankey.prototype.alpha = 0.99;

    Sankey.prototype.node_padding = '20%';

    Sankey.prototype.node_width = 30;

    Sankey.prototype.align = 'both';

    Sankey.prototype.link_path = 'curve';

    Sankey.prototype.link_path_curvature = 0.5;

    Sankey.prototype.overflow_width_ratio = 0.5;

    Sankey.prototype.nodes_options = void 0;

    Sankey.prototype.node_options = void 0;

    Sankey.prototype.rect_options = void 0;

    Sankey.prototype.links_options = void 0;

    Sankey.prototype.link_options = void 0;

    Sankey.prototype.path_options = void 0;

    Sankey.prototype.node_label_options = void 0;

    Sankey.prototype.link_label_options = void 0;

    Sankey.prototype._init = function() {
      this.h = d3.scale.linear();
      this.v = d3.scale.linear();
      if (this.key == null) {
        this.key = (function(_this) {
          return function(d) {
            return _this.data.indexOf(d);
          };
        })(this);
      }
      if (this.link_key == null) {
        this.link_key = (function(_this) {
          return function(l) {
            return _this.link_source(l) + ',' + _this.link_target(l);
          };
        })(this);
      }
      if (this.link_source == null) {
        this.link_source = function(l) {
          return l.source;
        };
      }
      if (this.link_target == null) {
        this.link_target = function(l) {
          return l.target;
        };
      }
      if (this.link_value == null) {
        this.link_value = function(l) {
          return l.value;
        };
      }
      return this.background = this.content.select('rect.background').singleton().position({
        x: 0,
        y: 0
      });
    };

    Sankey.prototype._size = function() {
      this.v.range([0, this.height]);
      this.background.position({
        width: this.width,
        height: this.height
      });
      if ((!isNaN(this.node_padding)) || (!isNaN(this.node_width && this.overflow_width_ratio))) {
        return this._update();
      }
    };

    Sankey.prototype._update = function(origin) {
      var current_data, current_links, datum, detect_backedge, k, key, len, len1, len2, len3, link, link_key, link_value, m, n, name, name1, next_nodes, node, node_links, nodes, o, ref, ref1, ref2, ref3, ref4, remaining_nodes, stack, target_key, visited, x;
      if (origin === 'render' && !isNaN(this.node_padding)) {
        return;
      }
      this.nodes = nodes = {};
      this.node_links = node_links = {};
      current_links = [];
      ref = this.links;
      for (k = 0, len = ref.length; k < len; k++) {
        link = ref[k];
        link_key = this.link_key(link);
        link_value = this.link_value(link);
        if (!link_value) {
          continue;
        }
        if (node_links[link_key] != null) {
          throw Error("Link with duplicate source and target specified");
        }
        current_links.push(link);
        node_links[link_key] = {
          value: this.link_value(link)
        };
        node = nodes[name = this.link_source(link)] != null ? nodes[name] : nodes[name] = {
          source_links: [],
          target_links: []
        };
        node.target_links.push(link);
        node = nodes[name1 = this.link_target(link)] != null ? nodes[name1] : nodes[name1] = {
          source_links: [],
          target_links: []
        };
        node.source_links.push(link);
      }
      current_data = (function() {
        var len1, m, ref1, results;
        ref1 = this.data;
        results = [];
        for (m = 0, len1 = ref1.length; m < len1; m++) {
          datum = ref1[m];
          if (this.key(datum) in this.nodes) {
            results.push(datum);
          }
        }
        return results;
      }).call(this);
      if ((this.value != null) && !this.safe) {
        for (m = 0, len1 = current_data.length; m < len1; m++) {
          datum = current_data[m];
          nodes[this.key(datum)].value = this.value(datum);
        }
      } else {
        key = this.key;
        link_key = this.link_key;
        for (n = 0, len2 = current_data.length; n < len2; n++) {
          datum = current_data[n];
          node = nodes[key(datum)];
          node.value = Math.max(d3.sum(node.source_links, function(l) {
            return node_links[link_key(l)].value;
          }), d3.sum(node.target_links, function(l) {
            return node_links[link_key(l)].value;
          }));
          if (this.value != null) {
            node.value = Math.max(node.value, this.value(datum));
          }
        }
      }
      for (key in nodes) {
        node = nodes[key];
        if (node.value == null) {
          throw Error("Missing nodes are not currently supported");
        }
      }
      ref1 = this.nodes;
      for (key in ref1) {
        node = ref1[key];
        node.links_sum = d3.sum(node.source_links, (function(_this) {
          return function(l) {
            return _this.node_links[_this.link_key(l)].value;
          };
        })(this)) + d3.sum(node.target_links, (function(_this) {
          return function(l) {
            return _this.node_links[_this.link_key(l)].value;
          };
        })(this));
      }
      visited = {};
      ref2 = this.nodes;
      for (key in ref2) {
        node = ref2[key];
        if (!(!visited[key])) {
          continue;
        }
        stack = [];
        (detect_backedge = (function(_this) {
          return function(key, node) {
            var len3, o, ref3, target, target_key;
            visited[key] = true;
            stack.push(node);
            ref3 = node.target_links;
            for (o = 0, len3 = ref3.length; o < len3; o++) {
              link = ref3[o];
              target_key = _this.link_target(link);
              target = nodes[target_key];
              node_links[_this.link_key(link)].backedge = indexOf.call(stack, target) >= 0;
              if (!visited[target_key]) {
                detect_backedge(target_key, target);
              }
            }
            return stack.pop();
          };
        })(this))(key, node);
      }
      remaining_nodes = this.nodes;
      x = 0;
      while (!c3.util.isEmpty(remaining_nodes)) {
        next_nodes = {};
        for (key in remaining_nodes) {
          node = remaining_nodes[key];
          node.x = x;
          ref3 = node.target_links;
          for (o = 0, len3 = ref3.length; o < len3; o++) {
            link = ref3[o];
            if (!(!node_links[this.link_key(link)].backedge)) {
              continue;
            }
            target_key = this.link_target(link);
            next_nodes[target_key] = nodes[target_key];
          }
        }
        remaining_nodes = next_nodes;
        x++;
      }
      x--;
      if (this.align === 'both') {
        ref4 = this.nodes;
        for (key in ref4) {
          node = ref4[key];
          if (!node.target_links.length) {
            node.x = x;
          }
        }
      }
      this.h.domain([0, x]);
      return this._layout(origin, current_data, current_links, this.nodes);
    };

    Sankey.prototype._layout = function(origin, current_data1, current_links, current_nodes) {
      var alpha, base, collision_detection, column, columns, delta, i, i1, iteration, j, j1, k, key, layout_links, len, len1, len10, len11, len12, len2, len3, len4, len5, len6, len7, len8, len9, link, m, n, node, node_link, node_links, o, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, s, source_link_value, source_node, t, target_link_value, target_node, tmp, total_source_link_value, total_weighted_y, u, v, v_domain, w, weighted_y, y, z;
      this.current_data = current_data1;
      this.current_nodes = current_nodes;
      node_links = this.node_links;
      this.columns = columns = d3.nest().key(function(node) {
        return node.x;
      }).sortKeys(d3.ascending).entries((function() {
        var ref, results;
        ref = this.current_nodes;
        results = [];
        for (key in ref) {
          node = ref[key];
          results.push(node);
        }
        return results;
      }).call(this)).map(function(g) {
        return g.values;
      });
      c3.array.sort_up(this.columns, function(column) {
        return column[0].x;
      });
      if (!isNaN(this.node_padding)) {
        for (k = 0, len = columns.length; k < len; k++) {
          column = columns[k];
          column.padding_percent = this.node_padding * (column.length - 1) / this.height;
          if (column.padding_percent > 0.8) {
            column.padding_percent = 0.8;
          }
        }
      } else if ((typeof (base = this.node_padding).charAt === "function" ? base.charAt(this.node_padding.length - 1) : void 0) === '%') {
        for (m = 0, len1 = columns.length; m < len1; m++) {
          column = columns[m];
          column.padding_percent = column.length === 1 ? 0 : this.node_padding.slice(0, -1) / 100;
          if (column.padding_percent === 1) {
            column.padding_percent = 0.999;
          }
        }
      } else {
        throw new Error("Unsupported node_padding parameter: " + this.node_padding);
      }
      v_domain = d3.max((function() {
        var len2, n, results;
        results = [];
        for (n = 0, len2 = columns.length; n < len2; n++) {
          column = columns[n];
          results.push(d3.sum(column, function(node) {
            return node.value;
          }) / (1 - column.padding_percent));
        }
        return results;
      })());
      this.v.domain([0, v_domain]);
      for (n = 0, len2 = columns.length; n < len2; n++) {
        column = columns[n];
        column.padding = column.length === 1 ? 0 : v_domain * column.padding_percent / (column.length - 1);
      }
      collision_detection = (function(_this) {
        return function() {
          var dy, len3, len4, o, p, results, y;
          results = [];
          for (o = 0, len3 = columns.length; o < len3; o++) {
            column = columns[o];
            c3.array.sort_up(column, function(node) {
              return node.y;
            });
            y = 0;
            for (p = 0, len4 = column.length; p < len4; p++) {
              node = column[p];
              dy = y - node.y;
              if (dy > 0) {
                node.y += dy;
              }
              y = node.y + node.value + column.padding;
            }
            if (node.y + node.value > _this.v.domain()[1]) {
              y = _this.v.domain()[1];
              results.push((function() {
                var q, results1;
                results1 = [];
                for (q = column.length - 1; q >= 0; q += -1) {
                  node = column[q];
                  dy = node.y + node.value - y;
                  if (dy > 0) {
                    node.y -= dy;
                  } else {
                    break;
                  }
                  results1.push(y = node.y - column.padding);
                }
                return results1;
              })());
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
      })(this);
      layout_links = (function(_this) {
        return function() {
          var column_padding, len3, link, link_key, link_source, link_target, node_link, o, results, trailing_padding, trailing_y, y;
          link_key = _this.link_key;
          link_source = _this.link_source;
          link_target = _this.link_target;
          results = [];
          for (o = 0, len3 = columns.length; o < len3; o++) {
            column = columns[o];
            column_padding = column.length > 1 ? column.padding : column.length === 1 ? _this.v.domain()[1] - column[0].value : 0;
            results.push((function() {
              var len4, len5, p, q, ref, results1;
              results1 = [];
              for (p = 0, len4 = column.length; p < len4; p++) {
                node = column[p];
                c3.array.sort_up(node.source_links, (function(_this) {
                  return function(link) {
                    return _this.nodes[link_source(link)].y;
                  };
                })(this));
                trailing_y = node.y - column_padding / 2;
                trailing_padding = column_padding / (node.source_links.length - 1);
                y = node.y;
                ref = node.source_links;
                for (q = 0, len5 = ref.length; q < len5; q++) {
                  link = ref[q];
                  node_link = node_links[link_key(link)];
                  node_link.ty = y;
                  y += node_link.value;
                  node_link.tx = node.x;
                  if (!(link_source(link) in this.current_nodes)) {
                    node_link.sx = node.x - 0.5;
                    node_link.sy = trailing_y;
                    if (this.v(node_link.value) > this.h(0.25)) {
                      node_link.sx -= this.h.invert(this.v(node_link.value));
                    }
                    if (this.v(node_link.sy).toFixed(3) === this.v(node_link.ty).toFixed(3)) {
                      node_link.sy += this.v.invert(1);
                    }
                  }
                  trailing_y += node_link.value + trailing_padding;
                }
                c3.array.sort_up(node.target_links, (function(_this) {
                  return function(link) {
                    return _this.nodes[link_target(link)].y;
                  };
                })(this));
                y = node.y;
                trailing_y = node.y - column_padding / 2;
                trailing_padding = column_padding / (node.target_links.length - 1);
                results1.push((function() {
                  var len6, ref1, results2, s;
                  ref1 = node.target_links;
                  results2 = [];
                  for (s = 0, len6 = ref1.length; s < len6; s++) {
                    link = ref1[s];
                    node_link = node_links[link_key(link)];
                    node_link.sy = y;
                    y += node_link.value;
                    node_link.sx = node.x;
                    if (!(link_target(link) in this.current_nodes)) {
                      node_link.tx = node.x + 0.5;
                      node_link.ty = trailing_y;
                      if (this.v(node_link.value) > this.h(0.25)) {
                        node_link.tx += this.h.invert(this.v(node_link.value));
                      }
                      if (this.v(node_link.sy).toFixed(3) === this.v(node_link.ty).toFixed(3)) {
                        node_link.ty += this.v.invert(1);
                      }
                    }
                    results2.push(trailing_y += node_link.value + trailing_padding);
                  }
                  return results2;
                }).call(this));
              }
              return results1;
            }).call(_this));
          }
          return results;
        };
      })(this);
      y = 0;
      if (columns.length) {
        c3.array.sort_up(columns[0], function(node) {
          return node.value;
        });
        tmp = columns[0].slice(0);
        ref = d3.merge([
          (function() {
            var p, ref, results;
            results = [];
            for (i = p = ref = columns[0].length - 1; p >= 0; i = p += -2) {
              results.push(i);
            }
            return results;
          })(), (function() {
            var p, ref, ref1, results;
            results = [];
            for (i = p = ref = columns[0].length % 2, ref1 = columns[0].length - 1; p <= ref1; i = p += 2) {
              results.push(i);
            }
            return results;
          })()
        ]);
        for (i = o = 0, len3 = ref.length; o < len3; i = ++o) {
          r = ref[i];
          columns[0][i] = tmp[r];
        }
        ref1 = columns[0];
        for (p = 0, len4 = ref1.length; p < len4; p++) {
          node = ref1[p];
          node.y = y;
          y += node.value + columns[0].padding;
        }
      }
      for (j = q = 0, len5 = columns.length; q < len5; j = ++q) {
        column = columns[j];
        if (j) {
          for (s = 0, len6 = column.length; s < len6; s++) {
            node = column[s];
            weighted_y = 0;
            source_link_value = 0;
            total_weighted_y = 0;
            total_source_link_value = 0;
            ref2 = node.source_links;
            for (t = 0, len7 = ref2.length; t < len7; t++) {
              link = ref2[t];
              node_link = this.node_links[this.link_key(link)];
              source_node = this.current_nodes[this.link_source(link)];
              if (source_node == null) {
                continue;
              }
              total_weighted_y += source_node.y * node_link.value;
              total_source_link_value += node_link.value;
              if (source_node.x >= node.x) {
                continue;
              }
              weighted_y += source_node.y * node_link.value;
              source_link_value += node_link.value;
            }
            if (source_link_value) {
              node.y = weighted_y / source_link_value;
            } else if (total_source_link_value) {
              node.y = total_weighted_y / total_source_link_value;
            } else {
              target_link_value = 0;
              ref3 = node.target_links;
              for (u = 0, len8 = ref3.length; u < len8; u++) {
                link = ref3[u];
                node_link = this.node_links[this.link_key(link)];
                target_node = this.current_nodes[this.link_target(link)];
                if (target_node == null) {
                  continue;
                }
                weighted_y += target_node.y * node_link.value;
                target_link_value += node_link.value;
              }
              if (!target_link_value) {
                throw "assertion error: Orphan node";
              }
              node.y = weighted_y / target_link_value;
            }
          }
        }
      }
      collision_detection();
      layout_links();
      alpha = 1;
      for (iteration = v = 0, ref4 = this.iterations; 0 <= ref4 ? v < ref4 : v > ref4; iteration = 0 <= ref4 ? ++v : --v) {
        alpha *= this.alpha;
        for (w = 0, len9 = columns.length; w < len9; w++) {
          column = columns[w];
          for (z = 0, len10 = column.length; z < len10; z++) {
            node = column[z];
            delta = 0;
            ref5 = node.source_links;
            for (i1 = 0, len11 = ref5.length; i1 < len11; i1++) {
              link = ref5[i1];
              node_link = this.node_links[this.link_key(link)];
              if (node_link.tx > node_link.sx) {
                delta += (node_link.sy - node_link.ty) * node_link.value;
              }
            }
            ref6 = node.target_links;
            for (j1 = 0, len12 = ref6.length; j1 < len12; j1++) {
              link = ref6[j1];
              node_link = this.node_links[this.link_key(link)];
              if (node_link.tx > node_link.sx) {
                delta += (node_link.ty - node_link.sy) * node_link.value;
              }
            }
            delta /= node.links_sum;
            node.y += delta * alpha;
          }
        }
        collision_detection();
        layout_links();
      }
      this.links_layer = this.content.select('g.links').singleton().options(this.links_options).update();
      this.link_g = this.links_layer.select('g.link').options(this.link_options).animate(origin !== 'render').bind(current_links, this.link_key).update();
      this.paths = this.link_g.inherit('path').options(this.path_options).update();
      this.link_g.all.classed('backedge', (function(_this) {
        return function(link) {
          return _this.node_links[_this.link_key(link)].backedge;
        };
      })(this));
      this.nodes_layer = this.content.select('g.nodes').singleton().options(this.nodes_options).update();
      this.node_g = this.nodes_layer.select('g.node').options(this.node_options).animate(origin !== 'render').bind(this.current_data, this.key).update();
      this.rects = this.node_g.inherit('rect').options(this.rect_options).update();
      if (this.node_label_options != null) {
        this.node_labels_clip = this.node_g.inherit('svg.label', 'restore');
        return this.node_labels = this.node_labels_clip.inherit('text', 'restore').options(this.node_label_options).update();
      } else {
        if ((ref7 = this.node_labels_clip) != null) {
          ref7.all.remove();
        }
        delete this.node_labels;
        return delete this.node_labels_clip;
      }
    };

    Sankey.prototype._draw = function(origin) {
      var base, node_percent, node_width;
      if (!isNaN(this.node_width)) {
        node_width = this.node_width;
        if (this.overflow_width_ratio) {
          if ((node_width * (this.h.domain()[1] + 1) / this.width) > this.overflow_width_ratio) {
            this.h.domain([0, (this.overflow_width_ratio * this.width / node_width) - 1]);
          }
        }
      } else if ((typeof (base = this.node_width).charAt === "function" ? base.charAt(this.node_width.length - 1) : void 0) === '%') {
        node_percent = this.node_width.slice(0, -1) / 100;
        node_width = (node_percent * this.width) / (this.columns.length + node_percent - 1);
      } else {
        throw new Error("Unsupported node_width parameter: " + this.node_width);
      }
      this.h.rangeRound([0, this.width - node_width]);
      this.node_g.animate(origin !== 'render' && origin !== 'resize').position({
        transform: (function(_this) {
          return function(d) {
            var key;
            return 'translate(' + _this.h(_this.nodes[key = _this.key(d)].x) + ',' + _this.v(_this.nodes[key].y) + ')';
          };
        })(this)
      });
      this.rects.animate(origin !== 'render' && origin !== 'resize').position({
        width: node_width,
        height: (function(_this) {
          return function(d) {
            return Math.max(1, _this.v(_this.nodes[_this.key(d)].value));
          };
        })(this)
      });
      this.paths.animate(origin !== 'render' && origin !== 'resize').position({
        d: (function(_this) {
          return function(link) {
            var curvature, node_link, sx, sy, tx, ty, x_interpolator;
            node_link = _this.node_links[_this.link_key(link)];
            sx = _this.h(node_link.sx) + node_width;
            tx = _this.h(node_link.tx);
            switch (_this.link_path) {
              case 'straight':
                sy = _this.v(node_link.sy);
                ty = _this.v(node_link.ty);
                return 'M' + sx + ',' + sy + 'L' + tx + ',' + ty + 'l0,' + _this.v(node_link.value) + 'L' + sx + ',' + (sy + _this.v(node_link.value)) + 'Z';
              case 'curve':
                curvature = tx > sx ? _this.link_path_curvature : -_this.link_path_curvature * 4;
                sy = _this.v(node_link.sy + node_link.value / 2);
                ty = _this.v(node_link.ty + node_link.value / 2);
                x_interpolator = d3.interpolateRound(sx, tx);
                return 'M' + sx + ',' + sy + 'C' + x_interpolator(curvature) + ',' + sy + ' ' + x_interpolator(1 - curvature) + ',' + ty + ' ' + tx + ',' + ty;
              default:
                throw Error("Unknown link_path option: " + _this.link_path);
            }
          };
        })(this),
        'stroke-width': this.link_path === 'curve' ? (function(_this) {
          return function(link) {
            return Math.max(1, _this.v(_this.node_links[_this.link_key(link)].value));
          };
        })(this) : void 0
      });
      this.links_layer.all.attr('class', 'links ' + this.link_path);
      if (this.node_labels != null) {
        if (this.node_label_options.orientation !== 'vertical') {
          this.node_labels.animate(origin !== 'render' && origin !== 'resize').position({
            y: (function(_this) {
              return function(d) {
                return _this.v(_this.nodes[_this.key(d)].value) / 2;
              };
            })(this),
            x: (function(_this) {
              return function(d) {
                if (_this.nodes[_this.key(d)].x > _this.h.domain()[1] / 2) {
                  return node_width;
                } else {
                  return 0;
                }
              };
            })(this),
            dx: (function(_this) {
              return function(d) {
                if (_this.nodes[_this.key(d)].x > _this.h.domain()[1] / 2) {
                  return '-0.25em';
                } else {
                  return '0.25em';
                }
              };
            })(this),
            dy: '0.4em'
          });
          this.nodes_layer.all.classed({
            'horizontal_labels': true,
            'vertical_labels': false
          });
          return this.node_labels.all.style({
            'text-anchor': (function(_this) {
              return function(d) {
                if (_this.nodes[_this.key(d)].x > _this.h.domain()[1] / 2) {
                  return 'end';
                } else {
                  return 'start';
                }
              };
            })(this)
          });
        } else {
          this.node_labels.animate(origin !== 'render' && origin !== 'resize').position({
            y: node_width / 2,
            x: (function(_this) {
              return function(d) {
                return -_this.v(_this.nodes[_this.key(d)].value);
              };
            })(this),
            dx: '0.25em',
            dy: '0.4em'
          });
          this.nodes_layer.all.classed({
            'horizontal_labels': false,
            'vertical_labels': true
          });
          return this.node_labels.all.style({
            'text-anchor': 'start'
          });
        }
      }
    };

    Sankey.prototype._style = function(style_new) {
      var ref, ref1;
      this.node_g.options(this.node_options);
      this.rects.options(this.rect_options);
      if ((ref = this.node_labels) != null) {
        ref.options(this.node_label_options);
      }
      this.link_g.options(this.link_options);
      this.paths.options(this.path_options);
      this.nodes_layer.style();
      this.node_g.style(style_new);
      this.rects.style(style_new);
      if ((ref1 = this.node_labels) != null) {
        ref1.style(style_new);
      }
      this.links_layer.style();
      this.link_g.style(style_new);
      return this.paths.style(style_new);
    };

    return Sankey;

  })(c3.Graph);

  c3.Sankey.Butterfly = (function(superClass) {
    extend(Butterfly, superClass);

    function Butterfly() {
      this.focus = bind(this.focus, this);
      this._style = bind(this._style, this);
      this._butterfly_layout = bind(this._butterfly_layout, this);
      this._butterfly_update = bind(this._butterfly_update, this);
      this._update = bind(this._update, this);
      this._init = bind(this._init, this);
      return Butterfly.__super__.constructor.apply(this, arguments);
    }

    Butterfly.version = 0.1;

    Butterfly.prototype.type = 'butterfly';

    Butterfly.prototype.navigatable = true;

    Butterfly.prototype.depth_of_field = 2;

    Butterfly.prototype._init = function() {
      Butterfly.__super__._init.apply(this, arguments);
      return this.background["new"].on('click', (function(_this) {
        return function() {
          return _this.focus(null);
        };
      })(this));
    };

    Butterfly.prototype._update = function(origin) {
      var ref;
      if (ref = this.focal, indexOf.call(this.data, ref) < 0) {
        this.focal = null;
      }
      if (origin !== 'focus' || (this.focal == null)) {
        Butterfly.__super__._update.apply(this, arguments);
        this._butterfly_update();
        this._style(true);
      }
      if (this.focal != null) {
        this._butterfly_layout();
        this._butterfly_update();
        return this._style(true);
      }
    };

    Butterfly.prototype._butterfly_update = function() {
      if (this.navigatable) {
        this.rects["new"].on('click', (function(_this) {
          return function(datum) {
            d3.event.stopPropagation;
            return _this.focus(datum);
          };
        })(this));
      }
      return this.paths.all.classed({
        fade_left: (function(_this) {
          return function(link) {
            return !(_this.link_source(link) in _this.current_nodes);
          };
        })(this),
        fade_right: (function(_this) {
          return function(link) {
            return !(_this.link_target(link) in _this.current_nodes);
          };
        })(this)
      });
    };

    Butterfly.prototype._butterfly_layout = function() {
      var current_links, datum, focus_key, focus_node, nodes, walk;
      focus_key = this.key(this.focal);
      focus_node = this.nodes[focus_key];
      nodes = {};
      current_links = [];
      walk = (function(_this) {
        return function(key, direction, depth) {
          var k, len, len1, len2, link, links, m, n, node, ref, ref1, results;
          if (nodes[key]) {
            return;
          }
          node = _this.nodes[key];
          if (node == null) {
            return;
          }
          nodes[key] = node;
          node.x = _this.depth_of_field + (depth * direction);
          ref = [node.source_links, node.target_links];
          for (k = 0, len = ref.length; k < len; k++) {
            links = ref[k];
            for (m = 0, len1 = links.length; m < len1; m++) {
              link = links[m];
              current_links.push(link);
            }
          }
          if (depth < _this.depth_of_field) {
            ref1 = (direction === 1 ? node.target_links : node.source_links);
            results = [];
            for (n = 0, len2 = ref1.length; n < len2; n++) {
              link = ref1[n];
              results.push(walk((direction === 1 ? _this.link_target : _this.link_source)(link), direction, depth + 1));
            }
            return results;
          }
        };
      })(this);
      walk(focus_key, 1, 0);
      delete nodes[focus_key];
      walk(focus_key, -1, 0);
      this.current_data = (function() {
        var k, len, ref, results;
        ref = this.data;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          datum = ref[k];
          if (this.key(datum) in nodes) {
            results.push(datum);
          }
        }
        return results;
      }).call(this);
      this.h.domain([-0.5, this.depth_of_field * 2 + 0.5]);
      return this._layout('focus', this.current_data, current_links, nodes);
    };

    Butterfly.prototype._style = function(style_new) {
      Butterfly.__super__._style.apply(this, arguments);
      this.content.all.classed('navigatable', this.navigatable);
      return this.node_g.all.classed('focal', (function(_this) {
        return function(datum) {
          return datum === _this.focal;
        };
      })(this));
    };

    Butterfly.prototype.focus = function(focal) {
      this.focal = focal;
      this.trigger('focus', this.focal);
      this._update('focus');
      this._draw('focus');
      this.trigger('focusend', this.focal);
      return this;
    };

    return Butterfly;

  })(c3.Sankey);

  c3.Butterfly = c3.Sankey.Butterfly;

}).call(this);

//# sourceMappingURL=c3-graph.js.map
