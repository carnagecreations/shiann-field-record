//
//    Field Record — interactive layer
//    Ported from the original single-page excavation site's behaviors,
//    adapted to work across real multi-page navigation instead of hash routing.
//

(function () {
    var REDUCE = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    var sitesEl = document.getElementById("frSitesData");
    var SITES = [];
    try {
        SITES = sitesEl ? JSON.parse(sitesEl.textContent) : [];
    } catch (e) {
        SITES = [];
    }

    var currentSlug = null;
    var m = location.pathname.match(/\/dig-sites\/([^/]+)\/?/);
    if (m) currentSlug = m[1];

    function getVisited() {
        try {
            return JSON.parse(sessionStorage.getItem("svb_visited") || "[]");
        } catch (e) {
            return [];
        }
    }
    function addVisited(slug) {
        var v = getVisited();
        if (v.indexOf(slug) === -1) {
            v.push(slug);
            try {
                sessionStorage.setItem("svb_visited", JSON.stringify(v));
            } catch (e) {}
        }
        return v;
    }

    /* ---- Trail: mark visited/current pips + progress count ---- */
    function paintTrail() {
        var visited = getVisited();
        document.querySelectorAll(".trail-pip[data-site-slug]").forEach(function (pip) {
            var slug = pip.dataset.siteSlug;
            pip.classList.remove("visited", "current");
            if (slug === currentSlug) {
                pip.classList.add("current");
                pip.setAttribute("aria-current", "page");
            } else if (visited.indexOf(slug) !== -1) {
                pip.classList.add("visited");
            }
        });
        var progressEl = document.getElementById("frTrailProgress");
        if (progressEl) {
            progressEl.textContent = visited.length + " / " + SITES.length + " sites excavated";
        }
    }

    /* ---- Toast helpers ---- */
    function showToast(html, duration) {
        var t = document.getElementById("frToast");
        if (!t) return;
        t.innerHTML = html;
        t.classList.add("show");
        clearTimeout(t._timer);
        t._timer = setTimeout(function () {
            t.classList.remove("show");
        }, duration || 3200);
    }

    function checkFullExcavation() {
        var visited = getVisited();
        var allDone = SITES.length > 0 && SITES.every(function (s) {
            return visited.indexOf(s.slug) !== -1;
        });
        if (!allDone) return;
        var already = false;
        try {
            already = sessionStorage.getItem("svb_celebrated") === "1";
        } catch (e) {}
        if (already) return;
        try {
            sessionStorage.setItem("svb_celebrated", "1");
        } catch (e) {}
        var t = document.getElementById("frCelebrateToast");
        if (!t) return;
        t.innerHTML = "<b>Full excavation complete</b>All " + SITES.length + " dig sites uncovered — that's the whole record.";
        t.classList.add("show");
        clearTimeout(t._timer);
        t._timer = setTimeout(function () {
            t.classList.remove("show");
        }, 4200);
    }

    /* ---- On a dig-site page: record visit, show "uncovered" toast on first visit ---- */
    if (currentSlug) {
        var wasVisited = getVisited().indexOf(currentSlug) !== -1;
        addVisited(currentSlug);
        if (!wasVisited) {
            var site = SITES.filter(function (s) { return s.slug === currentSlug; })[0];
            if (site) {
                showToast("<b>Dig site uncovered</b>" + site.title);
            }
            checkFullExcavation();
        }
    }
    paintTrail();

    /* ---- Keyboard prev/next hint + arrow-key navigation between dig sites ---- */
    (function setupPrevNext() {
        if (!currentSlug || !SITES.length) return;
        var idx = SITES.map(function (s) { return s.slug; }).indexOf(currentSlug);
        if (idx === -1) return;
        var prev = SITES[(idx - 1 + SITES.length) % SITES.length];
        var next = SITES[(idx + 1) % SITES.length];
        var prevLabel = document.getElementById("frPrevLabel");
        var nextLabel = document.getElementById("frNextLabel");
        if (prevLabel) prevLabel.textContent = prev.title;
        if (nextLabel) nextLabel.textContent = next.title;

        document.addEventListener("keydown", function (e) {
            if (e.target && /input|textarea/i.test(e.target.tagName)) return;
            if (lightbox && lightbox.classList.contains("show")) return;
            if (e.key === "ArrowRight") {
                location.href = "/dig-sites/" + next.slug + "/";
            } else if (e.key === "ArrowLeft") {
                location.href = "/dig-sites/" + prev.slug + "/";
            }
        });
    })();

    /* ---- Easter eggs ---- */
    function showFactToast(text) {
        showToast("<b>Found something</b>" + text, 4200);
    }
    function triggerEgg(el) {
        showFactToast(el.dataset.egg);
        if (!REDUCE) {
            el.classList.add("egg-pop");
            setTimeout(function () {
                el.classList.remove("egg-pop");
            }, 400);
        }
    }

    /* ---- Lightbox (mascot fossil photos) ---- */
    var lightbox = document.getElementById("frLightbox");
    function openLightbox(photoEl) {
        var img = photoEl.querySelector("img");
        document.getElementById("lbImg").src = photoEl.dataset.full || img.src;
        document.getElementById("lbImg").alt = img.alt;
        document.getElementById("lbCaption").textContent = photoEl.dataset.species;
        var creditLink = document.createElement("a");
        creditLink.href = photoEl.dataset.creditUrl;
        creditLink.target = "_blank";
        creditLink.rel = "noopener";
        creditLink.textContent = photoEl.dataset.credit;
        var creditEl = document.getElementById("lbCredit");
        creditEl.innerHTML = "";
        creditEl.appendChild(creditLink);
        lightbox.classList.add("show");
        lightbox.setAttribute("aria-hidden", "false");
        lightbox._returnFocus = photoEl;
        document.getElementById("lbClose").focus();
    }
    function closeLightbox() {
        lightbox.classList.remove("show");
        lightbox.setAttribute("aria-hidden", "true");
        if (lightbox._returnFocus) lightbox._returnFocus.focus();
    }
    function unearthThenOpen(photoEl) {
        if (REDUCE) {
            openLightbox(photoEl);
            return;
        }
        photoEl.classList.add("unearth");
        setTimeout(function () {
            photoEl.classList.remove("unearth");
        }, 320);
        setTimeout(function () {
            openLightbox(photoEl);
        }, 150);
    }

    document.addEventListener("click", function (e) {
        var photoEl = e.target.closest ? e.target.closest(".mascot-photo") : null;
        if (photoEl) {
            unearthThenOpen(photoEl);
            return;
        }
        var eggEl = e.target.closest ? e.target.closest("[data-egg]") : null;
        if (eggEl) {
            triggerEgg(eggEl);
            return;
        }
        if (e.target === lightbox) closeLightbox();
    });
    var lbClose = document.getElementById("lbClose");
    if (lbClose) lbClose.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", function (e) {
        if (lightbox && lightbox.classList.contains("show")) {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "Enter" || e.key === " ") {
                if (document.activeElement && document.activeElement.classList.contains("mascot-photo")) {
                    e.preventDefault();
                    unearthThenOpen(document.activeElement);
                }
            }
            return;
        }
        if (e.target && /input|textarea/i.test(e.target.tagName)) return;
        if (document.activeElement && document.activeElement.classList.contains("mascot-photo") && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            unearthThenOpen(document.activeElement);
            return;
        }
        if (document.activeElement && document.activeElement.dataset && document.activeElement.dataset.egg && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            triggerEgg(document.activeElement);
        }
    });

    /* ---- Scroll reveal ---- */
    (function attachReveal() {
        var els = document.querySelectorAll(".reveal");
        if (REDUCE || !("IntersectionObserver" in window)) {
            els.forEach(function (el) {
                el.classList.add("in-view");
            });
            return;
        }
        var obs = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (en) {
                    if (en.isIntersecting) {
                        en.target.classList.add("in-view");
                        obs.unobserve(en.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        els.forEach(function (el) {
            obs.observe(el);
        });
    })();

    /* ---- Hub-tile hover tilt ---- */
    if (!REDUCE) {
        document.querySelectorAll(".hub-tile").forEach(function (tile) {
            tile.addEventListener("mousemove", function (e) {
                var r = tile.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width - 0.5;
                var y = (e.clientY - r.top) / r.height - 0.5;
                tile.style.transform = "perspective(500px) rotateX(" + -y * 6 + "deg) rotateY(" + x * 6 + "deg) translateY(-3px)";
            });
            tile.addEventListener("mouseleave", function () {
                tile.style.transform = "";
            });
        });
    }

    /* ---- Intro excavation reveal (first visit this session, hub only) ---- */
    (function introReveal() {
        var overlay = document.getElementById("frIntroOverlay");
        if (!overlay) return;
        var seen = false;
        try {
            seen = sessionStorage.getItem("svb_introSeen") === "1";
        } catch (e) {}
        if (REDUCE || seen || currentSlug) {
            overlay.remove();
            return;
        }
        try {
            sessionStorage.setItem("svb_introSeen", "1");
        } catch (e) {}
        var footSvg =
            '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">' +
            '<ellipse cx="16" cy="23" rx="6.4" ry="5.2"/>' +
            '<ellipse cx="8.5" cy="14.5" rx="3" ry="6.6" transform="rotate(-22 8.5 14.5)"/>' +
            '<ellipse cx="16" cy="10.5" rx="3.1" ry="7.4"/>' +
            '<ellipse cx="23.5" cy="14.5" rx="3" ry="6.6" transform="rotate(22 23.5 14.5)"/>' +
            "</svg>";
        overlay.innerHTML = '<div class="intro-glyph">' + footSvg + '</div><div class="intro-text">Uncovering the record&hellip;</div>';
        setTimeout(function () {
            overlay.classList.add("hide");
            setTimeout(function () {
                overlay.remove();
            }, 650);
        }, 900);
    })();

    /* ---- Cursor footprint trail (pointer devices only) ---- */
    (function cursorTrail() {
        if (REDUCE || !window.matchMedia || matchMedia("(pointer: coarse)").matches) return;
        var footSvg =
            '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">' +
            '<ellipse cx="16" cy="23" rx="6.4" ry="5.2"/>' +
            '<ellipse cx="8.5" cy="14.5" rx="3" ry="6.6" transform="rotate(-22 8.5 14.5)"/>' +
            '<ellipse cx="16" cy="10.5" rx="3.1" ry="7.4"/>' +
            '<ellipse cx="23.5" cy="14.5" rx="3" ry="6.6" transform="rotate(22 23.5 14.5)"/>' +
            "</svg>";
        var last = 0;
        document.addEventListener("mousemove", function (e) {
            var now = Date.now();
            if (now - last < 160) return;
            last = now;
            var el = document.createElement("div");
            el.className = "fr-cursor-print";
            el.style.left = e.clientX + "px";
            el.style.top = e.clientY + "px";
            el.innerHTML = footSvg;
            el.style.transform = "translate(-50%,-50%) rotate(" + (Math.random() * 30 - 15) + "deg)";
            document.body.appendChild(el);
            setTimeout(function () {
                el.remove();
            }, 820);
        });
    })();
})();
