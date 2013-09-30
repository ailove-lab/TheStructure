
gl = null 

vshader = 
    """
    attribute vec3 vpos;
    attribute vec4 vcol;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    varying vec4 vColor;
    varying vec3 vPos;

    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(vpos, 1.0);
        vColor = vcol;
        vPos   = vpos;
    }
    """

fshader = 
    """
    precision mediump float;

    varying vec4 vColor;
    varying vec3 vPos;

    void main(void) {
        gl_FragColor = vColor;
    }
    """

initGL = (canvas)->     
    try 
        gl = canvas.getContext "experimental-webgl"
    catch e
        console.log e
    
    onResize()        
    console.log "Could not initialise WebGL" unless gl


getShader = (gl, text, type)-> 

    shader = gl.createShader type 

    gl.shaderSource shader, text
    gl.compileShader shader

    unless gl.getShaderParameter shader, gl.COMPILE_STATUS
        console.log gl.getShaderInfoLog shader
        return null
    return shader


shader = null

initShaders = ()->

    fshader = getShader gl, fshader, gl.FRAGMENT_SHADER
    vshader = getShader gl, vshader, gl.VERTEX_SHADER

    console.log fshader, vshader

    shader = gl.createProgram()
    gl.attachShader shader, vshader 
    gl.attachShader shader, fshader
    gl.linkProgram  shader

    unless gl.getProgramParameter shader, gl.LINK_STATUS
        console.log "Could not initialise shaders"

    gl.useProgram shader

    shader.vertexPositionAttribute = gl.getAttribLocation shader, "vpos"
    gl.enableVertexAttribArray shader.vertexPositionAttribute

    shader.vertexColorAttribute = gl.getAttribLocation shader, "vcol"
    gl.enableVertexAttribArray shader.vertexColorAttribute

    shader.pMatrixUniform = gl.getUniformLocation shader, "uPMatrix"
    shader.mMatrixUniform = gl.getUniformLocation shader, "uMVMatrix"


mMatrix = mat4.create()
pMatrix = mat4.create()


setMatrixUniforms = ()->
    gl.uniformMatrix4fv shader.pMatrixUniform, false, pMatrix
    gl.uniformMatrix4fv shader.mMatrixUniform, false, mMatrix

tpos = null
tcol = null

initBuffers = ()->

    tpos = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, tpos)
    vertices = [
         0.0,  1.0,  0.0
        -1.0, -1.0,  0.0
         1.0, -1.0,  0.0
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    tpos.itemSize = 3
    tpos.numItems = 3

    tcol = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, tcol)
    colors = [
        1.0, 0.0, 0.0, 1.0
        0.0, 1.0, 0.0, 1.0
        0.0, 0.0, 1.0, 1.0
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
    tcol.itemSize = 4
    tcol.numItems = 3


drawScene = ()->

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    mat4.perspective(90, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix)

    mat4.identity(mMatrix)
    mat4.translate(mMatrix, [0.0, 0.0, -3.0])
    mat4.rotateX(mMatrix, new Date()/1000.0)
    mat4.translate(mMatrix, [0.0, 1.0, 0.0])
    
    gl.bindBuffer(gl.ARRAY_BUFFER, tpos)
    gl.vertexAttribPointer(shader.vertexPositionAttribute, tpos.itemSize, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, tcol)
    gl.vertexAttribPointer(shader.vertexColorAttribute, tcol.itemSize, gl.FLOAT, false, 0, 0)

    setMatrixUniforms()
    gl.drawArrays(gl.TRIANGLES, 0, tpos.numItems)

onResize = ()->
    canvas.width  = gl.viewportWidth  = canvas.clientWidth 
    canvas.height = gl.viewportHeight = canvas.clientHeight

webGLStart = ()->

    canvas = document.getElementById "canvas"

    initGL canvas
    initShaders()
    initBuffers()

    gl.clearColor 0.0, 0.0, 0.0, 1.0 
    gl.enable gl.DEPTH_TEST 

    setInterval drawScene, 60
