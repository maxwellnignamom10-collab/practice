document.documentElement.classList.add("js");
try {
  var t = localStorage.getItem("farm-theme");
  if (t) document.documentElement.dataset.theme = t;
} catch (e) {}

document.addEventListener("DOMContentLoaded", function () {
  (function () {
    var $ = function (s) {
      return document.querySelector(s);
    };
    /* ===== FARM DETAILS: edit this block, the whole site updates ===== */
    var FARM = {
      email: "hello@littlemeadow.farm",
      phone: "",
      whatsapp: "",
      momo: { network: "", number: "", name: "" },
      bank: { bank: "", accountName: "", accountNumber: "" },
      payLink: "",
    };
    /* ================================================================== */
    var bg = $(".bgp"),
      bi = $('img[alt^="Pigs resting"]');
    if (bg && bi) bg.style.setProperty("--photo", 'url("' + bi.src + '")');
    document.querySelectorAll(".spin").forEach(function (sp) {
      var im = $('img[alt^="' + sp.dataset.k + '"]');
      if (im) sp.style.setProperty("--herd", 'url("' + im.src + '")');
    });
    /* hero slider */
    (function () {
      var f = $("#hs");
      if (!f) return;
      var tr = f.querySelector(".hs-track"),
        cap = $("#hc"),
        sl = [tr.firstElementChild],
        dots = $("#hd"),
        i = 0,
        tm,
        M = [
          ["Family run · Est. 2024", "Gungupa, Chamba"],
          ["Our herd", "Healthy, curious piglets."],
          ["Room to roam", "Fresh straw and space."],
          ["Thoughtful care", "Care from day one."],
          ["Small batches", "More attention for each pig."],
          ["Comfortable pens", "A clean space for the herd."],
        ];
      [
        "Piglets standing",
        "Pigs resting",
        "Piglets nursing",
        "Healthy piglets walking",
      ].forEach(function (q) {
        var im = document.querySelector('img[alt^="' + q + '"]');
        if (im) {
          var c = im.cloneNode();
          c.className = "hsl";
          c.removeAttribute("loading");
          tr.append(c);
          sl.push(c);
        }
      });
      var extra = document.createElement("img");
      extra.className = "hsl";
      extra.src = "images.html/JPEG%20Image_(05).jpg";
      extra.alt = "Pigs resting in a bright, well-kept pen";
      extra.decoding = "async";
      tr.append(extra);
      sl.push(extra);
      sl.forEach(function (_, k) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Show photo " + (k + 1));
        b.onclick = function () {
          go(k);
          rst();
        };
        dots.append(b);
      });
      function go(k) {
        i = (k + sl.length) % sl.length;
        sl.forEach(function (x, j) {
          x.classList.toggle("on", j === i);
          x.classList.toggle("pv", j === (i + sl.length - 1) % sl.length);
        });
        cap.querySelector("small").textContent = M[i][0];
        cap.querySelector("span").textContent = M[i][1];
        Array.prototype.forEach.call(dots.children, function (d, j) {
          d.setAttribute("aria-current", j === i);
        });
      }
      function rst() {
        clearInterval(tm);
        if (!matchMedia("(prefers-reduced-motion:reduce)").matches)
          tm = setInterval(function () {
            go(i + 1);
          }, 5000);
      }
      $("#hp").onclick = function () {
        go(i - 1);
        rst();
      };
      $("#hn").onclick = function () {
        go(i + 1);
        rst();
      };
      f.addEventListener("mouseenter", function () {
        clearInterval(tm);
      });
      f.addEventListener("mouseleave", rst);
      f.addEventListener("focusin", function () {
        clearInterval(tm);
      });
      f.addEventListener("focusout", rst);
      go(0);
      rst();
    })();

    /* photos follow cursor */
    (function () {
      if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
      var P = [].slice
          .call(document.querySelectorAll(".spin"))
          .map(function (e, i) {
            return {
              e: e,
              x: 0,
              y: 0,
              a: [14, 12, 16, 10, 12, 12][i % 6],
              k: [0.05, 0.08, 0.04, 0.1, 0.06, 0.07][i % 6],
            };
          }),
        tx = 0,
        ty = 0;
      addEventListener("pointermove", function (e) {
        tx = e.clientX / innerWidth - 0.5;
        ty = e.clientY / innerHeight - 0.5;
      });
      (function f() {
        requestAnimationFrame(f);
        P.forEach(function (p) {
          p.x += (tx * p.a * 2 - p.x) * p.k;
          p.y += (ty * p.a * 2 - p.y) * p.k;
          p.e.style.translate = p.x.toFixed(1) + "px " + p.y.toFixed(1) + "px";
        });
      })();
    })();

    /* fade the big photos as you scroll so the content stays readable */
    (function () {
      var sp = document.querySelectorAll(".spin");
      function f() {
        var o = Math.max(0.2, 1 - scrollY / (innerHeight * 0.75));
        sp.forEach(function (e) {
          e.style.opacity = o;
        });
      }
      addEventListener("scroll", f, { passive: true });
      f();
    })();

    /* card tilt */
    if (
      matchMedia("(hover:hover)").matches &&
      !matchMedia("(prefers-reduced-motion:reduce)").matches
    ) {
      document.querySelectorAll(".card").forEach(function (c) {
        c.addEventListener("pointermove", function (e) {
          var b = c.getBoundingClientRect(),
            x = (e.clientX - b.left) / b.width,
            y = (e.clientY - b.top) / b.height;
          c.style.transform =
            "perspective(900px) rotateX(" +
            (0.5 - y) * 9 +
            "deg) rotateY(" +
            (x - 0.5) * 11 +
            "deg) translateZ(8px)";
          c.style.setProperty("--mx", x * 100 + "%");
          c.style.setProperty("--my", y * 100 + "%");
        });
        c.addEventListener("pointerleave", function () {
          c.style.transform = "";
        });
      });
    }

    /* reveal */
    var io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            function (es) {
              es.forEach(function (e) {
                if (e.isIntersecting) {
                  e.target.classList.add("in");
                  io.unobserve(e.target);
                }
              });
            },
            { threshold: 0.1 },
          )
        : null;
    document.querySelectorAll(".rv").forEach(function (el) {
      io ? io.observe(el) : el.classList.add("in");
    });

    /* inquiry list */
    var items = new Set(),
      L = $("#il"),
      cnt = $("#ic"),
      em = $("#ie"),
      send = $("#is");
    function draw() {
      L.replaceChildren();
      items.forEach(function (p) {
        var c = document.createElement("span");
        c.className = "chip";
        c.append(p);
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = "×";
        b.setAttribute("aria-label", "Remove " + p);
        b.onclick = function () {
          items.delete(p);
          draw();
        };
        c.append(b);
        L.append(c);
      });
      cnt.textContent = items.size;
      em.hidden = items.size > 0;
      send.disabled = !items.size;
    }
    document.querySelectorAll("[data-add]").forEach(function (b) {
      b.onclick = function () {
        items.add(b.dataset.add);
        draw();
        if (b.dataset.go) {
          var g = $(b.dataset.go);
          if (g) g.scrollIntoView({ behavior: "smooth" });
        }
      };
    });
    send.onclick = function () {
      location.href =
        "mailto:" +
        FARM.email +
        "?subject=" +
        encodeURIComponent("Pig enquiry") +
        "&body=" +
        encodeURIComponent(
          "Hello Dominic,\n\nI’m interested in:\n" +
            Array.from(items)
              .map(function (i) {
                return "- " + i;
              })
              .join("\n") +
            "\n\nWhat’s currently available?\n\nThank you!",
        );
    };

    /* theme, menu, progress, buttons */
    (function () {
      var H = document.documentElement,
        th = $("#th"),
        mn = $("#mn"),
        lk = $("#lk"),
        pg = $("#pg"),
        tt = $("#tt"),
        mt = $('meta[name="theme-color"]');
      function cur() {
        return (
          H.dataset.theme ||
          (matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark")
        );
      }
      function paint() {
        var l = cur() === "light";
        th.textContent = l ? "☾" : "☀";
        th.setAttribute(
          "aria-label",
          "Switch to " + (l ? "dark" : "light") + " mode",
        );
        mt.content = l ? "#f6f3e9" : "#0d140f";
      }
      th.onclick = function () {
        var n = cur() === "light" ? "dark" : "light";
        H.dataset.theme = n;
        try {
          localStorage.setItem("farm-theme", n);
        } catch (e) {}
        paint();
      };
      paint();
      mn.onclick = function () {
        var o = lk.classList.toggle("open");
        mn.setAttribute("aria-expanded", o);
        mn.setAttribute("aria-label", o ? "Close menu" : "Open menu");
        mn.textContent = o ? "✕" : "☰";
      };
      lk.addEventListener("click", function (e) {
        if (e.target.closest("a")) {
          lk.classList.remove("open");
          mn.setAttribute("aria-expanded", "false");
          mn.textContent = "☰";
        }
      });
      function sc() {
        var m = H.scrollHeight - innerHeight;
        pg.style.width = (m > 0 ? (scrollY / m) * 100 : 0) + "%";
        tt.classList.toggle("on", scrollY > 600);
      }
      addEventListener("scroll", sc, { passive: true });
      sc();
      tt.onclick = function () {
        scrollTo({ top: 0, behavior: "smooth" });
      };
      $("#ix").onclick = function () {
        items.clear();
        draw();
      };
      $("#ce").onclick = function () {
        var b = this,
          m = FARM.email;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(m).then(
            function () {
              b.textContent = "Copied ✓";
              setTimeout(function () {
                b.textContent = "Copy email";
              }, 2000);
            },
            function () {
              b.textContent = m;
            },
          );
        } else b.textContent = m;
      };
    })();

    $("#tk").onclick = function () {
      var v = $("#tn").value.trim();
      if (!v) {
        $("#tn").focus();
        return;
      }
      location.href =
        "mailto:" +
        FARM.email +
        "?subject=" +
        encodeURIComponent("Order update: " + v) +
        "&body=" +
        encodeURIComponent(
          "Hello, could you please send me an update on order " +
            v +
            "? Thank you!",
        );
    };

    var lnk = {};
    document.querySelectorAll('.links a[href^="#"]').forEach(function (a) {
      lnk[a.getAttribute("href").slice(1)] = a;
    });
    if ("IntersectionObserver" in window) {
      var so = new IntersectionObserver(
        function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) {
              Object.keys(lnk).forEach(function (k) {
                lnk[k].removeAttribute("aria-current");
              });
              if (lnk[e.target.id])
                lnk[e.target.id].setAttribute("aria-current", "true");
            }
          });
        },
        { rootMargin: "-45% 0px -50% 0px" },
      );
      Object.keys(lnk).forEach(function (i) {
        var el = document.getElementById(i);
        if (el) so.observe(el);
      });
    }

    (function () {
      var m = FARM;
      document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
        a.href = "mailto:" + m.email;
        if (a.textContent.indexOf("@") > -1) a.textContent = m.email;
      });
      if (m.whatsapp) {
        var u =
          "https://wa.me/" +
          m.whatsapp.replace(/\D/g, "") +
          "?text=" +
          encodeURIComponent("Hello Dominic, I’m interested in your pigs.");
        ["#cw", "#wa"].forEach(function (i) {
          var a = $(i);
          a.href = u;
          a.hidden = false;
        });
      }
      if (m.phone) {
        var c = $("#cc");
        c.href = "tel:" + m.phone.replace(/\s/g, "");
        c.textContent = "Call " + m.phone;
        c.hidden = false;
      }
      function cb(txt) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "btn ghost";
        b.style.cssText = "padding:8px 16px;font-size:.85rem;margin-top:10px";
        b.textContent = "Copy";
        b.onclick = function () {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(txt).then(function () {
              b.textContent = "Copied ✓";
              setTimeout(function () {
                b.textContent = "Copy";
              }, 2000);
            });
          }
        };
        return b;
      }
      var mm = m.momo,
        pm = $("#pmm");
      if (mm.number) {
        pm.textContent =
          "Send to " +
          mm.number +
          (mm.name ? " (" + mm.name + ")" : "") +
          (mm.network ? ", " + mm.network : "") +
          ".";
        pm.append(document.createElement("br"), cb(mm.number));
      }
      var bk = m.bank,
        pb = $("#pmb");
      if (bk.accountNumber) {
        pb.textContent = [bk.bank, bk.accountName, bk.accountNumber]
          .filter(Boolean)
          .join(" · ");
        pb.append(document.createElement("br"), cb(bk.accountNumber));
      }
      if (m.payLink) {
        $("#po").hidden = false;
        $("#pl").href = m.payLink;
      }
    })();

    /* visit form */
    var vf = $("#vf");
    $("#vd").min = new Date().toISOString().slice(0, 10);
    vf.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(vf);
      var body =
        "Name: " +
        d.get("name") +
        "\nEmail: " +
        d.get("email") +
        "\nPreferred date: " +
        d.get("date") +
        "\nGroup size: " +
        d.get("group") +
        "\nNotes: " +
        (d.get("note") || "None");
      $("#vs").textContent =
        "Your email app should open with the request ready to send.";
      location.href =
        "mailto:" +
        FARM.email +
        "?subject=" +
        encodeURIComponent("Farm visit request") +
        "&body=" +
        encodeURIComponent(body);
    });
  })();
});
