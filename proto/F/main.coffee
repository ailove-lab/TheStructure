
R =   1.0
r = R/2.0
s = Math.sqrt 3.0
a = R*s

W = window.innerWidth
H = window.innerHeight

MOUSEDOWN = false
MODE      = "ON"

colors = [
    0xEE2244
    0x88CC44
    0x4488EE
    0xEE8844 ]

mat1 = new THREE.MeshBasicMaterial color: 0xAAAAAA, opacity: 0.5
mat2 = new THREE.MeshBasicMaterial color: 0xCC2244, opacity: 0.75
mat3 = new THREE.MeshBasicMaterial color: 0xEEEEEE, opacity: 0.75

scene  = new THREE.Scene()
camera = new THREE.PerspectiveCamera 45, W/H, 1, 1000
camera.position.y = 0
camera.position.z = 10

scene.add new THREE.AmbientLight 0x444444

light1 = new THREE.DirectionalLight 0xFFCCAA, 1.5
light1.position.set  0, 15, 15
scene.add light1

light2 = new THREE.DirectionalLight 0x4422CC, 1.5
light2.position.set 0,-15, 15
scene.add light2

# renderer = new THREE.WebGLRenderer({antialias:true})
renderer = new THREE.CanvasRenderer()
renderer.setSize W, H
# renderer.domElement.addEventListener 'mousemove', onDocumentMouseMove, false );
projector = new THREE.Projector()
mouse     = new THREE.Vector3()

document.body.appendChild renderer.domElement

PI2 = 3.141592654*2

progA = (ctx)->
    z = 1
    ctx.beginPath();
    # ctx.arc( 0, 0, 0.5, 0, PI2, true );
    ctx.moveTo      0,  R*z
    ctx.lineTo -a/2*z, -r*z
    ctx.lineTo  a/2*z, -r*z
    ctx.closePath();
    ctx.fill();

progB = (ctx)->
    z = 1
    ctx.beginPath();
    # ctx.arc( 0, 0, 0.5, 0, PI2, true );
    ctx.moveTo      0,-R*z
    ctx.lineTo  a/2*z, r*z
    ctx.lineTo -a/2*z, r*z
    ctx.closePath();
    ctx.fill();

progFill = (ctx)->
    ctx.beginPath();
    ctx.arc( 0, 0, r/2, 0, PI2, true );
    # ctx.moveTo    0,-R
    # ctx.lineTo  a/2, r
    # ctx.lineTo -a/2, r
    ctx.closePath();
    ctx.fill();

progFillSmall = (ctx)->
    ctx.beginPath();
    ctx.arc( 0, 0, r/4, 0, PI2, true );
    # ctx.moveTo    0,-R
    # ctx.lineTo  a/2, r
    # ctx.lineTo -a/2, r
    ctx.closePath();
    ctx.fill();

progStroke = (ctx)->

    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc( 0, 0, r, 0, PI2, true );
    ctx.closePath();
    ctx.stroke();

marker = new THREE.Particle(
    new THREE.ParticleCanvasMaterial 
        color  : 0x404040
        program: progStroke
) 
scene.add marker

# ------------------------------------------------------------------------------

buildFace = (d, z)->
    face = new THREE.Geometry()
    if d
        face.vertices.push( new THREE.Vector3(      0,  R*z, 0 ) );
        face.vertices.push( new THREE.Vector3( -a/2*z, -r*z, 0 ) );
        face.vertices.push( new THREE.Vector3(  a/2*z, -r*z, 0 ) );
    else
        face.vertices.push( new THREE.Vector3(      0, -R*z, 0 ) );
        face.vertices.push( new THREE.Vector3(  a/2*z,  r*z, 0 ) );
        face.vertices.push( new THREE.Vector3( -a/2*z,  r*z, 0 ) );

    face.faces.push( new THREE.Face3( 0, 1, 2 ) );
    face.computeFaceNormals()
    face

dot = (x1,y1,x2,y2)->x1*x2+y1*y2

