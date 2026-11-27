(function () {
  var COLORS = [
    "#ffe66d",
    "#ff9fb2",
    "#9be7c4",
    "#8fd3ff",
    "#ffb77a",
    "#c9b6ff",
  ];
  var CATS = [
    ["daily", "Daily"],
    ["weekly", "Weekly"],
    ["custom", "Custom"],
    ["none", "One-time"],
  ];
  var PINS = ["#c0291f", "#2a6fd0", "#1f9d6b", "#d99a00"],
    TAPES = [
      "rgba(255,170,190,.8)",
      "rgba(150,200,255,.75)",
      "rgba(170,230,190,.8)",
      "rgba(255,220,120,.85)",
    ];
  var $ = function (s) {
    return document.querySelector(s);
  };
  var pad = function (n) {
    return String(n).padStart(2, "0");
  };
  var key = function (d) {
    return (
      d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate())
    );
  };
  var esc = function (s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var store = {
    get: function (k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set: function (k, v) {
      try {
        localStorage.setItem(k, v);
      } catch (e) {}
    },
  };
  var tkey = function () {
    return key(new Date());
  };
  var dayNum = function (k) {
    var p = k.split("-");
    return Date.UTC(+p[0], p[1] - 1, +p[2]) / 864e5;
  };
  var rp = function (t) {
    return t.rep || "none";
  };

  var today = new Date(),
    tasks;
  try {
    tasks = JSON.parse(store.get("wall.tasks"));
  } catch (e) {
    tasks = null;
  }
  if (!Array.isArray(tasks)) {
    tasks = [
      {
        id: 1,
        title: "Revise Docker + Jenkins notes",
        desc: "Images, volumes, then one full pipeline run",
        date: key(today),
        time: "18:00",
        color: COLORS[3],
        rep: "daily",
      },
      {
        id: 2,
        title: "Push project to GitHub",
        desc: "Clean the README and add screenshots",
        date: key(today),
        time: "21:00",
        color: COLORS[0],
        rep: "weekly",
      },
      {
        id: 3,
        title: "Apply to 5 fresher roles",
        desc: "Tailor the resume for each one",
        date: key(today),
        time: "12:00",
        color: COLORS[1],
        rep: "custom",
        every: 3,
        unit: "d",
      },
      {
        id: 4,
        title: "Buy a new notebook",
        date: "",
        time: "",
        color: COLORS[2],
        rep: "none",
      },
    ];
  }
  var sel = null,
    filter = "all",
    view = new Date(today.getFullYear(), today.getMonth(), 1),
    color = COLORS[0],
    lastDay = tkey(),
    asking = null;
  function save() {
    store.set("wall.tasks", JSON.stringify(tasks));
  }
  var rk = function () {
    return sel || tkey();
  };

  /* repeat logic */
  function occurs(t, k) {
    if (!t.date) return false;
    var r = rp(t);
    if (r === "none") return t.date === k;
    var d = dayNum(k) - dayNum(t.date);
    if (d < 0) return false;
    if (r === "daily") return true;
    if (r === "weekly") return d % 7 === 0;
    return d % ((t.every || 1) * (t.unit === "w" ? 7 : 1)) === 0;
  }
  function isDoneOn(t, k) {
    return rp(t) === "none" ? !!t.done : !!(t.dn && t.dn[k]);
  }
  function nk(n) {
    var d = new Date(n * 864e5);
    return (
      d.getUTCFullYear() +
      "-" +
      pad(d.getUTCMonth() + 1) +
      "-" +
      pad(d.getUTCDate())
    );
  }
  function streak(t, k) {
    var r = rp(t),
      st =
        r === "daily"
          ? 1
          : r === "weekly"
            ? 7
            : (t.every || 1) * (t.unit === "w" ? 7 : 1),
      b = dayNum(t.date || k),
      c = dayNum(k),
      n = 0;
    if (c < b) return 0;
    c -= (c - b) % st;
    if (c === dayNum(k) && !(t.dn && t.dn[nk(c)])) c -= st;
    while (c >= b && t.dn && t.dn[nk(c)]) {
      n++;
      c -= st;
    }
    return n;
  }
  function repText(t) {
    var r = rp(t);
    if (r === "none") return "";
    if (r === "daily") return "Every day";
    if (r === "weekly") return "Every week";
    var u = t.unit === "w" ? "week" : "day";
    return t.every > 1 ? "Every " + t.every + " " + u + "s" : "Every " + u;
  }
  var DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var MONS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  function t12(s) {
    if (cfg.clock === "24") return s;
    var p = s.split(":"),
      h = +p[0];
    return (h % 12 || 12) + ":" + p[1] + " " + (h < 12 ? "AM" : "PM");
  }
  function whenText(t) {
    if (rp(t) !== "none") return t.time ? "at " + t12(t.time) : "Any time";
    if (!t.date) return "Unscheduled";
    var d = new Date(t.date + "T00:00"),
      r =
        DAYS[d.getDay()].slice(0, 3) +
        " " +
        d.getDate() +
        " " +
        MONS[d.getMonth()].slice(0, 3);
    return t.time ? r + ", " + t12(t.time) : r;
  }
  function sortKey(t) {
    return (
      (isDoneOn(t, rk()) ? "1" : "0") +
      (rp(t) === "none" ? t.date || "9999" : "") +
      (t.time || "99:99")
    );
  }

  /* settings */
  var cfg = { name: "", theme: "auto", clock: "12" };
  try {
    var sv = store.get("wall.cfg");
    if (sv) Object.assign(cfg, JSON.parse(sv));
    else {
      var ot = store.get("wall.theme");
      if (ot === "dark" || ot === "light") cfg.theme = ot;
    }
  } catch (e) {}
  function paintStats() {
    var k = rk(),
      open = tasks.filter(function (t) {
        return !isDoneOn(t, k);
      }).length;
    $("#stats").textContent =
      (cfg.name ? "Hey, " + cfg.name + " · " : "") +
      open +
      " open · " +
      (tasks.length - open) +
      " done" +
      (sel ? " on " + sel : " today");
  }
  function applyCfg() {
    var r = document.documentElement;
    if (cfg.theme === "auto") r.removeAttribute("data-theme");
    else r.dataset.theme = cfg.theme;
    ["theme", "clock"].forEach(function (k) {
      document.querySelectorAll("#s-" + k + " button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.v === cfg[k]));
      });
    });
    $("#me").textContent = cfg.name.trim()
      ? cfg.name.trim().charAt(0).toUpperCase()
      : "Me";
  }
  function saveCfg() {
    store.set("wall.cfg", JSON.stringify(cfg));
  }
  $("#s-name").value = cfg.name;
  $("#s-name").oninput = function () {
    cfg.name = this.value;
    saveCfg();
    applyCfg();
    paintStats();
  };
  $("#set").onclick = function (e) {
    var b = e.target.closest(".seg button");
    if (!b) return;
    cfg[b.parentNode.dataset.k] = b.dataset.v;
    saveCfg();
    applyCfg();
    clock();
    render();
  };
  function toggleSet(open) {
    var el = $("#set");
    el.classList.toggle("hidden", !open);
    $("#me").setAttribute("aria-expanded", String(open));
  }
  $("#me").onclick = function () {
    toggleSet($("#set").classList.contains("hidden"));
  };
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#set,#me")) toggleSet(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") toggleSet(false);
  });
  applyCfg();

  /* clock */
  var tinted = 0,
    STOPS = [
      [0, [31, 58, 122]],
      [5, [31, 58, 122]],
      [7, [255, 185, 138]],
      [10, [207, 232, 255]],
      [16, [207, 232, 255]],
      [18, [255, 201, 122]],
      [20.5, [141, 123, 214]],
      [23, [31, 58, 122]],
      [24, [31, 58, 122]],
    ];
  function tintWall(d) {
    var h = d.getHours() + d.getMinutes() / 60,
      i = 0;
    while (i < STOPS.length - 2 && h > STOPS[i + 1][0]) i++;
    var a = STOPS[i],
      b = STOPS[i + 1],
      f = Math.min(1, Math.max(0, (h - a[0]) / (b[0] - a[0]))),
      c = a[1].map(function (v, j) {
        return Math.round(v + (b[1][j] - v) * f);
      });
    document.documentElement.style.setProperty(
      "--tint",
      "rgb(" + c.join(",") + ")",
    );
  }
  function clock() {
    var d = new Date(),
      is12 = cfg.clock !== "24",
      h = is12 ? d.getHours() % 12 || 12 : d.getHours();
    $("#time").innerHTML =
      pad(h) +
      ":" +
      pad(d.getMinutes()) +
      '<span class="text-lg font-semibold">:' +
      pad(d.getSeconds()) +
      (is12 ? " " + (d.getHours() < 12 ? "AM" : "PM") : "") +
      "</span>";
    $("#date").textContent =
      DAYS[d.getDay()] +
      ", " +
      d.getDate() +
      " " +
      MONS[d.getMonth()] +
      " " +
      d.getFullYear();
    if (tkey() !== lastDay) {
      lastDay = tkey();
      drawCal();
      render();
    }
    if (!tinted || d.getSeconds() === 0) {
      tinted = 1;
      tintWall(d);
    }
  }

  /* calendar */
  function drawCal() {
    $("#mon").textContent = MONS[view.getMonth()] + " " + view.getFullYear();
    var off =
        (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7,
      html = "",
      tk = tkey();
    for (var i = 0; i < 42; i++) {
      var d = new Date(view.getFullYear(), view.getMonth(), 1 - off + i),
        k = key(d);
      var has = tasks.some(function (t) {
        return occurs(t, k) && !isDoneOn(t, k);
      });
      html +=
        '<button type="button" class="day' +
        (d.getMonth() !== view.getMonth() ? " out" : "") +
        (k === tk ? " today" : "") +
        (k === sel ? " sel" : "") +
        '" data-k="' +
        k +
        '" aria-label="' +
        d.toDateString() +
        '">' +
        d.getDate() +
        (has ? "<i></i>" : "") +
        "</button>";
    }
    $("#grid").innerHTML = html;
  }
  $("#grid").onclick = function (e) {
    var b = e.target.closest(".day");
    if (!b) return;
    sel = sel === b.dataset.k ? null : b.dataset.k;
    if (sel) $("#f-date").value = sel;
    drawCal();
    render();
  };
  $("#prev").onclick = function () {
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    drawCal();
  };
  $("#next").onclick = function () {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    drawCal();
  };

  /* form */
  $("#colors").innerHTML = COLORS.map(function (c, i) {
    return (
      '<label class="relative"><input class="sr" type="radio" name="c" value="' +
      c +
      '" aria-label="Color ' +
      (i + 1) +
      '"' +
      (i === 0 ? " checked" : "") +
      '><span class="sw block" style="background:' +
      c +
      '"></span></label>'
    );
  }).join("");
  $("#colors").onchange = function (e) {
    color = e.target.value;
    $("#form").style.backgroundColor = color;
  };
  $("#f-date").value = tkey();
  $("#f-rep").onchange = function () {
    $("#custom").classList.toggle("hidden", this.value !== "custom");
  };
  $("#form").onsubmit = function (e) {
    e.preventDefault();
    var title = $("#f-title").value.trim();
    if (!title) return;
    var rep = $("#f-rep").value,
      date = $("#f-date").value;
    if (rep !== "none" && !date) date = tkey();
    var t = {
      id: Date.now(),
      title: title,
      date: date,
      time: $("#f-time").value,
      color: color,
      rep: rep,
      desc: $("#f-desc").value.trim(),
    };
    if (rep === "custom") {
      t.every = Math.max(1, Math.min(99, +$("#f-n").value || 1));
      t.unit = $("#f-u").value;
    }
    tasks.unshift(t);
    save();
    $("#f-title").value = "";
    $("#f-desc").value = "";
    $("#f-time").value = "";
    drawCal();
    render();
  };

  /* filters + board */
  function drawFilters() {
    var f = [
      ["all", "All"],
      ["today", "Today"],
      ["done", "Done"],
    ];
    $("#filters").innerHTML =
      f
        .map(function (x) {
          return (
            '<button type="button" class="btn" data-f="' +
            x[0] +
            '" aria-pressed="' +
            (filter === x[0]) +
            '">' +
            x[1] +
            "</button>"
          );
        })
        .join("") +
      (sel
        ? '<button type="button" class="btn" data-f="clear">Showing ' +
          sel +
          " ✕</button>"
        : "");
  }
  $("#filters").onclick = function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.f === "clear") sel = null;
    else filter = b.dataset.f;
    drawCal();
    render();
  };
  function visible() {
    var k = rk();
    return tasks
      .filter(function (t) {
        if (sel && !occurs(t, sel)) return false;
        if (filter === "today" && !occurs(t, tkey())) return false;
        if (filter === "done") return isDoneOn(t, k);
        return true;
      })
      .sort(function (a, b) {
        var x = sortKey(a),
          y = sortKey(b);
        return x < y ? -1 : x > y ? 1 : 0;
      });
  }
  function render() {
    drawFilters();
    var k = rk(),
      list = visible(),
      h = "";
    CATS.forEach(function (c) {
      var g = list.filter(function (t) {
        return rp(t) === c[0];
      });
      if (!g.length) return;
      h +=
        '<section class="mt-4"><h3 class="hand text-3xl px-2">' +
        c[1] +
        ' <span class="text-sm" style="font-family:Manrope,sans-serif;color:var(--muted)">' +
        g.length +
        '</span></h3><div class="board">' +
        g
          .map(function (t) {
            var done = isDoneOn(t, k),
              r = (((t.id * 37) % 9) - 4) * 0.9,
              sn = rp(t) !== "none" ? streak(t, k) : 0;
            return (
              '<article class="note' +
              (done ? " done" : "") +
              '" data-id="' +
              t.id +
              '" style="--r:' +
              r +
              "deg;background-color:" +
              t.color +
              ";--pc:" +
              PINS[t.id % 4] +
              ";--tc:" +
              TAPES[t.id % 4] +
              '">' +
              '<i class="deco d' +
              (t.id % 4) +
              '"></i>' +
              (sn > 0
                ? '<span class="stamp">' +
                  sn +
                  (rp(t) === "daily"
                    ? " DAY STREAK"
                    : rp(t) === "weekly"
                      ? " WEEK STREAK"
                      : " IN A ROW") +
                  "</span>"
                : "") +
              '<button class="chk" data-act="done" aria-label="' +
              (done ? "Mark not done" : "Mark done") +
              '">' +
              (done ? "✓" : "") +
              "</button>" +
              '<button class="del" data-act="del" aria-label="Delete task" title="Delete">×</button>' +
              (asking === t.id
                ? '<div class="ask"><p>Delete this repeating task for good?</p><div><button data-act="yes">Delete</button><button data-act="no">Keep</button></div></div>'
                : "") +
              '<div><p class="ttl mt-3">' +
              esc(t.title) +
              "</p>" +
              (t.desc ? '<p class="dsc">' + esc(t.desc) + "</p>" : "") +
              "</div>" +
              '<div><div class="when">' +
              whenText(t) +
              "</div>" +
              (rp(t) !== "none"
                ? '<span class="rep" title="Tick = done for this day, it keeps repeating. × = delete for good">↻ ' +
                  repText(t) +
                  "</span>"
                : "") +
              "</div></article>"
            );
          })
          .join("") +
        "</div></section>";
    });
    $("#board").innerHTML =
      h ||
      '<p class="paper p-5 text-sm mt-4" style="max-width:340px">Nothing stuck here yet. Add a task on the left and it lands on the wall.</p>';
    paintStats();
  }
  $("#board").onclick = function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var id = +b.closest(".note").dataset.id,
      t = tasks.filter(function (x) {
        return x.id === id;
      })[0],
      k = rk(),
      a = b.dataset.act;
    if (a === "done") {
      if (rp(t) === "none") t.done = !t.done;
      else {
        t.dn = t.dn || {};
        if (t.dn[k]) delete t.dn[k];
        else t.dn[k] = 1;
      }
    } else if (a === "del" && rp(t) !== "none") {
      asking = id;
      render();
      return;
    } else if (a === "no") {
      asking = null;
      render();
      return;
    } else {
      asking = null;
      tasks = tasks.filter(function (x) {
        return x.id !== id;
      });
    }
    save();
    drawCal();
    render();
  };

  /* tilt */
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  $("#board").addEventListener("pointermove", function (e) {
    if (calm || e.pointerType === "touch") return;
    var n = e.target.closest(".note");
    if (!n) return;
    var r = n.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    n.style.setProperty("--rx", (-y * 20).toFixed(1) + "deg");
    n.style.setProperty("--ry", (x * 20).toFixed(1) + "deg");
    n.classList.add("hot");
  });
  $("#board").addEventListener("pointerout", function (e) {
    var n = e.target.closest(".note");
    if (!n || n.contains(e.relatedTarget)) return;
    n.classList.remove("hot");
    n.style.setProperty("--rx", "0deg");
    n.style.setProperty("--ry", "0deg");
  });

  clock();
  drawCal();
  render();
  setInterval(clock, 1000);
})();
