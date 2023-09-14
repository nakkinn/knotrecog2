let pix_gray;

function preload(){
    img = loadImage('images/IMG_1550.jpeg');
}

function setup(){
    createCanvas(windowWidth, windowHeight);

    img.resize(300, 300*img.width/img.height);

    pix_gray = new Array(img.height);
    for(let i=0; i<pix_gray.length; i++)    pix_gray[i] = new Array(img.width);

    for(let i=0; i<pix_gray.length; i++)    for(let j=0; j<pix_gray[0].length; j++){
        pix_gray[i][j] = brightness(img.get(j,i));
    }

    let result = '';

    for(let k=0; k<100; k+=2){

        let sum = 0;

        for(let i=1; i<pix_gray.length-1; i++)    for(let j=1; j<pix_gray[0].length-1; j++){
            sum += abs(nei(i,j)/8 - k);
        }

        result += sum + ',';

    }

    function nei(y,x){
        return pix_gray[y-1][x] + pix_gray[y-1][x+1] + pix_gray[y][x+1] + pix_gray[y+1][x+1] + 
        pix_gray[y+1][x] + pix_gray[y+1][x-1] + pix_gray[y][x-1] + pix_gray[y-1][x-1];
    }


    noLoop();
}

function draw(){
    background(255);

    noStroke();

    niti(40);
}

function niti(t){
    for(let i=0; i<pix_gray.length; i++)    for(let j=0; j<pix_gray[0].length; j++){
        //fill(pix_gray[i][j]*2.5);
        if(pix_gray[i][j]<t)   fill(0);
        else    noFill();
        rect(j, i, 1);
    }
}