# baricentric coordinate system
# http://en.wikipedia.org/wiki/Barycentric_coordinates_%28mathematics%29
cartesianToBaricetric = (x,y, x1,y1, x2,y2, x3,y3)->
    x13 = x1-x3
    y13 = y1-y3
    x23 = x2-x3
    y23 = y2-y3
    xx3 =  x-x3
    yy3 =  y-y3
    
    d = y23*x13-x23*y13
    u = (y23*xx3-x23*yy3)/d
    v = (x13*yy3-y13*xx3)/d
    w = 1 - u - v 

    u: u
    v: v
    w: w

# convert baricentric coordinates back to cartesian 
baricentricToCartesian = (u,v, x1,y1, x2,y2, x3,y3)->
    w = 1 - u - v
    x: x1*u + x2*v + x3*w
    y: y1*u + y2*v + y3*w

indexToCartesian = (i,j)->
    d = Math.abs (i+j+1)%2
    x: i*a/2.0*z
    y: j*a/2.0*z*s + r*(d*z-1)

cartesianToIndex = (x,y)->
    z = 1
    k = 2/a/z
    i = x*k
    j = y*k/s
    d = Math.abs (i+1)%2
    i:i 
    j:j

# ------------------------------------------------------------------------------
class Atom extends THREE.Object3D

    @meshes:[]

    constructor: (@i, @j, @k=0)->
        
        super()
        
        @z = Math.pow 2, @k 
        
        @d = Math.abs (@i+@j+1)%2
        @position.x = @i*a/2.0*@z
        @position.y = @j*a/2.0*s*@z + r*(@d*@z-1)

        # @position.x *= 1.1
        # @position.y *= 1.1
        
        @on = false
        mat = if @on then mat2 else mat1
        @face = buildFace Math.abs((@j+@i)%2), @z*0.98

        Atom.meshes.push @mesh = new THREE.Mesh @face, mat
        @mesh.atom = @
        @add @mesh

        scene.add p = new THREE.Particle(
            new THREE.ParticleCanvasMaterial 
                color  : 0x808080
                opacity: 0.25
                program: progFill
        ) 
        p.position.x = @position.x
        p.position.y =-@position.y


    toggle:=>
        # console.log "toggle"
        @on = !@on
        @mesh.material = if @on then mat2 else mat1

    setOn:=>
        # console.log "toggle"
        @on = true
        @mesh.material = mat2
    
    setOff:=>
        # console.log "toggle"
        @on = false
        @mesh.material = mat1

# --------------------------------------------------------------------------------------------

class Hole extends THREE.Object3D

    @meshes:[]

    constructor: (@i, @j)->

        super()

        # console.log "H #{@i} #{@j}"
        
        @d = Math.abs((@i+@j+1)%2)
        @position.x = @i*a/2.0
        @position.y = @j*a/2.0*s + @d*R/2.0

        # @position.x *= 1.1
        # @position.y *= 1.1
        
        mat = mat3
        @face = buildFace Math.abs((@j+@i)%2), 1
        Hole.meshes.push @mesh = new THREE.Mesh @face, mat
        @mesh.hole = @
        @add @mesh

# ------------------------------------------------------------------------------

class Structure extends THREE.Object3D

    atoms: {}
    holes: {}

    constructor:()->
        
        super()        
        
        # @addAtom 0, 0 

        @rotation.z = Math.PI
        
        A = 1
        for j in [-A*2..A]
            l = 2*A+j
            for i in [-l..l]
                @addAtom i, j
            
    addAtom: (i,j)=>

        @add @atoms["#{i}:#{j}"] = new Atom i, j
        
               
# ------------------------------------------------------------------------------

