// Generated by CoffeeScript 1.6.2
var Dharma, S3, TR, Ta, Tr, colors, dharma,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TR = 1.0;

Tr = TR / 2.0;

S3 = Math.sqrt(3.0);

Ta = TR * S3;

colors = [0xEE2244, 0x88CC44, 0x4488EE, 0xEE8844];

Dharma = (function() {
  var b2c;

  function Dharma() {
    this.poinToTriangle = __bind(this.poinToTriangle, this);
    this.onMouseMove = __bind(this.onMouseMove, this);
    this.onMouseDown = __bind(this.onMouseDown, this);
    this.render = __bind(this.render, this);
  }

  Dharma.prototype.init = function() {
    var a, _i;

    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.W / this.H, 1, 1000);
    this.camera.position.y = 0;
    this.camera.position.z = 40;
    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setSize(this.W, this.H);
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove, false);
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown, false);
    this.projector = new THREE.Projector();
    this.mouse = new THREE.Vector3();
    this.scene.add(new THREE.AmbientLight(0x444444));
    this.scene.add(this.lineTriangles = new THREE.Object3D);
    this.scene.add(this.faceTriangles = new THREE.Object3D);
    this.faces = {};
    for (a = _i = 0; _i <= 600; a = ++_i) {
      this.poinToTriangle((15 - a / 40) * Math.sin(a / 100 * Math.PI), (15 - a / 40) * Math.cos(a / 100 * Math.PI));
    }
    document.body.appendChild(this.renderer.domElement);
    return this.render();
  };

  Dharma.prototype.c2b = function(p, a, b, c) {
    var ac, bc, d, pc, u, v, w;

    ac = {
      x: a.x - c.x,
      y: a.y - c.y
    };
    bc = {
      x: b.x - c.x,
      y: b.y - c.y
    };
    pc = {
      x: p.x - c.x,
      y: p.y - c.y
    };
    d = bc.y * ac.x - bc.x * ac.y;
    u = (bc.y * pc.x - bc.x * pc.y) / d;
    v = (ac.x * pc.y - ac.y * pc.x) / d;
    w = 1 - u - v;
    return {
      u: u,
      v: v,
      w: w
    };
  };

  b2c = function(u, v, a, b, c) {
    var w;

    w = 1 - u - v;
    return {
      x: a.x * u + b.x * v + c.x * w,
      y: a.y * u + b.y * v + c.y * w
    };
  };

  Dharma.prototype.getTriangles = function(z, p, a, b, c, T, H) {
    var ab, bc, br, ca;

    if (T == null) {
      T = null;
    }
    if (H == null) {
      H = null;
    }
    z = z >> 1;
    if (z === 0) {
      return T;
    }
    br = this.c2b(p, a, b, c);
    if (br.u > 0 && br.v > 0 && br.w > 0) {
      if (T == null) {
        T = {};
      }
      if (H == null) {
        H = 0x4;
      }
      T[H] = [a, b, c];
      ab = {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2
      };
      bc = {
        x: (b.x + c.x) / 2,
        y: (b.y + c.y) / 2
      };
      ca = {
        x: (c.x + a.x) / 2,
        y: (c.y + a.y) / 2
      };
      if (br.u <= 1 / 2 && br.v <= 1 / 2 && br.w <= 1 / 2) {
        this.getTriangles(z, p, ab, bc, ca, T, H << 2 | 0x0);
      }
      if (br.u > 1 / 2) {
        this.getTriangles(z, p, a, ab, ca, T, H << 2 | 0x1);
      }
      if (br.v > 1 / 2) {
        this.getTriangles(z, p, ab, b, bc, T, H << 2 | 0x2);
      }
      if (br.w > 1 / 2) {
        this.getTriangles(z, p, ca, bc, c, T, H << 2 | 0x3);
      }
    }
    return T;
  };

  Dharma.prototype.getTriangle = function(p, a, b, c) {
    var T, br, cor, d, inc, u, v, w;

    br = this.c2b(p, a, b, c);
    u = Math.floor(br.u);
    v = Math.floor(br.v);
    w = Math.floor(br.w);
    d = (u + v + w) % 2;
    inc = !d ? 1 / 3 : 2 / 3;
    cor = b2c(u + inc, v + inc, a, b, c);
    T = !d ? [
      {
        x: cor.x + a.x,
        y: cor.y + a.y
      }, {
        x: cor.x + b.x,
        y: cor.y + b.y
      }, {
        x: cor.x + c.x,
        y: cor.y + c.y
      }
    ] : [
      {
        x: cor.x + a.x,
        y: cor.y - a.y
      }, {
        x: cor.x - b.x,
        y: cor.y - b.y
      }, {
        x: cor.x - c.x,
        y: cor.y - c.y
      }
    ];
    T.push({
      u: u + inc,
      v: v + inc,
      w: 1 - u - v - inc * 2
    });
    return T;
  };

  Dharma.prototype.render = function() {
    requestAnimationFrame(this.render);
    return this.renderer.render(this.scene, this.camera);
  };

  Dharma.prototype.onMouseDown = function(e) {};

  Dharma.prototype.onMouseMove = function(e) {
    var m, o, x0, y0;

    e.preventDefault();
    m = new THREE.Vector3;
    m.x = (e.clientX / window.innerWidth) * 2 - 1;
    m.y = -(e.clientY / window.innerHeight) * 2 + 1;
    m.z = 0.5;
    this.projector.unprojectVector(m, this.camera);
    o = this.camera.position;
    x0 = o.z * m.x / (o.z - m.z);
    y0 = o.z * m.y / (o.z - m.z);
    return this.poinToTriangle(x0, y0);
  };

  Dharma.prototype.poinToTriangle = function(x, y) {
    var a, b, c, h, t, z, _ref;

    z = 1;
    a = {
      x: 0,
      y: TR * z
    };
    b = {
      x: Ta / 2 * z,
      y: -Tr * z
    };
    c = {
      x: -Ta / 2 * z,
      y: -Tr * z
    };
    t = this.getTriangle({
      x: x,
      y: y
    }, a, b, c);
    h = "" + (t[3].u * 3 | 0) + "|" + (t[3].v * 3 | 0);
    if ((_ref = this.triangles) == null) {
      this.triangles = {};
    }
    if (!this.triangles[h]) {
      return this.faceTriangles.add(this.triangles[h] = this.createFaceTriangle(t[0], t[1], t[2], 0, Math.random() * colors.length | 0));
    }
  };

  Dharma.prototype.createLineTriangle = function(a, b, c, z) {
    var geom;

    if (z == null) {
      z = 0.0;
    }
    geom = new THREE.Geometry();
    geom.vertices.push(new THREE.Vector3(a.x, a.y, z));
    geom.vertices.push(new THREE.Vector3(b.x, b.y, z));
    geom.vertices.push(new THREE.Vector3(c.x, c.y, z));
    geom.vertices.push(new THREE.Vector3(a.x, a.y, z));
    return new THREE.Line(geom, new THREE.LineBasicMaterial({
      color: 0xDDDDDD,
      opacity: 1.0
    }));
  };

  Dharma.prototype.createFaceTriangle = function(a, b, c, z, cid) {
    var geom;

    if (z == null) {
      z = 0.0;
    }
    if (cid == null) {
      cid = 0;
    }
    geom = new THREE.Geometry();
    geom.vertices.push(new THREE.Vector3(a.x, a.y, z));
    geom.vertices.push(new THREE.Vector3(c.x, c.y, z));
    geom.vertices.push(new THREE.Vector3(b.x, b.y, z));
    geom.faces.push(new THREE.Face3(0, 1, 2));
    geom.computeFaceNormals();
    return new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
      color: colors[cid],
      opacity: 0.95
    }));
  };

  return Dharma;

})();

dharma = new Dharma;

dharma.init();