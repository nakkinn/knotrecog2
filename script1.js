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

let textarea;

let plist;


let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
 imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);


imgElement.onload = function() {
    let src = cv.imread(imgElement);

    //サイズ調整
    let ratio = 400 / Math.max(src.matSize[0], src.matSize[1]);
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


function setup(){



    canvas = createCanvas(840,840);

    button1 = createButton('細線化（はじめから）');
    button1.position(20, 652);
    button1.mousePressed(button1event);

    input2 = createInput();
    input2.style('width','40px');
    input2.value('12');
    input2.position(20, 684);

    button2 = createButton('px以下の線を削除');
    button2.position(65, 682);
    button2.mousePressed(button2event);

    button3 = createButton('ポイントリストに変換');
    button3.position(20, 712);
    button3.mousePressed(button3event);

    input3 = createInput();
    input3.style('width','40px');
    input3.value('7');
    input3.position(20, 744);

    button4 = createButton('以下の切れ目をつなぐ');
    button4.position(65, 742);
    button4.mousePressed(button4event);

    button5 = createButton('不変量の算出');
    button5.position(20, 772);
    button5.mousePressed(button5event);

    textarea = createElement('textarea');
    textarea.style('width','500px');
    textarea.style('height','200px');

    textarea.position(300,650);

    background(255);

}


function draw(){

    if(mode==1){
        background(255);
        textarea.value('');

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

        translate(420, 0);

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
        
        translate(420, 0);

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
        translate(420, 0);
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
        translate(420, 0);
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
        for(let i=0; i<arrow.length; i++)   line(420+arrow[i][1], arrow[i][0], 420+arrow[i][3], arrow[i][2]);

        let str = ''
        str += 'ドーカーコード\n';
        str += dowker + '\n\n';

        //ドーカーコードチェック
        let errorflag = false;
        for(let i=0; i<dowker.length; i++){
            if(isNaN(dowker[i]))    errorflag = true;
            if(dowker[i] % 2 == 1)  errorflag = true;
        }

        if(errorflag){
            str += 'エラー1\n';
        }else{
            let alex, jones;
            alex = dok2alex(dowker);
            str += 'アレキサンダー多項式\n';
            str += alex + '\n\n'; 

            if(dowker.length<14){
                jones = dok2jones(dowker);

                str += 'ジョーンズ多項式\n';
                str += jones + '\n\n';

                let kouho = findknot(dowker);

                if(kouho.length>0){
                    str += '結び目候補\n'
                    for(let i=0; i<kouho.length; i++){
                        str += kouho[i];
                        if(i!=kouho.length-1)   str += ', ';
                    }
                }
            }
        }

        textarea.value(str);

    }
}





