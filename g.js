function marchingCubes(initialPoint, edgeLength, count, fn) {
    triangleMesh = [];

    triangleMesh.extend = function(arr) { //for some reason, arrays.concat is SLOW
        var len = this.length;
        for (var i = 0; i < arr.length; ++i) {
            this[len+i] = arr[i];
        };
    }

    for(var i = 0; i < count; i++) {
        for(var j = 0; j < count; j++) {
            for(var k = 0; k < count; k++) {
                triangleMesh.extend(meshCube({x: initialPoint.x + edgeLength*i,
                                              y: initialPoint.y + edgeLength*j,
                                              z: initialPoint.z + edgeLength*k}, edgeLength, fn));
            }
        }
    }
    return triangleMesh;
}

function cubeMeshToPointArray(triangles) {
    var points = [];
    for(var i = 0; i < triangles.length; i++) {
        points.push(triangles[i][0].x);
        points.push(triangles[i][0].y);
        points.push(triangles[i][0].z);

        points.push(triangles[i][1].x);
        points.push(triangles[i][1].y);
        points.push(triangles[i][1].z);
        
        points.push(triangles[i][2].x);
        points.push(triangles[i][2].y);
        points.push(triangles[i][2].z);
    }
    return points;
}

//returns the mesh for an isosurface where fn=0 in a sampled cubic region
function meshCube(point, edgeLength, fn) {
    //vertices of the cube
    var p = [{x: point.x             , y: point.y             , z: point.z             },
             {x: point.x + edgeLength, y: point.y             , z: point.z             },
             {x: point.x + edgeLength, y: point.y + edgeLength, z: point.z             },
             {x: point.x             , y: point.y + edgeLength, z: point.z             },
             {x: point.x             , y: point.y             , z: point.z + edgeLength},
             {x: point.x + edgeLength, y: point.y             , z: point.z + edgeLength},
             {x: point.x + edgeLength, y: point.y + edgeLength, z: point.z + edgeLength},
             {x: point.x             , y: point.y + edgeLength, z: point.z + edgeLength}];

    //scalars at the vertices
    //compute now to avoid recomputing points as they are used
    var s = [fn(p[0].x, p[0].y, p[0].z),
             fn(p[1].x, p[1].y, p[1].z),
             fn(p[2].x, p[2].y, p[2].z),
             fn(p[3].x, p[3].y, p[3].z),
             fn(p[4].x, p[4].y, p[4].z),
             fn(p[5].x, p[5].y, p[5].z),
             fn(p[6].x, p[6].y, p[6].z),
             fn(p[7].x, p[7].y, p[7].z)];

    var mesh = [];

    mesh.extend = function(arr) { //for some reason, arrays.concat is SLOW
        var len = this.length;
        for (var i = 0; i < arr.length; ++i) {
            this[len+i] = arr[i];
        };
    }

    mesh.extend(meshTetrahedron([p[0], p[6], p[1], p[2]], [s[0], s[6], s[1], s[2]]));
    mesh.extend(meshTetrahedron([p[0], p[6], p[2], p[3]], [s[0], s[6], s[2], s[3]]));
    mesh.extend(meshTetrahedron([p[0], p[6], p[3], p[7]], [s[0], s[6], s[3], s[7]]));
    mesh.extend(meshTetrahedron([p[0], p[6], p[7], p[4]], [s[0], s[6], s[7], s[4]]));
    mesh.extend(meshTetrahedron([p[0], p[6], p[4], p[5]], [s[0], s[6], s[4], s[5]]));
    mesh.extend(meshTetrahedron([p[0], p[6], p[5], p[1]], [s[0], s[6], s[5], s[1]]));

    return mesh;
}


