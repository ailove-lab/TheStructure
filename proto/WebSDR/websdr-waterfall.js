 //WebSDR HTML5 client side - Copyright 2013, pa3fwm@amsat.org - all rights reserved
(function() {
    var t = !0, v = !1, x = 0;
    function R() {
        function F(b) {
            var a = getMouseXY(b).x - this.offsetParent.offsetLeft, c = b.wheelDelta || -b.detail;
            0 < c ? I(-2, a) : 0 > c && I(-1, a);
            return cancelEvent(b)
        }
        var c = waterfallapplet[i];
        function K(b) {
            b = dragorigval - (b - dragorigX << a.maxzoom - a.b);
            0 > b && (b = 0);
            var c = (1024 << a.maxzoom) - (1024 << a.maxzoom - a.b);
            b > c && (b = c);
            a.d.send("GET /~~waterparam?start=" + b);
            c = a.c;
            a.c = b;
            G(c, a.c, a.b, v);
            J()
        }
        function S(b) {
            b = getMouseXY(b);
            K(b.x);
            return cancelEvent(e)
        }
        function L(b) {
            b.preventDefault();
            a.j = t;
            a.g = 10
        }
        function M(b) {
            b.preventDefault();
            setTimeout(T, 
            300)
        }
        function T() {
            a.j = v
        }
        function N(b) {
            b.preventDefault();
            var c = 0;
            b = Math.floor(10 * b.scale);
            b > a.g + 1 && (c = -1);
            b < a.g - 1 && (c = 1);
            0 != c && (w(c, (a.l + a.r) / 2 / 1024), a.g = b)
        }
        function O(b) {
            b.preventDefault();
            1 == b.targetTouches.length && (a.t = dragorigX, dragorigX = b.targetTouches[0].pageX, a.j == v && (dragging = t, dragorigval = a.c, a.o = a.f, a.f = (new Date).getTime(), clearTimeout(a.s)))
        }
        function P(b) {
            b.preventDefault();
            for (var c = 0; c < b.touches.length; c++) {
                var d = b.touches[c];
                a.r = a.l;
                a.l = d.pageX;
                a.j == v && (K(d.pageX), a.o = 0, a.f = 0)
            }
        }
        function U() {
            w(1, 
            dragorigX / 1024)
        }
        function Q(b) {
            b.preventDefault();
            dragging = v;
            (b = a.f - a.o) && 300 > b ? w(-1, dragorigX / 1024) : a.f && 300 > (new Date).getTime() - a.f && (a.s = setTimeout(U, 300))
        }
        function J() {
            zoomchange(a.p, a.b, a.c)
        }
        function G(b, p, n, f) {
            var g = c.width, h = 0, k = d.height - h;
            if (f && (h = q - 1, k = 1, 0 > h))
                return;
            if (n == a.b)
                try {
                    if (p < b) {
                        var l = b - p >> a.maxzoom - a.b;
                        d.a.drawImage(d, 0, h, g - l, k, l, h, g - l, k);
                        d.a.fillStyle = "#000000";
                        d.a.fillRect(0, h, l, k);
                        f || (j.a.drawImage(j, 0, h, g - l, k, l, h, g - l, k), j.a.fillStyle = "#000000", j.a.fillRect(0, h, l, k))
                    } else if (p > 
                    b) {
                        var m = p - b >> a.maxzoom - a.b;
                        d.a.drawImage(d, m, h, g - m, k, 0, h, g - m, k);
                        d.a.fillStyle = "#000000";
                        d.a.fillRect(g - m, h, m, k);
                        f || (j.a.drawImage(j, m, h, g - m, k, 0, h, g - m, k), j.a.fillStyle = "#000000", j.a.fillRect(g - m, h, m, k))
                    }
                } catch (s) {
                }
            else
                a.n = t, n > a.b ? (m = 1 << n - a.b, l = 0.5 + (-p + b) * g / (1024 << a.maxzoom - a.b), d.a.drawImage(d, 0, h, 1024, k, l, h, 1024 / m, k), d.a.fillStyle = "#000000", d.a.fillRect(0, h, l, k), d.a.fillRect(l + g / m, h, g, k), f || (j.a.drawImage(j, 0, h, 1024, k, l, h, 1024 / m, k), j.a.fillStyle = "#000000", j.a.fillRect(0, h, l, k), j.a.fillRect(l + g / 
                m, h, g, k))) : (m = 1 << a.b - n, l = 0.5 + (p - b) * g / (1024 << a.maxzoom - n), d.a.drawImage(d, l, h, g / m, k, 0, h, g, k), f || j.a.drawImage(j, l, h, g / m, k, 0, h, g, k))
        }
        function w(b, c) {
            if (0 != a.maxzoom) {
                var d = a.b, f = a.c, g = a.c + Math.round(c * (1024 << a.maxzoom - a.b));
                a.b -= b;
                0 > a.b && (a.b = 0);
                a.b > a.maxzoom && (a.b = a.maxzoom);
                g -= Math.round(c * (1024 << a.maxzoom - a.b));
                0 > g && (g = 0);
                var h = (1024 << a.maxzoom) - (1024 << a.maxzoom - a.b);
                g > h && (g = h);
                a.c = g;
                G(f, a.c, d, v);
                a.d.send("GET /~~waterparam?zoom=" + a.b + "&start=" + a.c);
                J()
            }
        }
        function I(b, d) {
            if (-1 == b)
                w(1, d / 1024);
            else if (-2 == 
            b)
                w(-1, d / 1024);
            else {
                var f = this.b, j = this.c, g = b, h = c.width;
                0 > g && (g = 0);
                g > this.maxzoom && (g = this.maxzoom);
                0 > d && (d = 0);
                h = (1024 << this.maxzoom) - (h << this.maxzoom - g);
                d > h && (d = h);
                this.d.send("GET /~~waterparam?zoom=" + g + "&start=" + d);
                this.b = g;
                this.c = d;
                G(j, a.c, f, v);
                J()
            }
        }
        c.width || (c.width = 1024);
        c.height || (c.height = 100);
        document.getElementById(c.div).innerHTML = '<span id="debug3"></span><br><div id="wfcdiv' + x + '" style="height:100px;overflow:hidden;position:relative;"><canvas class="html5waterfall" id="wf1canvas' + 
        x + '" width="' + c.width + '" height="' + c.height + '" style="position:absolute">test</canvas><canvas class="html5waterfall" id="wf2canvas' + x + '" width="' + c.width + '" height="' + c.height + '" style="position:absolute">test</canvas></div>';
        c.e = document.getElementById("wfcdiv" + x);
        var s = 0 <= x ? "on" : "off";
        c.e.p = c.id;
        c.e.band = c.band;
        c.e.width = c.width;
        c.e.height = c.height;
        c.e.maxzoom = c.maxzoom;
        c = c.e;
        c.destroy = function() {
            try {
                c.d.close()
            } catch (b) {
            }
            c.parentNode.removeChild(c)
        };
        var y = document.getElementById("wf1canvas" + x), 
        A = document.getElementById("wf2canvas" + x), d = y, j = A, H = c.width;
        c.k = 9;
        c.d = new WebSocket("ws://websdr.ewi.utwente.nl:8901/~~waterstream" + c.band + "?format=" + c.k + "&width=" + H);
        c.d.binaryType = "arraybuffer";
        x++;
        y.a = y.getContext("2d");
        A.a = A.getContext("2d");
        y.q = y.a.createImageData(H, 1);
        A.q = A.a.createImageData(H, 1);
        var a = c;
        -1 < x && (s += "mes");
        c.mode = 1;
        var B = new Uint8Array(256), C = new Uint8Array(256), D = new Uint8Array(256), f;
        for (f = 0; 64 > f; f++)
            B[f] = 0, C[f] = 0, D[f] = 2 * f;
        for (; 128 > f; f++)
            B[f] = 3 * f - 192, C[f] = 0, D[f] = 2 * f;
        for (; 192 > f; f++)
            B[f] = 
            f + 64, C[f] = 256 * Math.sqrt((f - 128) / 64), D[f] = 511 - 2 * f;
        for (; 256 > f; f++)
            B[f] = 255, C[f] = 255, D[f] = 512 + 2 * f;
        c.b = 0;
        c.c = 0;
        -2 < x && (s += "sa");
        c.i = 0;
        c.h = 0;
        c.n = t;
        c.m = [];
        c.j = v;
        c.g = 10;
        c.l = 0;
        c.r = 0;
        c.o = 0;
        c.f = 0;
        c.s = 0;
        -3 < x && (s += "ge");
        var E = new Uint8Array(1024), q = 0;
        c.d[s] = function(b) {
            b = new Uint8Array(b.data);
            if (255 == b[0])
                1 == b[1] && (a.h = b[3] + (b[4] << 8) + (b[5] << 16) + (b[6] << 24), 128 > b[2] && (a.i = b[2]));
            else {
                var p;
                for (p = 0; 1 > p; p++) {
                    if (1 == a.k) {
                        var n = b, u = E;
                        for (f = 0; f < n.length; f++)
                            z = 16 * (n[f] & 15) + 2, u[2 * f] = z, z = n[f] & 242, u[2 * f + 1] = z
                    }
                    if (9 == a.k)
                        for (var n = 
                        b, u = E, g = 0, h = 0, k = 0, l = 0, m = 0, s = 0; k < c.width; ) {
                            var l = n[h] << 8 + g | n[h + 1] << g, r = 0, w = 1;
                            l & 32768 && (l = 128 * m + ((l & 32512) >> 8), r = V[l], w = W[l]);
                            g += w;
                            8 <= g && (g -= 8, h++);
                            if (1 == r || -1 == r)
                                m = 1;
                            if (1 < r || -1 > r)
                                m = 2;
                            0 == r && (m = 0);
                            s += r << 4;
                            r = u[k] + s;
                            0 > r && (r = 8);
                            255 < r && (r = 248);
                            u[k] = r;
                            k++
                        }
                }
                p = d.q;
                if (0 != a.mode) {
                    for (b = 0; b < H; b++)
                        n = E[b], p.data[4 * b] = B[n], p.data[4 * b + 1] = C[n], p.data[4 * b + 2] = D[n], p.data[4 * b + 3] = 255;
                    d.a.putImageData(p, 0, q);
                    d.style.top = d.height - q + "px";
                    j.style.top = -q + "px";
                    q++;
                    q >= d.height && (q = 0, b = j, j = d, d = b);
                    (a.i != a.b || a.h != a.c) && G(a.h, a.c, 
                    a.i, t)
                } else {
                    d.a.fillStyle = "#000000";
                    d.a.fillRect(0, 0, d.width, d.height);
                    d.a.fillStyle = "#00ffff";
                    if (a.n) {
                        for (b = 0; 1024 > b; b++)
                            a.m[b] = E[b];
                        a.n = v
                    }
                    for (b = 0; b < c.width; b++)
                        n = 0.5 * (E[b] + a.m[b]), a.m[b] = n, n *= d.height / 255, d.a.fillRect(b, d.height - n, 1, n)
                }
            }
        };
        c.d.onopen = function() {
            waterfallappletstarted(a.p)
        };
        d.addEventListener("mousewheel", F);
        d.addEventListener("DOMMouseScroll", F);
        j.addEventListener("mousewheel", F);
        j.addEventListener("DOMMouseScroll", F);
        c.onmousedown = function(b) {
            var a = getMouseXY(b);
            dragging = t;
            document.onmousemove = 
            S;
            dragorigX = a.x;
            dragorigval = this.c;
            return cancelEvent(b)
        };
        window.isTouchDev && (d.addEventListener("gesturestart", L), d.addEventListener("gesturechange", N), d.addEventListener("gestureend", M), j.addEventListener("gesturestart", L), j.addEventListener("gesturechange", N), j.addEventListener("gestureend", M), d.addEventListener("touchstart", O), d.addEventListener("touchmove", P), d.addEventListener("touchend", Q), j.addEventListener("touchstart", O), j.addEventListener("touchmove", P), j.addEventListener("touchend", Q));
        c.setSize = function(b, a) {
            var f = document.createElement("canvas");
            f.width = d.width;
            var u = Math.min(d.height, a);
            f.height = u;
            f.getContext("2d").drawImage(d, 0, 0, f.width, q, 0, u - q, f.width, q);
            f.getContext("2d").drawImage(j, 0, j.height - (u - q), f.width, u - q, 0, 0, f.width, u - q);
            d.height = a;
            d.width = b;
            j.height = a;
            j.width = b;
            this.style.height = a + "px";
            j.a.drawImage(f, 0, a - f.height);
            q = 0;
            c.height = a;
            c.width = b
        };
        c.setheight = function() {
        };
        c.setzoom = I;
        c.setslow = function(a) {
            this.d.send("GET /~~waterparam?slow=" + a)
        };
        c.setmode = function(a) {
            if ((2 <= 
            this.mode || 2 <= a) && this.mode != a) {
                var c = a;
                0 == c && (c = 1);
                this.d.send("GET /~~waterparam?scale=" + c)
            }
            0 == a && 0 != this.mode && (q = d.height - 1, j.style.top = d.height + "px", d.style.top = "0px", smoothbinvalid = t);
            this.mode = a
        };
        c.setband = function(a, c, d, f) {
            this.i = this.b = d;
            this.h = this.c = f;
            this.maxzoom = c;
            this.d.send("GET /~~waterparam?band=" + a + "&zoom=" + this.b + "&start=" + this.c)
        };
        var V = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
            -1, -1, -1, -1, -1, -1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, 5, 5, 7, 7, 9, 11, 13, 15, -5, -5, -7, -7, -9, -11, -13, -15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 3, 3, 
            3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, 7, 7, 9, 9, 11, 11, 13, 15, -7, -7, -9, -9, -11, -11, -13, -15], W = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
            3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7, 8, 8, 8, 8, 7, 7, 7, 7, 8, 8, 8, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
            3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 7, 7, 7, 7, 7, 7, 8, 8, 7, 7, 7, 7, 7, 7, 8, 8];
        return c
    }
    window.prep_html5waterfalls = function() {
        for (i = 0; i < nwaterfalls; i++)
            waterfallapplet[i] = R()
    };
    prep_html5waterfalls();
})();