onDocumentMouseDown = (e) ->

    e.preventDefault();
    m   = new THREE.Vector3
    m.x =  ( e.clientX / window.innerWidth  ) * 2 - 1
    m.y = -( e.clientY / window.innerHeight ) * 2 + 1
    m.z = 0.5
    
    # search intersection with plane z=0 
    projector.unprojectVector m, camera
    o = camera.position
    x0 = o.z*m.x/(o.z-m.z)
    y0 = o.z*m.y/(o.z-m.z)
    
    z = 1
    bar = cartesianToBaricetric x0, y0, 0,  R*z,-a/2*z,-r*z, a/2*z,-r*z
    u = Math.round(bar.u*3)/3
    v = Math.round(bar.v*3)/3
    w = Math.round(bar.w*3)/3

    # if u*3%3 & v*3%3 & w*3%3
    
    cor = baricentricToCartesian u, v, 0, R*z,-a/2*z,-r*z, a/2*z,-r*z
    # prog = if Math.round(u*3)%2 then progA else progB 
    
    p = new THREE.Particle(
        new THREE.ParticleCanvasMaterial 
            color  : colors[Math.random()*colors.length|0]
            opacity: 0.75
            program: progFill
    ) 
    p.position.x = cor.x
    p.position.y = cor.y
    scene.add p


onDocumentMouseMove = (e)->

    e.preventDefault();
    m   = new THREE.Vector3
    m.x =  ( e.clientX / window.innerWidth  ) * 2 - 1
    m.y = -( e.clientY / window.innerHeight ) * 2 + 1
    m.z = 0.5
    
    # search intersection with plane z=0 
    projector.unprojectVector m, camera
    o = camera.position
    x0 = o.z*m.x/(o.z-m.z)
    y0 = o.z*m.y/(o.z-m.z)

    z = 4
    bar = cartesianToBaricetric x0, y0, 0,  R*z,-a/2*z,-r*z, a/2*z,-r*z
    u = Math.floor(bar.u*4)
    v = Math.floor(bar.v*4)
    w = Math.floor(bar.w*4)
    
    console.log u, v, w, u+v+w    
    d = (u+v+w)%2
    
    # if d == 0
    #     u+=2/3
    #     v+=2/3
    #     w+=2/3
    # else
    #     u+=1/3
    #     v+=1/3
    #     w+=1/3
    inc = if d then 1/3 else 2/3
    cor = baricentricToCartesian (u+inc)/4, (v+inc)/4, 0, R*z,-a/2*z,-r*z, a/2*z,-r*z
    marker.position.x = cor.x
    marker.position.y = cor.y

    # ind = cartesianToIndex x0, -y0
    # cor = indexToCartesian Math.round(ind.i), Math.round(ind.j)
    # marker.position.x =  cor.x
    # marker.position.y = -cor.y

    document.getElementById("text").innerText = """
        u + v + w = 1
        #{(u).toFixed(0)} + #{(v).toFixed(0)} + #{(w).toFixed(0)} = #{(u+v+w).toFixed(0)}
        #{(1-u*3).toFixed(0)} + #{(1-v*3).toFixed(0)} + #{(1-w*3).toFixed(0)} = 0
        #{(u*3%3)} + #{(v*3%3)} + #{(w*3%3)}
        #{(bar.u*3).toFixed(3)} + #{(bar.v*3).toFixed(3)} + #{(bar.w*3).toFixed(3)} = #{(bar.u + bar.v + bar.w).toFixed(3)}
    """


render = ()->

    requestAnimationFrame render
    renderer.render scene, camera
    # structure.rotation.z += 0.01

structure = new Structure 
scene.add structure

renderer.domElement.addEventListener 'mousemove', onDocumentMouseMove, false 
renderer.domElement.addEventListener 'mousedown', onDocumentMouseDown, false 
# renderer.domElement.addEventListener 'mouseup'  , onDocumentMouseUp  , false

# setInterval structure.cellularCalcs, 100

do render


