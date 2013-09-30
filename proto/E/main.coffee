
R =   1.0
r = R/2.0
s = Math.sqrt 3.0
a = R*s

W = window.innerWidth
H = window.innerHeight

MOUSEDOWN = false
MODE      = "ON"

mat1 = new THREE.MeshBasicMaterial color: 0xAAAAAA
mat2 = new THREE.MeshBasicMaterial color: 0xCC2244
mat3 = new THREE.MeshBasicMaterial color: 0xEEEEEE

face1 = new THREE.Geometry()
face1.vertices.push( new THREE.Vector3(    0,  R, 0 ) );
face1.vertices.push( new THREE.Vector3( -a/2, -r, 0 ) );
face1.vertices.push( new THREE.Vector3(  a/2, -r, 0 ) );
face1.faces.push( new THREE.Face3( 0, 1, 2 ) );
face1.computeFaceNormals()

face2 = new THREE.Geometry()
face2.vertices.push( new THREE.Vector3(    0, -R, 0 ) );
face2.vertices.push( new THREE.Vector3(  a/2,  r, 0 ) );
face2.vertices.push( new THREE.Vector3( -a/2,  r, 0 ) );
face2.faces.push( new THREE.Face3( 0, 1, 2 ) );
face2.computeFaceNormals()
# do @face1.computeCentroids
# do @face1.computeBoundingSphere

scene  = new THREE.Scene()
camera = new THREE.PerspectiveCamera 45, W/H, 0.1, 1000
camera.position.y = 0
camera.position.z = 40

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

# ------------------------------------------------------------------------------

class Atom extends THREE.Object3D

    @meshes:[]

    constructor: (@i, @j)->
        
        super()
        
        @d = Math.abs((@i+@j+1)%2)
        @position.x = @i*a/2.0
        @position.y = @j*a/2.0*s + @d*R/2.0

        @position.x *= 1.1
        @position.y *= 1.1
        
        @on = false
        mat = if @on then mat2 else mat1
        @face = if Math.abs((@j+@i)%2) then face1 else face2
        Atom.meshes.push @mesh = new THREE.Mesh @face, mat
        @mesh.atom = @
        @add @mesh

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

        console.log "H #{@i} #{@j}"
        
        @d = Math.abs((@i+@j+1)%2)
        @position.x = @i*a/2.0
        @position.y = @j*a/2.0*s + @d*R/2.0

        @position.x *= 1.1
        @position.y *= 1.1
        
        mat = mat3
        @face = if Math.abs((@j+@i)%2) then face1 else face2
        Hole.meshes.push @mesh = new THREE.Mesh @face, mat
        @mesh.hole = @
        @add @mesh

# ------------------------------------------------------------------------------

class Structure extends THREE.Object3D

    atoms: {}
    holes: {}

    constructor:()->
        
        super()        
        
        @rotation.z = Math.PI
        
        A = 3
        for j in [-A*2..A]
            l = 2*A+j
            for i in [-l..l]
                @addAtom i, j
            
    addAtom: (i,j)=>
        
        console.log "A #{i} #{j}"

        # if there is the hole, remove it
        if @holes["#{i}:#{j}"]
            @remove @holes["#{i}:#{j}"]
            delete  @holes["#{i}:#{j}"]

        # add an atom instead
        @add @atoms["#{i}:#{j}"] = new Atom i, j
        
        # add the holes around 
        if @atoms["#{i}:#{j}"].d
            @add @holes["#{i}:#{j+1}"] = new Hole i, j+1 unless @holes["#{i}:#{j+1}"] or @atoms["#{i}:#{j+1}"] 
        else 
            @add @holes["#{i}:#{j-1}"] = new Hole i, j-1 unless @holes["#{i}:#{j-1}"] or @atoms["#{i}:#{j-1}"] 
        
        @add @holes["#{i-1}:#{j}"] = new Hole i-1, j unless @holes["#{i-1}:#{j}"] or @atoms["#{i-1}:#{j}"] 
        @add @holes["#{i+1}:#{j}"] = new Hole i+1, j unless @holes["#{i+1}:#{j}"] or @atoms["#{i+1}:#{j}"] 
    

    cellularCalcs:=>

        return if MOUSEDOWN

        for id, atom of @atoms
            x = @atoms["#{atom.i-1}:#{atom.j}"]?.on
            y = @atoms["#{atom.i+1}:#{atom.j}"]?.on
            z = if atom.d then @atoms["#{atom.i}:#{atom.j+1}"]?.on else @atoms["#{atom.i}:#{atom.j-1}"]?.on
            atom.siblings = (x|0)+(y|0)+(z|0)

        # for i, a of @atoms
        #     a.toggle() if a.siblings>=3 
        
        for id, atom of @atoms
            switch atom.siblings
                when 0
                    do atom.setOff if atom.on
                # when 1
                #     do atom.setOn if not atom.on 
                when 2
                    do atom.setOn if not atom.on 
                when 3
                    do atom.setOff if atom.on
               
# ------------------------------------------------------------------------------

onDocumentMouseDown = (e) ->

    e.preventDefault();

    MOUSEDOWN = true
    
    mouse.x =  ( e.clientX / window.innerWidth  ) * 2 - 1
    mouse.y = -( e.clientY / window.innerHeight ) * 2 + 1
    mouse.z = 0.5
    
    projector.unprojectVector mouse, camera
    console.log mouse

    raycaster  = new THREE.Raycaster camera.position, mouse.sub( camera.position ).normalize()
    intersects = raycaster.intersectObjects Atom.meshes
    
    if intersects.length > 0
        if intersects[0].object.atom.on
            intersects[0].object.atom.setOff()
            MODE = "OFF"
        else
            intersects[0].object.atom.setOn()
            MODE = "ON"
        return  
        # console.log intersects[0].object.atom.c
    else
        MODE = "ON"

    intersects = raycaster.intersectObjects Hole.meshes
    if intersects.length > 0
        hole = intersects[0].object.hole
        structure.addAtom hole.i, hole.j

    return 

onDocumentMouseUp = (e)->

    e.preventDefault();
    
    MOUSEDOWN = false

    # controls.enabled = true
    # if INTERSECTED
    #     plane.position.copy( INTERSECTED.position );
    #     SELECTED = null;

    # container.style.cursor = 'auto';


onDocumentMouseMove = (e)->

    e.preventDefault();

    if MOUSEDOWN

        mouse.x =  ( e.clientX / W ) * 2 - 1
        mouse.y = -( e.clientY / H ) * 2 + 1
        mouse.z =  0.5

        # atom.lookAt mouse.clone().multiplyScalar(-15).setZ(20) for atom in structure.children

        projector.unprojectVector mouse, camera
        # console.log mouse
        raycaster  = new THREE.Raycaster camera.position, mouse.sub( camera.position ).normalize()
        intersects = raycaster.intersectObjects Atom.meshes

        if intersects.length > 0
            renderer.domElement.style.cursor = 'pointer';
            if MODE=="ON"
                intersects[0].object.atom.setOn()
            else
                intersects[0].object.atom.setOff()
        else 
            renderer.domElement.style.cursor = 'auto';


render = ()->

    requestAnimationFrame render
    renderer.render scene, camera

structure = new Structure 
scene.add structure

renderer.domElement.addEventListener 'mousemove', onDocumentMouseMove, false 
renderer.domElement.addEventListener 'mousedown', onDocumentMouseDown, false 
renderer.domElement.addEventListener 'mouseup'  , onDocumentMouseUp  , false

setInterval structure.cellularCalcs, 100

do render
