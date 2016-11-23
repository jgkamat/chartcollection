// Generated by CoffeeScript 1.11.1
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  c3.Table = (function(superClass) {
    var last_found, last_search;

    extend(Table, superClass);

    Table.version = 0.1;

    Table.prototype.type = 'table';

    Table.prototype.data = [];

    Table.prototype.key = void 0;

    Table.prototype.filter = void 0;

    Table.prototype.columns = [];

    Table.prototype.selectable = false;

    Table.prototype.sortable = false;

    Table.prototype.sort_column = void 0;

    Table.prototype.limit_rows = void 0;

    Table.prototype.pagination = false;

    Table.prototype.page = void 0;

    Table.prototype.max_pages_in_paginator = 9;

    Table.prototype.searchable = false;

    Table.prototype.searchable_if_not_paginated = true;

    Table.prototype.table_options = void 0;

    Table.prototype.table_header_options = void 0;

    Table.prototype.header_options = void 0;

    Table.prototype.footer_options = void 0;

    Table.prototype.table_body_options = void 0;

    Table.prototype.row_options = void 0;

    Table.prototype.cell_options = void 0;

    Table.prototype.vis_options = void 0;

    function Table() {
      this.find = bind(this.find, this);
      this.search = bind(this.search, this);
      this.select = bind(this.select, this);
      this.highlight = bind(this.highlight, this);
      this.sort = bind(this.sort, this);
      this._style = bind(this._style, this);
      this._update = bind(this._update, this);
      this._update_headers = bind(this._update_headers, this);
      this._init = bind(this._init, this);
      Table.__super__.constructor.apply(this, arguments);
      this.selections = [];
    }

    Table.prototype._init = function() {
      var base, base1, base2, base3, column, k, len, ref, ref1, ref2;
      this.table = c3.select(d3.select(this.anchor), 'table').singleton();
      if (this.table_options == null) {
        this.table_options = {};
      }
      if ((base = this.table_options).styles == null) {
        base.styles = {};
      }
      if ((base1 = this.table_options.styles).width == null) {
        base1.width = '100%';
      }
      this.table.options(this.table_options).update();
      this.header = this.table.inherit('thead').inherit('tr');
      this.header.options(this.table_header_options).update();
      this.body = this.table.inherit('tbody');
      this.body.options(this.table_body_options).update();
      if (this.next_column_key == null) {
        this.next_column_key = 0;
      }
      ref = this.columns;
      for (k = 0, len = ref.length; k < len; k++) {
        column = ref[k];
        if (column.key == null) {
          column.key = this.next_column_key++;
        }
        if (column.header == null) {
          column.header = {};
        }
        if ((base2 = column.header).text == null) {
          base2.text = "";
        }
        if (column.cells == null) {
          column.cells = {};
        }
        if ((base3 = column.cells).text == null) {
          base3.text = "";
        }
        if (column.sortable == null) {
          column.sortable = column.sort != null;
        }
        if (column.value == null) {
          column.value = column.sort;
        }
        if (column.sort == null) {
          column.sort = column.value;
        }
        if (column.sortable && (column.sort == null)) {
          throw "column.sort() or column.value() not defined for a sortable column";
        }
        if (column.vis && (column.value == null)) {
          throw "column.value() not defined for a column with a column.vis visualization";
        }
      }
      if ((this.sort_column != null) && typeof this.sort_column === 'string') {
        this.sort_column = this.columns.find((function(_this) {
          return function(column) {
            var ref1, ref2;
            return _this.sort_column === (column != null ? (ref1 = column.header) != null ? ref1.text : void 0 : void 0) || _this.sort_column === (column != null ? (ref2 = column.header) != null ? ref2.html : void 0 : void 0);
          };
        })(this));
      }
      if (this.searchable && !((ref1 = this.handlers) != null ? ref1.found : void 0) && !((ref2 = this.handlers) != null ? ref2.match : void 0)) {
        this.on('found', (function(_this) {
          return function(str, data, i) {
            return _this.select([data]);
          };
        })(this));
      }
      return this._update_headers();
    };

    Table.prototype._update_headers = function() {
      var self;
      self = this;
      this.headers = this.header.select('th').bind(this.columns, function(column) {
        return column.key;
      }).options(this.header_options, (function(column) {
        return column.header;
      })).update();
      this.headers["new"].on('click.sort', (function(_this) {
        return function(column) {
          if (_this.sortable && column.sortable) {
            return _this.sort(column);
          }
        };
      })(this));
      if (this.sortable) {
        return this.headers.all.each(function(column) {
          var title;
          if (column === self.sort_column) {
            title = d3.select(this);
            return title.html(title.html() + ("<span class='arrow' style='float:right'>" + (column.sort_ascending ? '▲' : '▼') + "</span>"));
          }
        });
      }
    };

    Table.prototype._update = function(origin) {
      var cell_contents, column, d, data, datum, i, k, l, left_pages, len, len1, m, next_button, num_pages, page_buttons, pages, paginate, paginator, prev_button, ref, ref1, ref2, ref3, ref4, ref5, results, right_pages, rows_limited, search_control, search_input, searchable, self;
      self = this;
      ref = this.columns;
      for (k = 0, len = ref.length; k < len; k++) {
        column = ref[k];
        if (!column.vis) {
          continue;
        }
        column.value_total = (ref1 = (ref2 = typeof column.total_value === "function" ? column.total_value() : void 0) != null ? ref2 : column.total_value) != null ? ref1 : void 0;
        if (column.value_total == null) {
          column.value_total = 0;
          ref3 = this.data;
          for (l = 0, len1 = ref3.length; l < len1; l++) {
            datum = ref3[l];
            column.value_total += column.value(datum);
          }
        }
      }
      this.current_data = this.filter != null ? (function() {
        var len2, m, ref4, results;
        ref4 = this.data;
        results = [];
        for (i = m = 0, len2 = ref4.length; m < len2; i = ++m) {
          d = ref4[i];
          if (this.filter(d, i)) {
            results.push(d);
          }
        }
        return results;
      }).call(this) : this.data;
      if (this.sort_column != null) {
        if (this.filter == null) {
          this.current_data = this.current_data.slice(0);
        }
        c3.array.sort_up(this.current_data, this.sort_column.sort);
        if (!this.sort_column.sort_ascending) {
          this.current_data.reverse();
        }
      }
      data = (function() {
        var ref4;
        if (!this.limit_rows) {
          return this.current_data;
        } else {
          this.limit_rows = Math.floor(this.limit_rows);
          if (isNaN(this.limit_rows)) {
            throw Error("limit_rows set to non-numeric value: " + this.limit_rows);
          }
          this.page = Math.max(1, Math.min(Math.ceil(this.current_data.length / this.limit_rows), (ref4 = this.page) != null ? ref4 : 1));
          return this.current_data.slice(this.limit_rows * (this.page - 1), +((this.limit_rows * this.page) - 1) + 1 || 9e9);
        }
      }).call(this);
      this.rows = this.body.select('tr').bind(data, this.key);
      this.rows.options(this.row_options).update();
      if (this.key != null) {
        this.rows.all.order();
      }
      this.cells = this.rows.select('td').bind(((function(_this) {
        return function(d) {
          var len2, m, ref4, results;
          ref4 = _this.columns;
          results = [];
          for (m = 0, len2 = ref4.length; m < len2; m++) {
            column = ref4[m];
            results.push(d);
          }
          return results;
        };
      })(this)), (function(_this) {
        return function(d, i) {
          return _this.columns[i].key;
        };
      })(this));
      if (!this.columns.some(function(column) {
        return column.vis != null;
      })) {
        cell_contents = this.cells;
      } else {
        this.vis = this.cells.inherit('div.vis');
        this.vis.options(this.vis_options, ((function(_this) {
          return function(d, i) {
            return _this.columns[i].vis_options;
          };
        })(this))).update();
        cell_contents = this.vis.inherit('span');
        this.vis.all.each(function(d, i) {
          column = self.columns[i % self.columns.length];
          switch (column.vis) {
            case 'bar':
              return d3.select(this).classed('bar', true).style('width', column.value(d) / column.value_total * 100 + '%');
          }
        });
      }
      cell_contents.options(this.cell_options, ((function(_this) {
        return function(d, i) {
          return _this.columns[i].cells;
        };
      })(this))).update();
      this.cells.options(this.cell_options, ((function(_this) {
        return function(d, i) {
          return _this.columns[i].cells;
        };
      })(this)));
      if (this.selectable) {
        (origin === 'render' ? this.rows.all : this.rows["new"]).on('click.select', (function(_this) {
          return function(item) {
            return _this.select(c3.Table.set_select(_this.selections, item, _this.selectable === 'multi' || (_this.selectable === true && d3.event.ctrlKey)));
          };
        })(this));
        this.highlight();
      } else if (origin === 'render') {
        this.rows.all.on('click.select', null);
      }
      this.footer = this.table.select('caption');
      rows_limited = !!this.limit_rows && this.current_data.length > this.limit_rows;
      paginate = this.pagination && rows_limited;
      searchable = this.searchable && (this.searchable_if_not_paginated || rows_limited);
      if (searchable || paginate) {
        this.footer.singleton().options(this.footer_options).update();
        paginator = this.footer.select('span.pagination', ':first-child');
        if (paginate) {
          paginator.singleton();
          num_pages = Math.ceil(this.current_data.length / this.limit_rows);
          this.max_pages_in_paginator = Math.floor(Math.max(this.max_pages_in_paginator, 3));
          left_pages = Math.ceil((this.max_pages_in_paginator - 3) / 2);
          right_pages = Math.floor((this.max_pages_in_paginator - 3) / 2);
          prev_button = paginator.select('span.prev.button').singleton();
          prev_button["new"].text('◀').on('click', (function(_this) {
            return function() {
              _this.page--;
              return _this.redraw();
            };
          })(this));
          prev_button.all.classed('disabled', this.page <= 1);
          pages = [1].concat(slice.call((num_pages > 2 ? (function() {
              results = [];
              for (var m = ref4 = Math.max(2, Math.min(this.page - left_pages, num_pages - 1 - left_pages - right_pages)), ref5 = Math.min(num_pages - 1, Math.max(this.page + right_pages, 2 + left_pages + right_pages)); ref4 <= ref5 ? m <= ref5 : m >= ref5; ref4 <= ref5 ? m++ : m--){ results.push(m); }
              return results;
            }).apply(this) : [])), [num_pages]);
          if (pages[1] - pages[0] > 1) {
            pages.splice(1, 0, '…');
          }
          if (pages[pages.length - 1] - pages[pages.length - 2] > 1) {
            pages.splice(pages.length - 1, 0, '…');
          }
          page_buttons = paginator.select('ul').singleton().select('li').bind(pages);
          page_buttons["new"].on('click', (function(_this) {
            return function(p) {
              _this.page = p;
              return _this.redraw();
            };
          })(this));
          page_buttons.all.classed('active', (function(_this) {
            return function(p) {
              return p === _this.page;
            };
          })(this)).classed('disabled', (function(_this) {
            return function(p) {
              return p === '…';
            };
          })(this)).text(function(p, i) {
            return p;
          });
          next_button = paginator.select('span.next.button').singleton();
          next_button["new"].text('▶').on('click', (function(_this) {
            return function() {
              _this.page++;
              return _this.redraw();
            };
          })(this));
          next_button.all.classed('disabled', this.page >= this.current_data.length / this.limit_rows);
        } else {
          paginator.remove();
        }
        search_control = this.footer.select('span.search');
        if (searchable) {
          search_control.singleton();
          search_control.inherit('span.button')["new"].text('🔎').on('click', (function(_this) {
            return function() {
              search_input.node().classList.remove('notfound');
              if (!_this.find(search_input.node().value)) {
                return search_input.node().classList.add('notfound');
              }
            };
          })(this));
          return search_input = search_control.inherit('input')["new"].attr('type', 'text').on('keydown', function() {
            this.classList.remove('notfound');
            if (this.value && d3.event.keyCode === 13) {
              return search_control.select('.button').node().click();
            }
          });
        } else {
          return search_control.remove();
        }
      } else {
        return this.footer.remove();
      }
    };

    Table.prototype._style = function(style_new) {
      var k, klass, len, ref, ref1, self, sort_column_i;
      self = this;
      this.table.style().all.classed({
        'c3': true,
        'table': true,
        'sortable': this.sortable,
        'selectable': this.selectable,
        'sorted': this.sort_column != null,
        'single_select': this.selectable === 'single',
        'multi_select': this.selectable === 'multi',
        'paginated': this.pagination && this.limit_rows && this.current_data.length > this.limit_rows,
        'searchable': !!this.searchable
      });
      if (this["class"] != null) {
        ref = this["class"].split(' ');
        for (k = 0, len = ref.length; k < len; k++) {
          klass = ref[k];
          this.table.all.classed(klass, true);
        }
      }
      this.header.style();
      this.headers.style(style_new).all.classed({
        'sortable': !this.sortable ? false : function(column) {
          return column.sort != null;
        },
        'sorted': (function(_this) {
          return function(d) {
            return d === _this.sort_column;
          };
        })(this)
      });
      this.body.style();
      this.rows.style(style_new);
      sort_column_i = this.columns.indexOf(this.sort_column);
      this.cells.style(style_new && (this.key != null)).all.classed({
        'sorted': function(d, i) {
          return i === sort_column_i;
        }
      });
      return (ref1 = this.vis) != null ? ref1.style(style_new && (this.key != null)) : void 0;
    };

    Table.prototype.sort = function(column, ascending) {
      if (column.sort) {
        if (ascending != null) {
          column.sort_ascending = ascending;
        } else if (this.sort_column === column) {
          column.sort_ascending = !column.sort_ascending;
        }
        this.sort_column = column;
        this._update_headers();
        return this.redraw('sort');
      }
    };

    Table.prototype.highlight = function(selections) {
      this.selections = selections != null ? selections : this.selections;
      this.rows.all.classed('selected', !this.selections.length ? false : (function(_this) {
        return function(d) {
          return indexOf.call(_this.selections, d) >= 0;
        };
      })(this));
      return this.rows.all.classed('deselected', !this.selections.length ? false : (function(_this) {
        return function(d) {
          return !(indexOf.call(_this.selections, d) >= 0);
        };
      })(this));
    };

    Table.prototype.select = function(selections) {
      this.selections = selections != null ? selections : this.selections;
      this.highlight();
      return this.trigger('select', this.selections);
    };

    last_search = "";

    last_found = -1;

    Table.prototype.search = function(value) {
      var column, column_contents, content, d, i, k, len, new_page, re, ref;
      if (!value) {
        return;
      }
      re = RegExp(value, 'i');
      if (value !== last_search) {
        last_found = -1;
        last_search = value;
      }
      content = typeof this.searchable === 'function' ? this.searchable : (column_contents = (function() {
        var k, len, ref, ref1, ref2, ref3, results;
        ref = this.columns;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          column = ref[k];
          results.push(c3.functor((ref1 = (ref2 = (ref3 = column.cells.html) != null ? ref3 : column.cells.text) != null ? ref2 : this.cell_options.html) != null ? ref1 : this.cell_options.text));
        }
        return results;
      }).call(this), function(d, i) {
        var column_content, j;
        return ((function() {
          var k, len, results;
          results = [];
          for (j = k = 0, len = column_contents.length; k < len; j = ++k) {
            column_content = column_contents[j];
            results.push(column_content(d, i, j));
          }
          return results;
        })()).join(' ');
      });
      ref = this.current_data;
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        d = ref[i];
        if (i > last_found) {
          if (re.test(content(d, i))) {
            last_found = i;
            new_page = Math.ceil((i + 1) / this.limit_rows);
            if (new_page !== this.page) {
              this.page = new_page;
              this.redraw();
            }
            return [d, i];
          }
        }
      }
      last_found = -1;
      return null;
    };

    Table.prototype.find = function(value) {
      var ret;
      ret = this.search(value);
      this.trigger.apply(this, ['found', value].concat(slice.call((ret != null ? ret : [null, null]))));
      this.trigger.apply(this, ['match', value].concat(slice.call((ret != null ? ret : [null, null]))));
      return ret;
    };

    Table.set_select = function(set, item, multi_select) {
      if (set == null) {
        return [item];
      } else if (multi_select) {
        if (indexOf.call(set, item) >= 0) {
          c3.array.remove_item(set, item);
        } else {
          set.push(item);
        }
      } else {
        switch (set.length) {
          case 0:
            set.push(item);
            break;
          case 1:
            if (indexOf.call(set, item) >= 0) {
              set.length = 0;
            } else {
              set.length = 0;
              set.push(item);
            }
            break;
          default:
            set.length = 0;
            set.push(item);
        }
      }
      return set;
    };

    return Table;

  })(c3.Base);

}).call(this);

//# sourceMappingURL=c3-table.js.map