for i in [0..step = 3]

    j = i/step
    z = 4

    geom = new THREE.Geometry();

    geom.vertices.push new THREE.Vector3      0, R*z, 0
    geom.vertices.push new THREE.Vector3 -a/2*z,-r*z, 0
    geom.vertices.push new THREE.Vector3  a/2*z,-r*z, 0
    geom.vertices.push new THREE.Vector3      0, R*z, 0

    line = new THREE.Line( geom, new THREE.LineBasicMaterial( { color: 0x404040, opacity: 0.25} ) );
    scene.add line

    # ------------

    geom = new THREE.Geometry();
    
    cor = baricentricToCartesian 1/3, 1/3, 0, R*z,-a/2*z,-r*z, a/2*z,-r*z
    geom.vertices.push new THREE.Vector3(cor.x, cor.y, 0)

    cor = baricentricToCartesian 1-j, j/2, 0, R*z,-a/2*z,-r*z, a/2*z,-r*z
    len = Math.sqrt(cor.x*cor.x+cor.y*cor.y)*8
    geom.vertices.push new THREE.Vector3(cor.x, cor.y, 0)
    
    geom.vertices.push new THREE.Vector3(cor.x+cor.y/len, cor.y-cor.x/len, 0)

    line = new THREE.Line( geom, new THREE.LineBasicMaterial( { color: 0x800000, opacity: 0.25} ) );
    scene.add line

    # -----------
    
    geom = new THREE.Geometry();
    
    cor = baricentricToCartesian 1/3, 1/3, 0, R*z,-a/2*z,-r*z, a/2*z,-r*z
    geom.vertices.push new THREE.Vector3(cor.x, cor.y, 0)

    cor = baricentricToCartesian j/2, j/2, 0, R*z,-a/2*z,-r*z, a/2*z,-r*z
    len = Math.sqrt(cor.x*cor.x+cor.y*cor.y)*8
    geom.vertices.push new THREE.Vector3(cor.x, cor.y, 0)
    
    geom.vertices.push new THREE.Vector3(cor.x+cor.y/len, cor.y-cor.x/len, 0)

    line = new THREE.Line( geom, new THREE.LineBasicMaterial( { color: 0x008000, opacity: 0.25 } ) );
    scene.add line

    # -----------

    geom = new THREE.Geometry();
    
    cor = baricentricToCartesian 1/3, 1/3, 0, R*z,-a/2*z,-r*z, a/2*z,-r*z
    geom.vertices.push new THREE.Vector3(cor.x, cor.y, 0)

    cor = baricentricToCartesian j/2, 1-j, 0, R*z,-a/2*z,-r*z, a/2*z,-r*z
    len = Math.sqrt(cor.x*cor.x+cor.y*cor.y)*8
    geom.vertices.push new THREE.Vector3(cor.x, cor.y, 0)
    
    geom.vertices.push new THREE.Vector3(cor.x+cor.y/len, cor.y-cor.x/len, 0)

    line = new THREE.Line( geom, new THREE.LineBasicMaterial( { color: 0x000080, opacity: 0.25 } ) );
    scene.add line


baricentricPoint = (u, v)->
    z = 1
    scene.add p = new THREE.Particle(
        new THREE.ParticleCanvasMaterial 
            color  : colors[Math.random()*colors.length|0]
            opacity: 0.75
            program: progFillSmall
    ) 
    cor = baricentricToCartesian u/3, v/3, 0, R*z,-a/2*z,-r*z, a/2*z,-r*z
    p.position.x = cor.x
    p.position.y = cor.y

cortesianPoint = (x, y)->
    z = 1
    scene.add p = new THREE.Particle(
        new THREE.ParticleCanvasMaterial 
            color  : colors[Math.random()*colors.length|0]
            opacity: 0.75
            program: progStroke
    ) 
    p.position.x = x
    p.position.y = y

z = 1
for u in [-3..9]
    for v in [-3..6-u]
        if u%3 and v%3 and (3-u-v)%3 
            baricentricPoint u, v

for i in [-2..2]
    for j in [-1..0]
        d = Math.abs (i+j+1)%2
        x = i*a/2.0*z
        y = j*a/2.0*s*z + r*(d*z-1)
        cortesianPoint x, -y