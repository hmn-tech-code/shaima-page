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
      //    strength: قوة السطوع من 0 إلى 1 (0.5 = نص قوة الصورة تقريباً)
      glow: { enabled: true, strength: 0.5 },

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
  // === GREEN GLOW (أضواء خضراء من فوق) ===
  // =====================

  function addTopGlow() {
    if (!C.glow || !C.glow.enabled) return;
    if (document.getElementById("noor-glow")) return;

    var s = Math.max(0, Math.min(1, C.glow.strength));
    var g = "0,230,110"; // أخضر فاتح مضيء

    var glowStyle = document.createElement("style");
    glowStyle.textContent = `
      #noor-glow {
        position: fixed;
        top: 0; left: 0; right: 0;
        height: 100vh;
        pointer-events: none;      /* ما يمنع الضغط على أي شي */
        z-index: 2147483000;
        overflow: hidden;
        opacity: 0;
        animation: noorGlowIn 1.2s ease-out forwards;
      }
      /* توهج ناعم أعلى الشاشة */
      #noor-glow .ng-haze {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse 70% 35% at 50% 0%, rgba(${g},${0.35 * s}), transparent 70%),
          linear-gradient(to bottom, rgba(${g},${0.12 * s}), transparent 45%);
      }
      /* الشعاع: شكل مخروط يوسع لتحت */
      #noor-glow .ng-beam {
        position: absolute;
        top: -5vh;
        width: 26vw;
        min-width: 120px;
        height: 95vh;
        transform-origin: 50% 0;
        clip-path: polygon(46% 0, 54% 0, 100% 100%, 0 100%);
        background: linear-gradient(to bottom,
          rgba(${g},${0.55 * s}) 0%,
          rgba(${g},${0.22 * s}) 40%,
          transparent 85%);
        filter: blur(10px);
        animation: noorSway 7s ease-in-out infinite alternate;
      }
      #noor-glow .ng-b1 { left: -8vw;  --r: -28deg; animation-duration: 8s;  }
      #noor-glow .ng-b2 { left: 14vw;  --r: -12deg; animation-duration: 6.5s; animation-delay: -2s; }
      #noor-glow .ng-b3 { left: 37vw;  --r:   0deg; animation-duration: 9s;  animation-delay: -4s; }
      #noor-glow .ng-b4 { right: 14vw; --r:  12deg; animation-duration: 7s;  animation-delay: -1s; }
      #noor-glow .ng-b5 { right: -8vw; --r:  28deg; animation-duration: 8.5s; animation-delay: -3s; }

      @keyframes noorSway {
        0%   { transform: rotate(calc(var(--r) - 6deg)); opacity: .75; }
        50%  { opacity: 1; }
        100% { transform: rotate(calc(var(--r) + 6deg)); opacity: .8; }
      }
      @keyframes noorGlowIn { to { opacity: 1; } }

      /* لمن مفعّل تقليل الحركة في جواله */
      @media (prefers-reduced-motion: reduce) {
        #noor-glow, #noor-glow .ng-beam { animation: none; opacity: 1; }
        #noor-glow .ng-beam { transform: rotate(var(--r)); }
      }
    `;
    document.head.appendChild(glowStyle);

    var wrap = document.createElement("div");
    wrap.id = "noor-glow";
    wrap.setAttribute("aria-hidden", "true");

    var haze = document.createElement("div");
    haze.className = "ng-haze";
    wrap.appendChild(haze);

    for (var i = 1; i <= 5; i++) {
      var beam = document.createElement("div");
      beam.className = "ng-beam ng-b" + i;
      wrap.appendChild(beam);
    }

    document.body.appendChild(wrap);
  }

  // =====================
  // === BANNER + COUNTDOWN ===
  // =====================

  window.addEventListener("load", function () {

    try {
      addTopGlow();
    } catch (e) {
      console.error("Noor glow error:", e);
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

      const BANNER_URL       = C.bannerUrl;
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
