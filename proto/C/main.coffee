
R =   1.5
r = R/2.0
s = Math.sqrt 3.0
a = R*s

W = window.innerWidth
H = window.innerHeight

mat1 = new THREE.MeshPhongMaterial
        color       : 0x000000
        ambient     : 0x888888
        specular    : 0xffffff
        shininess   : 250
        side        : THREE.DoubleSide 
        vertexColors: THREE.VertexColors
        shading     : THREE.FlatShading

mat2 = new THREE.MeshPhongMaterial
        color       : 0xCC2244
        ambient     : 0x444444
        specular    : 0xffffff
        shininess   : 250
        side        : THREE.DoubleSide 
        vertexColors: THREE.VertexColors
        shading     : THREE.FlatShading

scene  = new THREE.Scene()
camera = new THREE.PerspectiveCamera 50, W/H, 0.1, 1000

camera.position.y =  3
camera.position.z = 25

scene.add new THREE.AmbientLight 0x444444

light1 = new THREE.DirectionalLight 0xEE2244, 1.0
light1.position.set  0, 25, 25
scene.add light1

light2 = new THREE.DirectionalLight 0x4422EE, 1.0
light2.position.set  0,-25, 25
scene.add light2

renderer = new THREE.WebGLRenderer()
renderer.setSize(W, H)
document.body.appendChild renderer.domElement

class Atom

    constructor: (@i, @j)->
        
        @x = a*@i+Math.round((@j-1)/2)*a/2
        @y = (Math.round(@j/2)*3-Math.abs(@j)%2)*r

        @x *= 0.5
        @y *= 0.5
        
        console.log @i, @j, @x, @y/r

        @geo = new THREE.TetrahedronGeometry R, 0
        m = new THREE.Matrix4

        if Math.abs((@j)%2)==0
            m.makeRotationY Math.PI/4
        else 
            m.makeRotationY -Math.PI/4
        @geo.applyMatrix m

        if Math.abs((@j)%2)==0
            m.makeRotationX -Math.PI/5
        else 
            m.makeRotationX  Math.PI/5 
        @geo.applyMatrix m


        # do @geo.computeFaceNormals

        # mat = if (@i*@j)%3 then mat1 else mat2
        mat = mat2
        @mesh = new THREE.Mesh @geo, mat
        @obj  = new THREE.Object3D
        @obj.add @mesh

        @obj.position.x = @x
        @obj.position.y = @y

    draw:->

    animation:->
        @obj.rotation.y += @x * Math.PI / 300
        @obj.rotation.x += @y * Math.PI / 100


class Structure

    atoms: []

    constructor:->
        
        @obj = new THREE.Object3D
        @obj.rotation.z = Math.PI
        A = 16
        for j in [-A..A/2]
            l = (j+A)/2|0
            for i in [A/4|0..-l+A/4|0]
                @atoms.push(atom = new Atom i, j)
                @obj.add atom.obj

        scene.add @obj

    draw:->
        # do a.draw for a in atoms

    animation:->
        
        do atom.animation for atom in @atoms

    atom:(i,j)->


structure = new Structure

render = ()->

    requestAnimationFrame render

    # structure.obj.rotation.x +=0.10
    # structure.obj.rotation.y +=0.05
    do structure.animation
    # structure.obj.rotation.y = Math.PI/2.0
    renderer.render scene, camera


do render
