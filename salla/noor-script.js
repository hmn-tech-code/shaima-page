/* ============================================================
   NOOR — BANNER + COUNTDOWN + AUTO INFINITE SCROLL + GREEN GLOW
   ------------------------------------------------------------
   للتبديل بين الحملات: غيّر قيمة ACTIVE_CAMPAIGN فقط لا غير.
   كل الحملات القديمة محفوظة تحت ومستعدة للتفعيل في أي وقت.
   ============================================================ */

(function () {

  // =========================================================
  // ==========   1) الحملة الفعّالة حالياً   =================
  // =========================================================
  //  "nationalDay"   → اليوم الوطني        (مفعّلة الآن ✅)
  //  "backToSchool"  → العودة إلى المدارس  (محفوظة للرجوع لها)
  var ACTIVE_CAMPAIGN = "nationalDay";

  // البانر الافتراضي اللي يرجع بعد انتهاء أي حملة
  var DEFAULT_BANNER = "https://i.ibb.co/TqpgpB3G/IMG-5506.png";

  var DAY = 24 * 60 * 60 * 1000;

  // =========================================================
  // ==========   2) بيانات الحملات   ========================
  // =========================================================
  var CAMPAIGNS = {

    /* ---------- 🟢 اليوم الوطني (الجديدة) ---------- */
    nationalDay: {
      // 👇 العداد مطفي — البانر فقط. خلّها true لو حبيت ترجّع العداد
      showCountdown: false,

      // 💡 السطوع الأخضر من فوق (أضواء المسرح)
      //    enabled:  false يطفيه
      //    strength: قوة السطوع من 0 إلى 1 (1 = أقوى شي، 0.7 = أخف شوي من الصورة)
      glow: { enabled: true, strength: 0.7 },

      // ⏰ وقت النهاية: 7 أكتوبر 2026 — 12:00 AM بتوقيت السعودية
      //    بعدها يرجع البانر الأصلي ويختفي التوقع والأضواء تلقائياً
      endsAt:        Date.UTC(2026, 9, 6, 21, 0, 0),
      endBannerUrl:  DEFAULT_BANNER,

      // ⚽ توقع المباراة (تحت البانر)
      match: {
        title:   "توقّع نهائي كأس الخليج 🏆",
        // ضربة البداية: 10:00 PM بتوقيت الإمارات = 9:00 PM بتوقيت السعودية
        kickoff: Date.UTC(2026, 9, 6, 18, 0, 0),
        timeText: "اليوم 9:00 مساءً بتوقيت السعودية",
        home: { name: "السعودية", flag: "https://flagcdn.com/w320/sa.png" },
        away: { name: "الإمارات", flag: "https://flagcdn.com/w320/ae.png" },
        // نسب تقريبية للعرض (مو تصويت حقيقي)
        baseVotes: { home: 1480, draw: 310, away: 590 }
      },

      bannerUrl:  "https://i.ibb.co/KjBw7NPH/IMG-6399.png",
      afterUrl:   DEFAULT_BANNER,

      // البداية: 6 سبتمبر 2026 — 12:00 AM بتوقيت السعودية (UTC+3)
      start:  Date.UTC(2026, 8, 5, 21, 0, 0),
      phases: [ 18 * DAY ],   // 18 يوم → ينتهي 24 سبتمبر 00:00 (آخر يوم فعلي 23 سبتمبر)

      beforeText: "متبقي ساعات قليلة وتبدأ عروض اليوم الوطني مع نور",
      duringText: "بدأت عروض اليوم الوطني مع نور",

      heights: { small: "240px", medium: "270px", large: "900px" },

      theme: {
        main:      "#006C35",   // الأخضر السعودي
        boxBg:     "#f1f9f4",
        boxBorder: "#006C35",
        barBottom: "#d7e9dd",
        textColor: "#0b2e1c",
        labelColor:"#4f7c62",
        glow:      "0,108,53"   // نفس اللون بصيغة RGB للظلال
      }
    },

    /* ---------- 🟠 العودة إلى المدارس (القديمة — محفوظة) ---------- */
    backToSchool: {
      showCountdown: true,

      glow: { enabled: false, strength: 0.5 },

      bannerUrl:  "https://i.ibb.co/q3GWSYhm/IMG-6039.png",
      afterUrl:   DEFAULT_BANNER,

      // البداية: 25 أغسطس 2026 — 12:00 AM بتوقيت السعودية
      start:  Date.UTC(2026, 7, 24, 21, 0, 0),
      phases: [ 12 * DAY ],   // 12 يوم → آخر يوم فعلي 5 سبتمبر

      beforeText: "متبقي ساعات قليلة وتبدأ عروض العودة الى المدارس مع نور",
      duringText: "بدأت عروض العودة الى المدارس مع نور",

      heights: { small: "240px", medium: "270px", large: "900px" },

      theme: {
        main:      "#F5A623",
        boxBg:     "#fff8ee",
        boxBorder: "#F5A623",
        barBottom: "#f0e0c8",
        textColor: "#3a2a10",
        labelColor:"#9a7a4a",
        glow:      "245,161,35"
      }
    }

  };

  var C = CAMPAIGNS[ACTIVE_CAMPAIGN];
  var T = C.theme;

  // =========================================================
  // ==========   3) استثناء صفحات الشراء   ==================
  // =========================================================
  var path = window.location.pathname || "";

  if (
    path.indexOf("checkout")  !== -1 ||
    path.indexOf("address")   !== -1 ||
    path.indexOf("addresses") !== -1 ||
    path.indexOf("cart")      !== -1
  ) {
    return;
  }

  // =====================
  // === GREEN GLOW (أضواء مسرح خضراء من فوق + لمعات) ===
  // =====================

  function addTopGlow() {
    if (!C.glow || !C.glow.enabled) return;
    if (document.getElementById("noor-glow")) return;

    var S = Math.max(0, Math.min(1, C.glow.strength));
    var stopped = false;
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var canvas = document.createElement("canvas");
    canvas.id = "noor-glow";
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position:      "fixed",
      top: "0", left: "0",
      width:         "100%",
      height:        "100%",
      pointerEvents: "none",          // ما يمنع الضغط على أي شي
      zIndex:        "2147483000",
      opacity:       "0",
      transition:    "opacity 1.5s ease-out",
    });
    document.body.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var W = 0, H = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // الأشعة: x = مكان مصدر الضوء (نسبة من العرض)، a = الميلان، w = عرض الشعاع
    var beams = [
      { x:  0.02, a:  0.55, w: 0.16, amp: 0.08, sp: 0.30, ph: 0.0 },
      { x:  0.30, a:  0.18, w: 0.14, amp: 0.12, sp: 0.42, ph: 1.7 },
      { x:  0.50, a:  0.00, w: 0.18, amp: 0.10, sp: 0.36, ph: 3.1 },
      { x:  0.70, a: -0.18, w: 0.14, amp: 0.12, sp: 0.40, ph: 2.3 },
      { x:  0.98, a: -0.55, w: 0.16, amp: 0.08, sp: 0.28, ph: 5.2 },
    ];

    function beamAngle(b, t) {
      return b.a + Math.sin(t * b.sp + b.ph) * b.amp;
    }

    // اللمعات (ذهبي + أخضر) — تبان أكثر داخل الأشعة
    var COLORS = ["255,205,70", "255,225,120", "60,230,110", "120,255,150", "250,255,235"];
    var particles = [];
    var count = window.innerWidth < 600 ? 240 : 380;
    for (var i = 0; i < count; i++) {
      particles.push({
        x:     Math.random(),
        y:     Math.random(),
        r:     Math.random() < 0.08 ? 3 + Math.random() * 5 : 0.6 + Math.random() * 1.6,
        vy:    0.004 + Math.random() * 0.012,
        vx:    (Math.random() - 0.5) * 0.004,
        tw:    Math.random() * Math.PI * 2,
        tws:   1.5 + Math.random() * 3.5,
        c:     COLORS[(Math.random() * COLORS.length) | 0],
      });
    }

    function lightAt(px, py, t) {
      var f = 0;
      for (var k = 0; k < beams.length; k++) {
        var b  = beams[k];
        var sx = b.x * W, sy = -20;
        var dx = px - sx, dy = py - sy;
        var d  = Math.abs(Math.atan2(dx, dy) - beamAngle(b, t)) / b.w;
        if (d < 1) {
          var dist = Math.sqrt(dx * dx + dy * dy) / (H * 1.15);
          f = Math.max(f, (1 - d) * Math.max(0, 1 - dist));
        }
      }
      return f;
    }

    function drawBeam(b, t) {
      var sx  = b.x * W, sy = -20;
      var L   = H * 1.15;
      var dir = Math.PI / 2 - beamAngle(b, t);
      var pulse = 0.85 + 0.15 * Math.sin(t * 1.3 + b.ph * 2);

      // طبقات كثيرة: عريضة خفيفة → نواة ساطعة (عشان الحواف تكون ناعمة)
      var layers = [ [1.0, 0.025], [0.82, 0.03], [0.64, 0.04], [0.47, 0.05], [0.32, 0.06], [0.18, 0.08] ];
      for (var j = 0; j < layers.length; j++) {
        var w = b.w * layers[j][0];
        var a = layers[j][1] * S * pulse;
        var g = ctx.createRadialGradient(sx, sy, 0, sx, sy, L);
        g.addColorStop(0.00, "rgba(235,255,240," + a * 3 + ")");
        g.addColorStop(0.12, "rgba(80,240,130,"  + a + ")");
        g.addColorStop(0.55, "rgba(30,200,95,"   + a * 0.45 + ")");
        g.addColorStop(1.00, "rgba(20,160,70,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.arc(sx, sy, L, dir - w, dir + w);
        ctx.closePath();
        ctx.fill();
      }

      // وهج مصدر الضوء فوق
      var fr = Math.min(W, H) * 0.22;
      var fg = ctx.createRadialGradient(sx, 0, 0, sx, 0, fr);
      fg.addColorStop(0.0, "rgba(245,255,245," + 0.8 * S * pulse + ")");
      fg.addColorStop(0.3, "rgba(90,240,140,"  + 0.35 * S * pulse + ")");
      fg.addColorStop(1.0, "rgba(40,200,90,0)");
      ctx.fillStyle = fg;
      ctx.fillRect(sx - fr, 0, fr * 2, fr);
    }

    var last = 0;
    function frame(ms) {
      var t  = ms / 1000;
      var dt = last ? Math.min(0.05, t - last) : 0.016;
      last = t;

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, W, H);

      // صبغة خضراء خفيفة على الصفحة (أقوى فوق)
      var tint = ctx.createLinearGradient(0, 0, 0, H);
      tint.addColorStop(0, "rgba(15,70,35," + 0.30 * S + ")");
      tint.addColorStop(1, "rgba(15,70,35," + 0.16 * S + ")");
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, W, H);

      // الإضاءة تنجمع فوق بعض (مثل الضوء الحقيقي)
      ctx.globalCompositeOperation = "lighter";

      var haze = ctx.createLinearGradient(0, 0, 0, H * 0.35);
      haze.addColorStop(0, "rgba(60,230,120," + 0.22 * S + ")");
      haze.addColorStop(1, "rgba(60,230,120,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, W, H * 0.35);

      for (var k = 0; k < beams.length; k++) drawBeam(beams[k], t);

      // اللمعات تنرسم عادي عشان تبان حتى على الخلفية البيضاء
      ctx.globalCompositeOperation = "source-over";

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (!reduceMotion) {
          p.y += p.vy * dt;
          p.x += p.vx * dt + Math.sin(t * 0.6 + p.tw) * 0.0003;
          if (p.y > 1.02) { p.y = -0.02; p.x = Math.random(); }
          if (p.x < -0.02) p.x = 1.02; else if (p.x > 1.02) p.x = -0.02;
        }
        var px = p.x * W, py = p.y * H;
        var tw = 0.35 + 0.65 * Math.abs(Math.sin(t * p.tws + p.tw));
        var a  = S * tw * (0.25 + 1.1 * lightAt(px, py, t));
        if (a < 0.03) continue;

        if (p.r > 2.5) {
          // بوكيه (دوائر ضوء ناعمة كبيرة)
          var bg = ctx.createRadialGradient(px, py, 0, px, py, p.r);
          bg.addColorStop(0, "rgba(" + p.c + "," + Math.min(1, a * 0.6) + ")");
          bg.addColorStop(1, "rgba(" + p.c + ",0)");
          ctx.fillStyle = bg;
          ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = "rgba(" + p.c + "," + Math.min(1, a) * 0.3 + ")";
          ctx.beginPath(); ctx.arc(px, py, p.r * 3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(" + p.c + "," + Math.min(1, a) + ")";
          ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }

      if (!reduceMotion && !stopped) requestAnimationFrame(frame);
    }

    requestAnimationFrame(function (ms) {
      frame(ms);
      canvas.style.opacity = "1";
    });

    // ترجع دالة تطفي الأضواء (نستخدمها الساعة 12 بالليل)
    return function stopGlow() {
      stopped = true;
      window.removeEventListener("resize", resize);
      canvas.style.opacity = "0";
      setTimeout(function () { canvas.remove(); }, 1600);
    };
  }

  // =====================
  // === MATCH PREDICTION (توقع المباراة) ===
  // =====================

  function addMatchPoll(afterEl) {
    var M = C.match;
    if (!M) return null;

    var KEY = "noor-poll-" + M.kickoff;
    var LABELS = {
      home: "فوز " + M.home.name,
      draw: "تعادل",
      away: "فوز " + M.away.name
    };

    function getVote() {
      try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }
    function saveVote(v) {
      try { localStorage.setItem(KEY, v); } catch (e) {}
    }

    // الأصوات تزيد شوي مع الوقت عشان تبان حيّة
    function getCounts(myVote) {
      var mins = Math.max(0, Math.floor((Date.now() - (M.kickoff - 12 * 3600000)) / 60000));
      var c = {
        home: M.baseVotes.home + Math.floor(mins * 2.1),
        draw: M.baseVotes.draw + Math.floor(mins * 0.4),
        away: M.baseVotes.away + Math.floor(mins * 0.8)
      };
      if (myVote && c[myVote] !== undefined) c[myVote] += 1;
      return c;
    }

    var css = document.createElement("style");
    css.textContent = `
      #noor-poll {
        direction: rtl;
        font-family: inherit;
        margin: 14px 12px;
        padding: 18px 16px 16px;
        border-radius: 18px;
        color: #fff;
        background:
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(80,240,140,.28), transparent 70%),
          linear-gradient(160deg, #0b5a30 0%, #063d20 60%, #04291a 100%);
        box-shadow: 0 10px 28px rgba(0,80,40,.25), inset 0 1px 0 rgba(255,255,255,.12);
        position: relative;
        overflow: hidden;
        text-align: center;
      }
      #noor-poll * { box-sizing: border-box; }
      #noor-poll .np-title { font-weight: 800; font-size: 1.1rem; margin: 0 0 4px; }
      #noor-poll .np-sub   { font-size: .8rem; opacity: .8; margin: 0 0 14px; }
      #noor-poll .np-teams {
        display: flex; align-items: center; justify-content: space-between;
        gap: 8px; margin-bottom: 14px;
      }
      #noor-poll .np-team { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
      #noor-poll .np-flag {
        width: 66px; height: 44px; border-radius: 8px; object-fit: cover;
        box-shadow: 0 4px 12px rgba(0,0,0,.3); border: 2px solid rgba(255,255,255,.85);
        background: rgba(255,255,255,.15);
      }
      #noor-poll .np-name { font-weight: 700; font-size: .95rem; }
      #noor-poll .np-vs {
        font-weight: 900; font-size: 1.05rem; color: #ffd76a;
        width: 44px; height: 44px; border-radius: 50%; line-height: 44px; flex: none;
        background: rgba(255,255,255,.1); border: 1px solid rgba(255,215,106,.4);
      }
      #noor-poll .np-timer { font-size: .8rem; color: #ffd76a; margin: -4px 0 12px; font-weight: 700; }
      #noor-poll .np-btns { display: flex; gap: 8px; }
      #noor-poll .np-btn {
        flex: 1; padding: 12px 4px; border-radius: 12px; cursor: pointer;
        font: inherit; font-weight: 800; font-size: .9rem; color: #063d20;
        background: #fff; border: none;
        box-shadow: 0 4px 0 rgba(0,0,0,.18);
        transition: transform .15s, box-shadow .15s, background .2s;
      }
      #noor-poll .np-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 rgba(0,0,0,.18); }
      #noor-poll .np-btn.np-draw { background: #e9f3ec; }
      #noor-poll .np-results { display: none; text-align: right; }
      #noor-poll.np-voted .np-btns { display: none; }
      #noor-poll.np-voted .np-results { display: block; animation: npIn .4s ease-out; }
      #noor-poll .np-row { margin-bottom: 10px; }
      #noor-poll .np-row-head { display: flex; justify-content: space-between; font-size: .88rem; font-weight: 700; margin-bottom: 5px; }
      #noor-poll .np-track { height: 12px; border-radius: 99px; background: rgba(255,255,255,.14); overflow: hidden; }
      #noor-poll .np-fill {
        height: 100%; width: 0; border-radius: 99px;
        background: linear-gradient(90deg, #7dffb0, #2fd477);
        transition: width 1.1s cubic-bezier(.2,.9,.3,1);
      }
      #noor-poll .np-row.np-mine .np-fill { background: linear-gradient(90deg, #ffe58a, #f5b82e); }
      #noor-poll .np-row.np-mine .np-row-head span:first-child::after { content: "  ✓ توقعك"; color: #ffd76a; font-size: .78rem; }
      #noor-poll .np-total { font-size: .78rem; opacity: .75; text-align: center; margin-top: 4px; }
      #noor-poll .np-thanks { text-align: center; font-weight: 800; margin-bottom: 12px; }
      @keyframes npIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    `;
    document.head.appendChild(css);

    var box = document.createElement("div");
    box.id = "noor-poll";
    box.innerHTML =
      '<div class="np-title"></div>' +
      '<div class="np-sub"></div>' +
      '<div class="np-teams">' +
        '<div class="np-team"><img class="np-flag" alt=""><div class="np-name"></div></div>' +
        '<div class="np-vs">VS</div>' +
        '<div class="np-team"><img class="np-flag" alt=""><div class="np-name"></div></div>' +
      '</div>' +
      '<div class="np-timer"></div>' +
      '<div class="np-btns">' +
        '<button type="button" class="np-btn" data-v="home"></button>' +
        '<button type="button" class="np-btn np-draw" data-v="draw"></button>' +
        '<button type="button" class="np-btn" data-v="away"></button>' +
      '</div>' +
      '<div class="np-results">' +
        '<div class="np-thanks"></div>' +
        '<div class="np-bars"></div>' +
        '<div class="np-total"></div>' +
      '</div>';

    box.querySelector(".np-title").textContent = M.title;
    box.querySelector(".np-sub").textContent = M.home.name + " × " + M.away.name + " — " + M.timeText;
    var flags = box.querySelectorAll(".np-flag");
    var names = box.querySelectorAll(".np-name");
    flags[0].src = M.home.flag; flags[0].alt = M.home.name; names[0].textContent = M.home.name;
    flags[1].src = M.away.flag; flags[1].alt = M.away.name; names[1].textContent = M.away.name;

    var btns = box.querySelectorAll(".np-btn");
    for (var b = 0; b < btns.length; b++) {
      btns[b].textContent = LABELS[btns[b].getAttribute("data-v")];
      btns[b].addEventListener("click", function () {
        var v = this.getAttribute("data-v");
        saveVote(v);
        showResults(v);
      });
    }

    function showResults(myVote) {
      var c = getCounts(myVote);
      var total = c.home + c.draw + c.away;
      var bars = box.querySelector(".np-bars");
      bars.innerHTML = "";
      var fills = [];
      ["home", "draw", "away"].forEach(function (k) {
        var pct = Math.round(c[k] / total * 100);
        var row = document.createElement("div");
        row.className = "np-row" + (k === myVote ? " np-mine" : "");
        row.innerHTML = '<div class="np-row-head"><span></span><span></span></div>' +
                        '<div class="np-track"><div class="np-fill"></div></div>';
        row.querySelector(".np-row-head span:first-child").textContent = LABELS[k];
        row.querySelector(".np-row-head span:last-child").textContent = pct + "%";
        bars.appendChild(row);
        fills.push([row.querySelector(".np-fill"), pct]);
      });
      box.querySelector(".np-thanks").textContent = myVote
        ? "شكراً على توقعك! 💚 يلا نشجع الأخضر 🇸🇦"
        : "انتهى التصويت — توقعات زوار نور 💚";
      box.querySelector(".np-total").textContent = total.toLocaleString("en-US") + " توقع";
      box.classList.add("np-voted");
      // تحريك الأشرطة
      setTimeout(function () {
        fills.forEach(function (f) { f[0].style.width = f[1] + "%"; });
      }, 60);
    }

    // عداد لين ضربة البداية
    var timerEl = box.querySelector(".np-timer");
    function tick() {
      var diff = M.kickoff - Date.now();
      if (diff <= 0) {
        timerEl.textContent = "⚽ المباراة بدأت — بالتوفيق للأخضر!";
        // بعد بداية المباراة يتقفل التصويت وتطلع النتائج
        if (!box.classList.contains("np-voted")) showResults(getVote());
        clearInterval(tickTimer);
        return;
      }
      var h = Math.floor(diff / 3600000);
      var m = Math.floor(diff % 3600000 / 60000);
      var sec = Math.floor(diff % 60000 / 1000);
      timerEl.textContent = "⏳ باقي على المباراة: " +
        String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
    }
    var tickTimer = setInterval(tick, 1000);

    var saved = getVote();
    if (saved) showResults(saved);
    tick();

    afterEl.parentNode.insertBefore(box, afterEl.nextSibling);

    return function removePoll() {
      clearInterval(tickTimer);
      box.remove();
    };
  }

  // =====================
  // === BANNER + COUNTDOWN ===
  // =====================

  window.addEventListener("load", function () {

    // هل خلصت الحملة؟ (بعد 12 بالليل بتوقيت السعودية)
    var campaignOver = C.endsAt && Date.now() >= C.endsAt;

    var stopGlow = null;
    if (!campaignOver) {
      try {
        stopGlow = addTopGlow();
      } catch (e) {
        console.error("Noor glow error:", e);
      }
    }

    try {

      const CAMPAIGN_START = new Date(C.start);
      const PHASES         = C.phases;
      const TOTAL_MS       = PHASES.reduce((a, b) => a + b, 0);

      function getCurrentPhase(now) {
        // التايمر الأول: من الحين لين تبدأ الحملة
        if (now < CAMPAIGN_START) {
          return { end: CAMPAIGN_START, text: C.beforeText };
        }

        const elapsed = now - CAMPAIGN_START;
        if (elapsed < 0 || elapsed >= TOTAL_MS) return null; // يختفي العداد بعد انتهاء العرض

        let accumulated = 0;
        for (let i = 0; i < PHASES.length; i++) {
          accumulated += PHASES[i];
          if (elapsed < accumulated) {
            return {
              end:  new Date(CAMPAIGN_START.getTime() + accumulated),
              text: C.duringText
            };
          }
        }
        return null;
      }

      // =====================
      // === BANNER ===
      // =====================

      const BANNER_URL       = campaignOver ? C.endBannerUrl : C.bannerUrl;
      const BANNER_AFTER_URL = C.afterUrl;

      const banner = document.createElement("img");
      banner.src = BANNER_URL;
      banner.alt = "Banner";
      banner.style.width = "100%";
      banner.style.display = "block";
      banner.style.objectFit = "cover";
      banner.style.objectPosition = "bottom";

      function adjustBannerHeight() {
        const w = window.innerWidth;
        if (w <= 500)      banner.style.height = C.heights.small;
        else if (w <= 800) banner.style.height = C.heights.medium;
        else               banner.style.height = C.heights.large;
      }

      adjustBannerHeight();
      window.addEventListener("resize", adjustBannerHeight);
      document.body.prepend(banner);

      // ⚽ توقع المباراة تحت البانر
      var removePoll = null;
      if (!campaignOver) {
        try {
          removePoll = addMatchPoll(banner);
        } catch (e) {
          console.error("Noor poll error:", e);
        }
      }

      // لو الصفحة مفتوحة وقت 12 بالليل: رجّع البانر الأصلي وأخفِ التوقع والأضواء
      if (!campaignOver && C.endsAt) {
        var untilEnd = C.endsAt - Date.now();
        if (untilEnd < 24 * 60 * 60 * 1000) {
          setTimeout(function () {
            banner.src = C.endBannerUrl;
            if (removePoll) removePoll();
            if (stopGlow) stopGlow();
          }, untilEnd);
        }
      }

      // 🚫 العداد مطفي لهذي الحملة → بانر فقط، بدون تواريخ ولا عدّاد
      if (C.showCountdown === false) return;

      const nowCheck    = new Date();
      const activePhase = getCurrentPhase(nowCheck);

      // لو العرض خلص أصلاً: بدّل البانر واطلع بدون عداد
      if (!activePhase) {
        banner.src = BANNER_AFTER_URL;
        return;
      }

      // =====================
      // === ANIMATIONS ===
      // =====================

      const style = document.createElement("style");
      style.textContent = `
        @keyframes cdFlipIn {
          0%   { transform: translateY(-60%); opacity: 0; }
          100% { transform: translateY(0);    opacity: 1; }
        }
        @keyframes cdColonBlink {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.2; }
        }
        @keyframes cdPulse {
          0%, 100% { box-shadow: 0 2px 10px rgba(${T.glow},0.15), 0 0 0 0   rgba(${T.glow},0.4); }
          50%       { box-shadow: 0 2px 10px rgba(${T.glow},0.15), 0 0 0 7px rgba(${T.glow},0);   }
        }
        .cd-flip {
          display: inline-block;
          animation: cdFlipIn 0.3s cubic-bezier(0.23,1,0.32,1);
        }
        .cd-colon-blink { animation: cdColonBlink 1s step-start infinite; }
        .cd-box-pulse   { animation: cdPulse 0.8s ease-in-out infinite !important; }
      `;
      document.head.appendChild(style);

      // =====================
      // === COUNTDOWN CONTAINER ===
      // =====================

      const countdownContainer = document.createElement("div");
      Object.assign(countdownContainer.style, {
        background:     "#ffffff",
        borderTop:      "3px solid " + T.main,
        borderBottom:   "1px solid " + T.barBottom,
        padding:        "14px 12px 16px",
        fontFamily:     "'Segoe UI', Arial, sans-serif",
        display:        "flex",
        flexWrap:       "wrap",
        justifyContent: "center",
        alignItems:     "center",
        gap:            "8px",
        textAlign:      "center",
        direction:      "ltr",
        boxShadow:      "0 3px 14px rgba(" + T.glow + ",0.12)",
        position:       "relative",
        overflow:       "hidden",
      });

      const shimmer = document.createElement("div");
      Object.assign(shimmer.style, {
        position:   "absolute",
        top: "0", left: "0", right: "0",
        height:     "3px",
        background: "linear-gradient(90deg, transparent, " + T.main + ", transparent)",
      });
      countdownContainer.appendChild(shimmer);

      document.body.insertBefore(countdownContainer, banner.nextSibling);

      // =====================
      // === MESSAGE ===
      // =====================

      const message = document.createElement("div");
      Object.assign(message.style, {
        color:         T.textColor,
        fontWeight:    "700",
        fontSize:      "1.05rem",
        width:         "100%",
        marginBottom:  "6px",
        textAlign:     "center",
        direction:     "rtl",
        letterSpacing: "0.03em",
        textShadow:    "none",
      });
      message.textContent = activePhase.text;
      countdownContainer.appendChild(message);

      // =====================
      // === BOXES + COLONS ===
      // =====================

      const units = [
        { key: "days",    label: "أيام"  },
        { key: "hours",   label: "ساعات" },
        { key: "minutes", label: "دقائق" },
        { key: "seconds", label: "ثواني" },
      ];

      const boxes      = {};
      const prevValues = {};

      units.forEach((unit, i) => {

        const box = document.createElement("div");
        Object.assign(box.style, {
          background:    T.boxBg,
          border:        "1.5px solid " + T.boxBorder,
          borderRadius:  "10px",
          padding:       "10px 6px 8px",
          width:         "68px",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          boxShadow:     "0 2px 8px rgba(" + T.glow + ",0.10)",
          transition:    "box-shadow 0.3s",
        });

        const value = document.createElement("span");
        value.textContent = "00";
        value.className   = "cd-flip";
        Object.assign(value.style, {
          fontSize:      "1.65rem",
          fontWeight:    "800",
          fontFamily:    "'Courier New', 'Lucida Console', monospace",
          letterSpacing: "0.04em",
          lineHeight:    "1.1",
          color:         T.main,
          textShadow:    "0 1px 6px rgba(" + T.glow + ",0.25)",
        });

        const label = document.createElement("div");
        label.textContent = unit.label;
        Object.assign(label.style, {
          fontSize:      "0.68rem",
          marginTop:     "5px",
          color:         T.labelColor,
          letterSpacing: "0.06em",
          direction:     "rtl",
        });

        box.appendChild(value);
        box.appendChild(label);
        countdownContainer.appendChild(box);

        boxes[unit.key]      = { valueEl: value, boxEl: box };
        prevValues[unit.key] = "";

        if (i < units.length - 1) {
          const colon = document.createElement("div");
          colon.textContent = ":";
          colon.className   = "cd-colon-blink";
          Object.assign(colon.style, {
            color:      T.main,
            fontSize:   "1.9rem",
            fontWeight: "900",
            alignSelf:  "center",
            marginTop:  "-10px",
            lineHeight: "1",
            textShadow: "0 1px 4px rgba(" + T.glow + ",0.3)",
            userSelect: "none",
          });
          countdownContainer.appendChild(colon);
        }
      });

      // =====================
      // === COUNTDOWN LOGIC ===
      // =====================

      function animateValue(el, newVal) {
        el.classList.remove("cd-flip");
        void el.offsetWidth;
        el.textContent = newVal;
        el.classList.add("cd-flip");
      }

      function updateCountdown() {
        const now   = new Date();
        const phase = getCurrentPhase(now);

        // انتهى العرض نهائياً: أخفِ العداد وبدّل البانر
        if (!phase) {
          countdownContainer.style.display = "none";
          banner.src = BANNER_AFTER_URL;
          clearInterval(timer);
          return;
        }

        if (message.textContent !== phase.text) {
          message.textContent = phase.text;
        }

        const diff = phase.end - now;
        if (diff <= 0) return;

        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const vals = {
          days:    String(days).padStart(2, "0"),
          hours:   String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        };

        const isUrgent = diff < 60000;

        Object.keys(vals).forEach((key) => {
          const { valueEl, boxEl } = boxes[key];
          if (vals[key] !== prevValues[key]) {
            animateValue(valueEl, vals[key]);
            prevValues[key] = vals[key];
          }
          if (isUrgent) boxEl.classList.add("cd-box-pulse");
          else          boxEl.classList.remove("cd-box-pulse");
        });
      }

      let timer = setInterval(updateCountdown, 1000);
      updateCountdown();

      var btn = document.querySelector(".s-infinite-scroll-btn");
      if (btn) {
        mutationWatcher._lastBtn = btn;
        attachScrollObserver(btn);
      }

    } catch (e) {
      console.error("Noor script error:", e);
    }

  });

  // =====================
  // === AUTO INFINITE SCROLL ===
  // =====================

  var scrollObserver  = null;
  var mutationWatcher;

  function attachScrollObserver(btn) {
    if (scrollObserver) scrollObserver.disconnect();
    scrollObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () { btn.click(); }, 200);
          }
        });
      },
      { rootMargin: "0px 0px 300px 0px", threshold: 0 }
    );
    scrollObserver.observe(btn);
  }

  mutationWatcher = new MutationObserver(function () {
    var btn = document.querySelector(".s-infinite-scroll-btn");
    if (btn && btn !== mutationWatcher._lastBtn) {
      mutationWatcher._lastBtn = btn;
      attachScrollObserver(btn);
    }
  });

  mutationWatcher.observe(document.body, { childList: true, subtree: true });

  var hideStyle = document.createElement("style");
  hideStyle.textContent = ".s-infinite-scroll-wrapper { opacity: 0; pointer-events: none; height: 1px; overflow: hidden; }";
  document.head.appendChild(hideStyle);

})();