//
//
// Finding the triangle mesh for the f(x)=0 isosurface in a sampled tetrahedral region
//
//         x1
//         +
//        /|\
//       / | \
//      /  |  \
//  x4 +-- | --+ x2
//      \  |  /
//       \ | /
//        \|/
//         +
//         x3
//
// If the f(x)=0 isosurface passes through a tetrahedral region, then f(x1), f(x2), f(x3),
// and f(x4) cannot all have the same sign. If these do not all have the same sign, then a
// linear interpolation can be used to approximate the roots of f along the edges that
// connect vertices of differing signs. Due to tetrahedral symmetry, there are two cases
// for how the signs can differ.
//
// In the first case, one vertex has a different sign than the other three. In this case, 
// there will be three interpolated roots, which form a single triangle.
//
// In the second case, two vertices have a different sign than the other two. In this case,
// there will be four coplanar interpolated roots. To make a triangle mesh covering the
// quadrilateral formed by these four roots, first pick a diagonal and then form two triangles
// using the points on the diagonal and the two other points. A diagonal can be picked by
// selecting two roots from along two edges that do not share any vertex. Because the roots
// are coplanar (prove?), the choice of diagonal is not significant.
// 
function meshTetrahedron(points, scalars) {
    var edges = 0;
    var interpPoints = [];

    if((scalars[0] > 0) != (scalars[1] > 0)) {
        interpPoints[edges++] = linearInterp(points[0], scalars[0], points[1], scalars[1]);
    }
    if((scalars[2] > 0) != (scalars[3] > 0)) {
        interpPoints[edges++] = linearInterp(points[2], scalars[2], points[3], scalars[3]);
    }

    if((scalars[0] > 0) != (scalars[2] > 0)) {
        interpPoints[edges++] = linearInterp(points[0], scalars[0], points[2], scalars[2]);
    }
    if((scalars[1] > 0) != (scalars[3] > 0)) {
        interpPoints[edges++] = linearInterp(points[1], scalars[1], points[3], scalars[3]);
    }

    if((scalars[0] > 0) != (scalars[3] > 0)) {
        interpPoints[edges++] = linearInterp(points[0], scalars[0], points[3], scalars[3]);
    }
    if((scalars[1] > 0) != (scalars[2] > 0)) {
        interpPoints[edges++] = linearInterp(points[1], scalars[1], points[2], scalars[2]);
    }

    switch(edges) {
        case 4:
            return [[interpPoints[0], interpPoints[1], interpPoints[2]],
                    [interpPoints[0], interpPoints[1], interpPoints[3]]];
        case 3:
            return [[interpPoints[0], interpPoints[1], interpPoints[2]]];
        case 0:
        default:
            return [];
    }
}


// Linear interpolation
//
// Finding the root xr by linear interpolation, given (x1, f(x1)) and (x2, f(x2)):
//
//       |                   
//       |                   
// f(x2) +              +    
//       |             /     
//       |            /      
//       |           /       
//       |          /        
//       |         /         
//       |        /          
// 0 ----+---+---+------+----
//       |   x1 /xr     x2   
//       |     /             
//       |    /              
// f(x1) +   +               
//       |                   
//
// Because we assume a linear interpolation, notice that
//
// [f(x2) - f(x1)]/[x2 - x1] = slope = [0 - f(x1)]/[xr - x1]
//
// Solving for xr using simple algebra, we see that
//
// xr = x1 + [f(x1)]/[f(x1) - f(x2)]*(x2 - x1)
//
// Finally, because [f(x1)]/[f(x1) - f(x2)] is a scalar quantity, this 1D example
// easily generalizes to higher dimensions. In our case, 3D.
//
// Note that a more symmetric, equivalent form is given by
//
// xr = f(x2)/[f(x2)-f(x1)]*x1 + f(x1)/[f(x1)-f(x2)]*x2

function linearInterp(point1, val1, point2, val2) {
    var k = val1 / (val1 - val2);
    return {x: (point1.x + k*(point2.x - point1.x)),
            y: (point1.y + k*(point2.y - point1.y)),
            z: (point1.z + k*(point2.z - point1.z))};
}