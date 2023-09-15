//写真読み込み
let inputimg;
let pix;
let mode = 0;

let slider1;
let input1;
let input2;

let button1;
let button2;
let button3;

let canvas;

let plist;


let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
 imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);


imgElement.onload = function() {
    let src = cv.imread(imgElement);

    //サイズ調整
    let ratio = 300 / Math.max(src.matSize[0], src.matSize[1]);
    cv.resize(src, src, new cv.Size(src.matSize[1]*ratio, src.matSize[0]*ratio));

    let niti = new cv.Mat();

    //白黒に変換
    cv.cvtColor(src, niti, cv.COLOR_RGBA2GRAY);
    //二値化
    cv.adaptiveThreshold(niti, niti, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 51, 20);

    pix = new Array(niti.rows);
    for(let i=0; i<pix.length; i++)  pix[i] = new Array(niti.cols);

    for(let i=0; i<pix.length; i++) for(let j=0; j<pix[0].length; j++){
        pix[i][j] = 1 - niti.ucharAt(i, j)/255;
    }
    anaume();
    deleteDot(pix);

    mode = 1;

    src.delete();
    niti.delete();

}

// let defimg;

// function preload(){
//     defimg = loadImage('images/20230905_063016272_iOS.jpg');
// }

function setup(){



    canvas = createCanvas(640,640);
    //canvas = createCanvas(windowWidth, windowHeight);

    //ファイル入力
    // input1 = createFileInput(inputevent);
    // input1.position(20,420);

    
    // slider1 = createSlider(30,100,50);
    // slider1.position(20, 455);
    // slider1.changed(sliderevent);

    button1 = createButton('細線化（はじめから）');
    button1.position(20, 452);
    button1.mousePressed(button1event);

    input2 = createInput();
    input2.style('width','40px');
    input2.value('12');
    input2.position(20, 484);

    button2 = createButton('px以下の線を削除');
    button2.position(65, 482);
    button2.mousePressed(button2event);

    button3 = createButton('ポイントリストに変換');
    button3.position(20, 512);
    button3.mousePressed(button3event);

    input3 = createInput();
    input3.style('width','40px');
    input3.value('7');
    input3.position(20, 544);

    button4 = createButton('以下の切れ目をつなぐ');
    button4.position(65, 542);
    button4.mousePressed(button4event);

    button5 = createButton('不変量の算出');
    button5.position(20, 572);
    button5.mousePressed(button5event);

    background(240);

    // defimg.resize(300,300);
    // image(defimg, 0, 0);
    //mode = 2;

}


function draw(){

    // if(mode==1){    //ファイル入力

    //     background(240);
    //     image(inputimg, 0, 0);
    //     mode = 2;

    // }else   if(mode==2){

    //     //ファイル入力
    //     pix = new Array(inputimg.height);
    //     for(let i=0; i<pix.length; i++) pix[i] = new Array(int(inputimg.width));

    //     //プログラム埋め込み
    //     // pix = new Array(300);
    //     // for(let i=0; i<300; i++)    pix[i] = new Array(300);

    //     for(let i=0; i<pix.length; i++)    for(let j=0; j<pix[0].length; j++){
    //         pix[i][j] = brightness(canvas.get(j,i));
    //     }

    //     //グレイ画像
    //     for(let i=0; i<pix.length; i++) for(let j=0; j<pix[i].length; j++){
    //         stroke(pix[i][j] * 2.55);
    //         rect(j, i, 1);
    //     }

    //     nitika_auto();

    //     anaume();

    //     //二値化画像
    //     translate(320, 0);
    //     noStroke();
    //     for(let i=0; i<pix.length; i++) for(let j=0; j<pix[i].length; j++){
    //         if(pix[i][j]==1)   fill(0);
    //         else    fill(255);
    //         rect(j, i, 1);
    //     }

    //     mode = 3;
    // }

    if(mode==1){
        noStroke();
        fill(0);
        for(let i=0; i<pix.length; i++) for(let j=0; j<pix[0].length; j++){
            if(pix[i][j]==1)    fill(0);
            else    fill(255);
            rect(j, i, 1);
        }

        //尺
        stroke(0,0,255);
        line(10,10,60,10);
        noStroke();
        fill(0,0,255);
        text(0,10,23);
        text(50,60,23);

        mode = 2;
    }

}



