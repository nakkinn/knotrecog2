//スクリーンショット 2023-09-09 211633.png

let img;

function preload(){
    img = loadImage('images/20230905_063016272_iOS.jpg');
}

function setup(){
    createCanvas(windowWidth ,windowHeight);

    background(240);

    img.resize(300, 300);

    let mat1 = new Array(img.height);
    for(let i=0; i<mat1.length; i++)    mat1[i] = new Array(img.width);

    for(let i=0; i<mat1.length; i++)    for(let j=0; j<mat1[0].length; j++){
        mat1[i][j] = brightness(img.get(j,i));
    }

    noStroke();

    // for(let i=0; i<mat1.length; i++)    for(let j=0; j<mat1[0].length; j++){
    //     fill(mat1[i][j]*2.55);
    //     rect(j*1, i*1, 1);
    // }

    let mat2 = new Array(img.height);
    for(let i=0; i<mat2.length; i++)    mat2[i] = new Array(img.width);
    for(let i=0; i<mat2.length; i++)    for(let j=0; j<mat2[0].length; j++)    mat2[i][j] = 0;

    let a1 = 10;

    for(let i=0; i<mat2.length-1; i++)  for(let j=0; j<mat2[0].length-1; j++){
        if(mat1[i][j]-mat1[i][j+1]>a1)  mat2[i][j+1] = 1;
        if(mat1[i][j+1]-mat1[i][j]>a1)  mat2[i][j] = 1;
        if(mat1[i][j]-mat1[i+1][j]>a1)  mat2[i+1][j] = 1;
        if(mat1[i+1][j]-mat1[i][j]>a1)  mat2[i][j] = 1;
    }

    let mat3 = new Array(img.height);
    for(let i=0; i<mat3.length; i++)    mat3[i] = new Array(img.width);
    for(let i=1; i<mat3.length-1; i++)  for(let j=1; j<mat3[0].length-1; j++){
        mat3[i][j] = mat2[i][j];
        if(neicou2(i,j)>=3) mat3[i][j] = 1;
    }

    function neicou2(y, x){
        result = 0;
        if(mat2[y-1][x]==1)   result++;
        if(mat2[y-1][x+1]==1)   result++;
        if(mat2[y][x+1]==1)   result++;
        if(mat2[y+1][x+1]==1)   result++;
        if(mat2[y+1][x]==1)   result++;
        if(mat2[y+1][x-1]==1)   result++;
        if(mat2[y][x-1]==1)   result++;
        if(mat2[y-1][x-1]==1)   result++;
        return result;
    }

    fill(255, 0, 0);
    for(let i=0; i<mat1.length-1; i++)    for(let j=0; j<mat1[0].length-1; j++){
        if(mat3[i][j]==1){
            //fill(0, 255, 0);
            //rect(j*1, i*1, 1);
        }
        if(mat2[i][j]==1){
            fill(0, 0, 255);
            rect(j, i, 1);
        }
    }



}
