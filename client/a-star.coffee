M = []
s = 11
cx = s>>1
cy = s>>1

# printMatrix = ()->

# generateMatrix = ()->

m = ""
for y in [-cy..cy]
    M[cy+y] = []
    r = "  "
    r+=`y>=0?' '+y+'\t':y+'\t'`
    for x in [-cx..cx]
        if  (x+(y>>1)) % 2
            r += "#"
            M[cy+y][cx+x] = 1
        else
            r += "."
            M[cy+y][cx+x] = 0
        r+=" "
    m+=r+"\n"

console.log m