function asyncGeneratorStep(e, t, a, n, o, r, i) {
    try {
      var s = e[r](i),
        c = s.value;
    } catch (e) {
      return void a(e);
    }
    s.done ? t(c) : Promise.resolve(c).then(n, o);
  }
  function _asyncToGenerator(e) {
    return function () {
      var t = this,
        a = arguments;
      return new Promise(function (n, o) {
        var r = e.apply(t, a);
        function i(e) {
          asyncGeneratorStep(r, n, o, i, s, 'next', e);
        }
        function s(e) {
          asyncGeneratorStep(r, n, o, i, s, 'throw', e);
        }
        i(void 0);
      });
    };
  }
  function _typeof(e) {
    return (_typeof =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              'function' == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? 'symbol'
              : typeof e;
          })(e);
  }
  function _toConsumableArray(e) {
    return _arrayWithoutHoles(e) || _iterableToArray(e) || _nonIterableSpread();
  }
  function _nonIterableSpread() {
    throw new TypeError('Invalid attempt to spread non-iterable instance');
  }
  function _iterableToArray(e) {
    if (
      Symbol.iterator in Object(e) ||
      '[object Arguments]' === Object.prototype.toString.call(e)
    )
      return Array.from(e);
  }
  function _arrayWithoutHoles(e) {
    if (Array.isArray(e)) {
      for (var t = 0, a = new Array(e.length); t < e.length; t++) a[t] = e[t];
      return a;
    }
  }
  function _slicedToArray(e, t) {
    return (
      _arrayWithHoles(e) || _iterableToArrayLimit(e, t) || _nonIterableRest()
    );
  }
  function _nonIterableRest() {
    throw new TypeError('Invalid attempt to destructure non-iterable instance');
  }
  function _iterableToArrayLimit(e, t) {
    var a = [],
      n = !0,
      o = !1,
      r = void 0;
    try {
      for (
        var i, s = e[Symbol.iterator]();
        !(n = (i = s.next()).done) && (a.push(i.value), !t || a.length !== t);
        n = !0
      );
    } catch (e) {
      (o = !0), (r = e);
    } finally {
      try {
        n || null == s.return || s.return();
      } finally {
        if (o) throw r;
      }
    }
    return a;
  }
  function _arrayWithHoles(e) {
    if (Array.isArray(e)) return e;
  }
  window.onReadyToUse(function () {
    $man.body.$attr({
      'data-os': window.device.os,
      'data-browser': window.device.browser,
    });
    var e,
      t = function (e, t) {
        $man('.table-loading-status').$html(e),
          t && $man('.table-loading-logo').$classRemove('_animated');
      },
      a = (API.user && API.user.user_id) || -1,
      n = a,
      o =
        ((e = location.hash.substr(1)),
        Tools.querystring.parse(
          e.split('?')[e.indexOf('?') > -1 || '/' === e[0] ? 1 : 0],
        )),
      r = function (e) {
        return window.parsers.numberToSpacedString(Math.round(e), ',');
      },
      i = '.table-body-board-center-arbitr';
    t('Загрузка модулей...'),
      VueLoader.require([
        'TableAction',
        'TableActionInventory',
        'TableHelper',
        'TableFieldcard',
        'TableContract',
      ]).then(function (e) {
        var s = _slicedToArray(e, 5),
          c = s[0],
          d = s[1],
          l = s[2],
          u = s[3],
          p = s[4];
        t('Запуск кода...');
        var _ = Tools.requireVueLib('ls');
        window.Table = new (function () {
          var e = this,
            s = '1' === localStorage.TABLE_DEBUG;
          (e.debugOn = function () {
            (localStorage.TABLE_DEBUG = '1'), (s = !0);
          }),
            (e.debugOff = function () {
              (localStorage.TABLE_DEBUG = '0'), (s = !1);
            }),
            (e.benchmark = function (e) {
              if ('string' == typeof localStorage.tableBenchmark) {
                var t = localStorage.tableBenchmark.split('@').map(function (e) {
                  return parseFloat(e);
                });
                if (t[1] > Date.unix() - 604800) return void (e && e(t[0]));
              }
              var a = 0;
              !(function t() {
                var n =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : 1;
                s && console.log('start '.concat(n, '/').concat(5, '...')),
                  setTimeout(function () {
                    var o = Date.now(),
                      r = '_bench_'.concat(n);
                    window[r] = [];
                    for (var i = 0; i < 5e4; i++) window[r].push(Math.random());
                    delete window[r];
                    var c = Date.now() - o;
                    (a = (a * (n - 1) + c) / n),
                      5 === n
                        ? (s && console.log('completed: '.concat(a, ' ms')),
                          (localStorage.tableBenchmark = a + '@' + Date.unix()),
                          e && e(a))
                        : (s && console.log('ok.'),
                          setTimeout(function () {
                            t(n + 1);
                          }, 1));
                  }, 1);
              })();
            });
          var m = _slicedToArray(
              (function () {
                var t,
                  a,
                  n,
                  i = Vue.observable({}),
                  s = location.pathname.split('/'),
                  c = location.hash.substr(1).split('?'),
                  d = [s[1]];
                if (s.length >= 3 && '' !== s[2])
                  window.history.replaceState(
                    {},
                    document.title,
                    '/' + s[1] + '/',
                  ),
                    d.push(s[2], s[3]);
                else if (c.length > 1 || '/' === c[0][0]) {
                  var l = c[0].split('/');
                  d.push(l[1], l[2]);
                } else location.href = '/games';
                console.log('params_about', d);
                var u = d[0];
                (t = d[1]),
                  (a = d[2]),
                  (n = null !== u.match(/^m1tv(-v[0-9]+)?/));
                var p = !1,
                  _ = [],
                  m = new Vue({
                    name: 'storage',
                    data: {
                      config: null,
                      status: null,
                      status_future: null,
                      flags: null,
                      settings: null,
                      time: null,
                      is_action_processing: 0,
                      is_events_processing: !1,
                      player_move_owner_last: -1,
                      start_time: 0,
                      time_delta: 0,
                      url_hash_params: o,
                    },
                    computed: {
                      vms: function () {
                        return i;
                      },
                      api_user: function () {
                        return API.user;
                      },
                      api_status: function () {
                        return API.status;
                      },
                      about: function () {
                        return {
                          gs_id: t,
                          gs_game_id: a,
                          is_m1tv: n,
                          is_live_on_m1tv:
                            (this.api_status.m1tv_live || []).filter(function (
                              e,
                            ) {
                              return e.gs_id === t && e.gs_game_id === a;
                            }).length > 0,
                          is_m1cup:
                            !!this.flags &&
                            0 === this.flags.game_mode &&
                            (this.flags.match_title || '').indexOf('M1 Cup') > -1,
                        };
                      },
                      is_ready: function () {
                        return null !== this.config && null !== this.status;
                      },
                      action_cards: function () {
                        if (this.config)
                          return new Map(
                            this.config.action_cards.map(function (e) {
                              var t = _slicedToArray(e, 2),
                                a = t[0],
                                n = t[1],
                                o = void 0 === n ? {} : n;
                              return (
                                ((o = Tools.cloneJSON(o)).about = {}), [a, o]
                              );
                            }),
                          );
                      },
                      is_paused: function () {
                        return (
                          this.is_ready &&
                          void 0 !== this.status.pause_data &&
                          this.status.pause_data.is_active
                        );
                      },
                      action_types: function () {
                        return new Set(
                          this.is_ready ? this.status.action_type : [],
                        );
                      },
                      players: function () {
                        return new Map(
                          this.is_ready
                            ? this.status.players.map(function (e) {
                                return [e.user_id, e];
                              })
                            : [],
                        );
                      },
                      player_indexes: function () {
                        return new Map(
                          this.is_ready
                            ? this.status.players.map(function (e, t) {
                                return [e.user_id, t];
                              })
                            : [],
                        );
                      },
                      current_move: function () {
                        return this.is_ready ? this.status.current_move : {};
                      },
                      field_id_jail: function () {
                        if (this.is_ready) {
                          var e = !0,
                            t = !1,
                            a = void 0;
                          try {
                            for (
                              var n,
                                o = Tools.Array.getKeyValueIterator(
                                  this.config.fields,
                                )[Symbol.iterator]();
                              !(e = (n = o.next()).done);
                              e = !0
                            ) {
                              var r = _slicedToArray(n.value, 2),
                                i = r[0];
                              if ('jail' === r[1].type) return i;
                            }
                          } catch (e) {
                            (t = !0), (a = e);
                          } finally {
                            try {
                              e || null == o.return || o.return();
                            } finally {
                              if (t) throw a;
                            }
                          }
                        }
                        return 0;
                      },
                      game_mode_titles: function () {
                        return [null, 'Перетасовка', 'Квалификация'];
                      },
                      game_submode_titles: function () {
                        return [
                          'Обычная игра',
                          'Апокалипсис',
                          'Быстрая игра',
                          'Русская рулетка',
                          'Ретро',
                          'GAMEMODE5',
                        ];
                      },
                    },
                    watch: {
                      'status.player_ownerOfMove': function (e, t) {
                        e !== t && (this.player_move_owner_last = e);
                      },
                      url_hash_params: {
                        handler: function (e) {
                          var t =
                            '#/' + this.about.gs_id + '/' + this.about.gs_game_id;
                          Object.keys(e).length > 0 &&
                            (t += '?' + Tools.querystring.stringify(e)),
                            window.history.replaceState(
                              {},
                              document.title,
                              location.pathname + t.replace(/=(&|$)/g, '$1'),
                            ),
                            'stream' in e
                              ? $man.body.$classAdd('_stream')
                              : $man.body.$classRemove('_stream'),
                            window.tableResize();
                        },
                        immediate: !0,
                        deep: !0,
                      },
                    },
                    methods: {
                      moneyFormatter: function () {
                        for (
                          var e = arguments.length, t = new Array(e), a = 0;
                          a < e;
                          a++
                        )
                          t[a] = arguments[a];
                        return r(t);
                      },
                      update: function (e) {
                        var t =
                          arguments.length > 1 &&
                          void 0 !== arguments[1] &&
                          arguments[1];
                        null === this.config &&
                          void 0 !== e.config &&
                          ((this.config = e.config),
                          (this.flags = e.flags || {}),
                          (this.settings = e.settings || {}));
                        var a = void 0 === e.status;
                        a || (this.status_future = e.status);
                        var n = e.time || (e.status && e.status.time);
                        if (n)
                          (this.time = Tools.cloneJSON(n)),
                            (this.time.delta = Date.now() - this.time.ts_now),
                            (this.start_time = Math.floor(n.ts_start / 1e3)),
                            (this.time_delta = Math.floor(
                              (Date.now() - n.ts_now) / 1e3,
                            ));
                        else if ('current_time' in e) {
                          var o = {
                            ts_start: 1e3 * (e.ts_start || e.game_started),
                            ts_now: 1e3 * e.current_time,
                            inactive: 0,
                          };
                          if (!a) {
                            var r = e.status.pause_data;
                            r &&
                              ((o.inactive =
                                1e3 *
                                (r.total_time +
                                  (r.is_active
                                    ? this.time - r.pause_started_at
                                    : 0))),
                              r.is_active &&
                                (o.ts_inactive = 1e3 * r.pause_started_at));
                          }
                          (o.delta = Date.now() - o.ts_now),
                            (this.time = o),
                            (this.start_time = e.ts_start || e.game_started),
                            (this.time_delta = Date.unix() - e.current_time);
                        }
                        this.packetProcess({
                          msg: e,
                          no_events: t,
                          no_status: a,
                        });
                      },
                      packetProcess: function (t) {
                        var a = this;
                        !(
                          arguments.length > 1 &&
                          void 0 !== arguments[1] &&
                          arguments[1]
                        ) && p
                          ? (_.push(t),
                            'id' in t.msg &&
                              (_ = _.sort(function (e, t) {
                                if ('id' in e || 'id' in t)
                                  return (e.id || 0) > (t.id || 0) ? 1 : -1;
                              })))
                          : ((p = !0),
                            setTimeout(function () {
                              var n = t.msg,
                                o = t.no_events,
                                r = t.no_status;
                              r || (a.is_events_processing = !0),
                                e.UI.update(
                                  n,
                                  { no_events: o, no_status: r },
                                  function () {
                                    r ||
                                      ((a.is_events_processing = !1),
                                      (a.status = n.status)),
                                      _.length > 0
                                        ? a.packetProcess(_.shift(), !0)
                                        : (p = !1);
                                  },
                                );
                            }));
                      },
                      patchLive: function (e) {
                        var t = e.user_id,
                          a = e.money,
                          n = e.field;
                        switch (e.type) {
                          case 'startBypass':
                          case 'start_bonus':
                            this.patchLiveMoney(t, a);
                            break;
                          case 'buy':
                            this.patchLiveMoney(t, -a),
                              Vue.set(this.status.fields, n, {
                                owner: t,
                                level: 0,
                                mortgaged: !1,
                              });
                        }
                      },
                      patchLiveMoney: function (e, t) {
                        this.players.get(e).money += t;
                      },
                      patchLivePosition: function (e, t) {
                        this.players.get(e).position = t;
                      },
                      patchActionsRemove: function () {},
                      patchActionsRestore: function () {},
                      getFuturePosition: function (e) {
                        return this.status_future.players.filter(function (t) {
                          return t.user_id === e;
                        })[0].position;
                      },
                      getPlayerIndex: function (e) {
                        var t = this.player_indexes.get(e);
                        return void 0 === t ? -1 : t;
                      },
                    },
                  });
                return [
                  m,
                  function () {
                    var e =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : {},
                      t = e.name,
                      a = e.of,
                      n = void 0 === a ? Vue : a,
                      o = e.args;
                    if (t in i) throw new Error('VM already registered.');
                    (o.name = t), (o.parent = m);
                    var r = new n(o);
                    return Vue.set(i, t, r), r;
                  },
                ];
              })(),
              2,
            ),
            f = m[0],
            v = m[1];
          s && (e._vm_storage = f);
          var g = v({
            name: 'options',
            args: {
              computed: {
                sound_level: _.attach('tblOpts_soundLevel', Number, 100),
                msgs_from_spectators: _.attach('tblOpts_spectators', Boolean, !0),
                stream_mode: _.attach('tblOpts_streammode', Boolean, !1),
                old_colors: _.attach('tblOpts_colorsOld', Boolean, !1),
              },
              watch: {
                stream_mode: {
                  handler: function (e) {
                    e
                      ? Vue.set(f.url_hash_params, 'stream', '')
                      : Vue.delete(f.url_hash_params, 'stream');
                  },
                  immediate: !0,
                },
                old_colors: {
                  handler: function (e) {
                    e
                      ? $man.body.$attrRemove('mnpl-newcolors')
                      : $man.body.$attr('mnpl-newcolors', 1);
                  },
                  immediate: !0,
                },
              },
            },
          });
          'stream' in f.url_hash_params && (g.stream_mode = !0),
            ['config', 'status', 'flags', 'settings', 'about'].map(function (t) {
              Object.defineProperty(e, t, {
                get: function () {
                  return Tools.proxy.createImmutable(f[t]);
                },
              });
            });
          var b,
            h =
              ((b = {
                nom: [
                  'Автомобили',
                  'Парфюмерия',
                  'Одежда',
                  'Веб-сервисы',
                  'Напитки',
                  'Авиалинии',
                  'Рестораны',
                  'Отели',
                  'Электроника',
                  'Разработчики игр',
                ],
                gen: [
                  'Автомобилей',
                  'Парфюмерии',
                  'Одежды',
                  'Веб-сервисов',
                  'Напитков',
                  'Авиалиний',
                  'Ресторанов',
                  'Отелей',
                  'Электроники',
                  'Разработчиков игр',
                ],
                acc: [
                  0,
                  'Парфюмерию',
                  'Одежду',
                  0,
                  0,
                  0,
                  0,
                  0,
                  'Электронику',
                  'Разработчиков игр',
                ],
              }),
              function (e, t) {
                return (b[t] || b.nom)[e] || b.nom[e];
              }),
            y = new Map(),
            w = new Map(),
            k = new Map();
          window._replacements = { cards: y, generators: w, jokes: k };
          var T = {},
            S = v({
              name: 'time',
              args: {
                data: { ticker: 0 },
                computed: {
                  lib_time: function () {
                    return Tools.requireVueLib('time');
                  },
                  time: function () {
                    return (
                      this.lib_time.unix,
                      this.ticker,
                      this.$parent.is_ready
                        ? this.$parent.about.is_m1tv
                          ? e.M1TV.getCurrentIngameTs()
                          : Date.unix() - this.$parent.time_delta
                        : Date.unix()
                    );
                  },
                  time_ingame: function () {
                    if (this.$parent.is_ready) {
                      var e = this.$parent.time;
                      if (e)
                        return Math.floor(
                          ((e.ts_inactive || 1e3 * this.time) -
                            e.ts_start -
                            e.inactive) /
                            1e3,
                        );
                    }
                    return 0;
                  },
                  time_modificators: function () {
                    var e = null,
                      t = 0;
                    if (this.$parent.is_ready) {
                      var a = this.$parent.config,
                        n = !0,
                        o = !1,
                        r = void 0;
                      try {
                        for (
                          var i, s = a.roundTaxes[Symbol.iterator]();
                          !(n = (i = s.next()).done);
                          n = !0
                        ) {
                          var c = i.value;
                          this.time_ingame >= c.game_time && (e = c.tax);
                        }
                      } catch (e) {
                        (o = !0), (r = e);
                      } finally {
                        try {
                          n || null == s.return || s.return();
                        } finally {
                          if (o) throw r;
                        }
                      }
                      if (void 0 !== a.incomeTaxes) {
                        var d = !0,
                          l = !1,
                          u = void 0;
                        try {
                          for (
                            var p, _ = a.incomeTaxes[Symbol.iterator]();
                            !(d = (p = _.next()).done);
                            d = !0
                          ) {
                            var m = p.value;
                            this.time_ingame >= m.game_time && (t = m.tax_rate);
                          }
                        } catch (e) {
                          (l = !0), (u = e);
                        } finally {
                          try {
                            d || null == _.return || _.return();
                          } finally {
                            if (l) throw u;
                          }
                        }
                      }
                    }
                    return { start_bypass_fee: e, income_tax_rate: t };
                  },
                },
                methods: {
                  getTimeWithSpeed: function (t) {
                    return this.$parent.about.is_m1tv
                      ? e.M1TV.getTimeWithSpeed(t)
                      : t;
                  },
                },
              },
            });
          (e.getTime = function () {
            return S.time;
          }),
            (e.getGameTime = function () {
              return S.time_ingame;
            }),
            (e.getTimeWithSpeed = function (t) {
              return e.about.is_m1tv ? e.M1TV.getTimeWithSpeed(t) : t;
            }),
            (e.getTimeModificators = function () {
              return S.time_modificators;
            }),
            (e.setTimeout = function (t, a) {
              var n = e.getTimeWithSpeed(a);
              if (0 !== n) return setTimeout(t, n);
              t();
            });
          var x = (e.getEventsArray = function (e) {
              return Array.isArray(e)
                ? e
                : Object.keys(e).map(function (t) {
                    var a = Tools.cloneJSON(e[t]);
                    return (a._id = t), a;
                  });
            }),
            A = function (e) {
              return String(e)
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
            };
          e.UI = new (function () {
            var o = this;
            o.moneyFormatter = r;
            var _ = function (e) {
              var t = f.config.fields.length;
              return (e + t) % t;
            };
            v({
              name: 'legacysupport',
              args: {
                data: { is_table_inited: !1 },
                watch: {
                  '$parent.$data': {
                    handler: function () {
                      s && console.log('[Vue UI] vm_storage watcher triggered'),
                        null !== this.$parent.config &&
                          null !== this.$parent.status &&
                          (this.is_table_inited ||
                            (U(), (this.is_table_inited = !0)),
                          J());
                    },
                    deep: !0,
                  },
                  '$parent.is_paused': {
                    handler: function (e) {
                      e
                        ? ($man(''.concat(i, ' #arbitr-pause')).$hide(),
                          $man(
                            ''
                              .concat(i, ' #arbitr-unpause, ')
                              .concat(i, ' #arbitr-uncontract'),
                          ).$unhide())
                        : ($man(''.concat(i, ' #arbitr-pause')).$unhide(),
                          $man(
                            ''
                              .concat(i, ' #arbitr-unpause, ')
                              .concat(i, ' #arbitr-uncontract'),
                          ).$hide());
                    },
                    immediate: !0,
                  },
                  '$parent.player_move_owner_last': function (e) {
                    this.$parent.about.is_m1tv || e !== a || pe('nextmove');
                  },
                },
              },
            });
            var m = $man('#styles-dyn').$detach().$html(),
              b = $man('#styles-dyn-css'),
              C = function (e) {
                var t =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : 'px';
                (this.value = e), (this.unit = t);
              };
            C.prototype.toString = function () {
              return this.value + this.unit;
            };
            var I = ['field_width', 'field_height', 'label_height', 'corner_gap'],
              M = new Vue({
                el: '#vm-css',
                data: {
                  vars: {
                    field_width: new C(55),
                    field_height: new C(100),
                    field_padding: new C(1),
                    label_height: new C(22),
                    corner_gap: new C(0),
                    body_logo_coeff_w: 0.8,
                    body_logo_coeff_h: 0.7,
                    center_offset: new C(8),
                    table_size_x: 9,
                    table_size_y: 9,
                    game_submode: 0,
                    field_id_jail: 10,
                  },
                },
                computed: {
                  vm_storage: function () {
                    return f;
                  },
                  stylus: function () {
                    var e = [];
                    for (var t in this.vars)
                      e.push('$'.concat(t, ' = ').concat(this.vars[t]));
                    return e.join('\n') + '\n\n' + m;
                  },
                  svg: function () {
                    var e = this.vars,
                      t = e.field_height,
                      a = e.field_padding,
                      n = e.corner_gap,
                      o = t.value - 2 * a.value,
                      r = o + n.value;
                    return {
                      size: r,
                      path: [
                        'M'.concat(r, ' 0'),
                        'V'.concat(o),
                        'A'
                          .concat(n.value, ' ')
                          .concat(n.value, ' 0 0 0 ')
                          .concat(o, ' ')
                          .concat(r),
                        'H0',
                        'A'.concat(r, ' ').concat(r, ' 0 0 1 ').concat(r, ' 0'),
                        'Z',
                      ].join(''),
                    };
                  },
                },
                watch: {
                  'vm_storage.config': {
                    handler: function (e) {
                      null !== e &&
                        ((this.vars.game_submode = e.game_submode || 0),
                        5 === e.game_submode && this.minipoly());
                    },
                    deep: !0,
                  },
                  'vm_storage.config.size': {
                    handler: function (e) {
                      var t = _slicedToArray(e, 2),
                        a = t[0],
                        n = t[1];
                      (this.vars.table_size_x = a), (this.vars.table_size_y = n);
                    },
                    deep: !0,
                  },
                  'vm_storage.field_id_jail': {
                    handler: function (e) {
                      null !== e && (this.vars.field_id_jail = e);
                    },
                    immediate: !0,
                  },
                  stylus: {
                    handler: function (e) {
                      window.stylus.render(e, {}, function (e, t) {
                        e
                          ? console.error(e)
                          : (b.$text(t), setTimeout(window.tableResize));
                      });
                    },
                    immediate: !0,
                  },
                },
                methods: {
                  scale: function (e) {
                    for (var t = 0, a = I; t < a.length; t++) {
                      var n = a[t],
                        o = this.vars[n].value;
                      this.vars[n].value = Math.round(o * e);
                    }
                  },
                  minipoly: function () {
                    (this.vars.field_width.value = 58),
                      (this.vars.corner_gap.value = 35),
                      (this.vars.body_logo_coeff_h = 0.6),
                      (this.vars.body_logo_coeff_w = 0.75),
                      (this.vars.center_offset.value = 18),
                      this.scale(1.25),
                      setTimeout(function () {
                        G();
                      }, 310);
                  },
                },
              });
            s && (o._vm_css = M),
              (o.update = function (t, a, n) {
                if (
                  ('boolean' == typeof a && (a = { no_events: a }),
                  !0 === a.no_events)
                ) {
                  var o = !0,
                    r = !1,
                    i = void 0;
                  try {
                    for (
                      var s, c = e.status.players[Symbol.iterator]();
                      !(o = (s = c.next()).done);
                      o = !0
                    ) {
                      var d = s.value;
                      V(d.user_id, d.position, d.jailed, {
                        directly: !0,
                        no_animate: !0,
                      });
                    }
                  } catch (e) {
                    (r = !0), (i = e);
                  } finally {
                    try {
                      o || null == c.return || c.return();
                    } finally {
                      if (r) throw i;
                    }
                  }
                  n();
                } else
                  ne(t.events, { immediate: a.no_status }, function () {
                    n();
                  });
              });
            var j = API.createAsyncStorage({ is_short: !0 });
            new Vue({
              data: { storage: j.storage },
              watch: {
                storage: {
                  handler: function () {
                    H();
                    var e = !0,
                      t = !1,
                      a = void 0;
                    try {
                      for (
                        var n,
                          o = $man(
                            '.table-body-board-chat-message-user:not(._rendered)',
                          )[Symbol.iterator]();
                        !(e = (n = o.next()).done);
                        e = !0
                      ) {
                        var r = n.value,
                          i = parseInt(r.$attr('mnpl-userid'));
                        r.$addClass('_rendered').$text(
                          this.storage[i].nick.htmlToText(),
                        );
                      }
                    } catch (e) {
                      (t = !0), (a = e);
                    } finally {
                      try {
                        e || null == o.return || o.return();
                      } finally {
                        if (t) throw a;
                      }
                    }
                  },
                  deep: !0,
                },
              },
            });
            !(function e() {
              f.is_ready
                ? (j.reload.apply(j, _toConsumableArray(f.players.keys())),
                  setTimeout(e, 6e4))
                : setTimeout(e, 100);
            })(),
              s && (e._users_storage = j),
              Object.defineProperty(e, 'users_data', {
                get: function () {
                  return (
                    s &&
                      Tools.log.deprecatedMessageShow(
                        'Do not use "self.users_data". Use "users_storage.storage" instead.',
                      ),
                    Tools.proxy.createImmutable(j.storage)
                  );
                },
              });
            var P = v({
                name: 'fields',
                args: {
                  el: '#ui-fields',
                  data: {},
                  computed: {
                    vm_storage: function () {
                      return f;
                    },
                    vm_contract: function () {
                      return E;
                    },
                    fields_owners: function () {
                      var e = new Map(),
                        t = this.vm_storage,
                        a = t.config,
                        n = t.status;
                      if (null !== n) {
                        var o = this.vm_contract,
                          r = o.is_future,
                          i = o.field_owners_future;
                        a.fields.forEach(function (t, a) {
                          var o = n.fields[a];
                          if (void 0 !== o) {
                            var s = r && i.has(a) ? i.get(a) : o.owner;
                            e.set(a, s);
                          }
                        });
                      }
                      return e;
                    },
                    fields_with_equipment: function () {
                      var e = this,
                        t = new Map(),
                        a = this.vm_storage,
                        n = a.config,
                        o = a.status;
                      return null === o
                        ? t
                        : (n.fields.forEach(function (a, r) {
                            if ('field' === a.type) {
                              var i = o.fields[r],
                                s = n.groups[a.group],
                                c = {
                                  field_id: r,
                                  title: a.title,
                                  image: a.image,
                                  group: a.group,
                                  coeff_rent: 1,
                                };
                              if (
                                (n.version < 5
                                  ? ((c.buy = s.buy), (c.levels = s.levels))
                                  : 1 === a.is_last
                                  ? ((c.buy = s.buy_last),
                                    (c.levels = s.levels_last))
                                  : ((c.buy = s.buy), (c.levels = s.levels)),
                                void 0 !== s.coeffs &&
                                  (c.coeffs = Tools.clone(s.coeffs)),
                                void 0 !== s.coeffs_rentmirror &&
                                  (c.coeffs_rentmirror = Tools.clone(
                                    s.coeffs_rentmirror,
                                  )),
                                (c.levelUpCost = s.levelUpCost),
                                void 0 !== i)
                              ) {
                                var d = e.fields_owners.get(r),
                                  l = e.getPersonalizedMonopolyInfo(d, a.group);
                                if (
                                  ((c.owner = d),
                                  (c.owner_true = i.owner),
                                  (c.level = i.level),
                                  (c.mortgaged = i.mortgaged),
                                  void 0 !== i.mortgage_lose_round &&
                                    (c.mortgage_lose_round =
                                      i.mortgage_lose_round),
                                  (c.can_build = l.can_build),
                                  l.is_owned)
                                ) {
                                  var u = y.get(d);
                                  if (u) {
                                    var p = u.get(r);
                                    void 0 !== p &&
                                      ((c.title = p.title),
                                      (c.image = p.image),
                                      (c.coeff_rent = p.coeff_rent));
                                  }
                                }
                              }
                              t.set(r, c),
                                $man(
                                  '.table-body-board-chat-message span._field[mnpl-field_id="'.concat(
                                    r,
                                    '"]',
                                  ),
                                ).$text(c.title);
                            }
                          }),
                          Vue.nextTick(te),
                          t);
                    },
                    fields: function () {
                      var e = this;
                      s && console.log('[Vue UI Fields] re-computing fields');
                      var t = [],
                        a = this.vm_storage,
                        o = a.config,
                        i = a.status,
                        c = -1;
                      return null === o || null === i
                        ? t
                        : (o.fields.forEach(function (a, s) {
                            var d = 'corner' === a.design,
                              l = 'field' === a.type;
                            d && c++;
                            var u = {
                              is_corner: d,
                              line: c,
                              is_field: l,
                              is_special: 'special' === a.type,
                              is_jail: 'jail' === a.type,
                              group: null,
                              bg: 'url('.concat(a.image, ')'),
                              label: null,
                              label_currency: null,
                              owner: null,
                              owner_index: null,
                              is_mortgaged: null,
                              mortgage_rounds_left: null,
                              mortgage_shake: !1,
                              stars: 0,
                            };
                            if (l) {
                              var p = e.fields_with_equipment.get(s);
                              u.bg = 'url('.concat(p.image, ')');
                              var _ = a.group;
                              u.group = _;
                              var m = p.owner,
                                v = p.level,
                                g = p.levels,
                                b = 0;
                              if (void 0 === p.owner) b = p.buy;
                              else {
                                (u.owner = m),
                                  (u.owner_index = f.player_indexes.get(m));
                                var h = e.getPersonalizedMonopolyInfo(m, _);
                                !0 === p.mortgaged
                                  ? ((b = 0), (u.is_mortgaged = 1))
                                  : void 0 !== p.coeffs_rentmirror
                                  ? (b =
                                      p.coeffs_rentmirror[h.fields_owned - 1] *
                                      e.vm_storage.players.get(u.owner).rent_last)
                                  : void 0 !== p.coeffs
                                  ? ((u.label_currency = 'x'),
                                    (b = p.coeffs[h.fields_owned - 1]))
                                  : (b =
                                      !1 === p.levelUpCost
                                        ? g[h.fields_owned - 1]
                                        : 0 === v && h.is_owned
                                        ? 2 * g[v]
                                        : v > 0 && !h.is_owned
                                        ? g[v] * o.coeff_level_no_mnpl
                                        : g[v]),
                                  (b = Math.round(b * p.coeff_rent));
                              }
                              if (((u.label = r(b)), !0 === p.mortgaged)) {
                                if (void 0 !== p.mortgage_lose_round) {
                                  var y = p.mortgage_lose_round - i.round;
                                  (u.mortgage_rounds_left = y),
                                    y <= 1 &&
                                      m === n &&
                                      i.action_player === n &&
                                      e.vm_storage.action_types.has(
                                        'unmortgage',
                                      ) &&
                                      (u.mortgage_shake = !0);
                                }
                              } else
                                p.level === g.length - 1
                                  ? (u.stars = -1)
                                  : (u.stars = p.level || 0);
                            }
                            t.push(u);
                          }),
                          t);
                    },
                    click_mode: function () {
                      var e = this.vm_storage,
                        t = e.status,
                        n = e.action_types;
                      if (
                        !(
                          null === t ||
                          this.vm_storage.about.is_m1tv ||
                          a !== t.action_player ||
                          f.is_paused ||
                          f.is_action_processing ||
                          f.is_events_processing ||
                          F.is_hidden
                        )
                      ) {
                        if (this.vm_contract.mode > 0) return 1;
                        if (
                          n.has('chooseBusStop') ||
                          n.has('chooseTaxiStop') ||
                          n.has('chooseFieldToMove') ||
                          n.has('wormholeUse')
                        )
                          return 2;
                      }
                      return 0;
                    },
                    fields_to_move: function () {
                      var e = new Map();
                      if (2 === this.click_mode) {
                        var t = this.vm_storage,
                          a = t.config,
                          n = t.status,
                          o = t.action_types,
                          r = new Tools.Lazy();
                        r.set('all', function () {
                          return new Map(
                            a.fields.map(function (e, t) {
                              return [t, t];
                            }),
                          );
                        });
                        var i = !0 === n.current_move.move_reverse ? -1 : 1;
                        if (o.has('chooseBusStop')) {
                          var s = this.vm_storage.players.get(n.action_player)
                              .position,
                            c = n.current_move.dices;
                          e.set(_(s + (c[0] + c[1]) * i), -1),
                            e.set(_(s + c[1] * i), 1),
                            e.set(_(s + c[0] * i), 0);
                        }
                        if (o.has('chooseTaxiStop'))
                          for (
                            var d = this.vm_storage.players.get(n.action_player)
                                .position,
                              l = n.current_move.dices[0],
                              u = 1;
                            u <= l;
                            u++
                          )
                            e.set(_(d + u * i), u);
                        else if (o.has('chooseFieldToMove'))
                          (e = r.all).delete(
                            this.vm_storage.players.get(n.action_player).position,
                          );
                        else if (o.has('wormholeUse')) {
                          var p = !0,
                            m = !1,
                            f = void 0;
                          try {
                            for (
                              var v,
                                g = Tools.Array.getKeyValueIterator(a.fields)[
                                  Symbol.iterator
                                ]();
                              !(p = (v = g.next()).done);
                              p = !0
                            ) {
                              var b = _slicedToArray(v.value, 2),
                                h = b[0],
                                y = b[1];
                              'corner' === y.design &&
                                'wormhole' !== y.action &&
                                e.set(h, h);
                            }
                          } catch (e) {
                            (m = !0), (f = e);
                          } finally {
                            try {
                              p || null == g.return || g.return();
                            } finally {
                              if (m) throw f;
                            }
                          }
                        }
                      }
                      return e;
                    },
                  },
                  methods: {
                    getPersonalizedMonopolyInfo: function (e, t) {
                      var a = this,
                        n = {
                          is_owned: !0,
                          fields_owned: 0,
                          can_build: !0,
                          level_min: 10,
                          level_max: -10,
                        },
                        o = new Set(),
                        r = this.vm_storage,
                        i = r.status,
                        s = r.config,
                        c = s.groups[t];
                      return (
                        s.fields.forEach(function (r, d) {
                          if ('field' === r.type && t === r.group) {
                            var l,
                              u = i.fields[d],
                              p =
                                void 0 !== u &&
                                (s.version >= 5 || !1 === u.mortgaged);
                            p
                              ? ((l = a.fields_owners.get(d)), o.add(l))
                              : o.add(-1),
                              void 0 === u || !1 === c.levelUpCost
                                ? ((n.can_build = !1),
                                  delete n.level_min,
                                  delete n.level_max)
                                : void 0 !== n.level_min &&
                                  void 0 !== n.level_max &&
                                  ((n.level_min = Math.min(u.level, n.level_min)),
                                  (n.level_max = Math.max(u.level, n.level_max))),
                              void 0 === u || l !== e
                                ? ((n.is_owned = !1), (n.can_build = !1))
                                : p && n.fields_owned++,
                              (void 0 !== u && !0 !== u.mortgaged) ||
                                ((n.can_build = !1),
                                s.version < 5 && (n.is_owned = !1));
                          }
                        }),
                        1 !== o.size &&
                          ((n.is_owned = !1),
                          (n.can_build = !1),
                          delete n.level_min,
                          delete n.level_max),
                        1 === s.LEVEL_CHANGE_NO_MNPL &&
                          o.has(e) &&
                          'number' == typeof c.levelUpCost &&
                          (n.can_build = !0),
                        0 === t && n.fields_owned >= 3 && (n.is_owned = !0),
                        n
                      );
                    },
                    clickOnField: Tools.preventMouseEmulation(function (t, a) {
                      var n = P;
                      if (2 === n.click_mode) {
                        var o = n.fields_to_move.get(a);
                        if ('number' == typeof o) {
                          var r = n.vm_storage.action_types;
                          r.has('chooseBusStop')
                            ? e.GameAPI.action.call(t, 'chooseBusStop', {
                                stop: o,
                              })
                            : r.has('chooseTaxiStop')
                            ? e.GameAPI.action.call(t, 'chooseTaxiStop', {
                                stop: o,
                              })
                            : r.has('chooseFieldToMove')
                            ? e.GameAPI.action.call(t, 'chooseFieldToMove', {
                                field_id: a,
                              })
                            : r.has('wormholeUse') &&
                              e.GameAPI.action.call(t, 'wormholeUse', {
                                field_id: a,
                              });
                        }
                      } else 1 === n.click_mode ? n.vm_contract.addField(a) : n.fields[a].is_field && (O.field_id = a);
                    }),
                  },
                },
              }),
              F = v({ name: 'action', of: c, args: { el: '#vm-action' } });
            v({ name: 'action_inv', of: d, args: { el: '#vm-action-inv' } });
            var E = new p({
              el: '#vm-contract',
              computed: {
                vm_storage: function () {
                  return f;
                },
                vm_fields: function () {
                  return P;
                },
                users_data: function () {
                  return j.storage;
                },
                moneyFormatter: function () {
                  return r;
                },
              },
            });
            s && (o._vm_contract = E);
            var O = new u({
              el: '#vm-fieldcard',
              computed: {
                vm_storage: function () {
                  return f;
                },
                vm_fields: function () {
                  return P;
                },
                mnplNames: function () {
                  return h;
                },
                moneyFormatter: function () {
                  return r;
                },
              },
            });
            s && (o._vm_fieldcard = O);
            var R,
              D,
              B,
              U = function () {
                t('Всё готово!'),
                  $('.table-loading').delay(100).fadeOut(300),
                  f.status.players.forEach(function (t, a) {
                    var n = '';
                    (n += '<div class="table-body-players-card" id="player_card_'
                      .concat(t.user_id, '" mnpl-order="')
                      .concat(a, '" mnpl-team="')
                      .concat(t.team, '">')),
                      (n += '<div class="table-body-players-card-body">'),
                      (n += '<div class="table-body-players-card-body-avatar">'),
                      (n += '<div><div></div></div>'),
                      (n += '</div>'),
                      (n += '<div class="table-body-players-card-body-nick">'),
                      (n += '<div class="_vip"></div>'),
                      (n += '<div class="_nick"><div>&nbsp;</div></div>'),
                      (n += '<div class="_muted"></div>'),
                      (n += '<div class="_ignore"></div>'),
                      (n += '</div>'),
                      (n += '<div class="table-body-players-card-body-money">'.concat(
                        window.parsers.numberToSpacedString(t.money, ','),
                        '</div>',
                      )),
                      (n +=
                        '<div class="table-body-players-card-body-timer"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx=50 cy=50 r=46 transform="rotate(-90 50 50)"/></svg><div>75</div></div>'),
                      (n += '</div>'),
                      (n += '<div class="table-body-players-card-menu"></div>'),
                      (n += '</div>'),
                      1 === e.flags.game_2x2
                        ? a <= 1
                          ? $('.table-body-players').append(n)
                          : $(n).insertAfter(
                              $(
                                '.table-body-players-card[mnpl-team="'.concat(
                                  t.team,
                                  '"]',
                                ),
                              ),
                            )
                        : $('.table-body-players').append(n);
                    var o = new Map();
                    for (var r in t.cards_equipped) {
                      var i = t.cards_equipped[r];
                      o.set(parseInt(r), i);
                    }
                    if (
                      (y.set(t.user_id, o),
                      w.set(t.user_id, t.generator),
                      meowmod.load(
                        'tableGenerator' +
                          t.generator.type
                            .split('_')
                            .map(function (e) {
                              return e[0].toUpperCase() + e.substr(1);
                            })
                            .join(''),
                      ),
                      void 0 === t.joke
                        ? (t.joke = !1)
                        : ('number' == typeof t.joke &&
                            (t.joke = { thing_id: -1, proto_id: t.joke }),
                          k.set(t.user_id, t.joke)),
                      !1 !== t.joke)
                    ) {
                      var s = e.UI.Jokes.getTitle(t.joke.proto_id);
                      void 0 === T[s] &&
                        ((T[s] = null),
                        VueLoader.getComponent(s).then(function (e) {
                          e.$mount().$el.$appendTo('.table-jokes'), (T[s] = e);
                        }));
                    }
                    $('.table-body-board-tokens').append(
                      '<div id="player_token_'
                        .concat(t.user_id, '" mnpl-user_id="')
                        .concat(t.user_id, '" mnpl-position="0">'),
                    ),
                      1 === e.flags.game_2x2 &&
                        0 === a &&
                        $('.table-body-players').append(
                          '<div class="table-body-players-vs"></div>',
                        );
                  }),
                  setTimeout(function () {
                    var t = !0,
                      a = !1,
                      n = void 0;
                    try {
                      for (
                        var o, r = e.status.players[Symbol.iterator]();
                        !(t = (o = r.next()).done);
                        t = !0
                      ) {
                        var i = o.value;
                        e.UI.movePlayer(i.user_id, i.position, i.jailed, {
                          directly: !0,
                          no_animate: !0,
                        });
                      }
                    } catch (e) {
                      (a = !0), (n = e);
                    } finally {
                      try {
                        t || null == r.return || r.return();
                      } finally {
                        if (a) throw n;
                      }
                    }
                  }),
                  2 === e.config.game_submode &&
                    meowmod.load('tableGeneratorSpeedDie'),
                  (!0 !== f.about.is_m1tv &&
                    !1 !== f.players.has(n) &&
                    1 === API.user.vip) ||
                    $('.table-body-board-chatbottom ._screenshot').hide(),
                  !1 === e.about.is_m1tv &&
                    !1 === new Set(f.players.keys()).has(n) &&
                    ($('.table-body-board-action').remove(),
                    $('.table-body-board-chat').addClass('_noaction'));
              },
              L = _slicedToArray(
                ((R = {
                  regular: [
                    null,
                    [[0.5, 0.5]],
                    [
                      [0.275, 0.5],
                      [0.725, 0.5],
                    ],
                    [
                      [0.175, 0.333],
                      [0.5, 0.667],
                      [0.825, 0.333],
                    ],
                    [
                      [0.175, 0.333],
                      [0.5, 0.667],
                      [0.825, 0.333],
                      [0.825, 0.333],
                    ],
                    [
                      [0.175, 0.333],
                      [0.5, 0.667],
                      [0.825, 0.333],
                      [0.825, 0.333],
                      [0.825, 0.333],
                    ],
                  ],
                  corner: [
                    null,
                    [[0.5, 0.5]],
                    [
                      [0.333, 0.333],
                      [0.667, 0.667],
                    ],
                    [
                      [0.292, 0.5],
                      [0.667, 0.283],
                      [0.667, 0.717],
                    ],
                    [
                      [0.25, 0.25],
                      [0.25, 0.75],
                      [0.75, 0.75],
                      [0.75, 0.25],
                    ],
                    [
                      [0.2, 0.2],
                      [0.2, 0.8],
                      [0.5, 0.5],
                      [0.8, 0.2],
                      [0.8, 0.8],
                    ],
                  ],
                  jail: [
                    null,
                    [[0.72, 0.28]],
                    [
                      [0.6, 0.2],
                      [0.8, 0.4],
                    ],
                    [
                      [0.48, 0.18],
                      [0.78, 0.22],
                      [0.82, 0.52],
                    ],
                    [
                      [0.4, 0.15],
                      [0.67, 0.15],
                      [0.85, 0.333],
                      [0.85, 0.6],
                    ],
                    [
                      [0.35, 0.15],
                      [0.65, 0.15],
                      [0.6, 0.4],
                      [0.85, 0.35],
                      [0.85, 0.65],
                    ],
                  ],
                }),
                (D = o._movePlayer_correctTokenPositions = function (e) {
                  var t = e.position,
                    a = e.jailed,
                    n = e.user_id_exclude,
                    o = !0,
                    r = !1,
                    i = void 0;
                  try {
                    for (
                      var s,
                        c = (function (e, t) {
                          return _toConsumableArray(
                            $man(
                              '.table-body-board-tokens > div[mnpl-position="'
                                .concat(e, '"][mnpl-jailed="')
                                .concat(Number(t), '"]'),
                            ),
                          ).filter(function (e) {
                            return 'none' !== e.style.display;
                          });
                        })(t, a)[Symbol.iterator]();
                      !(o = (s = c.next()).done);
                      o = !0
                    ) {
                      var d = s.value,
                        l = parseInt(d.$attr('mnpl-user_id'));
                      l !== n && B(l, t, a, { is_fast: !0 });
                    }
                  } catch (e) {
                    (r = !0), (i = e);
                  } finally {
                    try {
                      o || null == c.return || c.return();
                    } finally {
                      if (r) throw i;
                    }
                  }
                }),
                (B = function (t, a, n, o, r) {
                  var i = o.no_animate,
                    s = void 0 !== i && i,
                    c = o.use_token_position,
                    d = void 0 === c || c,
                    l = o.is_fast,
                    u = void 0 !== l && l;
                  'function' != typeof r && (r = function () {});
                  var p = P.fields[a],
                    _ = p.line,
                    m = p.is_corner,
                    f = p.is_jail,
                    v = $man('.table-body-board-fields-one')[a],
                    g = v.$position(),
                    b = g.top,
                    h = g.left,
                    y = v.$outerWidth(),
                    w = v.$outerHeight(),
                    k = $man('#player_token_' + t),
                    $ = parseInt(k.$attr('mnpl-index')),
                    T = parseInt(k.$attr('mnpl-same_pos')),
                    S = k.$position().top,
                    x = k.$outerWidth(),
                    A = k.$outerHeight(),
                    C = b,
                    I = h,
                    M = _slicedToArray(
                      R[f ? 'jail' : m ? 'corner' : 'regular'][d ? T : 1][
                        d ? $ : 0
                      ],
                      2,
                    ),
                    j = M[0],
                    F = M[1];
                  if ((f && !n) || (!m && (1 === _ || 3 === _))) {
                    var E = [F, j];
                    (j = E[0]), (F = E[1]);
                  }
                  var O = w * j - A / 2,
                    D = y * F - x / 2;
                  if (s || -99999 === S)
                    k.$classRemove('_animated').$css('transition-duration', ''),
                      r();
                  else {
                    var B = e.getTimeWithSpeed(u ? 300 : 900);
                    k
                      .$classAdd('_animated')
                      .$css('transition-duration', B + 'ms'),
                      e.setTimeout(function () {
                        r();
                      }, 1.05 * B);
                  }
                  k.$css({ top: C + O, left: I + D });
                }),
                [
                  function (t, a, n, o, r) {
                    'object' !== _typeof(o) && (o = {}),
                      'function' != typeof r && (r = function () {});
                    var i = e.config.fields.length;
                    a = (a + i) % i;
                    var s = $('#player_token_' + t);
                    if ('none' !== s.css('display')) {
                      var c = parseInt(s.mnpl('position')),
                        d = '1' === s.mnpl('jailed'),
                        l = f.field_id_jail === a && !0 === n;
                      s.mnpl('position', a).mnpl('jailed', Number(l)),
                        (void 0 !== s.mnpl('index') && c === a && d === l) ||
                          (function () {
                            var e = $(
                                '.table-body-board-tokens > div:visible',
                              ).toArrayOfJQ(),
                              t = new Map(),
                              a = !0,
                              n = !1,
                              o = void 0;
                            try {
                              for (
                                var r, i = e[Symbol.iterator]();
                                !(a = (r = i.next()).done);
                                a = !0
                              ) {
                                var s = r.value,
                                  c = parseInt(s.mnpl('user_id')),
                                  d = parseInt(s.mnpl('position')),
                                  l = '1' === s.mnpl('jailed'),
                                  u = [d, Number(l)].join('|');
                                t.has(u) ? t.get(u).push(c) : t.set(u, [c]);
                              }
                            } catch (e) {
                              (n = !0), (o = e);
                            } finally {
                              try {
                                a || null == i.return || i.return();
                              } finally {
                                if (n) throw o;
                              }
                            }
                            var p = !0,
                              _ = !1,
                              m = void 0;
                            try {
                              for (
                                var f, v = t.values()[Symbol.iterator]();
                                !(p = (f = v.next()).done);
                                p = !0
                              )
                                for (var g = f.value, b = 0; b < g.length; b++)
                                  $('#player_token_' + g[b])
                                    .mnpl('same_pos', g.length)
                                    .mnpl('index', b);
                            } catch (e) {
                              (_ = !0), (m = e);
                            } finally {
                              try {
                                p || null == v.return || v.return();
                              } finally {
                                if (_) throw m;
                              }
                            }
                          })(),
                        D({ position: c, jailed: d, user_id_exclude: t }),
                        D({ position: a, jailed: l, user_id_exclude: t });
                      var u = [];
                      if (!0 === o.directly || (a === c && d !== l)) u.push(a);
                      else {
                        var p = c,
                          _ = a;
                        if (!0 === o.reverse) {
                          c < a && (p += i);
                          for (var m = p - 1; m >= _; m--) {
                            var v = m % i;
                            ('corner' !== e.config.fields[v].design && v !== a) ||
                              u.push(v);
                          }
                        } else {
                          c > a && (_ += i);
                          for (var g = p + 1; g <= _; g++) {
                            var b = g % i;
                            ('corner' !== e.config.fields[b].design && b !== a) ||
                              u.push(b);
                          }
                        }
                      }
                      !(function e(n) {
                        var i = u[n];
                        void 0 !== i
                          ? B(
                              t,
                              i,
                              l,
                              {
                                no_animate: o.no_animate,
                                use_token_position: i === a,
                              },
                              function () {
                                e(n + 1);
                              },
                            )
                          : (f.patchLivePosition(t, a), r());
                      })(0);
                    } else r();
                  },
                  function () {
                    var e = !0,
                      t = !1,
                      a = void 0;
                    try {
                      for (
                        var n,
                          o = $man('.table-body-board-tokens > div')[
                            Symbol.iterator
                          ]();
                        !(e = (n = o.next()).done);
                        e = !0
                      ) {
                        var r = n.value;
                        D({
                          position: parseInt(r.$attr('mnpl-position')),
                          jailed: '1' === r.$attr('mnpl-jailed'),
                        });
                      }
                    } catch (e) {
                      (t = !0), (a = e);
                    } finally {
                      try {
                        e || null == o.return || o.return();
                      } finally {
                        if (t) throw a;
                      }
                    }
                  },
                ]),
                2,
              ),
              V = L[0],
              G = L[1];
            o.movePlayer = V;
            for (
              var N,
                q,
                z,
                W,
                J = function () {
                  null !== e.status &&
                    ($man('.table-body-players-card').$attrRemove(
                      'mnpl-action_player',
                    ),
                    $man('#player_card_' + e.status.action_player).$attr(
                      'mnpl-action_player',
                      1,
                    ),
                    H());
                },
                H = function t() {
                  var a = e.status.player_ownerOfMove === n,
                    o = f.players.has(n),
                    i = !1;
                  if (o) {
                    var s = f.players.get(n);
                    0 === s.status,
                      (i = i || (s.ts_leave || 0) + 120 < Date.unix());
                  }
                  e.status.players.forEach(function (s) {
                    $('#player_token_' + s.user_id)[
                      -1 === s.status ? 'hide' : 'show'
                    ]();
                    var c = j.storage[s.user_id],
                      d = $('#player_card_'.concat(s.user_id));
                    -1 === s.status
                      ? d.mnpl('leaved', 1)
                      : d.removeMnpl('leaved'),
                      void 0 !== c &&
                        (d
                          .find(
                            '.table-body-players-card-body-avatar > div > div',
                          )
                          .css('background-image', 'url('.concat(c.avatar, ')')),
                        d
                          .find('.table-body-players-card-body-nick ._nick > div')
                          .html(c.nick),
                        d
                          .find('.table-body-players-card-body-nick ._vip')
                          [!0 === s.vip ? 'show' : 'hide'](),
                        d
                          .find('.table-body-players-card-body-nick ._muted')
                          [1 === c.muted ? 'show' : 'hide'](),
                        d
                          .find('.table-body-players-card-body-nick ._ignore')
                          [
                            '1' ===
                            localStorage['tableOption-ignore-' + s.user_id]
                              ? 'show'
                              : 'hide'
                          ]()),
                      d
                        .find('.table-body-players-card-body-money')
                        .html(r(s.money));
                    var l = d.find('.table-body-players-card-menu').html(''),
                      u = s.user_id === n;
                    if (e.about.is_m1tv)
                      l.append(
                        $('<div>')
                          .addClass('_profile')
                          .on('click', function () {
                            PageNavigation.openInNewTab('/profile/' + s.user_id);
                          }),
                      );
                    else if (u) {
                      l.append(
                        $('<div>')
                          .addClass('_profile')
                          .on('click', function () {
                            PageNavigation.openInNewTab('/profile/' + s.user_id);
                          }),
                      );
                      var p = 'tableOption-ignore-' + s.user_id;
                      if (
                        ('1' === localStorage[p] &&
                          l.append(
                            $('<div>')
                              .addClass('_ignore_off')
                              .on('click', function () {
                                localStorage.removeItem(p), t();
                              }),
                          ),
                        a && f.action_types.has('restart'))
                      ) {
                        var _ = f.config,
                          m = f.status.round,
                          v = s.restart;
                        void 0 === v
                          ? (v = _.restart_variants.filter(function (e) {
                              return m >= e.round_from && m <= e.round_to;
                            })[0])
                          : 'object' === _typeof(v) &&
                            null !== v &&
                            v.round_to < m &&
                            (v = 0),
                          v &&
                            l.append(
                              $('<div>')
                                .addClass('_restart')
                                .append(
                                  $('<div>').addClass('_title'),
                                  $('<div>').addClass('_badge').html(v.count),
                                )
                                .on('click', function (t) {
                                  Dialog.present({
                                    content: 'Вы уверены, что хотите взять рестарт за <b>'.concat(
                                      r(v.price),
                                      'k</b>?<br>Стоимость рестарта получит ваш соперник.',
                                    ),
                                    buttons: [
                                      {
                                        color: 'grapefruit',
                                        title: 'Да',
                                        cb: function () {
                                          e.GameAPI.action.call(t, 'restart');
                                        },
                                      },
                                      { title: 'Нет' },
                                    ],
                                  });
                                }),
                            );
                      }
                      a &&
                        !0 === s.can_use_credit &&
                        (!1 === s.credit_payRound &&
                        f.action_types.has('credit_take')
                          ? l.append(
                              $('<div>')
                                .addClass('_credit_take')
                                .on('click', function (t) {
                                  e.GameAPI.action.call(
                                    t,
                                    'credit_take',
                                    function (e) {
                                      if (
                                        102 === e.code &&
                                        'credit_cooldown' ===
                                          (e.data && e.data.errorType)
                                      ) {
                                        var t = e.data.rounds_left;
                                        $.designMessage(
                                          'Невозможно взять кредит.',
                                          'Кредит можно будет взять через '
                                            .concat(t, ' раунд')
                                            .concat(
                                              Tools.selectWordCase(t, [
                                                '',
                                                'а',
                                                'ов',
                                              ]),
                                              '.',
                                            ),
                                        );
                                      } else
                                        0 !== e.code &&
                                          (console.log('[ERROR]', e),
                                          $.designMessage(
                                            'Невозможно выполнить действие.',
                                          ));
                                    },
                                  );
                                }),
                            )
                          : f.action_types.has('credit_pay') &&
                            l.append(
                              $('<div>')
                                .addClass('_credit_pay')
                                .on('click', function (t) {
                                  e.GameAPI.action.call(t, 'credit_pay');
                                }),
                            )),
                        o &&
                          l.append(
                            $('<div>')
                              .addClass('_leave')
                              .on('click', function () {
                                $.designMessage({
                                  text: 'Вы уверены, что хотите сдаться?',
                                  buttons: [
                                    { title: 'Да', color: 'grapefruit' },
                                    { title: 'Нет' },
                                  ],
                                  cb: function (t) {
                                    0 === t && e.GameAPI.action('leave');
                                  },
                                });
                              }),
                          );
                    } else {
                      if (
                        (a &&
                          f.action_types.has('contract') &&
                          0 === s.status &&
                          (e.status.current_move.contracts || 0) < 3 &&
                          l.append(
                            $('<div>')
                              .addClass('_contract')
                              .on('click', function () {
                                0 === $('#contract:visible').length &&
                                  E.create(s.user_id);
                              }),
                          ),
                        l.append(
                          $('<div>')
                            .addClass('_profile')
                            .on('click', function () {
                              PageNavigation.openInNewTab(
                                '/profile/' + s.user_id,
                              );
                            }),
                        ),
                        API.user && !u)
                      ) {
                        var g = 'tableOption-ignore-' + s.user_id;
                        '1' === localStorage[g]
                          ? l.append(
                              $('<div>')
                                .addClass('_ignore_off')
                                .on('click', function () {
                                  localStorage.removeItem(g), t();
                                }),
                            )
                          : l.append(
                              $('<div>')
                                .addClass('_ignore')
                                .on('click', function () {
                                  (localStorage[g] = '1'), t();
                                }),
                            );
                      }
                      API.user &&
                        o &&
                        !u &&
                        i &&
                        l.append(
                          $('<div>')
                            .addClass('_report')
                            .on('click', function () {
                              var t = j.storage[s.user_id],
                                a = new Set();
                              e.getTime() - f.start_time < 300 && a.add(0),
                                1 === e.flags.game_2x2
                                  ? (a.add(1), a.add(2))
                                  : 2 === f.players.size && (a.add(1), a.add(2)),
                                window.Design.Dialog.presentVue('TableReport', {
                                  reasons_remove: a,
                                  user_id_reported: t.user_id,
                                  user_reported_nick: t.nick,
                                  user_reported_color: Z(s.user_id),
                                });
                            }),
                        ),
                        0 === s.status &&
                          API.user &&
                          window.testAdmin(4096) &&
                          l.append(
                            $('<div>')
                              .addClass('_kick')
                              .on('click', function () {
                                Dialog.present({
                                  content: 'Вы уверены, что хотите кикнуть игрока '.concat(
                                    j.storage[s.user_id].nick,
                                    '?',
                                  ),
                                  buttons: [
                                    {
                                      color: 'grapefruit',
                                      title: 'Да',
                                      cb: function () {
                                        API.callMethod(
                                          'reactor.games.kick',
                                          {
                                            gs_id: e.about.gs_id,
                                            gs_game_id: e.about.gs_game_id,
                                            user_id: s.user_id,
                                          },
                                          function (e) {
                                            switch (e.code) {
                                              case 0:
                                                e.data &&
                                                  e.data.msg &&
                                                  ee(e.data.msg);
                                                break;
                                              case 99:
                                                Dialog.present(e.data.msg);
                                                break;
                                              case 5001:
                                                Dialog.present(
                                                  'Ошибка',
                                                  'Недостаточно прав.',
                                                );
                                                break;
                                              default:
                                                API.dialogs.unknownError(e.code);
                                            }
                                          },
                                        );
                                      },
                                    },
                                    { title: 'Нет' },
                                  ],
                                });
                              }),
                          );
                    }
                  });
                },
                K = new Set(['dices', 'elektronika_m1']),
                Y = (o._rotateDices =
                  ((N = new Map()),
                  function (t, a) {
                    var n =
                      arguments.length > 2 && void 0 !== arguments[2]
                        ? arguments[2]
                        : function () {};
                    if (
                      !(
                        (e.about.is_m1tv && 2 === e.M1TV.getState()) ||
                        _e.is_open
                      )
                    ) {
                      var o = a.type;
                      if (K.has(o)) {
                        var r = [
                            t,
                            {
                              proto_id: a.generator_id,
                              game_submode: f.flags.game_submode,
                              seed: a.seed || SmartCache.hash(a.thing_id),
                            },
                            n,
                          ],
                          i = N.get(o);
                        if (i) i.start.apply(i, r);
                        else {
                          var s =
                            'TableGenerator' +
                            a.type
                              .split('_')
                              .map(function (e) {
                                return e[0].toUpperCase() + e.substr(1);
                              })
                              .join('');
                          VueLoader.getComponent(s).then(function (e) {
                            e
                              .$mount()
                              .$el.$appendTo('.table-body-board-generators'),
                              N.set(o, e),
                              e.start.apply(e, r);
                          });
                        }
                      } else
                        meowmod.require(
                          'tableGenerator' +
                            o
                              .split('_')
                              .map(function (e) {
                                return e[0].toUpperCase() + e.substr(1);
                              })
                              .join(''),
                          { vals: t, generator: a },
                        );
                    }
                    e.setTimeout(n, 1500);
                  })),
                X = (o.parseColor = function (e) {
                  var t = [];
                  if ('#' === e[0])
                    4 === e.length
                      ? t.push.apply(
                          t,
                          _toConsumableArray(
                            e
                              .substr(1)
                              .split('')
                              .map(function (e) {
                                return parseInt(e + e, 16);
                              }),
                          ),
                        )
                      : 7 === e.length &&
                        t.push.apply(
                          t,
                          _toConsumableArray(
                            e
                              .substr(1)
                              .match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
                              .slice(1)
                              .map(function (e) {
                                return parseInt(e, 16);
                              }),
                          ),
                        );
                  else if (0 === e.indexOf('rgb')) {
                    var a = e.match(
                      /^rgba?\(([0-9]{1,3}),\s?([0-9]{1,3}),\s?([0-9]{1,3})(?:,\s?([0-9\.]+))?\)$/i,
                    );
                    t.push.apply(
                      t,
                      _toConsumableArray(
                        a.slice(1, 4).map(function (e) {
                          return parseInt(e);
                        }),
                      ),
                    ),
                      void 0 !== a[4] && t.push(parseFloat(a[4]));
                  }
                  return void 0 === t[3] && t.push(1), t;
                }),
                Z = (o.getUserColorById = function (e) {
                  var t =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : 1,
                    a = $('#player_card_' + e);
                  if (0 === a.length)
                    return 'rgba(100, 100, 100, '.concat(t, ')');
                  var n = a.find('.table-body-players-card-body-avatar > div'),
                    o = n.css('background-image');
                  if (0 === o.indexOf('linear-gradient(')) {
                    var r = o
                        .match(/t\(([\s\S]+)\)$/)[1]
                        .match(/(rgba?\([^\)]+\)|#[0-9a-f]{3}|#[0-9a-f]{6})/gi)
                        .map(function (e) {
                          return X(e);
                        }),
                      i = new Array(3).fill(0).map(function (e, t) {
                        return Math.round((r[0][t] + r[1][t]) / 2);
                      });
                    return (i[3] = t), 'rgba('.concat(i.join(', '), ')');
                  }
                  var s = X(n.css('border-top-color'));
                  return (s[3] = t), 'rgba('.concat(s.join(', '), ')');
                }),
                Q = _slicedToArray(
                  (function () {
                    var e = _slicedToArray($man('.table-body-board-chat'), 1)[0],
                      t = _slicedToArray(
                        $man('.table-body-board-chat .scr-window'),
                        1,
                      )[0],
                      a = _slicedToArray(
                        $man('.table-body-board-chat .scr-content'),
                        1,
                      )[0],
                      n = !0,
                      r = (o.message = function (e, t) {
                        void 0 === t &&
                          console.warn('ID needed', new Error().stack);
                        var n = _slicedToArray($man('<div>'), 1)[0];
                        n
                          .$classAdd('table-body-board-chat-message')
                          .$attr('id', 'event_' + A(e)),
                          'string' == typeof t
                            ? n.$html(t)
                            : t instanceof jQuery
                            ? n.$append.apply(
                                n,
                                _toConsumableArray(Array.from(t)),
                              )
                            : n.$append(t);
                        var o = !0,
                          r = !1,
                          i = void 0;
                        try {
                          for (
                            var c,
                              d = n
                                .$find('.table-body-board-chat-message-user')
                                [Symbol.iterator]();
                            !(o = (c = d.next()).done);
                            o = !0
                          ) {
                            var l = c.value,
                              u = parseInt(l.$attr('mnpl-userid')),
                              p = 'user #' + u;
                            (u in j.storage)
                              ? (p = j.storage[u].nick.htmlToText())
                              : j.load(u),
                              l.$text(p);
                          }
                        } catch (e) {
                          (r = !0), (i = e);
                        } finally {
                          try {
                            o || null == d.return || d.return();
                          } finally {
                            if (r) throw i;
                          }
                        }
                        var _ = !0,
                          m = !1,
                          f = void 0;
                        try {
                          for (
                            var v, g = n.$find('._field')[Symbol.iterator]();
                            !(_ = (v = g.next()).done);
                            _ = !0
                          ) {
                            var b = v.value,
                              h = parseInt(b.$attr('mnpl-field_id'));
                            b.$text(P.fields_with_equipment.get(h).title);
                          }
                        } catch (e) {
                          (m = !0), (f = e);
                        } finally {
                          try {
                            _ || null == g.return || g.return();
                          } finally {
                            if (m) throw f;
                          }
                        }
                        n.$appendTo(a),
                          ('ontouchstart' in window) == !1 &&
                            window.$trigger('resize');
                        for (
                          ;
                          $man('.table-body-board-chat-message').length > 100;
  
                        )
                          $man('.table-body-board-chat-message')[0].$remove();
                        s();
                      }),
                      i = function () {
                        var e = 0,
                          t = !0,
                          n = !1,
                          o = void 0;
                        try {
                          for (
                            var r, i = a.$children()[Symbol.iterator]();
                            !(t = (r = i.next()).done);
                            t = !0
                          ) {
                            e += r.value.$outerHeight(!0);
                          }
                        } catch (e) {
                          (n = !0), (o = e);
                        } finally {
                          try {
                            t || null == i.return || i.return();
                          } finally {
                            if (n) throw o;
                          }
                        }
                        return e;
                      },
                      s = function () {
                        n && (t.scrollTop = 1e6),
                          t.$css(
                            'padding-top',
                            Math.max(t.$outerHeight(!0) - i(), 0),
                          );
                      };
                    return (
                      $man('.table-body-board-chat .scr-window').$on(
                        'scroll',
                        function () {
                          n = 1.333 * e.$height() + t.scrollTop >= i();
                        },
                        { passive: !0 },
                      ),
                      [r, s]
                    );
                  })(),
                  2,
                ),
                ee = Q[0],
                te = Q[1],
                ae = function (e, t) {
                  return e.replace(
                    /\{gender:([^,]{0,}),([^\}]{0,})\}/g,
                    function () {
                      for (
                        var e = arguments.length, a = new Array(e), n = 0;
                        n < e;
                        n++
                      )
                        a[n] = arguments[n];
                      return a[t + 1];
                    },
                  );
                },
                ne =
                  ((q = new Set([
                    'startBypass',
                    'double_spended',
                    'busStopChoosed',
                    'taxiStopChoosed',
                    'chooseTaxiStopFail',
                    'fieldToMoveChoosed',
                  ])),
                  (z = !1),
                  (W = []),
                  function t(a) {
                    for (
                      var o = {},
                        i = function () {},
                        s = arguments.length,
                        c = new Array(s > 1 ? s - 1 : 0),
                        d = 1;
                      d < s;
                      d++
                    )
                      c[d - 1] = arguments[d];
                    switch (c.length) {
                      case 0:
                        break;
                      case 1:
                        i = c[0];
                        break;
                      default:
                        var l = c[0];
                        (o = void 0 === l ? {} : l), (i = c[1]);
                    }
                    if (void 0 !== a) {
                      var u = x(a);
                      if (0 !== u.length)
                        if (!0 !== o.immediate && z) W.push([a, o, i]);
                        else {
                          z = !0;
                          var p = function (e) {
                              var t =
                                  arguments.length > 1 && void 0 !== arguments[1]
                                    ? arguments[1]
                                    : 'span',
                                a = $('<'.concat(t, '>'))
                                  .addClass('table-body-board-chat-message-user')
                                  .addClass(
                                    '_color_player_'.concat(
                                      f.getPlayerIndex(e),
                                      '_color',
                                    ),
                                  )
                                  .data('user_id', e)
                                  .mnpl('userid', e);
                              return (
                                'a' === t &&
                                  a.attr({
                                    href: '/profile/' + e,
                                    target: '_blank',
                                  }),
                                j.load(e),
                                a
                              );
                            },
                            _ = function (e) {
                              e.on('click', function (t) {
                                return (
                                  PageNavigation.openInNewTab(
                                    '/profile/' + e.data('user_id'),
                                  ),
                                  t.stopPropagation(),
                                  t.preventDefault(),
                                  !1
                                );
                              });
                            },
                            m =
                              u.filter(function (e) {
                                return 'double_spended' === e.type;
                              }).length > 0;
                          Tools.each.async(
                            u,
                            function (t, a, o) {
                              var i = function () {
                                  f.patchLive(t), o();
                                },
                                s = t._id,
                                c = new Tools.Lazy();
                              c.set('next_event', function () {
                                return u.slice(a + 1).filter(function (e) {
                                  return !1 === q.has(e && e.type);
                                })[0];
                              });
                              var d,
                                l,
                                v,
                                b = $('<div>'),
                                h = !1;
                              switch (
                                (t.user_id &&
                                  ((d = f.players.get(t.user_id)),
                                  (l = j.storage[t.user_id]),
                                  (v = Z(t.user_id))),
                                t.type)
                              ) {
                                case 'message':
                                  var y =
                                      '1' ===
                                      localStorage[
                                        'tableOption-ignore-' + t.user_id
                                      ],
                                    S = !g.msgs_from_spectators,
                                    x = t.user_id === n,
                                    A =
                                      0 ===
                                      e.status.players.filter(function (e) {
                                        return (
                                          e.user_id === t.user_id &&
                                          0 === e.status
                                        );
                                      }).length,
                                    C =
                                      e.status.players.filter(function (e) {
                                        return e.user_id === n && 0 === e.status;
                                      }).length > 0;
                                  if (
                                    !1 === e.about.is_m1tv &&
                                    1 !== t.forced &&
                                    (y || (S && !x && A))
                                  )
                                    (h = !0), i();
                                  else if (
                                    !1 === e.about.is_m1tv &&
                                    !0 === e.about.is_m1cup &&
                                    A &&
                                    C &&
                                    1 !== t.forced
                                  )
                                    (h = !0), i();
                                  else {
                                    var I = t.text;
                                    (I = window.parsers.setLinksClickable(I, !0)),
                                      (I = window.emotes.replace(I, {
                                        restrictions: e.flags.emotes_restricted,
                                      }));
                                    var M = $('<div>')
                                        .addClass(
                                          'table-body-board-chat-message-users',
                                        )
                                        .appendTo(b),
                                      P = p(t.user_id, 'a').addClass('_message'),
                                      F = f.getPlayerIndex(t.user_id);
                                    if (
                                      (P.removeClass(
                                        '_color_player_'.concat(F, '_color'),
                                      ),
                                      P.addClass(
                                        '_color_player_'.concat(F, '_bg_plain'),
                                      ),
                                      _(P),
                                      M.append(P),
                                      b.append('&nbsp;&mdash;&nbsp;'),
                                      t.private)
                                    )
                                      if (t.private.user) {
                                        P.addClass('_from');
                                        var E = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 100"><path d="M0 2 H10 L40 50 L10 98 H-10 Z" fill="'.concat(
                                          Z(t.user_id),
                                          '" /></svg>',
                                        );
                                        M.append(
                                          '<div class="_arrow" style="background:url(data:image/svg+xml;base64,'.concat(
                                            btoa(E),
                                            ') center / cover"></div>',
                                          ),
                                        );
                                        var O = p(t.private.user, 'a').addClass(
                                            '_message _to',
                                          ),
                                          R = f.getPlayerIndex(t.private.user);
                                        O.removeClass(
                                          '_color_player_'.concat(R, '_color'),
                                        ),
                                          O.addClass(
                                            '_color_player_'.concat(
                                              R,
                                              '_bg_plain',
                                            ),
                                          ),
                                          _(O),
                                          M.append(O);
                                      } else if (t.private.team) {
                                        P.addClass('_from');
                                        var D = new Set(t.toUsers);
                                        D.delete(t.user_id);
                                        var B = _toConsumableArray(D)[0],
                                          U = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 100"><path d="M0 2 H10 L40 50 L10 98 H-10 Z" fill="'.concat(
                                            Z(t.user_id),
                                            '" /></svg>',
                                          );
                                        M.append(
                                          '<div class="_arrow" style="background:url(data:image/svg+xml;base64,'.concat(
                                            btoa(U),
                                            ') center / cover"></div>',
                                          ),
                                        );
                                        var L = p(B, 'a').addClass(
                                            '_message _to',
                                          ),
                                          G = f.getPlayerIndex(B);
                                        L.removeClass(
                                          '_color_player_'.concat(G, '_color'),
                                        ),
                                          L.addClass(
                                            '_color_player_'.concat(
                                              G,
                                              '_bg_plain',
                                            ),
                                          ),
                                          _(L),
                                          M.append(L);
                                      }
                                    b.append(
                                      '<span mnpl-usermessage>'.concat(
                                        I,
                                        '</span>',
                                      ),
                                    );
                                    var N = l && l.nick;
                                    C &&
                                      !x &&
                                      A &&
                                      b.append(
                                        $('<span class="_report">').on(
                                          'click',
                                          function () {
                                            Dialog.presentVue('TableReport', {
                                              reasons_remove: new Set([0, 1, 2]),
                                              user_id_reported: t.user_id,
                                              user_reported_nick: N,
                                              user_reported_color: v,
                                            });
                                          },
                                        ),
                                      );
                                  }
                                  break;
                                case 'startBypass':
                                  b
                                    .append(p(t.user_id))
                                    .append(
                                      ' проходит очередной круг и получает '.concat(
                                        r(t.money),
                                        'k',
                                      ),
                                    ),
                                    e.about.is_m1tv ||
                                      t.user_id !==
                                        (API.user && API.user.user_id) ||
                                      pe('cashin');
                                  break;
                                case 'start_bonus':
                                  b.append(p(t.user_id)).append(
                                    ' останавливается на поле «Старт» и получает бонус в размере '.concat(
                                      r(t.money),
                                      'k',
                                    ),
                                  );
                                  break;
                                case 'startBypassFee':
                                  b.append(p(t.user_id)).append(
                                    ' проходит очередной круг и должен заплатить налог '.concat(
                                      r(t.money),
                                      'k',
                                    ),
                                  );
                                  break;
                                case 'rollDices':
                                  h = !0;
                                  var z = e.config.game_submode;
                                  b.append(p(t.user_id));
                                  var W = ' выбрасывает ' + t.dices[0];
                                  if (2 === z) {
                                    W += ':' + t.dices[1];
                                    var J = _slicedToArray(t.dices, 3)[2];
                                    void 0 !== J &&
                                      (W +=
                                        J <= 3
                                          ? ':' + J
                                          : ' и '.concat(
                                              [
                                                0,
                                                1,
                                                2,
                                                3,
                                                'Автобус',
                                                'М1',
                                                'Автобус',
                                              ][J],
                                              ' на быстром кубике',
                                            ));
                                  } else if (5 === z) {
                                    var H = _slicedToArray(t.dices, 2)[1];
                                    void 0 !== H &&
                                      (W +=
                                        H <= 4
                                          ? ':' + H
                                          : ' и '.concat(
                                              [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4,
                                                'Удвоение',
                                                'Такси',
                                              ][H],
                                              ' на мини-кубике',
                                            ));
                                  } else W += ':' + t.dices[1];
                                  if (
                                    (b.append(W),
                                    5 !== z &&
                                      t.dices[0] === t.dices[1] &&
                                      !1 === m &&
                                      (void 0 === t.dices[2] ||
                                        (t.dices[2] <= 3 &&
                                          t.dices[0] !== t.dices[2])) &&
                                      b.append(
                                        ' и получает ещё один ход, так как выпал дубль',
                                      ),
                                    !1 !== d.credit_payRound)
                                  ) {
                                    var K = d.credit_payRound - e.status.round;
                                    b.append(
                                      ' (до возврата кредита остал'
                                        .concat(
                                          Tools.selectWordCase(K, [
                                            'ся',
                                            'ось',
                                            'ось',
                                          ]),
                                          ' ',
                                        )
                                        .concat(K, ' раунд')
                                        .concat(
                                          Tools.selectWordCase(K, [
                                            '',
                                            'а',
                                            'ов',
                                          ]),
                                          ')',
                                        ),
                                    );
                                  }
                                  var X = !1,
                                    Q = !1,
                                    te = function () {
                                      X && Q && (ee(s, b.contents()), i());
                                    };
                                  Y(t.dices, w.get(d.user_id), function () {
                                    (X = !0), te();
                                  }),
                                    e.setTimeout(function () {
                                      var a = function () {
                                          (Q = !0), te();
                                        },
                                        n = 1 === t.move_reverse,
                                        o = (function (t) {
                                          var a =
                                              arguments.length > 1 &&
                                              void 0 !== arguments[1] &&
                                              arguments[1],
                                            n = t[0] + t[1];
                                          return (
                                            2 === e.config.game_submode &&
                                              void 0 !== t[2] &&
                                              t[2] <= 3 &&
                                              (n += t[2]),
                                            (a ? -1 : 1) * n
                                          );
                                        })(t.dices, n);
                                      switch (c.next_event && c.next_event.type) {
                                        case 'rollDicesForUnjailFail':
                                        case 'payForUnjail':
                                        case 'chooseBusStop':
                                        case 'chooseTaxiStop':
                                        case 'chooseFieldToMove':
                                          return void a();
                                        case 'goToJail':
                                        case 'rollDicesForUnjailSuccess':
                                          return void V(
                                            t.user_id,
                                            t.mean_position,
                                            !1,
                                            { reverse: n },
                                            a,
                                          );
                                        case 'goToJailByCombo':
                                          return void V(
                                            t.user_id,
                                            f.field_id_jail,
                                            !0,
                                            { directly: !0 },
                                            a,
                                          );
                                        case 'chance':
                                          var r =
                                            e.config.chance_cards[
                                              c.next_event.chance_id
                                            ];
                                          if (
                                            'jail' === r.type ||
                                            'teleport' === r.type
                                          )
                                            return void V(
                                              t.user_id,
                                              t.mean_position,
                                              !1,
                                              { reverse: n },
                                              a,
                                            );
                                      }
                                      V(
                                        t.user_id,
                                        ('mean_position' in t)
                                          ? t.mean_position
                                          : d.position + o,
                                        !1,
                                        { reverse: n },
                                        a,
                                      );
                                    }, 750);
                                  break;
                                case 'double_spended':
                                  (h = !0), i();
                                  break;
                                case 'chooseBusStop':
                                  b.append(p(t.user_id)).append(
                                    ae(
                                      ' получает бонус «Автобус» и может выбрать количество клеток, которое он{gender:,а} пройдёт: ' +
                                        t.stops
                                          .join(', ')
                                          .replace(/, ([0-9]+)$/, ' или $1'),
                                      l.gender || 0,
                                    ),
                                  );
                                  break;
                                case 'busStopChoosed':
                                  (h = !0),
                                    b
                                      .append(p(t.user_id))
                                      .append(
                                        ' выбирает значение ' +
                                          (-1 === t.stop
                                            ? 'суммы кубиков'
                                            : ' '.concat(
                                                ['первого', 'второго'][t.stop],
                                                ' кубика',
                                              )),
                                      ),
                                    V(
                                      t.user_id,
                                      t.mean_position,
                                      !1,
                                      { reverse: Boolean(t.move_reverse) },
                                      function () {
                                        ee(s, b.contents()), i();
                                      },
                                    );
                                  break;
                                case 'doubleRolledOnDice':
                                  b.append(p(t.user_id)).append(
                                    ' получает бонус «Удвоение»: переходит на двойное число клеток и получает ещё один ход ',
                                  );
                                  break;
                                case 'chooseTaxiStop':
                                  b.append(p(t.user_id)).append(
                                    ae(
                                      ' получает бонус «Такси» и может выбрать количество клеток, которое он{gender:,а} пройдёт: от 1 до ' +
                                        t.limit,
                                      l.gender || 0,
                                    ),
                                  );
                                  break;
                                case 'chooseTaxiStopFail':
                                  b.append(p(t.user_id)).append(
                                    ' получает бонус «Такси», но не имеет вариантов для выбора остановки',
                                  );
                                  break;
                                case 'taxiStopChoosed':
                                  (h = !0),
                                    b
                                      .append(p(t.user_id))
                                      .append(
                                        ' переходит на '.concat(t.stop, ' клет') +
                                          Tools.selectWordCase(t.stop, [
                                            'ку',
                                            'ки',
                                            'ок',
                                          ]) +
                                          ' ' +
                                          (t.move_reverse ? 'назад' : 'вперёд'),
                                      ),
                                    V(
                                      t.user_id,
                                      t.mean_position,
                                      !1,
                                      { reverse: Boolean(t.move_reverse) },
                                      function () {
                                        ee(s, b.contents()), i();
                                      },
                                    );
                                  break;
                                case 'chooseFieldToMove':
                                  b.append(p(t.user_id)).append(
                                    ' выбрасывает трипл и может перейти на любое поле по своему выбору',
                                  );
                                  break;
                                case 'fieldToMoveChoosed':
                                  (h = !0),
                                    V(
                                      t.user_id,
                                      t.field_id,
                                      !1,
                                      { reverse: Boolean(t.move_reverse) },
                                      function () {
                                        i();
                                      },
                                    );
                                  break;
                                case 'mrMonopoly':
                                  var ne = 'свободное поле';
                                  1 === t.field_type &&
                                    (ne = e.flags.game_2x2
                                      ? 'чужое поле'
                                      : 'поле соперника'),
                                    b
                                      .append(p(t.user_id))
                                      .append(
                                        ' использует бонус «М1» и переходит на ближайшее '.concat(
                                          ne,
                                        ),
                                      ),
                                    (h = !0),
                                    ee(s, b.contents()),
                                    e.setTimeout(function () {
                                      V(
                                        t.user_id,
                                        t.field_id,
                                        !1,
                                        { reverse: 1 === t.move_reverse },
                                        function () {
                                          i();
                                        },
                                      );
                                    }, 500);
                                  break;
                                case 'mrMonopolyFailed':
                                  b.append(p(t.user_id)).append(
                                    ' не может использовать бонус «М1», так как нет подходящих полей',
                                  );
                                  break;
                                case 'cash_plus':
                                  b
                                    .append(p(t.user_id))
                                    .append(
                                      ' попадает на поле «Бонус» и получает '.concat(
                                        r(t.money),
                                        'k',
                                      ),
                                    ),
                                    e.about.is_m1tv ||
                                      t.user_id !== (API.user && API.user_id) ||
                                      pe('cashin');
                                  break;
                                case 'cash_minus':
                                  b.append(p(t.user_id)).append(
                                    ae(
                                      ' попадает на поле «Штраф» и долж{gender:ен,на} заплатить Банку '.concat(
                                        r(t.money),
                                        'k',
                                      ),
                                      l.gender || 0,
                                    ),
                                  );
                                  break;
                                case 'tax_income':
                                  b.append(p(t.user_id)).append(
                                    ae(
                                      ' попадает на поле «Подоходный налог» и долж{gender:ен,на} заплатить Банку '.concat(
                                        r(t.money),
                                        'k',
                                      ),
                                      l.gender || 0,
                                    ),
                                  );
                                  break;
                                case 'tax_luxury':
                                  b.append(p(t.user_id)).append(
                                    ae(
                                      ' попадает на поле «Налог на роскошь» и долж{gender:ен,на} заплатить Банку '.concat(
                                        r(t.money),
                                        'k',
                                      ),
                                      l.gender || 0,
                                    ),
                                  );
                                  break;
                                case 'chance':
                                  var oe = p(t.user_id),
                                    re = e.config.chance_cards[t.chance_id];
                                  b.append(oe.clone()).append(
                                    ' попадает на поле «Шанс». ',
                                  );
                                  var ie = ae(re.text, l.gender || 0).replace(
                                    /%sum%/,
                                    r(t.money),
                                  );
                                  switch (
                                    (2 === t.user_id &&
                                      (ie = ie.replace(
                                        /второе место/,
                                        'первое место',
                                      )),
                                    1 === e.flags.game_2x2 &&
                                      (ie = ie.replace(
                                        /все скидываются/,
                                        'все соперники скидываются',
                                      )),
                                    b
                                      .append(ie.split('%username%')[0])
                                      .append(oe.clone())
                                      .append(ie.split('%username%')[1]),
                                    re.type)
                                  ) {
                                    case 'cash_in':
                                      e.about.is_m1tv ||
                                        t.user_id !== n ||
                                        pe('cashin');
                                      break;
                                    case 'jail':
                                      (h = !0),
                                        ee(s, b.contents()),
                                        V(
                                          t.user_id,
                                          f.field_id_jail,
                                          !0,
                                          { directly: !0 },
                                          function () {
                                            i();
                                          },
                                        );
                                      break;
                                    case 'teleport':
                                      (h = !0), ee(s, b.contents());
                                      var se = t.mean_position;
                                      void 0 === se &&
                                        (se = f.getFuturePosition(t.user_id)),
                                        e.setTimeout(function () {
                                          V(
                                            t.user_id,
                                            se,
                                            !1,
                                            { reverse: 1 === t.move_reverse },
                                            function () {
                                              i();
                                            },
                                          );
                                        }, 1e3);
                                  }
                                  break;
                                case 'action_card_draw':
                                  var ce = f.vms.action_inv.cards_about.get(
                                    t.kind,
                                  ).title;
                                  b.append(
                                    p(t.user_id),
                                    ' попадает на поле «Действие» и получает карту «'.concat(
                                      ce,
                                      '»',
                                    ),
                                  );
                                  break;
                                case 'action_card_fail_copies':
                                  var de = f.vms.action_inv.cards_about.get(
                                    t.kind,
                                  ).title;
                                  b.append(
                                    p(t.user_id),
                                    ' попадает на поле «Действие», но не получает карту, так как достигнут лимит карт «'.concat(
                                      de,
                                      '» на руках',
                                    ),
                                  );
                                  break;
                                case 'action_card_use':
                                  var le = f.vms.action_inv.cards_about.get(
                                    t.kind,
                                  ).title;
                                  b.append(
                                    p(t.user_id),
                                    ' разыгрывает действие «'.concat(le, '»'),
                                  );
                                  var ue = t.user_id_on === t.user_id,
                                    _e =
                                      ('user_id_on' in t)
                                        ? f.players.get(t.user_id_on)
                                        : null;
                                  switch (
                                    (_e &&
                                      !ue &&
                                      b.append(' на игроке ', p(_e.user_id)),
                                    t.kind)
                                  ) {
                                    case 3:
                                      b.append(
                                        '. Следующий ход ',
                                        p(_e.user_id),
                                        ' пропустит',
                                      );
                                      break;
                                    case 4:
                                      b.append(
                                        '. ',
                                        p(_e.user_id),
                                        ' пропустит на один ход меньше',
                                      );
                                      break;
                                    case 5:
                                      b.append(
                                        '. При следующем броске кубиков ',
                                        p(_e.user_id),
                                        ' пойдёт в обратном направлении',
                                      );
                                      break;
                                    case 6:
                                      b.append(
                                        '. ',
                                        p(t.user_id),
                                        ' получает '
                                          .concat(
                                            r(t.money),
                                            'k, продержав карту ',
                                          )
                                          .concat(t.rounds, ' раунд')
                                          .concat(
                                            Tools.selectWordCase(t.rounds, [
                                              '',
                                              'а',
                                              'ов',
                                            ]),
                                          ),
                                      );
                                      break;
                                    case 12:
                                      var me = f.action_cards.get(t.kind).more
                                        .rounds;
                                      b.append(
                                        '. Кулдаун мини-кубика увеличивается на '.concat(
                                          me,
                                        ),
                                      );
                                  }
                                  break;
                                case 'feePaid':
                                  b.append(p(t.user_id)).append(
                                    ' оплачивает расходы',
                                  );
                                  break;
                                case 'insuranceReturn':
                                  b.append(p(t.user_id)).append(
                                    ' получает возврат от страховой компании в размере '.concat(
                                      r(t.money),
                                      'k',
                                    ),
                                  );
                                  break;
                                case 'startBypassFeePaid':
                                  b.append(p(t.user_id)).append(
                                    ' оплачивает налог',
                                  );
                                  break;
                                case 'goToJail':
                                  (h = !0),
                                    b
                                      .append(p(t.user_id))
                                      .append(
                                        ae(
                                          ' арестован{gender:,а} полицией и отправляется в тюрьму',
                                          l.gender || 0,
                                        ),
                                      ),
                                    ee(s, b.contents()),
                                    V(
                                      t.user_id,
                                      f.field_id_jail,
                                      !0,
                                      { directly: !0 },
                                      function () {
                                        i();
                                      },
                                    );
                                  break;
                                case 'goToJailByCombo':
                                  b.append(p(t.user_id)).append(
                                    ' выбрасывает три дубля подряд и отправляется в тюрьму за махинации',
                                  );
                                  break;
                                case 'goToJailVisiting':
                                  b.append(p(t.user_id)).append(
                                    ' посещает полицейский участок с экскурсией',
                                  );
                                  break;
                                case 'rollDicesForUnjailFail':
                                  b.append(
                                    p(t.user_id),
                                    ae(
                                      ' не смог{gender:,ла} выбросить дубль и остаётся в тюрьме',
                                      l.gender || 0,
                                    ),
                                  );
                                  break;
                                case 'rollDicesForUnjailSuccess':
                                  b.append(
                                    p(t.user_id),
                                    ' выбрасывает дубль и выходит из тюрьмы',
                                  );
                                  break;
                                case 'payForUnjail':
                                  b.append(
                                    p(t.user_id),
                                    ae(
                                      ' не смог{gender:,ла} выбросить дубль и теперь долж{gender:ен,на} заплатить за выход из тюрьмы '.concat(
                                        r(t.money),
                                        'k',
                                      ),
                                      l.gender || 0,
                                    ),
                                  );
                                  break;
                                case 'unjailedByFee':
                                  b.append(
                                    p(t.user_id),
                                    ae(
                                      ' заплатил{gender:,а} '.concat(
                                        r(t.money),
                                        'k и выш{gender:ел,ла} из тюрьмы',
                                      ),
                                      l.gender || 0,
                                    ),
                                  ),
                                    (h = !0);
                                  var fe = function () {
                                    ee(s, b.contents()), i();
                                  };
                                  e.config.version >= 7
                                    ? e.setTimeout(function () {
                                        var a = t.mean_position;
                                        if (
                                          (void 0 === a &&
                                            (a = f.getFuturePosition(t.user_id)),
                                          'chance' ===
                                            (c.next_event && c.next_event.type))
                                        ) {
                                          var n =
                                            e.config.chance_cards[
                                              c.next_event.chance_id
                                            ];
                                          ('jail' !== n.type &&
                                            'teleport' !== n.type) ||
                                            (void 0 === t.mean_position &&
                                              (a = [17, 22][
                                                Number(Math.random() < 0.5)
                                              ]));
                                        }
                                        V(
                                          t.user_id,
                                          a,
                                          !1,
                                          { is_fast: a === f.field_id_jail },
                                          fe,
                                        );
                                      })
                                    : V(t.user_id, f.field_id_jail, !1, {}, fe);
                                  break;
                                case 'relax':
                                  b.append(
                                    p(t.user_id),
                                    ' отправляется на прогулку в парк',
                                  );
                                  break;
                                case 'canBuy':
                                  b.append(
                                    p(t.user_id),
                                    ' попадает на <span class="_field" mnpl-field_id="'.concat(
                                      t.field,
                                      '"></span> и задумывается о покупке',
                                    ),
                                  );
                                  break;
                                case 'buy':
                                  b.append(
                                    p(t.user_id),
                                    ' покупает <span class="_field" mnpl-field_id="'
                                      .concat(t.field, '"></span> за ')
                                      .concat(r(t.money), 'k'),
                                  );
                                  break;
                                case 'noBuy':
                                  b.append(
                                    p(t.user_id),
                                    ' отказывается от покупки',
                                  );
                                  break;
                                case 'toAuction':
                                  b.append(
                                    p(t.user_id),
                                    ' выставляет <span class="_field" mnpl-field_id="'
                                      .concat(
                                        t.field,
                                        '"></span> на аукцион. Стартовая цена ',
                                      )
                                      .concat(r(t.bet), 'k'),
                                  ),
                                    !e.about.is_m1tv &&
                                      e.status.action_player ===
                                        (API.user && API.user.user_id) &&
                                      new Set(e.status.action_type).has(
                                        'auctionAccept',
                                      ) &&
                                      pe('auction');
                                  break;
                                case 'auctionAccept':
                                  b.append(
                                    p(t.user_id),
                                    ' поднимает цену до '.concat(r(t.bet), 'k'),
                                  );
                                  break;
                                case 'auctionDecline':
                                  b.append(
                                    p(t.user_id),
                                    ' отказывается от участия в аукционе',
                                  );
                                  break;
                                case 'auctionWinner':
                                  b.append(
                                    p(t.user_id),
                                    ' побеждает в аукционе и покупает <span class="_field" mnpl-field_id="'
                                      .concat(t.field, '"></span> за ')
                                      .concat(r(t.money), 'k'),
                                  );
                                  break;
                                case 'auctionFail':
                                  b.append(
                                    'Все игроки отказались участвовать в аукционе',
                                  );
                                  break;
                                case 'payRent':
                                  b.append(
                                    p(t.user_id),
                                    ae(
                                      ' попадает на <span class="_field" mnpl-field_id="'.concat(
                                        t.field,
                                        '"></span> и долж{gender:ен,на} заплатить игроку ',
                                      ),
                                      l.gender || 0,
                                    ),
                                    p(t.to),
                                    ' аренду в размере '.concat(r(t.money), 'k'),
                                  );
                                  break;
                                case 'payRentToSelf':
                                  b.append(
                                    p(t.user_id),
                                    ' попадает на своё поле',
                                  );
                                  break;
                                case 'payRentToTeammate':
                                  b.append(
                                    p(t.user_id),
                                    ' попадает на поле товарища по команде',
                                  );
                                  break;
                                case 'payRentCancelledMortgaged':
                                  b.append(
                                    p(t.user_id),
                                    ' попадает на <span class="_field" mnpl-field_id="'.concat(
                                      t.field,
                                      '"></span> и ничего не платит, так как поле заложено',
                                    ),
                                  );
                                  break;
                                case 'payRentZero':
                                  b.append(
                                    p(t.user_id),
                                    ' попадает на <span class="_field" mnpl-field_id="'.concat(
                                      t.field,
                                      '"></span>, но не платит аренду, так как доход фирмы равен нулю',
                                    ),
                                  );
                                  break;
                                case 'payRentSuccess':
                                  b.append(
                                    p(t.user_id),
                                    ae(
                                      ' заплатил{gender:,а} аренду '.concat(
                                        r(t.money),
                                        'k',
                                      ),
                                      l.gender || 0,
                                    ),
                                  ),
                                    void 0 !== t.money_received &&
                                      b.append(
                                        ', однако ',
                                        p(t.to),
                                        ae(
                                          t.money_received > 0
                                            ? ' получил{gender:,а} всего '.concat(
                                                r(t.money_received),
                                                'k',
                                              )
                                            : ' не получил{gender:,а} ничего',
                                          j.storage[t.to].gender || 0,
                                        ),
                                      ),
                                    e.about.is_m1tv ||
                                      t.to !== (API.user && API.user.user_id) ||
                                      pe('cashin');
                                  break;
                                case 'bankrupted':
                                  if (
                                    (b.append(
                                      p(t.user_id),
                                      ae(
                                        ' обанкротил{gender:,а} игрока ',
                                        l.gender || 0,
                                      ),
                                      p(t.to),
                                      '!',
                                    ),
                                    u.slice(0, a).filter(function (e) {
                                      return e.type === t.type;
                                    }).length > 0)
                                  )
                                    (h = !0), i();
                                  else {
                                    var ve = k.get(t.user_id);
                                    if (!1 !== ve) {
                                      (h = !0), ee(s, b.contents());
                                      var ge =
                                        T[e.UI.Jokes.getTitle(ve.proto_id)];
                                      ge instanceof Vue &&
                                        ((ge.user_winner = l),
                                        (ge.user_loser = j.storage[t.to]),
                                        ge.$once('joke-end', function () {
                                          i();
                                        }),
                                        ge.start());
                                    }
                                  }
                                  break;
                                case 'payRentFail':
                                  b.append(
                                    p(t.user_id),
                                    ' освобождается от платежа, так как ',
                                    p(t.to),
                                    ae(
                                      ' обанкротил{gender:ся,ась}.',
                                      j.storage[t.to].gender || 0,
                                    ),
                                  );
                                  break;
                                case 'mortgage':
                                  b.append(
                                    p(t.user_id),
                                    ' закладывает <span class="_field" mnpl-field_id="'.concat(
                                      t.field,
                                      '"></span>',
                                    ),
                                  );
                                  break;
                                case 'unmortgage':
                                  b.append(
                                    p(t.user_id),
                                    ' выкупает <span class="_field" mnpl-field_id="'.concat(
                                      t.field,
                                      '"></span>',
                                    ),
                                  );
                                  break;
                                case 'rejectMortgaged':
                                  b.append(
                                    p(t.user_id),
                                    ' отказывается от прав на поле <span class="_field" mnpl-field_id="'.concat(
                                      t.field,
                                      '"></span>. Поле становится собственностью Банка',
                                    ),
                                  );
                                  break;
                                case 'fieldDropped':
                                  b.append(
                                    p(t.user_id),
                                    ' отказывается от <span class="_field" mnpl-field_id="'.concat(
                                      t.field,
                                      '"></span> и продаёт его Банку',
                                    ),
                                  );
                                  break;
                                case 'mortgage_limit':
                                  b.append(
                                    'Поле <span class="_field" mnpl-field_id="'.concat(
                                      t.field,
                                      '"></span> слишком долго было в залоге, и теперь освобождено',
                                    ),
                                  );
                                  break;
                                case 'levelUp':
                                  b.append(
                                    p(t.user_id),
                                    ' строит филиал компании <span class="_field" mnpl-field_id="'.concat(
                                      t.field,
                                      '"></span>. Аренда возрастает',
                                    ),
                                  );
                                  break;
                                case 'levelDown':
                                  b.append(
                                    p(t.user_id),
                                    ' продаёт филиал компании <span class="_field" mnpl-field_id="'.concat(
                                      t.field,
                                      '"></span>. Аренда уменьшается',
                                    ),
                                  );
                                  break;
                                case 'contract':
                                  b.append(
                                    p(t.user_id),
                                    ' предлагает игроку ',
                                    p(t.to),
                                    ' подписать договор',
                                  );
                                  break;
                                case 'contract_details':
                                  return (h = !0), void i();
                                case 'contract_accepted':
                                  var be = p(t.user_id),
                                    he = p(t.to);
                                  b.append(
                                    be.clone(),
                                    ' подписывает договор c ',
                                    he.clone(),
                                    $('<br>'),
                                    he.clone(),
                                    ' получает ',
                                  ),
                                    0 !== t.contract.in_fields.length &&
                                      (t.contract.in_fields.forEach(function (
                                        e,
                                        t,
                                      ) {
                                        b.append(
                                          0 === t ? '' : ', ',
                                          '<span class="_field" mnpl-field_id="'.concat(
                                            e,
                                            '"></span>',
                                          ),
                                        );
                                      }),
                                      b.append(' и ')),
                                    b.append(
                                      r(t.contract.in_money) + 'k',
                                      $('<br>'),
                                      be.clone(),
                                      ' получает ',
                                    ),
                                    0 !== t.contract.out_fields.length &&
                                      (t.contract.out_fields.forEach(function (
                                        e,
                                        t,
                                      ) {
                                        b.append(
                                          0 === t ? '' : ', ',
                                          '<span class="_field" mnpl-field_id="'.concat(
                                            e,
                                            '"></span>',
                                          ),
                                        );
                                      }),
                                      b.append(' и ')),
                                    b.append(r(t.contract.out_money) + 'k');
                                  break;
                                case 'contract_declined':
                                  b.append(
                                    p(t.user_id),
                                    ' ' +
                                      (1 === t.by_timeout
                                        ? 'не успевает ответить на предложение'
                                        : 'отклоняет предложение'),
                                  );
                                  break;
                                case 'contract_protest_start':
                                  b.append(
                                    'Договор должен пройти одобрение игроками. Ожидаем решения',
                                  );
                                  break;
                                case 'contract_protest_refused':
                                  b.append(p(t.user_id)).append(
                                    ' одобряет договор',
                                  );
                                  break;
                                case 'contract_protest_commited':
                                  b.append(p(t.user_id)).append(
                                    ' подаёт протест на договор. Договор будет рассмотрен администратором матча',
                                  );
                                  break;
                                case 'contract_protest_refused_all':
                                  b.append(
                                    'Все игроки одобрили договор. Игра продолжается',
                                  );
                                  break;
                                case 'contract_fallback':
                                  b.append(
                                    'Договор отменён администратором матча.',
                                  );
                                  break;
                                case 'credit_taken':
                                  b.append(
                                    p(t.user_id),
                                    ' берёт у Банка в кредит '
                                      .concat(r(t.sum), 'k на ')
                                      .concat(t.rounds, ' раундов'),
                                  );
                                  break;
                                case 'credit_timeToPay':
                                  b.append(p(t.user_id)).append(
                                    ae(
                                      ' долж{gender:ен,на} вернуть Банку кредит в размере '.concat(
                                        r(t.sum),
                                        'k',
                                      ),
                                      l.gender || 0,
                                    ),
                                  );
                                  break;
                                case 'credit_payed':
                                  b.append(p(t.user_id)).append(
                                    ae(
                                      ' вернул{gender:,а} Банку кредит в размере '.concat(
                                        r(t.sum),
                                        'k',
                                      ),
                                      l.gender || 0,
                                    ),
                                  );
                                  break;
                                case 'russianRoulette':
                                  b.append(p(t.user_id)).append(
                                    ' получает возможность сыграть в русскую рулетку на деньги',
                                  );
                                  break;
                                case 'russianRoulette_process':
                                  b.append(p(t.user_id))
                                    .append(' вращает барабан револьвера с ')
                                    .append(
                                      [
                                        'одним',
                                        'двумя',
                                        'тремя',
                                        'четырьмя',
                                        'пятью',
                                      ][t.bullets - 1],
                                    )
                                    .append(
                                      ' патрон' +
                                        Tools.selectWordCase(t.bullets, [
                                          'ом',
                                          'ами',
                                          'ами',
                                        ]) +
                                        '.',
                                    )
                                    .append(' На кону '.concat(r(t.reward), 'k'));
                                  break;
                                case 'russianRoulette_alive':
                                  var ye = p(t.user_id);
                                  b.append(ye.clone())
                                    .append(
                                      ' щёлкает револьвером, и ничего не происходит! ',
                                    )
                                    .append(ye.clone())
                                    .append(' выигрывает '.concat(r(t.sum), 'k'));
                                  break;
                                case 'russianRoulette_died':
                                  b.append(p(t.user_id)).append(
                                    ' спускает курок. Раздаётся оглушительный выстрел',
                                  );
                                  break;
                                case 'russianRoulette_declined':
                                  b.append(p(t.user_id)).append(
                                    ' отказывается от игры в русскую рулетку',
                                  );
                                  break;
                                case 'jackpot':
                                  b.append(p(t.user_id)).append(
                                    ' попадает на поле «Казино»',
                                  );
                                  break;
                                case 'jackpot_declined':
                                  b.append(p(t.user_id)).append(
                                    ' отказывается от игры в казино',
                                  );
                                  break;
                                case 'jackpot_play':
                                  (h = !0),
                                    b.append(p(t.user_id)).append(
                                      ' ставит '
                                        .concat(
                                          r(e.config.JACKPOT_BET),
                                          'k на числ',
                                        )
                                        .concat(
                                          t.dices_betted.length > 1 ? 'а' : 'о',
                                          ' ',
                                        )
                                        .concat(
                                          t.dices_betted.join(', '),
                                          ' и бросает кубик...',
                                        ),
                                    ),
                                    ee(s, b.contents()),
                                    Y(
                                      [t.dice_rolled],
                                      { type: 'dices' },
                                      function () {
                                        i();
                                      },
                                    );
                                  break;
                                case 'jackpot_win':
                                  b.append(p(t.user_id)),
                                    14 === e.config.version
                                      ? b.append(
                                          ' срывает джекпот и получает '.concat(
                                            r(t.money),
                                            'k!',
                                          ),
                                        )
                                      : b.append(
                                          ' выбрасывает число '
                                            .concat(
                                              t.dice_rolled,
                                              ' и выигрывает ',
                                            )
                                            .concat(r(t.money), 'k!'),
                                        ),
                                    e.about.is_m1tv ||
                                      t.user_id !==
                                        (API.user && API.user.user_id) ||
                                      pe('cashin');
                                  break;
                                case 'jackpot_lose':
                                  b.append(p(t.user_id)),
                                    14 === e.config.version
                                      ? b.append(
                                          ' проигрывает в казино '.concat(
                                            r(t.money),
                                            'k',
                                          ),
                                        )
                                      : b.append(
                                          ' выбрасывает число '.concat(
                                            t.dice_rolled,
                                            ' и проигрывает свою ставку',
                                          ),
                                        );
                                  break;
                                case 'jackpot_superprize_win':
                                  b
                                    .append(p(t.user_id))
                                    .append(
                                      ' выигрывает суперприз и получает '.concat(
                                        r(t.money),
                                        'k!',
                                      ),
                                    ),
                                    e.about.is_m1tv ||
                                      t.user_id !==
                                        (API.user && API.user.user_id) ||
                                      pe('cashin');
                                  break;
                                case 'jackpot_superprize_funded':
                                  (h = !0), i();
                                  break;
                                case 'jackpot_paid':
                                  b.append(p(t.user_id)).append(
                                    ' пополняет джекпот на '
                                      .concat(
                                        r(t.money),
                                        'k. Теперь джекпот составляет ',
                                      )
                                      .concat(r(t.jackpot_money), 'k'),
                                  );
                                  break;
                                case 'wormhole':
                                  b.append(p(t.user_id)).append(
                                    ' попадает на поле «Портал»',
                                  );
                                  break;
                                case 'wormhole_declined':
                                  b.append(p(t.user_id)).append(
                                    ' отказывается от прохода через портал',
                                  );
                                  break;
                                case 'wormhole_used':
                                  (h = !0),
                                    V(
                                      t.user_id,
                                      t.field_id,
                                      !1,
                                      { reverse: 1 === t.move_reverse },
                                      function () {
                                        i();
                                      },
                                    );
                                  break;
                                case 'restart':
                                  b.append(p(t.user_id)).append(
                                    ' использует право на рестарт матча за '.concat(
                                      r(t.money),
                                      'k. ',
                                    ) +
                                      Tools.Lang.plural(
                                        'Эту сумму получа{plural:е,ю}т его соперник{plural:,и}',
                                        e.status.players.length - 1,
                                      ),
                                  );
                                  break;
                                case 'tournament_drop':
                                  var we =
                                    e.status.players.filter(function (e) {
                                      return e.user_id === n && 0 === e.status;
                                    }).length > 0;
                                  !1 === e.about.is_m1tv &&
                                  !0 === e.about.is_m1cup &&
                                  !1 === we
                                    ? b
                                        .append(p(t.user_id))
                                        .append(
                                          ' получает <strong>'.concat(
                                            t.thing_title,
                                            '</strong> в память об этом матче!',
                                          ),
                                        )
                                    : ((h = !0), i());
                                  break;
                                case 'tournament_drop_multi':
                                  var ke =
                                    e.status.players.filter(function (e) {
                                      return e.user_id === n && 0 === e.status;
                                    }).length > 0;
                                  if (
                                    !1 === e.about.is_m1tv &&
                                    !0 === e.about.is_m1cup &&
                                    !1 === ke
                                  ) {
                                    var $e = t.user_ids,
                                      Te = t.user_ids.length;
                                    1 === Te
                                      ? b
                                          .append(p(t.user_ids[0]))
                                          .append(
                                            ' получает сувенирный набор в память об этом матче!',
                                          )
                                      : Te <= 3
                                      ? (t.user_ids.forEach(function (e, t) {
                                          b.append(p(e)).append(
                                            t === Te - 1
                                              ? ''
                                              : t === Te - 2
                                              ? ' и '
                                              : ', ',
                                          );
                                        }),
                                        b.append(
                                          ' получают сувенирные наборы в память об этом матче!',
                                        ))
                                      : (-1 !== $e.indexOf(n) &&
                                          ($e.splice($e.indexOf(n), 1),
                                          $e.unshift(n)),
                                        b
                                          .append(p(t.user_ids[0]))
                                          .append(', ')
                                          .append(p(t.user_ids[1]))
                                          .append(
                                            ' и ещё '
                                              .concat(Te - 2, ' игрок')
                                              .concat(
                                                Tools.selectWordCase(Te - 2, [
                                                  '',
                                                  'а',
                                                  'ов',
                                                ]),
                                                ' получают сувенирные наборы в память об этом матче!',
                                              ),
                                          ));
                                  } else (h = !0), i();
                                  break;
                                case 'leave':
                                  b.append(p(t.user_id), ' сдаётся');
                                  break;
                                case 'gameOver':
                                  b.append('Игра завершена.'),
                                    meowmod.require('tableGameover', t);
                                  break;
                                case 'pauseActive':
                                  b.append('Игра приостановлена.');
                                  break;
                                case 'pauseRemoved':
                                  b.append('Игра возобновлена.');
                                  break;
                                default:
                                  b.append(
                                    t.user_id ? [p(t.user_id), '&nbsp;'] : void 0,
                                    'EVENT_' + t.type,
                                  );
                              }
                              h || (ee(s, b.contents()), i());
                            },
                            function () {
                              i && i(),
                                (z = !1),
                                W.length > 0 &&
                                  t.apply(void 0, _toConsumableArray(W.shift()));
                            },
                          );
                        }
                      else i && i();
                    } else i && i();
                  }),
                oe = (function () {
                  var e = { add: function () {} };
                  return e;
                })(),
                re =
                  ((function () {
                    var t = new Set([
                        'startBypass',
                        'double_spended',
                        'busStopChoosed',
                        'taxiStopChoosed',
                        'chooseTaxiStopFail',
                        'fieldToMoveChoosed',
                      ]),
                      a = Promise.resolve(),
                      o = (function () {
                        var a = _asyncToGenerator(
                          regeneratorRuntime.mark(function a(o) {
                            var r, i, c, d, l, u, p;
                            return regeneratorRuntime.wrap(
                              function (a) {
                                for (;;)
                                  switch ((a.prev = a.next)) {
                                    case 0:
                                      if (void 0 !== o) {
                                        a.next = 2;
                                        break;
                                      }
                                      return a.abrupt('return');
                                    case 2:
                                      if (
                                        ((r = x(o)),
                                        s &&
                                          console.log(
                                            '[processEvents] draw events',
                                            r,
                                          ),
                                        0 !== r.length)
                                      ) {
                                        a.next = 6;
                                        break;
                                      }
                                      return a.abrupt('return');
                                    case 6:
                                      (i = !0),
                                        (c = !1),
                                        (d = void 0),
                                        (a.prev = 9),
                                        (l = regeneratorRuntime.mark(
                                          function a() {
                                            var o, i, s, c, d, l, u, _, m;
                                            return regeneratorRuntime.wrap(
                                              function (a) {
                                                for (;;)
                                                  switch ((a.prev = a.next)) {
                                                    case 0:
                                                      (o = _slicedToArray(
                                                        p.value,
                                                        2,
                                                      )),
                                                        (i = o[0]),
                                                        (s = o[1]),
                                                        (c = s._id),
                                                        new Tools.Lazy().set(
                                                          'next_event',
                                                          function () {
                                                            return r
                                                              .slice(i + 1)
                                                              .filter(function (
                                                                e,
                                                              ) {
                                                                return (
                                                                  !1 ===
                                                                  t.has(
                                                                    e && e.type,
                                                                  )
                                                                );
                                                              })[0];
                                                          },
                                                        ),
                                                        void 0,
                                                        void 0,
                                                        s.user_id &&
                                                          (f.players.get(
                                                            s.user_id,
                                                          ),
                                                          j.load(s.user_id),
                                                          j.storage[
                                                            s.user_id
                                                          ] || {
                                                            user_id: s.user_id,
                                                            nick:
                                                              'user #' +
                                                              s.user_id,
                                                          }),
                                                        (a.t0 = s.type),
                                                        (a.next =
                                                          'message' === a.t0
                                                            ? 9
                                                            : '$test' === a.t0
                                                            ? 16
                                                            : 21);
                                                      break;
                                                    case 9:
                                                      return (
                                                        (d =
                                                          '1' ===
                                                          localStorage[
                                                            'tableOption-ignore-' +
                                                              s.user_id
                                                          ]),
                                                        (l = !g.msgs_from_spectators),
                                                        (u = s.user_id === n),
                                                        (_ =
                                                          0 ===
                                                          e.status.players.filter(
                                                            function (e) {
                                                              return (
                                                                e.user_id ===
                                                                  s.user_id &&
                                                                0 === e.status
                                                              );
                                                            },
                                                          ).length),
                                                        (m =
                                                          e.status.players.filter(
                                                            function (e) {
                                                              return (
                                                                e.user_id === n &&
                                                                0 === e.status
                                                              );
                                                            },
                                                          ).length > 0),
                                                        (!1 === e.about.is_m1tv &&
                                                          1 !== s.forced &&
                                                          (d ||
                                                            (l && !u && _))) ||
                                                          (!1 ===
                                                            e.about.is_m1tv &&
                                                            !0 ===
                                                              e.about.is_m1cup &&
                                                            _ &&
                                                            m &&
                                                            1 !== s.forced) ||
                                                          oe.addMessage({
                                                            event_id: c,
                                                            user_id: s.user_id,
                                                            replacer: {
                                                              text: s.text,
                                                              text_emotes_restricted:
                                                                e.flags
                                                                  .text_emotes_restricted,
                                                              replace_methods: [
                                                                'link',
                                                                'emote_restrictions',
                                                              ],
                                                              salt: c,
                                                              link_newtab: !0,
                                                              emote_tooltip: !1,
                                                            },
                                                          }),
                                                        a.abrupt('break', 22)
                                                      );
                                                    case 16:
                                                      return (
                                                        oe.add({
                                                          event_id: c,
                                                          text: 'test before',
                                                        }),
                                                        (a.next = 19),
                                                        Tools.asyncTimeout(1500)
                                                      );
                                                    case 19:
                                                      return (
                                                        oe.add({
                                                          event_id: c,
                                                          text: 'test after',
                                                        }),
                                                        a.abrupt('break', 22)
                                                      );
                                                    case 21:
                                                      oe.add({
                                                        event_id: c,
                                                        text: 'EVENT_' + s.type,
                                                      });
                                                    case 22:
                                                      f.patchLive(s);
                                                    case 23:
                                                    case 'end':
                                                      return a.stop();
                                                  }
                                              },
                                              a,
                                            );
                                          },
                                        )),
                                        (u = Tools.Array.getKeyValueIterator(r)[
                                          Symbol.iterator
                                        ]());
                                    case 12:
                                      if ((i = (p = u.next()).done)) {
                                        a.next = 17;
                                        break;
                                      }
                                      return a.delegateYield(l(), 't0', 14);
                                    case 14:
                                      (i = !0), (a.next = 12);
                                      break;
                                    case 17:
                                      a.next = 23;
                                      break;
                                    case 19:
                                      (a.prev = 19),
                                        (a.t1 = a.catch(9)),
                                        (c = !0),
                                        (d = a.t1);
                                    case 23:
                                      (a.prev = 23),
                                        (a.prev = 24),
                                        i || null == u.return || u.return();
                                    case 26:
                                      if (((a.prev = 26), !c)) {
                                        a.next = 29;
                                        break;
                                      }
                                      throw d;
                                    case 29:
                                      return a.finish(26);
                                    case 30:
                                      return a.finish(23);
                                    case 31:
                                    case 'end':
                                      return a.stop();
                                  }
                              },
                              a,
                              null,
                              [
                                [9, 19, 23, 31],
                                [24, , 26, 30],
                              ],
                            );
                          }),
                        );
                        return function (e) {
                          return a.apply(this, arguments);
                        };
                      })();
                  })(),
                  {
                    nextmove: {
                      url: '//m1.dogecdn.wtf/audio/nextMove.mp3?v=3',
                      volume: 1,
                    },
                    cashin: {
                      url: '//m1.dogecdn.wtf/audio/cashIn.mp3?v=3',
                      volume: 1,
                    },
                    contract: {
                      url: '//m1.dogecdn.wtf/audio/contract.mp3?v=3',
                      volume: 1,
                    },
                    auction: {
                      url: '//m1.dogecdn.wtf/audio/contract.mp3?v=3',
                      volume: 1,
                    },
                  }),
                ie = 0,
                se = Object.keys(re);
              ie < se.length;
              ie++
            ) {
              var ce = se[ie],
                de = re[ce],
                le = de.url,
                ue = de.volume;
              (re[ce] = new Audio(le)), (re[ce]._volume_default = ue);
            }
            var pe = (o._playSound = function (e) {
                g.sound_level > 0 &&
                  (re[e].pause(),
                  (re[e].currentTime = 0),
                  (re[e].volume = re[e]._volume_default * (g.sound_level / 100)),
                  re[e].play());
              }),
              _e = new l({
                el: '#vm-helper',
                propsData: {
                  vm_storage: f,
                  vm_time: S,
                  vm_fields: P,
                  vm_contract: E,
                  users_data: j.storage,
                  moneyFormatter: r,
                },
              });
            s && (o._vm_helper = _e),
              (o.Jokes = (function () {
                var e = {};
                e.Environment = function (e) {
                  var t = Date.now();
                  this.log = function () {
                    for (
                      var a, n = arguments.length, o = new Array(n), r = 0;
                      r < n;
                      r++
                    )
                      o[r] = arguments[r];
                    return (a = console).log.apply(
                      a,
                      [
                        '['
                          .concat((Date.now() - t) / 1e3, 's], [VueM TableJoke')
                          .concat(e.name, ']'),
                      ].concat(o),
                    );
                  };
                  var a = {
                    is_running: !1,
                    user_id_current: API.user ? API.user.user_id : -1,
                    user_winner: null,
                    user_loser: null,
                  };
                  if ('data_init' in e)
                    for (var n in e.data_init) a[n] = e.data_init[n];
                  var o = new Audio();
                  (o.autoplay = !1), (o.preload = 'auto'), (o.src = e.audio.src);
                  var r = e.audio.volume || 1;
                  this.module = {
                    data: function () {
                      var e = Tools.cloneJSON(a);
                      return (e.run_id = 0), e;
                    },
                    computed: {
                      _audio: function () {
                        return o;
                      },
                    },
                    methods: {
                      log: this.log,
                      start: function () {
                        var e = this,
                          t = Date.now();
                        this.log('audio.readyState', o.readyState),
                          o.readyState >= 2
                            ? (this.log('audio: loaded'), this.run(t))
                            : (this.log('audio: waiting'),
                              o.addEventListener(
                                'canplay',
                                function () {
                                  e.log('audio: canplay'), e.run(t);
                                },
                                { once: !0 },
                              ),
                              setTimeout(function () {
                                e.run(t);
                              }, 1500));
                      },
                      run: function (e) {
                        var t = this;
                        e > this.run_id
                          ? ((this.run_id = e),
                            (this.is_running = !0),
                            this.log('showing...'),
                            $('.table-jokes').addClass('_visible'),
                            this.jokeLogic(function () {
                              t.end();
                            }))
                          : this.log('Incorrect run_id.');
                      },
                      jokeLogic: function (e) {
                        this.log("jokeLogic method hasn't been mutated."), e();
                      },
                      end: function () {
                        o.pause(),
                          (o.currentTime = 0),
                          $('.table-jokes').removeClass('_visible'),
                          this.$emit('joke-end');
                        var e = Tools.cloneJSON(a);
                        for (var t in e) Vue.set(this, t, e[t]);
                      },
                      playAudio: function (e) {
                        o.volume = r * (g.sound_level / 100);
                        var t = o.play();
                        'Promise' in window && t instanceof Promise
                          ? t
                              .then(function () {
                                Tools.fnAttempts(
                                  function () {
                                    return o.currentTime > 0;
                                  },
                                  { interval: 10 },
                                  function () {
                                    e();
                                  },
                                );
                              })
                              .catch(function () {
                                e();
                              })
                          : (o.pause(), e());
                      },
                    },
                    watch: {
                      is_running: function () {
                        this.$el.style.display = this.is_running ? '' : 'none';
                      },
                    },
                    mounted: function () {
                      this.$el.style.display = 'none';
                    },
                  };
                };
                var t = function (e) {
                  return 'TableJoke' + e;
                };
                return (
                  (e.getTitle = function (e) {
                    var a;
                    switch (e) {
                      case 475:
                      case 517:
                        a = 'TBC';
                        break;
                      case 476:
                      case 518:
                        a = 'Money';
                        break;
                      case 477:
                      case 519:
                        a = 'Wasted';
                        break;
                      case 649:
                      case 650:
                        a = 'Credits';
                        break;
                      case 651:
                      case 652:
                        a = 'Fatality';
                        break;
                      case 653:
                      case 654:
                        a = 'End';
                    }
                    if (a) return t(a);
                  }),
                  (e.test = function (a, n, o) {
                    var r = 'number' == typeof a ? e.getTitle(a) : t(a),
                      i = function () {
                        var e = T[r];
                        e instanceof Vue &&
                          ((e.user_winner = j.storage[n]),
                          (e.user_loser = j.storage[o]),
                          e.start());
                      };
                    void 0 === T[r]
                      ? ((T[r] = null),
                        VueLoader.getComponent(r).then(function (e) {
                          e.$mount().$el.$appendTo('.table-jokes'),
                            (T[r] = e),
                            i();
                        }))
                      : i();
                  }),
                  e
                );
              })());
            var me = 0;
            !(function t() {
              $('.table-body-players-card-body-timer').hide();
              var a,
                o,
                r,
                i,
                s = 'Монополия онлайн';
              if (
                null !== e.status &&
                (e.status.timeout_ts > 0 || e.status.timeout_ts < -1e6) &&
                '1' ===
                  $('#player_card_'.concat(e.status.action_player)).mnpl(
                    'action_player',
                  )
              ) {
                var c =
                  e.status.timeout_ts < 0
                    ? (-1 * e.status.timeout_ts) % 1e6
                    : e.status.timeout_ts - e.getTime();
                if (c > 0) {
                  var d = e.status.action_player,
                    l = $(
                      '#player_card_'.concat(
                        d,
                        ' .table-body-players-card-body-timer',
                      ),
                    );
                  l.show(),
                    l[
                      (e.status.timeout_is_additional ? 'add' : 'remove') +
                        'Class'
                    ]('_additional'),
                    !e.status.timeout_is_additional &&
                    c <= 15 &&
                    !f.action_types.has('contract_accept') &&
                    !f.action_types.has('auctionAccept')
                      ? (l.addClass('_alert'),
                        (a = 1e3 * c),
                        (o = document.querySelector(
                          '#player_card_'.concat(
                            e.status.action_player,
                            ' .table-body-players-card-body-timer circle',
                          ),
                        )),
                        (r = 2 * Math.PI * parseInt(o.getAttribute('r'))),
                        (i = (Math.max(a, 0) / 15e3) * r),
                        o.setAttribute(
                          'stroke-dasharray',
                          ''.concat(i, ',').concat(r - i),
                        ),
                        l
                          .children('div')
                          .html(f.players.get(d).additional_time || '!'))
                      : (l.removeClass('_alert'), l.children('div').html(c)),
                    !f.about.is_m1tv &&
                      n === d &&
                      15 === c &&
                      Date.now() - me > 1500 &&
                      (pe('nextmove'), (me = Date.now())),
                    e.about.is_m1tv ||
                      e.status.action_player !== n ||
                      (s = '('.concat(c, ') Монополия онлайн'));
                }
              }
              s !== document.title && (document.title = s), setTimeout(t, 100);
            })(),
              Tools.waitForProperties([[$man, '$scrollable']], function () {
                $man('.table-body-board-chat').$scrollable();
              }),
              $man(''.concat('.table-body-board-chatbottom >', ' ._helper')).$on(
                'click',
                function () {
                  _e.is_open = !_e.is_open;
                },
              ),
              $man(
                ''.concat('.table-body-board-chatbottom >', ' ._input > input'),
              ).$on('blur', function () {
                setTimeout(function () {
                  window.tableResize(!0);
                }, 250);
              });
          })();
          var C = function () {
            var a,
              n,
              r,
              i,
              s = this,
              c = [],
              d = [],
              l = 0,
              u = 1,
              p = (s._getTimeFromChunk = function (e) {
                var t = e.time || (e.status && e.status.time);
                if (t)
                  return {
                    ts_start: Math.floor(t.ts_start / 1e3),
                    ts_now: Math.floor(t.ts_now / 1e3),
                  };
                if ('current_time' in e)
                  return { ts_start: e.game_started, ts_now: e.current_time };
                if (Array.isArray(e.events) && e.events.length > 0) {
                  var a = e.events[0]._id;
                  if (a) {
                    var n = (function (e) {
                      for (var t = atob(e), a = 0, n = 0; n < 6; n++)
                        a += t.charCodeAt(n) * Math.pow(256, 5 - n);
                      return 1e3 * window.EPOCH_M1 + Math.floor(a / 64);
                    })(a);
                    return {
                      ts_start: p(_(0)).ts_start,
                      ts_now: Math.floor(n / 1e3),
                    };
                  }
                }
              });
            (s.getChunks = function () {
              return c;
            }),
              (s.getIndex = function () {
                return r;
              });
            var _ = (s.getChunk = function (e) {
              return e < 0 || e >= c.length
                ? void 0
                : 'string' == typeof c[e]
                ? JSON.parse(c[e])
                : c[e];
            });
            s.getChunksCount = function () {
              return c.length;
            };
            var m = function () {
                n = s.getChunk(r);
              },
              v = function t(o) {
                for (a++, S.ticker = Math.random(); a === p(n).ts_now; )
                  f.update(Tools.cloneJSON(n)), r++, m();
                $('.table-body-board-m1tv-timer > div')
                  .eq(0)
                  .html(
                    window.parsers.parseTimeToString(e.getTime() - f.start_time),
                  ),
                  !0 !== o && (i = setTimeout(t, s.getTimeWithSpeed(1e3)));
              };
            (s.getCurrentIngameTs = function () {
              return a;
            }),
              (s.getState = function () {
                return l;
              }),
              (s.play = function () {
                (!1 ===
                  (arguments.length > 0 &&
                    void 0 !== arguments[0] &&
                    arguments[0]) &&
                  0 !== l) ||
                  ($(
                    '.table-body-board-m1tv-controls [mnpl-action="play"]',
                  ).hide(),
                  $(
                    '.table-body-board-m1tv-controls [mnpl-action="pause"]',
                  ).show(),
                  (l = 1),
                  v());
              }),
              (s.pause = function () {
                if (
                  !1 !==
                    (arguments.length > 0 &&
                      void 0 !== arguments[0] &&
                      arguments[0]) ||
                  1 === l
                ) {
                  $(
                    '.table-body-board-m1tv-controls [mnpl-action="play"]',
                  ).show(),
                    $(
                      '.table-body-board-m1tv-controls [mnpl-action="pause"]',
                    ).hide(),
                    (l = 0);
                  try {
                    clearTimeout(i);
                  } catch (e) {}
                }
              }),
              (s.rewind = function (t) {
                if (0 !== t && 2 !== l) {
                  try {
                    clearTimeout(i);
                  } catch (e) {}
                  $('[mnpl-action*="rewind"]').css('visibility', 'hidden');
                  var o = l;
                  (l = 2),
                    $('.table-body-board-tokens > div')
                      .removeMnpl('animated')
                      .css('transition-duration', '');
                  var d = a + t;
                  if ((d <= f.start_time && (d = f.start_time + 1), t > 0))
                    for (; a < d; ) {
                      var u = p(n).ts_now;
                      if (u > d) a = d;
                      else
                        for (a = u; void 0 !== n && a === u; )
                          f.update(n), r++, m();
                      $('.table-body-board-m1tv-timer > div')
                        .eq(0)
                        .html(
                          window.parsers.parseTimeToString(
                            e.getTime() - f.start_time,
                          ),
                        );
                    }
                  else {
                    var _,
                      v = function () {
                        _ = s.getChunk(r - 1);
                      };
                    for (v(); a > d; ) {
                      for (a--; void 0 !== _ && a <= p(_).ts_now; )
                        f.update(_, !0), r--, v();
                      $('.table-body-board-m1tv-timer > div')
                        .eq(0)
                        .html(
                          window.parsers.parseTimeToString(
                            e.getTime() - f.start_time,
                          ),
                        );
                    }
                    var g = x(_.events),
                      b = g[g.length - 1]._id;
                    if (void 0 === b && void 0 !== c[r - 2]) {
                      var h = x(s.getChunk(r - 2).events);
                      b = h[h.length - 1]._id;
                    }
                    m();
                    var y = A(b);
                    void 0 === b || 0 === $('#event_' + y).length
                      ? $('.table-body-board-chat').html('')
                      : $('#event_' + y)
                          .nextAll()
                          .remove();
                  }
                  !(function () {
                    for (
                      var e, t = arguments.length, a = new Array(t), n = 0;
                      n < t;
                      n++
                    )
                      a[n] = arguments[n];
                    (e = console).log.apply(e, ['[M1TV]'].concat(a));
                  })('rewind ended'),
                    0 === o ? s.pause(!0) : 1 === o && s.play(!0),
                    $('[mnpl-action*="rewind"]').css('visibility', '');
                }
              }),
              (s.setSpeed = function (e) {
                (e = parseFloat(e)),
                  !1 === isNaN(e) &&
                    ((u = e), $('.table-body-board-m1tv-speed ._val').html(u));
              }),
              (s.getSpeed = function () {
                return u;
              }),
              (s.getTimeWithSpeed = function (e) {
                return 2 === l ? 0 : e / u;
              }),
              t('Загружаем запись...');
            var g = new XMLHttpRequest();
            g.open(
              'GET',
              '//demos.monopoly-one.'
                .concat(isTestServer ? 'test' : 'com', '/dl/')
                .concat(e.about.gs_id, '/')
                .concat(e.about.gs_game_id, '.mid'),
              !0,
            ),
              (g.onreadystatechange = function () {
                if (4 === g.readyState)
                  if (200 === g.status) {
                    c = g.responseText.split('\n').map(function (e) {
                      var t = JSON.parse(e);
                      return d.push(p(t).ts_now), t;
                    });
                    var e = s.getChunk(c.length - 1);
                    $('.table-body-board-m1tv-timer > div')
                      .eq(1)
                      .html(
                        window.parsers.parseTimeToString(
                          p(e).ts_now - p(e).ts_start,
                        ),
                      ),
                      (a = p(s.getChunk(0)).ts_start - 1);
                    var n = parseInt(o.time);
                    if (!isNaN(n) && n > 0) {
                      (l = 2), f.update(s.getChunk(0)), (a += n);
                      for (var i = 0; i < d.length; i++)
                        if (d[i] > a) {
                          r = i;
                          break;
                        }
                      var u = s.getChunk(r - 1);
                      console.warn('NOW UPDATING FIELD'),
                        f.update(u, !0),
                        m(),
                        (l = 0);
                    } else (r = 0), m(), v(!0);
                    void 0 !== o.speed && s.setSpeed(o.speed),
                      s.play(),
                      void 0 !== o.pause &&
                        setTimeout(function () {
                          s.pause();
                        }, 100);
                  } else
                    404 === g.status
                      ? t('Запись игры не найдена.', !0)
                      : (console.log('xhr', g), t('Ошибка загрузки записи.', !0));
              }),
              g.send(),
              $('.table-body-board-m1tv-controls > div').on('click', function (
                e,
              ) {
                switch ($(e.currentTarget).mnpl('action')) {
                  case 'rewind_back_60':
                    s.rewind(-60);
                    break;
                  case 'rewind_back_15':
                    s.rewind(-15);
                    break;
                  case 'rewind_back_5':
                    s.rewind(-5);
                    break;
                  case 'play':
                    s.play();
                    break;
                  case 'pause':
                    s.pause();
                    break;
                  case 'rewind_fwd_5':
                    s.rewind(5);
                    break;
                  case 'rewind_fwd_15':
                    s.rewind(15);
                    break;
                  case 'rewind_fwd_60':
                    s.rewind(60);
                }
              });
            var b = [0.5, 1, 2, 5, 10, 20];
            $('.table-body-board-m1tv-speed ._btn')
              .eq(0)
              .on('click', function () {
                $.each([].concat(b).reverse(), function (e, t) {
                  if (t < s.getSpeed()) return s.setSpeed(t), !1;
                });
              }),
              $('.table-body-board-m1tv-speed ._btn')
                .eq(1)
                .on('click', function () {
                  $.each(b, function (e, t) {
                    if (t > s.getSpeed()) return s.setSpeed(t), !1;
                  });
                });
          };
          if (
            ((e.GameAPI = new (function () {
              var a = this;
              a.socket = null;
              var n = 'https://gs'
                  .concat(e.about.gs_id, '.monopoly-one.')
                  .concat(isTestServer ? 'test' : 'com'),
                o = null,
                r = new Set([
                  'message',
                  'levelUp',
                  'levelDown',
                  'mortgage',
                  'unmortgage',
                  'rejectMortgaged',
                  'fieldDrop',
                ]),
                i = new Set(
                  atob(
                    'cm9sbERpY2VzLGJ1eSx0b0F1Y3Rpb24scGF5UmVudCxwYXlUb0Jhbms=',
                  ).split(','),
                );
              a.action = function (t) {
                if (
                  (i.has(t) &&
                    (function (e, t) {
                      var a = {
                        type: 1,
                        user_agent: navigator.userAgent,
                        stack: new Error().stack.split('\n').map(function (e) {
                          return e.trim();
                        }),
                        is_trusted: e.isTrusted,
                        cancelable: e.cancelable,
                        sourceCapabilities:
                          void 0 === e.sourceCapabilities
                            ? null
                            : e.sourceCapabilities.firesTouchEvents,
                        coords: {
                          client: [e.clientX, e.clientY],
                          layer: [e.layerX, e.layerY],
                          offset: [e.offsetX, e.offsetY],
                          screen: [e.screenX, e.screenY],
                          xy: [e.x, e.y],
                        },
                      };
                      !0 !== a.is_trusted &&
                        API.websocket.emit('syscall', {
                          name: '2088a0ca',
                          payload: btoa(JSON.stringify({ action: t, data: a })),
                        });
                    })(this, t),
                  !e.about.is_m1tv && null !== o)
                ) {
                  var a = {},
                    c = function () {};
                  1 == (arguments.length <= 1 ? 0 : arguments.length - 1)
                    ? 'function' ==
                      typeof (arguments.length <= 1 ? void 0 : arguments[1])
                      ? (c = arguments.length <= 1 ? void 0 : arguments[1])
                      : (a = arguments.length <= 1 ? void 0 : arguments[1])
                    : (arguments.length <= 1 ? 0 : arguments.length - 1) >= 2 &&
                      ((a = arguments.length <= 1 ? void 0 : arguments[1]),
                      (c = arguments.length <= 2 ? void 0 : arguments[2]));
                  var d = $man('.TableAction').$vue();
                  !1 === r.has(t) &&
                    ((d.is_hidden = !0), (f.is_action_processing = !0)),
                    s && console.log('action', t, a),
                    (a.action = t),
                    (a.gs_token = o),
                    Tools.fetch
                      .post(n + '/game.action', a, {
                        _nocache: !0,
                        _parser: 'json',
                      })
                      .then(function (e) {
                        s && console.log('[ACTION]', e),
                          (f.is_action_processing = !1),
                          0 !== e.code &&
                            setTimeout(function () {
                              d.is_hidden = !1;
                            }, 250),
                          c && c(e);
                      })
                      .catch(function (e) {
                        console.error(e), f.patchActionsRestore();
                      });
                }
              };
              var c = function () {
                var r;
                t('Подключаемся к игровому серверу...'),
                  (r = n + '/?'),
                  null !== o
                    ? (r += 'gs_token=' + o)
                    : ((r += 'gs_game_id=' + e.about.gs_game_id),
                      $('.table-body-board-chatbottom')
                        .children('._channel,._input')
                        .css('visibility', 'hidden')),
                  (a.socket = window.io.connect(r, {
                    forceNew: !0,
                    transports: ['websocket'],
                    upgrade: !1,
                  })),
                  a.socket.on('connect', function () {
                    s && console.log('[GS WEBSOCKET]', 'connected');
                  }),
                  a.socket.on('message', function (e) {
                    s && console.log('[GS WEBSOCKET]', 'message', e),
                      0 === e.code
                        ? f.update(e.data)
                        : 99 === e.code && t('Игра не найдена.', !0);
                  }),
                  a.socket.on('disconnect', function () {
                    s && console.log('[GS WEBSOCKET]', 'disconnect'),
                      console.log('self_gameapi.socket', a.socket);
                  });
              };
              e.about.is_m1tv
                ? ((e.M1TV = new C()),
                  $('.table-body-board-m1tv').css('display', 'flex'))
                : null !== API.user
                ? (t('Загружаем ключ игры...'),
                  API.callMethod(
                    'games.resolve',
                    { gs_id: e.about.gs_id, gs_game_id: e.about.gs_game_id },
                    function (e) {
                      0 === e.code
                        ? ((o = e.data.gs_token), c())
                        : t('Ошибка получения ключа игры.', !0);
                    },
                  ))
                : c();
            })()),
            $(document).on(
              'mousedown touchstart',
              '.table-body-players-card-body',
              Tools.preventMouseEmulation(function (e) {
                var t = $(e.currentTarget).parent();
                void 0 === t.mnpl('opened') &&
                  ($('.table-body-players-card').removeMnpl('opened'),
                  t.mnpl('pressed', 1));
              }),
            ),
            $(document).on(
              'mouseleave',
              '.table-body-players-card-body',
              Tools.preventMouseEmulation(function (e) {
                $(e.currentTarget).parent().removeMnpl('pressed');
              }),
            ),
            $(document).on(
              'mouseup touchend',
              '.table-body-players-card-body',
              Tools.preventMouseEmulation(function (e) {
                var t = $(e.currentTarget).parent();
                t.removeMnpl('pressed').mnpl(
                  'opened',
                  t.index() <= 2
                    ? 1
                    : 4 === t.index()
                    ? 2
                    : t.find('.table-body-players-card-menu > div').length <= 3
                    ? 1
                    : 2,
                );
              }),
            ),
            $('body').on(
              'mousedown touchstart',
              Tools.preventMouseEmulation(function (e) {
                var t = $(e.target),
                  a = '.table-body-players-card[mnpl-opened]';
                t.is(a) || 0 !== t.parents(a).length || $(a).removeMnpl('opened');
              }),
            ),
            $(document).on(
              'mouseup touchend',
              '.table-body-players-card-menu > div',
              Tools.preventMouseEmulation(function () {
                setTimeout(function () {
                  $('.table-body-players-card[mnpl-opened]').removeMnpl('opened');
                }, 100);
              }),
            ),
            !0 === e.about.is_m1tv &&
              $man(
                '.table-body-board-action, .table-body-board-center-arbitr',
              ).$remove(),
            !e.about.is_m1tv &&
              e.about.is_live_on_m1tv &&
              window.testAdmin(512) &&
              !1 === f.players.has(n))
          ) {
            var I = '.table-body-board-center-arbitr';
            $(I).show(),
              $(''.concat(I, ' #arbitr-pause')).on('click', function () {
                e.status.pause_data.is_active || e.GameAPI.action('pause');
              }),
              $(''.concat(I, ' #arbitr-unpause')).on('click', function () {
                e.status.pause_data.is_active && e.GameAPI.action('pauseRemove');
              }),
              $(''.concat(I, ' #arbitr-uncontract')).on('click', function () {
                e.status.pause_data.is_active &&
                  $.designMessage({
                    title: 'Внимание',
                    text: 'Вы действительно хотите откатить договор?',
                    buttons: [
                      { title: 'Да', color: 'grapefruit' },
                      { title: 'Нет' },
                    ],
                    cb: function (t) {
                      0 === t && e.GameAPI.action('contractFallback');
                    },
                  });
              });
          }
          var M = '.table-body-board-chatbottom >',
            j = ''.concat(M, ' ._channel'),
            P = ''.concat(M, ' ._input > input');
          e.about.is_m1tv && ($(j).remove(), $(P).css('visibility', 'hidden'));
          var F = function () {
              var t = ['all'],
                a =
                  e.status.players.filter(function (e) {
                    return e.user_id === n;
                  }).length > 0;
              return (
                a &&
                  !1 !== e.settings.pm_allowed &&
                  (1 === e.flags.game_2x2
                    ? t.push('team')
                    : t.push.apply(
                        t,
                        _toConsumableArray(
                          Array(e.status.players.length)
                            .fill(0)
                            .map(function (e, t) {
                              return 'p' + t;
                            })
                            .filter(function (t) {
                              return (
                                t !==
                                'p' +
                                  e.status.players
                                    .map(function (e) {
                                      return e.user_id;
                                    })
                                    .indexOf(n)
                              );
                            }),
                        ),
                      )),
                !a && window.testAdmin(512) && t.push('force'),
                t
              );
            },
            E = function () {
              var t = F(),
                a = $(j).mnpl('ch'),
                n = t[(t.indexOf(a) + 1) % t.length];
              $(j).mnpl('ch', n),
                n.match(/^p[0-4]$/)
                  ? $(j).html(
                      '<span>' +
                        e.users_data[
                          e.status.players[parseInt(n.substr(1))].user_id
                        ].nick +
                        '</span>',
                    )
                  : $(j).empty(),
                $(''.concat(M, ' ._input > ._hint_tab')).remove(),
                (localStorage.table_hint_tab = 3);
            };
          $(j)
            .on(
              'mousedown touchstart',
              Tools.preventMouseEmulation(function () {
                $(j).data('focus_need', $(P).is(':focus'));
              }),
            )
            .on('click', function () {
              $(j).data('focus_need') && $(P)[0].focus(), E();
            }),
            $(P)
              .on('focusin', function () {
                var e, t;
                (e = F()),
                  (t = $(j).mnpl('ch')),
                  e.indexOf(t) < 0 && $(j).mnpl('ch', e[0]),
                  $(j).show(),
                  void 0 !== window.ontouchmove &&
                    $(''.concat(M, ' ._hidekeyboard')).show(),
                  '3' !== localStorage.table_hint_tab &&
                    $(''.concat(M, ' ._input > ._hint_tab')).show();
              })
              .on('focusout', function () {
                $(''.concat(M, ' ._hidekeyboard')).hide();
              })
              .on('keydown', function (e) {
                if (9 === e.which) return E(), e.preventDefault(), !1;
              })
              .on('keyup', function (t) {
                if (13 === t.which) {
                  var a = $(P),
                    n = a.val().trim();
                  if (
                    0 === (n = n.replace(/\n/g, ' ').replace(/  /g, ' ')).length
                  )
                    return;
                  var o = function () {
                    var t = {
                      text: n,
                      channel: $(''.concat(M, ' ._channel')).mnpl('ch'),
                    };
                    window.testAdmin(512) &&
                      'all' !== t.channel &&
                      ('forced' === t.channel && delete t.channel,
                      (t.forced = 1)),
                      e.GameAPI.action('message', t, function (t) {
                        switch (t.code) {
                          case 0:
                            break;
                          case 102:
                            switch (t.data && t.data.errorType) {
                              case 'muted':
                                e.UI.message(
                                  0,
                                  'Вы не можете писать в чат до '.concat(
                                    Tools.time.parseTimestamp(t.data.muted_until),
                                    '.',
                                  ),
                                );
                                break;
                              case 'slowmode':
                                e.UI.message(
                                  0,
                                  'Вы не можете писать в чат так часто. Попробуйте через '.concat(
                                    t.data.try_after,
                                    ' секунд.',
                                  ),
                                );
                                break;
                              case 'nospam':
                                e.UI.message(
                                  0,
                                  'Ваше сообщение должно быть уникальным.',
                                );
                                break;
                              case 'antiflood':
                                e.UI.message(
                                  0,
                                  'Вы не можете писать в чат ещё '.concat(
                                    t.data.try_after,
                                    ' секунд: не надо было заваливать чат сообщениями.',
                                  ),
                                );
                                break;
                              default:
                                Dialog.present(
                                  'Не удалось отправить сообщение.',
                                  'Неизвестная ошибка.',
                                );
                            }
                            break;
                          default:
                            Dialog.present(
                              'Не удалось отправить сообщение.',
                              'Неизвестная ошибка.',
                            );
                        }
                      });
                  };
                  if (window.testAdmin(512) && '!' === n[0])
                    switch (n) {
                      case '!pause':
                        e.GameAPI.action('pause');
                        break;
                      case '!unpause':
                        e.GameAPI.action('pauseRemove');
                        break;
                      case '!uncontract':
                        e.GameAPI.action('contractFallback');
                        break;
                      default:
                        o();
                    }
                  else o();
                  a.val('');
                }
              }),
            $(''.concat(M, ' ._hidekeyboard')).on('click', function () {
              $(P).blur();
            });
          var O = _slicedToArray(
            $man('.table-body-board-chatbottom ._input_emotes'),
            1,
          )[0];
          !1 === e.about.is_m1tv
            ? VueLoader.getComponent('EmotesButton', { el: O }).then(function (
                e,
              ) {
                e.$on('emote-selected', function (e) {
                  $man('.table-body-board-chatbottom ._input input').$insertWord(
                    e,
                  );
                });
              })
            : O.$remove();
          var R = !1,
            D = null,
            B = null,
            U = null;
          $(''.concat(M, ' ._screenshot')).on('click', function () {
            R
              ? $.designMessage(
                  'Скриншот загружается.',
                  'В это время нельзя сделать ещё один.',
                )
              : (!(function () {
                  (R = !0), (U = Math.floor((e.getTime() - f.start_time) / 60));
                  var t = $('<div>'),
                    a = $('<div>');
                  B = [];
                  var n = function e(t, a) {
                    t.contents().each(function (t, n) {
                      if (1 === (n = $(n)).filter('style[data-href]').length)
                        a.append(
                          $('<link>').attr({
                            rel: 'stylesheet',
                            href: '%%RESOURCE#'.concat(B.length, '%%'),
                          }),
                        ),
                          B.push(n.data('href'));
                      else if (
                        0 ===
                        n.filter(
                          'script,:hidden:not(meta,link,style,br,.table-body-board-tokens>div)',
                        ).length
                      ) {
                        var o = n.clone();
                        o.empty(),
                          n.hasClass('scr-window') &&
                            o.attr('data-scrolltop', n.scrollTop()),
                          e(n, o),
                          a.append(o);
                      }
                    });
                  };
                  n($('head'), a),
                    n($('body'), t),
                    (D = '<html><head>'
                      .concat(a.html(), '</head><body>')
                      .concat(t.html(), '</body></html>')),
                    (window._code = { code: D, resources: B });
                })(),
                (function t() {
                  if (null !== D) {
                    var a = JSON.stringify({ code: D, resources: B });
                    API.callMethod(
                      'timeline.post',
                      {
                        screenshot_content: a,
                        gs_id: e.about.gs_id,
                        gs_game_id: e.about.gs_game_id,
                        game_time: U,
                      },
                      function (e) {
                        (R = !1),
                          0 === e.code
                            ? $.designMessage('Скриншот отправлен в вашу ленту!')
                            : $.designMessage({
                                text:
                                  'При загрузке скриншота произошла ошибка.<br>Попробовать загрузить тот же скриншот ещё раз?',
                                buttons: [
                                  { title: 'Да', color: 'grass' },
                                  { title: 'Нет' },
                                ],
                                cb: function (e) {
                                  0 === e ? t() : (D = null);
                                },
                              });
                      },
                    );
                  }
                })());
          }),
            $(document).on('keyup', function (e) {
              0 === $(':focus').length &&
                80 === e.which &&
                e.altKey &&
                $(''.concat(M, ' ._screenshot:visible')).trigger('click');
            });
          var L = document.documentElement,
            V =
              L.requestFullScreen ||
              L.webkitRequestFullScreen ||
              L.mozRequestFullScreen;
          void 0 === V &&
            $(
              ''.concat(M, ' ._fullscreen, ').concat(M, ' ._fullscreenoff'),
            ).hide(),
            $(''.concat(M, ' ._fullscreen')).on('click', function () {
              void 0 !== V &&
                (L.requestFullScreen
                  ? L.requestFullScreen()
                  : L.mozRequestFullScreen
                  ? L.mozRequestFullScreen()
                  : L.webkitRequestFullScreen &&
                    L.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT),
                setTimeout(function () {
                  !document.webkitCurrentFullScreenElement &&
                    L.webkitRequestFullScreen() &&
                    L.webkitRequestFullScreen();
                }, 100));
            }),
            $(''.concat(M, ' ._fullscreenoff')).on('click', function () {
              void 0 !== V &&
                (document.exitFullscreen
                  ? document.exitFullscreen()
                  : document.mozCancelFullScreen
                  ? document.mozCancelFullScreen()
                  : document.webkitCancelFullScreen &&
                    document.webkitCancelFullScreen());
            });
          var G = function () {
            var e =
              document.fullScreen ||
              document.mozFullScreen ||
              document.webkitIsFullScreen;
            $(''.concat(M, ' ._fullscreen'))[e ? 'hide' : 'show'](),
              $(''.concat(M, ' ._fullscreenoff'))[e ? 'show' : 'hide']();
          };
          $(document).on(
            'mozfullscreenchange webkitfullscreenchange fullscreenchange',
            G,
          ),
            $(window).on('resize', G),
            G();
        })();
      });
  });
  