//細線化　三又削除　点削除
function button1event(){
    if(mode==2){

        pix_hoso = newhososenka(pix);

        deleteFuti(pix_hoso);

        sasakure(pix_hoso);

        deleteDot(pix_hoso);

        translate(320, 0);

        for(let i=0; i<pix.length; i++) for(let j=0; j<pix[i].length; j++){
            if(pix_hoso[i][j])   stroke(0);
            else    stroke(255);
            rect(j, i, 1);
        }

        mode=3;
    }
}

//短いアーク削除
function button2event(){

    if(mode==3){

        deleteShortArc(pix_hoso, Number(input2.value()));
        
        translate(320, 0);

        for(let i=0; i<pix.length; i++) for(let j=0; j<pix[i].length; j++){
            if(pix_hoso[i][j])   stroke(0);
            else    stroke(255);
            rect(j, i, 1);
        }

    }
}

//ポイントリストに変換
function button3event(){

    if(mode==3){

        plist = pix2plist(pix_hoso);

        push();
        translate(320, 0);
        noStroke();
        fill(255);
        rect(0, 0, pix[0].length, pix.length);

        stroke(0);
        strokeWeight(2);

        for(let i=0; i<plist.length; i++){
            for(let j=0; j<plist[i].length-1; j++){
                line(plist[i][j][1], plist[i][j][0], plist[i][j+1][1], plist[i][j+1][0]);
            }
        }

        pop();

        strokeWeight(1);

        mode = 4;

    }
}

//切れ目をなくす
function button4event(){
    if(mode==4){

        kireme(Number(input3.value()));

        push();
        translate(320, 0);
        noStroke();
        fill(255);
        rect(0, 0, pix[0].length, pix.length);

        stroke(0);
        strokeWeight(2);

        for(let i=0; i<plist.length; i++){
            for(let j=0; j<plist[i].length-1; j++){
                line(plist[i][j][1], plist[i][j][0], plist[i][j+1][1], plist[i][j+1][0]);
            }
        }

        pop();
        strokeWeight(1);
    }
}

//不変量の算出
function button5event(){
    
    if(mode==4){

        let arrow = pairing2(plist);
        plist = sortplist(plist, arrow);

        let crossinfo = split2(plist);
        let dowker = cross2dowker(crossinfo, 0, false);

        stroke(255, 0, 0);
        for(let i=0; i<arrow.length; i++)   line(320+arrow[i][1], arrow[i][0], 320+arrow[i][3], arrow[i][2]);

        push();
        translate(220, -60);

        noStroke();
        fill(0);

        text('ドーカーコード',10,530);
        text(dowker, 10, 550);

        //ドーカーコードチェック
        let errorflag = false;
        for(let i=0; i<dowker.length; i++){
            if(isNaN(dowker[i]))    errorflag = true;
            if(dowker[i] % 2 == 1)  errorflag = true;
        }

        noStroke();
        if(errorflag){
            fill(255, 0, 0);
            text('エラー1', 10, 610);
        }

        if(!errorflag){
            let alex = dok2alex(dowker);
            text('アレキサンダー多項式',10,570);
            text(alex, 10, 590);

            if(dowker.length<14){
                let jones = dok2jones(dowker);

                text('ジョーンズ多項式',10,610);
                text(jones, 10, 630);
            
                // text('結び目候補', 260 ,530);
                // text(findknot(dowker),260,550);

            }
        }

        pop();

    }
}


// function inputevent(file){
//     if(file.type=='image'){
//         inputimg = createImg(file.data, '', function(){
//             let ratio = inputimg.height / inputimg.width;
//             inputimg.width = int( min(300, 300*inputimg.width/inputimg.height) );
//             inputimg.height = int( inputimg.width * ratio );
//             mode = 1;
//         });
//         inputimg.hide();
//     }
// }



