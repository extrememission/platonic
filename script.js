// Complete script.js with robust Dodecahedron face construction

const SOLIDS = {
  tetrahedron: {
    name: "Tetrahedron",
    symbol: "T",
    vertices: [
      [1, 1, 1],
      [-1, -1, 1],
      [-1, 1, -1],
      [1, -1, -1]
    ],
    faces: [
      [0, 1, 2],
      [0, 3, 1],
      [0, 2, 3],
      [1, 3, 2]
    ],
    info: `
<strong>Tetrahedron | T</strong><br>
Platonic solid<br><br>
<b>Vertices</b><br>4<br>
<b>Edges</b><br>6<br>
<b>Faces</b><br>4<br>
<b>Vertex configuration</b><br>3.3.3<br>
<b>Faces by type</b><br>4 triangles<br>
<b>Volume</b><br>≈0.118s³<br>
<b>Surface area</b><br>≈1.732s²<br>
<b>Sphericity</b><br>≈0.671<br>
<b>Symmetry</b><br>Full tetrahedral, Td<br>
<b>Order</b><br>24<br>
<b>Properties</b><br>deltahedron<br>
<b>Also known as</b><br>triangular pyramid, digonal antiprism, disphenoid
`
  },
  cube: {
    name: "Cube",
    symbol: "C",
    vertices: [
      [-1, -1, -1],
      [-1, -1, 1],
      [-1, 1, -1],
      [-1, 1, 1],
      [1, -1, -1],
      [1, -1, 1],
      [1, 1, -1],
      [1, 1, 1]
    ],
    faces: [
      [0,1,3,2],
      [4,6,7,5],
      [0,4,5,1],
      [2,3,7,6],
      [0,2,6,4],
      [1,5,7,3]
    ],
    info: `
<strong>Cube | C</strong><br>
Platonic solid<br><br>
<b>Vertices</b><br>8<br>
<b>Edges</b><br>12<br>
<b>Faces</b><br>6<br>
<b>Vertex configuration</b><br>4.4.4<br>
<b>Faces by type</b><br>6 squares<br>
<b>Volume</b><br>s³<br>
<b>Surface area</b><br>6s²<br>
<b>Sphericity</b><br>≈0.806<br>
<b>Symmetry</b><br>Full octahedral, Oh<br>
<b>Order</b><br>48<br>
<b>Properties</b><br>zonohedron, regular hexahedron<br>
<b>Also known as</b><br>regular hexahedron
`
  },
  octahedron: {
    name: "Octahedron",
    symbol: "O",
    vertices: [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1]
    ],
    faces: [
      [0,2,4],
      [2,1,4],
      [1,3,4],
      [3,0,4],
      [0,5,2],
      [2,5,1],
      [1,5,3],
      [3,5,0]
    ],
    info: `
<strong>Octahedron | O</strong><br>
Platonic solid<br><br>
<b>Vertices</b><br>6<br>
<b>Edges</b><br>12<br>
<b>Faces</b><br>8<br>
<b>Vertex configuration</b><br>4.4.4<br>
<b>Faces by type</b><br>8 triangles<br>
<b>Volume</b><br>≈0.471s³<br>
<b>Surface area</b><br>≈3.464s²<br>
<b>Sphericity</b><br>≈0.846<br>
<b>Symmetry</b><br>Full octahedral, Oh<br>
<b>Order</b><br>48<br>
<b>Properties</b><br>deltahedron<br>
<b>Also known as</b><br>regular octahedron
`
  },
  dodecahedron: {
    name: "Dodecahedron",
    symbol: "D",
    vertices: (function(){
      const PHI = (1 + Math.sqrt(5)) / 2;
      const a = 1 / PHI, b = 1;
      return [
        [ 0,  b,  a], [ 0,  b, -a], [ 0, -b,  a], [ 0, -b, -a],
        [ a,  0,  b], [ a,  0, -b], [-a,  0,  b], [-a,  0, -b],
        [ b,  a,  0], [ b, -a,  0], [-b,  a,  0], [-b, -a,  0],
        [ 1,  1,  1], [ 1,  1, -1], [ 1, -1,  1], [ 1, -1, -1],
        [-1,  1,  1], [-1,  1, -1], [-1, -1,  1], [-1, -1, -1]
      ];
    })(),
    faces: [
      [16,0,2,18,6],
      [16,10,8,12,0],
      [0,12,4,14,2],
      [2,14,9,11,18],
      [18,11,19,7,6],
      [6,7,17,10,16],
      [1,17,10,8,13],
      [13,8,12,4,5],
      [5,4,14,9,15],
      [15,9,11,19,3],
      [3,19,7,17,1],
      [1,13,5,15,3]
    ],
    info: `
<strong>Dodecahedron | D</strong><br>
Platonic solid<br
