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

// let defimg;

// function preload(){
//     defimg = loadImage('images/20230905_063016272_iOS.jpg');
// }

function setup(){

    canvas = createCanvas(640,640);
    //canvas = createCanvas(windowWidth, windowHeight);

    //ファイル入力
    input1 = createFileInput(inputevent);
    input1.position(20,420);

    
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

    if(mode==1){    //ファイル入力

        background(240);
        image(inputimg, 0, 0);
        mode = 2;

    }else   if(mode==2){

        //ファイル入力
        pix = new Array(inputimg.height);
        for(let i=0; i<pix.length; i++) pix[i] = new Array(int(inputimg.width));

        //プログラム埋め込み
        // pix = new Array(300);
        // for(let i=0; i<300; i++)    pix[i] = new Array(300);

        for(let i=0; i<pix.length; i++)    for(let j=0; j<pix[0].length; j++){
            pix[i][j] = brightness(canvas.get(j,i));
        }

        //グレイ画像
        for(let i=0; i<pix.length; i++) for(let j=0; j<pix[i].length; j++){
            stroke(pix[i][j] * 2.55);
            rect(j, i, 1);
        }

        nitika_auto();

        anaume();

        //二値化画像
        translate(320, 0);
        noStroke();
        for(let i=0; i<pix.length; i++) for(let j=0; j<pix[i].length; j++){
            if(pix[i][j]==1)   fill(0);
            else    fill(255);
            rect(j, i, 1);
        }

        mode = 3;
    }

}


function inputevent(file){
    if(file.type=='image'){
        inputimg = createImg(file.data, '', function(){
            let ratio = inputimg.height / inputimg.width;
            inputimg.width = int( min(300, 300*inputimg.width/inputimg.height) );
            inputimg.height = int( inputimg.width * ratio );
            mode = 1;
        });
        inputimg.hide();
    }
}


// function sliderevent(){
//     //二値化画像
//     translate(320, 0);

//     for(let i=0; i<pix.length; i++) for(let j=0; j<pix[i].length; j++){
//         if(pix[i][j] < 51){
//             stroke(0);
//             pix[i][j] = 1;
//         }else{
//             stroke(255);
//             pix[i][j] = 0;
//         }    
//         rect(j, i, 1);
//     }
// }


//細線化　三又削除　点削除
function button1event(){
    if(mode>=3){

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

        mode=4;
    }
}

//短いアーク削除
function button2event(){

    if(mode>=4){

        deleteShortArc(pix_hoso, Number(input2.value()));
        
        translate(320, 0);

        for(let i=0; i<pix.length; i++) for(let j=0; j<pix[i].length; j++){
            if(pix_hoso[i][j])   stroke(0);
            else    stroke(255);
            rect(j, i, 1);
        }

        mode = 5;
    }
}

//ポイントリストに変換
function button3event(){

    if(mode>=4){

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

        mode = 6;

    }
}

//切れ目をなくす
function button4event(){
    if(mode==6){

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
    
    if(mode==6){

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



function nitika_auto(){

    let clist = new Array(100);
    for(let i=0; i<clist.length; i++)   clist[i] = 0;

    for(let i=0; i<pix.length; i++) for(let j=0; j<pix[0].length; j++){
        clist[int(pix[i][j])]++;
    }

    for(let i=1; i<clist.length-1; i++){
        clist[i] = int((clist[i-1]+clist[i]+clist[i+1])/3);
    }

    str = '';
    for(let i=0; i<clist.length; i++)   str += clist[i] + ',';

    listm = [];
    let maxv = 0;
    for(let i=1; i<clist.length-1; i++){
        if(clist[i] > maxv && clist[i] > clist[i+1]){
            listm.push(i);
            maxv = clist[i];
        }
    }

    console.log(listm);

    let tmp = listm.length;
    for(let k=0; k<tmp-2; k++){
        let listd = [];
        for(let i=0; i<listm.length-1; i++) listd[i] = listm[i+1] - listm[i];
        let index = listd.indexOf(Math.min(...listd));
        listm.splice(index, 1);
    }

    console.log((listm[0]+listm[1])/2);

    for(let i=0; i<pix.length; i++) for(let j=0; j<pix[0].length; j++){
        if(pix[i][j] > (listm[0]+listm[1])/2)   pix[i][j] = 0;
        //if(pix[i][j] > 45)  pix[i][j] = 0;
        else    pix[i][j] = 1;
    }

}


function anaume(){
    let pixc = matrixCopy(pix);

    //縁
    for(let i=0; i<pixc.length; i++){
        pixc[i][0] = 2;
        pixc[i][pixc[0].length-1] = 2;
    }
    for(let i=0; i<pixc[0].length; i++){
        pixc[0][i] = 2;
        pixc[pixc.length-1][i] =2;
    }
    

    let y1, x1, xl, xr, tmp, flag;
    let stack = [[1,1]];

    for(let k=0; k<99999; k++){

        tmp = stack.pop();
        y1 = tmp[0];
        x1 = tmp[1];

        if(pixc[y1][x1]==0){

            pixc[y1][x1] = 2;

            //左にたどる
            for(let i=x1-1; i>=0; i--){
                if(pixc[y1][i]==0){
                    pixc[y1][i] = 2;
                }else{
                    xl = i;
                    break;
                }
            }
            //右にたどる
            for(let i=x1+1; i<pixc[0].length; i++){
                if(pixc[y1][i]==0){
                    pixc[y1][i] = 2;
                }else{
                    xr = i;
                    break;
                }
            }
            //一段下を調べる
            flag = true;
            for(let i=xl+1; i<xr; i++){
                if(flag && pixc[y1+1][i]==0){
                    stack.push([y1+1,i]);
                    flag = false;
                }
                if(!flag && pixc[y1+1][i]!=0){
                    flag = true;
                }
            }
            //一段上を調べる
            flag = true;
            for(let i=xl+1; i<xr; i++){
                if(flag && pixc[y1-1][i]==0){
                    stack.push([y1-1,i]);
                    flag = false;
                }
                if(!flag && pixc[y1-1][i]!=0){
                    flag = true;
                }
            }

        }
    
        if(stack.length==0) break;
    }

    for(let i=0; i<pix.length; i++) for(let j=0; j<pix[0].length; j++){
        if(pix[i][j]==0 && pixc[i][j]!=2)   pix[i][j] = 1;
    }

    // push();
    // translate(320, 320);
    // noStroke();
    // for(let i=0; i<pixc.length; i++)    for(let j=0; j<pixc[0].length; j++){
    //     if(pixc[i][j]==1)   fill(0);
    //     else if(pixc[i][j]==2)   fill(170, 170, 255);
    //     else    fill(255);
    //     rect(j, i, 1);
    // }


    // pop();
}


function kireme(kyori){

    for(let i=0; i<plist.length-1; i++){
        for(let j=i+1; j<plist.length; j++){
            if(dist(plist[i][plist[i].length-1][0],plist[i][plist[i].length-1][1],plist[j][0][0],plist[j][0][1])<kyori){
                plist[i] = plist[i].concat(plist[j]);
                plist.splice(j,1);
                i--;
                break;
            }
            if(dist(plist[i][plist[i].length-1][0],plist[i][plist[i].length-1][1],plist[j][plist[j].length-1][0],plist[j][plist[j].length-1][1])<kyori){
                plist[i] = plist[i].concat(plist[j].reverse());
                plist.splice(j,1);
                i--;
                break;
            }
            if(dist(plist[i][0][0],plist[i][0][1],plist[j][0][0],plist[j][0][1])<kyori){
                plist[i] = plist[i].concat(plist[j].reverse());
                plist.splice(j,1);
                i--;
                break;
            }
            if(dist(plist[i][0][0],plist[i][0][1],plist[j][plist[j].length-1][0],plist[j][plist[j].length-1][1])<kyori){
                plist[i] = plist[i].concat(plist[j]);
                plist.splice(j,1);
                i--;
                break;
            }
        }
    }

    // push();
    // translate(320, 320);

    // stroke(0);
    // for(let i=0; i<plist.length; i++){
    //     for(let j=0; j<plist[i].length-1; j++){
    //         line(plist[i][j][1], plist[i][j][0], plist[i][j+1][1], plist[i][j+1][0]);
    //     }
    // }

    // pop();
}

//端点Aの行先の行先が端点A出ない場合→端点Aの行先の行先を端点Aとする
function modifyArrow(arg){
    let result = matrixCopy(arg);

    for(let i=0; i<arg.length; i++){
        let flag = true;
        for(let j=0; j<arg.length; j++){
            if(i!=j){
                if(arg[i][0]==arg[j][2] && arg[i][1]==arg[j][3])    flag=false;
            }
        }
        if(flag){
            for(let j=0; j<arg.length; j++) if(i!=j){
                if(arg[i][2]==arg[j][0] && arg[i][3]==arg[j][1]){
                    arg[j][2] = result[i][0];
                    arg[j][3] = result[i][1];
                    break;
                }
            }
        }
    }
    
    return result;
}


//繋がりチェック　相互につながっていたらtrue
function checkArrow(arg){
    let lista = new Array(arg.length);
    for(let i=0; i<lista.length; i++)   lista[i] = 0;

    for(let i=0; i<arg.length; i++){
        for(let j=0; j<arg.length; j++){
            if(arg[i][2]==arg[j][0] && arg[i][3]==arg[j][1]){
                lista[j]++;
                break;
            }
        }
    }

    let cou = 0;
    for(let i=0; i<arg.length; i++){
        for(let j=0; j<arg.length; j++) if(j!=i){
            if(arg[j][0]==arg[i][2]&&arg[j][1]==arg[i][3]){
                if(arg[i][0]!=arg[j][2] || arg[i][1]!=arg[j][3])  if(lista[i]!=1)  cou++;
                break;
            }
        }
    }
    
    return cou;
}


//線が短くならない細線化
function newhososenka(arg){

    let result = matrixCopy(arg);

    let tmp;

    for(let k=0; k<99999; k++){
        tmp = 0;
        tmp += hoso1step(result, k);
        tmp += shave(result);

        if(tmp==0)  return result;

    }

    return result;

    //頂点繋がりだけにする
    function shave(arg){

        let flag;

        for(let k=0; k<99999; k++){
            flag = true;
            for(let i=1; i<arg.length-1; i++) for(let j=1; j<arg[0].length-1; j++){
                if(f4(arg,i,j) && f2(arg,i,j)<=4 && (f1(arg,i,j)==2||f1(arg,i,j)==3)){
                    flag = false;
                    arg[i][j] = 0;
                }
            }
            if(flag){
                return k;
            }
        }

        return -1;

    }

    //二値の二次元配列を細線化
    function hoso1step(arg, parity){
        let argtem = new Array(arg.length);
        
        let tem, cou=0;

        for(let i=0; i<argtem.length; i++)  argtem[i] = arg[i].concat();
        for(let i=1; i<arg.length-1; i++)    for(let j=1; j<arg[0].length-1; j++){
            if(arg[i][j]){
                tem = fxy(i,j);
                if(tem){
                    argtem[i][j] = 0;
                    cou++;
                }
            }
        }
        for(let i=0; i<argtem.length; i++)  for(let j=0; j<argtem[0].length; j++)   arg[i][j] = argtem[i][j];


        function fxy(y,x){
            let t2,t4,t6,t8,tem;
            t2 = arg[y-1][x];
            t4 = arg[y][x+1];
            t6 = arg[y+1][x];
            t8 = arg[y][x-1];
            if(parity%2==0) tem = t2*t4*t6==0 && t4*t6*t8==0;
            else    tem = t2*t4*t6==0 && t4*t6*t8==0;
            if(f1(arg,y,x)>=2 && f1(arg,y,x)<=6 && f2(arg,y,x)==2 && tem){
                return true;
            }
            return false;
        }

        return cou;

    }

    //周囲8ピクセルのうちtrueの個数
    function f1(p,y,x){
        return p[y-1][x] + p[y-1][x+1] + p[y][x+1] + p[y+1][x+1] + p[y+1][x] + p[y+1][x-1] + p[y][x-1] + p[y-1][x-1];
    }

    //周囲を一周したときtrue, falseが反転する回数
    function f2(p,y,x){

        let cou = 0;

        cou += abs(p[y-1][x] - p[y-1][x+1]);
        cou += abs(p[y-1][x+1] - p[y][x+1]);
        cou += abs(p[y][x+1] - p[y+1][x+1]);
        cou += abs(p[y+1][x+1] - p[y+1][x]);
        cou += abs(p[y+1][x] - p[y+1][x-1]);
        cou += abs(p[y+1][x-1] - p[y][x-1]);
        cou += abs(p[y][x-1] - p[y-1][x-1]);
        cou += abs(p[y-1][x-1] - p[y-1][x]);
        
        return cou;
    }


    function f4(p,y,x){
        if(!p[y][x])    return false;
        if(p[y-1][x]!=1 && p[y][x-1]!=1 && p[y+1][x]==1 && p[y][x+1]==1)    return true;
        if(p[y-1][x]==1 && p[y][x-1]!=1 && p[y+1][x]!=1 && p[y][x+1]==1)    return true;
        if(p[y-1][x]==1 && p[y][x-1]==1 && p[y+1][x]!=1 && p[y][x+1]!=1)    return true;
        if(p[y-1][x]!=1 && p[y][x-1]==1 && p[y+1][x]==1 && p[y][x+1]!=1)    return true;
        return false;
    }
}


//画像を二値化し、２次元配列を返す
function nitika(arg, value){
    let result = new Array(arg.height);
    for(let i=0; i<result.length; i++)  result[i] = new Array(arg.width);

    for(let i=0; i<result.length; i++)  for(let j=0; j<result[0].length; j++){
        if(brightness(arg.get(j,i))<value)    result[i][j] = 1;
        else    result[i][j] = 0;
    }

    //1ピクセルの穴埋め
    for(let i=1; i<result.length-1; i++)    for(let j=1; j<result.length-1; j++){
        if(result[i][j]==0 && result[i-1][j]==1 && result[i+1][j]==1 && result[i][j-1]==1 && result[i][j+1]==1) result[i][j] = 1;
    }
    
    return result;
}


//細線化されたデータから端点の数を返す
function endCount(arg){
    
    let result = 0;

    for(let i=1; i<arg.length-1; i++) for(let j=1; j<arg[i].length-1; j++){
        if(arg[i][j]==1 && f2(i,j)==2)   result++;
    }

    //周囲を一周したときtrue, falseが反転する回数
    function f2(y,x){

        let cou = 0;

        cou += abs(arg[y-1][x] - arg[y-1][x+1]);
        cou += abs(arg[y-1][x+1] - arg[y][x+1]);
        cou += abs(arg[y][x+1] - arg[y+1][x+1]);
        cou += abs(arg[y+1][x+1] - arg[y+1][x]);
        cou += abs(arg[y+1][x] - arg[y+1][x-1]);
        cou += abs(arg[y+1][x-1] - arg[y][x-1]);
        cou += abs(arg[y][x-1] - arg[y-1][x-1]);
        cou += abs(arg[y-1][x-1] - arg[y-1][x]);
        
        return cou;
    }

    return result;
}


//孤立した点があるか
function existDot(arg){
    for(let i=1; i<arg.length-1; i++)   for(let j=1; j<arg[0].length-1; j++){
        if(arg[i][j]==1 && arg[i-1][j]==0 && arg[i-1][j+1]==0 && arg[i][j+1]==0 && arg[i+1][j+1]==0 && arg[i+1][j]==0
            && arg[i+1][j-1]==0 && arg[i][j-1]==0 && arg[i-1][j-1]==0)  return true;
    }
    return false;
}


//枝分かれが存在するか　出力：[3つ又の個数, 4つ又の個数]
function checkBranch(arg){

    let result = [0,0];

    for(let i=1; i<arg.length-1; i++)   for(let j=1; j<arg[0].length-1; j++){
        if(arg[i][j]==1){
            if(f2(i,j)==6)  result[0]++;
            if(f2(i,j)==8)  result[1]++;
        }    
    }

    return result;

    //周囲を一周したときtrue, falseが反転する回数
    function f2(y,x){

        let cou = 0;

        cou += abs(arg[y-1][x] - arg[y-1][x+1]);
        cou += abs(arg[y-1][x+1] - arg[y][x+1]);
        cou += abs(arg[y][x+1] - arg[y+1][x+1]);
        cou += abs(arg[y+1][x+1] - arg[y+1][x]);
        cou += abs(arg[y+1][x] - arg[y+1][x-1]);
        cou += abs(arg[y+1][x-1] - arg[y][x-1]);
        cou += abs(arg[y][x-1] - arg[y-1][x-1]);
        cou += abs(arg[y-1][x-1] - arg[y-1][x]);
        
        return cou;
    }
}


//端点の組の決定
function pairing(arg){
    //端点の座標
    let end = [];
    let cross = [];

    //単ドットは端点には含まれない
    for(let i=1; i<arg.length-1; i++)  for(let j=1; j<arg[0].length-1; j++){
        if(f2(arg,i,j)==2 && arg[i][j]==1){
            end.push({'pos':[i,j], 'opposite':null, 'arc':null, 'angle':null, 'pair':null, 'crn':null});
        }
    }    
    
    //端点をたどるとどの端点と繋がっているか
    arg3 = new Array(arg.length);
    for(let i=0; i<arg3.length; i++){
        arg3[i] = [];
        for(let j=0; j<arg[0].length; j++){
            if(arg[i][j]==0)   arg3[i][j]=-1;
            else    arg3[i][j]=-2;
        }
    }
 
    let m;
    let arcnum = 0;

    for(let k=0; k<end.length/2; k++){

        for(let i=0; i<end.length; i++){
            if(end[i].opposite == null){
                m = i;
                break;
            }
        }

        let y1,x1;
        y1 = end[m].pos[0];
        x1 = end[m].pos[1];
        arg3[y1][x1] = arcnum;

        let dy = [-1,0,1,0,-1,1,1,-1];
        let dx = [0,1,0,-1,1,1,-1,-1];

        for(let k=0; k<arg.length**2; k++){
            let flag = true;
            for(let i=0; i<8; i++){
                if(arg3[y1+dy[i]][x1+dx[i]] == -2){
                    arg3[y1+dy[i]][x1+dx[i]] = arcnum;
                    y1 = y1+dy[i];
                    x1 = x1+dx[i]
                    flag = false;
                    break;
                }
            }
            if(flag){
                for(let i=0; i<end.length; i++){
                    if(y1==end[i].pos[0] && x1==end[i].pos[1]){
                        end[m].opposite = i;
                        end[i].opposite = m;
                        end[m].arc = arcnum;
                        end[i].arc = arcnum;
                        break;
                    }
                }
                break;
            }
        }
        arcnum++;
    }  

    //余白:-2 線上：-1 交点：0～
    arg4 = new Array(arg.length);
    for(let i=0; i<arg.length; i++){
        arg4[i] = new Array(arg[0].length);
        for(let j=0; j<arg[0].length; j++){
            arg4[i][j] = arg[i][j] - 2;
        }
    }
    
    //ペア・交点
    m = 0;
    for(let i=0; i<end.length/2; i++) cross[i] = {'pos':null, 'label':[], 'angle1':null, 'angle2':null}

    for(let k=0; k<end.length; k++) if(end[k].pair==null){

        list = [];
        for(let i=0; i<end.length; i++) if(i!=k){
            list.push([i,dist(end[k].pos[0],end[k].pos[1],end[i].pos[0],end[i].pos[1])]);
        }
        list.sort(function(a,b){return a[1]-b[1]});

        for(let k3=0; k3<end.length; k3++){

            let result = false;
            y1 = end[k].pos[0];
            x1 = end[k].pos[1];
            y2 = end[list[0][0]].pos[0];
            x2 = end[list[0][0]].pos[1];

            let xs,ys,x=x1,y=y1;

            if(x2>x1) xs = 1;
            else  xs = -1;
            if(y2>y1) ys = 1;
            else ys = -1;

            argd = new Array(arg.length);
            for(let i=0; i<argd.length; i++)    argd[i] = new Array(arg[0].length);

            for(let k1=0; k1<arg.length**2; k1++){
                if(x==x2 && y==y2){
                    break;
                }
            
                if(y1 == y2)  x+=xs;
                else if( ((y-y1)*(x2-x1) < (y2-y1)*(x-x1)&&xs*ys==-1) || ((y-y1)*(x2-x1) > (y2-y1)*(x-x1)&&xs*ys==1)) x+=xs;
                else  y+=ys;

                argd[y][x] = 1;

                //横切った
                if(arg3[y][x]>=0 && arg3[y][x]!=end[list[0][0]].arc && arg3[y][x]!=end[k].arc){
                    arg4[y][x] = m;
                    //cross[m].pos = [y,x];
                    m++;
                    result = true;
                    break;
                }
            
            }
        
            if(result == false){
                list.shift();
            }else   break;

        }

        end[k].pair = list[0][0];
        end[k].crn = m-1;
    
    }

    //周囲8ピクセルのうちtrueの個数
    function f1(p,y,x){
        return p[y-1][x] + p[y-1][x+1] + p[y][x+1] + p[y+1][x+1] + p[y+1][x] + p[y+1][x-1] + p[y][x-1] + p[y-1][x-1];
    }

    //周囲を一周したときtrue, falseが反転する回数
    function f2(p,y,x){

        let cou = 0;

        cou += abs(p[y-1][x] - p[y-1][x+1]);
        cou += abs(p[y-1][x+1] - p[y][x+1]);
        cou += abs(p[y][x+1] - p[y+1][x+1]);
        cou += abs(p[y+1][x+1] - p[y+1][x]);
        cou += abs(p[y+1][x] - p[y+1][x-1]);
        cou += abs(p[y+1][x-1] - p[y][x-1]);
        cou += abs(p[y][x-1] - p[y-1][x-1]);
        cou += abs(p[y-1][x-1] - p[y-1][x]);
        
        return cou;
    }

    let result = new Array(end.length);
    for(let i=0 ;i<result.length; i++){
        result[i] = [end[i].pos[0], end[i].pos[1], end[end[i].pair].pos[0], end[end[i].pair].pos[1]];
    }
    
    return result;

}


function pairing2(arg){

    let end = [];
    let result = [];

    for(let i=0; i<arg.length; i++){
        end.push([arg[i][0][0], arg[i][0][1], i]);
        end.push([arg[i][arg[i].length-1][0], arg[i][arg[i].length-1][1], i]);
    }

    for(let i1=0; i1<end.length; i1++){

        let tmp = [];

        for(let i2=0; i2<end.length; i2++){
            if(i1==i2 || end[i1][2]==end[i2][2]){
                tmp[i2] = 99999;
            }else{

                tmp[i2] = dist(end[i1][0], end[i1][1], end[i2][0], end[i2][1]);
                let flag = false;

                let va, vb, vc, vd;
                va = new p5.Vector(end[i1][0], end[i1][1]);
                vb = new p5.Vector(end[i2][0], end[i2][1]);

                let bflag = false;

                for(let i3=0; i3<arg.length; i3++){
                    if(i3!=end[i1][2] && i3!=end[i2][2]){
                        for(let i4=0; i4<arg[i3].length-1; i4++){
                            vc = new p5.Vector(arg[i3][i4][0], arg[i3][i4][1]);
                            vd = new p5.Vector(arg[i3][i4+1][0], arg[i3][i4+1][1]);
                            if(crosspoint(va,vb,vc,vd)){
                                bflag = true;
                                flag = true;
                                break;
                            }
                        }
                        if(bflag)   break;
                    }
                }

                if(!flag)   tmp[i2] = 99999;
            }
        }

        let index = tmp.indexOf(Math.min(...tmp));
        result.push([end[i1][0], end[i1][1], end[index][0], end[index][1]]);

    }

    return result;

    // push();
    // translate(320, 0);
    // stroke(0, 0, 255);
    // for(let i=0; i<result.length; i++){
    //     line(result[i][1], result[i][0], result[i][3], result[i][2]);
    // }
    // pop();
    
}

//3つ又が1個存在する細線を修復する 'error'を返すこともある
function deleteBranch1(arg){
    let matay, matax;

    //3つ又の位置を調べる
    let breakf = false;
    for(let i=1; i<arg.length; i++){
        for(let j=1; j<arg.length-1; j++){
            if(f2(i,j)==6 && arg[i][j]==1){
                matay = i;
                matax = j;
                breakf = true;
                break;
            }
        }
        if(breakf)  break;
    }

    //3つ又の周囲は黒が３個なのか確認（不要ならばあとで消す）
    if(f1(matay,matax)!=3)  return 'error';

    let newpix = new Array(3);  //3つ又の隣のピクセルを削除した3通りの画像
    for(let i=0; i<3; i++)  newpix[i] = matrixCopy(arg);

    let dy = [-1, -1, 0, 1, 1, 1, 0, -1];
    let dx = [0, 1, 1, 1, 0, -1, -1, -1];

    let i1 = 0;
    for(let k=0; k<8; k++){
        if(arg[matay+dy[k]][matax+dx[k]]==1){
            newpix[i1][matay+dy[k]][matax+dx[k]] = 0;
            i1++;
        }
    }

    //3通りの画像でペアリングしてどれだけうまくいっているか
    let sougo_error = new Array(3);
    for(let i=0; i<3; i++){
        let arrow = pairing(newpix[i]);
        sougo_error[i] = checkArrow(arrow);
    }

    //うまくいっているものは３つのうち１個だけであることを確認
    let cou=0, m;
    for(let i=0; i<3; i++){
        if(sougo_error[i]==0){
            cou++;
            m = i;
        }
    }
    if(cou==1){
        return newpix[m];
    }else{
        return 'error';
    }

    //周囲8ピクセルのうちtrueの個数
    function f1(y,x){
        return arg[y-1][x] + arg[y-1][x+1] + arg[y][x+1] + arg[y+1][x+1] + arg[y+1][x] + arg[y+1][x-1] + arg[y][x-1] + arg[y-1][x-1];
    }

    //周囲を一周したときtrue, falseが反転する回数
    function f2(y,x){

        let cou = 0;

        cou += abs(arg[y-1][x] - arg[y-1][x+1]);
        cou += abs(arg[y-1][x+1] - arg[y][x+1]);
        cou += abs(arg[y][x+1] - arg[y+1][x+1]);
        cou += abs(arg[y+1][x+1] - arg[y+1][x]);
        cou += abs(arg[y+1][x] - arg[y+1][x-1]);
        cou += abs(arg[y+1][x-1] - arg[y][x-1]);
        cou += abs(arg[y][x-1] - arg[y-1][x-1]);
        cou += abs(arg[y-1][x-1] - arg[y-1][x]);
        
        return cou;
    }

}


//3つ又が2個存在する細線を修復する
function deleteBranch2(arg){
    let matay = [];
    let matax = [];

    //３つ又の位置を調べる
    for(let i=1; i<arg.length-1; i++){
        for(let j=1; j<arg.length-1; j++){
            if(f2(i,j)==6 && arg[i][j]==1){
                matay.push(i);
                matax.push(j);
            }
            if(matay.length==2)  break;
        }
        if(matay.length==2);
    }

    //3つ又の周囲が黒3個であることを確認
    if(f1(matay[0],matax[0])!=3 || f1(matay[1],matax[1])!=3)    return 'error';

    //9個コピー
    let newpix = new Array(9);
    for(let i=0; i<newpix.length; i++)  newpix[i] = matrixCopy(arg);

    let dy = [-1, -1, 0, 1, 1, 1, 0, -1];
    let dx = [0, 1, 1, 1, 0, -1, -1, -1];

    let cou=0;
    for(let i1=0; i1<8; i1++){
        if(arg[matay[0]+dy[i1]][matax[0]+dx[i1]]==1){
            for(let i2=0; i2<8; i2++){
                if(arg[matay[1]+dy[i2]][matax[1]+dx[i2]]==1){
                    newpix[cou][matay[0]+dy[i1]][matax[0]+dx[i1]] = 0;
                    newpix[cou][matay[1]+dy[i2]][matax[1]+dx[i2]] = 0;
                    cou++;
                }
            }    
        }
    }
    //break使ったら処理減らせるかも

    //9通りの画像でペアリングしてどれだけうまくいっているか
    let endc = endCount(arg);
    let sougo_error = new Array(9);
    for(let i=0; i<9; i++){
        let arrow = pairing(newpix[i]);
        sougo_error[i] = checkArrow(arrow);
        if(endCount(newpix[i])!=endc+2) sougo_error[i] = 999;
    }

    // background(255);
    // noStroke();
    // let index = 8;
    // for(let i=1; i<newpix[index].length-1; i++)    for(let j=1; j<newpix[index][0].length-1; j++){
    //     if(newpix[index][i][j]==0)    fill(255);
    //     if(arg[i][j]==1)    fill(100,100,255);
    //     if(newpix[index][i][j]==1)    fill(0);
    //     rect(i, j, 1);
    // }

    //うまくいっているものは９つのうち１つだけであることを確認
    let cou0 = 0, cou1 = 0, m0, m1;
    for(let i=0; i<sougo_error.length; i++){
        if(sougo_error[i]==0){
            cou0++;
            m0 = i;
        }
        if(sougo_error[i]==1){
            cou1++;
            m1 = i;
        }
    }

    if(cou0==1){
        return newpix[m0];
    }else if(cou0==0 && cou1==1){
        return newpix[m1];
    }else{
        return 'error';
    }

    

    //周囲8ピクセルのうちtrueの個数
    function f1(y,x){
        return arg[y-1][x] + arg[y-1][x+1] + arg[y][x+1] + arg[y+1][x+1] + arg[y+1][x] + arg[y+1][x-1] + arg[y][x-1] + arg[y-1][x-1];
    }

    //周囲を一周したときtrue, falseが反転する回数
    function f2(y,x){

        let cou = 0;

        cou += abs(arg[y-1][x] - arg[y-1][x+1]);
        cou += abs(arg[y-1][x+1] - arg[y][x+1]);
        cou += abs(arg[y][x+1] - arg[y+1][x+1]);
        cou += abs(arg[y+1][x+1] - arg[y+1][x]);
        cou += abs(arg[y+1][x] - arg[y+1][x-1]);
        cou += abs(arg[y+1][x-1] - arg[y][x-1]);
        cou += abs(arg[y][x-1] - arg[y-1][x-1]);
        cou += abs(arg[y-1][x-1] - arg[y-1][x]);
        
        return cou;
    }
}


//二次元配列のコピー
function matrixCopy(arg){
    result = new Array(arg.length);
    for(let i=0; i<arg.length; i++) result[i] = arg[i].concat();
    return result;
}


//写真の画素データを短辺〇〇pxにする
// function imgResize(){
//     let s = 350;
//     if(img.width>img.height){
//         img.resize(s*img.width/img.height, s);
//     }else{
//         img.resize(s, s*img.height/img.width);
//     }
// }


//３つ又を3方向にたどり最も短い道を削除
function sasakure(arg){

    let dy = [-1, 0, 1, 0, -1, 1, 1, -1];
    let dx = [0, 1, 0, -1, 1, 1, -1, -1];

    let py,px;

    for(let i1=1; i1<arg.length-1; i1++)    for(let j1=1; j1<arg[0].length-1; j1++){
        if(arg[i1][j1]==1 && f2(i1,j1)==6){

            let pixcopy = matrixCopy(arg);
            pixcopy[i1][j1] = 0;

            let dlist = new Array(8);
            for(let i=0; i<dlist.length; i++)   dlist[i] = 99999;

            for(let k1=0; k1<8; k1++){

                if(arg[i1+dy[k1]][j1+dx[k1]]==1){
                    py = i1+dy[k1];
                    px = j1+dx[k1];
                    pixcopy[py][px] = 0;
                    for(let k2=0; k2<99999; k2++){
                        let flag1 = true;
                        for(let k3=0; k3<8; k3++){
                            if(pixcopy[py+dy[k3]][px+dx[k3]]==1){
                                py = py + dy[k3];
                                px = px + dx[k3];
                                pixcopy[py][px] = 0;
                                flag1 = false;
                                break;
                            }
                        }
                        if(flag1){  //行ける場所がなかった
                            dlist[k1] = k2;
                            break;
                        }
                    }
                }
            }

            let dir = dlist.indexOf(Math.min(...dlist));
            py = i1 + dy[dir];
            px = j1 + dx[dir];
            arg[py][px] = 0;

            // for(let k1=0; k1<99999; k1++){
            //     let flag = true;
            //     for(let k2=0; k2<8; k2++){
            //         if(arg[py+dy[k2]][px+dx[k2]]==1){
            //             py = py + dy[k2];
            //             px = px + dx[k2];
            //             //arg[py][px] = 0;
            //             flag = false;
            //         }
            //     }
            //     if(flag)    break;
            // }


        }
    }

    //周囲を一周したときtrue, falseが反転する回数
    function f2(y,x){
        let cou = 0;
        cou += abs(arg[y-1][x] - arg[y-1][x+1]);
        cou += abs(arg[y-1][x+1] - arg[y][x+1]);
        cou += abs(arg[y][x+1] - arg[y+1][x+1]);
        cou += abs(arg[y+1][x+1] - arg[y+1][x]);
        cou += abs(arg[y+1][x] - arg[y+1][x-1]);
        cou += abs(arg[y+1][x-1] - arg[y][x-1]);
        cou += abs(arg[y][x-1] - arg[y-1][x-1]);
        cou += abs(arg[y-1][x-1] - arg[y-1][x]);
        return cou;
    }

    

}


//ふちを白に
function deleteFuti(arg){
    for(let i=0; i<arg.length; i++){
        arg[i][0] = 0;
        arg[i][arg[0].length-1] = 0;
    }
    for(let i=0; i<arg[0].length; i++){
        arg[0][i] = 0;
        arg[arg.length-1][i] = 0;
    }
}


//単ドットを白に
function deleteDot(arg){
    for(let i=1; i<arg.length-1; i++) for(let j=1; j<arg[0].length-1; j++){
        if(arg[i][j]==1 && arg[i-1][j]==0 && arg[i-1][j+1]==0 && arg[i][j+1]==0 && arg[i+1][j+1]==0 && arg[i+1][j]==0
        && arg[i+1][j-1]==0 && arg[i][j-1]==0 && arg[i-1][j-1]==0){
            arg[i][j] = 0;
        }
    }  
}


//短いアークを削除
function deleteShortArc(arg, len){
    let pixcopy = matrixCopy(arg);
    let list = [];
    let cou = 2;

    let y, x;

    let dy = [-1, 0, 1, 0, -1, 1, 1, -1];
    let dx = [0, 1, 0, -1, 1, 1, -1, -1];

    for(let i=1; i<pixcopy.length-1; i++)   for(let j=1; j<pixcopy[0].length-1; j++){
        if(pixcopy[i][j]==1 && f2(i,j)==2){
            y = i;
            x = j;
            pixcopy[i][j] = cou;
            for(let k1=0; k1<99999; k1++){
                let flag = true;
                for(let k2=0; k2<8; k2++){
                    if(pixcopy[y+dy[k2]][x+dx[k2]]==1){
                        y = y + dy[k2];
                        x = x + dx[k2];
                        pixcopy[y][x] = cou;
                        flag = false;
                    }
                }
                if(flag){
                    if(k1<=len) list.push(cou);
                    cou++;
                    break;
                }
            }
        }
    }

    for(let i=1; i<pixcopy.length-1; i++)   for(let j=1; j<pixcopy[0].length-1; j++){
        if(list.indexOf(pixcopy[i][j])!=-1) arg[i][j] = 0;
    }

    //周囲を一周したときtrue, falseが反転する回数
    function f2(y,x){
        let cou = 0;
        cou += abs(arg[y-1][x] - arg[y-1][x+1]);
        cou += abs(arg[y-1][x+1] - arg[y][x+1]);
        cou += abs(arg[y][x+1] - arg[y+1][x+1]);
        cou += abs(arg[y+1][x+1] - arg[y+1][x]);
        cou += abs(arg[y+1][x] - arg[y+1][x-1]);
        cou += abs(arg[y+1][x-1] - arg[y][x-1]);
        cou += abs(arg[y][x-1] - arg[y-1][x-1]);
        cou += abs(arg[y-1][x-1] - arg[y-1][x]);
        return cou;
    }
}


//細線化ピクセルデータと行先の配列からドーカーコードを求める
function pix2dowker(arg, arrow){

    let pix0 = matrixCopy(arg);
    let pix_arcnum = matrixCopy(arg);

    let x, y, x1, y1, x2, y2;
    let n, index;

    let dy = [-1, 0, 1, 0, -1, 1, 1, -1];
    let dx = [0, 1, 0, -1, 1, 1, -1, -1];

    //単１ピクセルを削除
    for(let i=1; i<arg.length-1; i++)   for(let j=1; j<arg.length-1; j++){
        if(arg[i][j]==1 && arg[i-1][j]==0 && arg[i-1][j+1]==0 && arg[i][j+1]==0 && arg[i+1][j+1]==0
        && arg[i+1][j]==0 && arg[i+1][j-1]==0 && arg[i][j-1]==0 && arg[i-1][j-1]==0){
            pix0[i][j] = 0;
            pix_arcnum[i][j] = 0;
        }
    }

    //pix_arcnumを準備のため1を-1に置換
    for(let i=1; i<pix_arcnum.length-1; i++)    for(let j=1; j<pix_arcnum.length-1; j++){
        if(arg[i][j]==1){
            pix_arcnum[i][j] = -1;
            pix0[i][j] = -1;
        }
    }

    //pix_arcnumにアーク番号をふる
    index = 0;
    n = 1;

    for(let k1=0; k1<arrow.length/2; k1++){

        y = arrow[index][0];
        x = arrow[index][1];

        pix_arcnum[y][x] = n;

        for(let k=0; k<99999; k++){
            let flag = true;
            for(let i=0; i<8; i++){
                if(pix_arcnum[y+dy[i]][x+dx[i]]==-1){
                    pix_arcnum[y+dy[i]][x+dx[i]]=n;
                    y += dy[i];
                    x += dx[i];
                    flag = false;
                    break;
                }
            }
            if(flag)    break;  //たどり終わった
        }

        n++;
        for(let i=0; i<arrow.length; i++){
            index++;
            if(index >= arrow.length)   break;
            if(pix_arcnum[ arrow[index][0] ][ arrow[index][1] ]==-1)    break;
        }

    }

    //交点を探す ２端点と交点に同じ番号をふる
    n = 1;
    index = 0;

    for(let k1=0; k1<arrow.length/2; k1++){

        //スタートの端点
        y1 = arrow[index][0];   
        x1 = arrow[index][1];
        //行先の端点
        y2 = arrow[index][2];
        x2 = arrow[index][3];
        
        //たどっている最中注目しているピクセル座標
        x = x1, y = y1;

        //変位
        let xs, ys;

        if(x2>x1) xs = 1;
        else  xs = -1;
        if(y2>y1) ys = 1;
        else ys = -1;

        for(let k=0; k<99999; k++){

            if(y1 == y2)  x+=xs;
            else if( ((y-y1)*(x2-x1) < (y2-y1)*(x-x1)&&xs*ys==-1) || ((y-y1)*(x2-x1) > (y2-y1)*(x-x1)&&xs*ys==1)) x+=xs;
            else  y+=ys;

            //アークを横切ったとき　スタートのアークでもゴールのアークでもない
            if(pix0[y][x]==-1 && pix_arcnum[y][x]!=pix_arcnum[y1][x1] && pix_arcnum[y][x]!=pix_arcnum[y2][x2]){
                pix0[y][x] = n;
                pix0[y1][x1] = n;
                pix0[y2][x2] = n;
                break;
            }
        }

        n++;
        for(let i=0; i<arrow.length; i++){
            index++;
            if(index >= arrow.length)   break;
            if(pix0[ arrow[index][0] ][ arrow[index][1] ]==-1)    break;
        }

    }

    noStroke();
    for(let i=0; i<pix0.length; i++)    for(let j=0; j<pix0[0].length; j++){
        if(pix0[i][j]==-1)   fill(0);
        if(pix0[i][j]>0) fill(255, 0, 0);
        if(pix0[i][j]==0)   noFill();
        rect(j+320, i+300, 1);
    }

    //pix0をたどり0で埋めていく
    
    //基点
    // y1 = arrow[0][0];
    // x1 = arrow[0][1];

    // y = y1;
    // x = x1;

    // n = 1;

    // let fulldowker = new Array(arrow.length/2);
    // for(let i=0; i<fulldowker.length; i++)  fulldowker[i] = new Array(2);
    // fulldowker[pix0[y][x]-1][0] = n;
    // n++;

    // let endflag = false;

    // for(let k=0; k<999999; k++){
    //     for(let i=0; i<8; i++){
    //         if(pix0[y+dy[i]][x+dx[i]]!=0){
    //             pix0[y][x] = 0;
    //             y += dy[i];
    //             x += dx[i];
    //             if(pix0[y][x] != -1){
    //                 if(f2s(y,x)==2){    //端点
    //                     for(let j=0; j<arrow.length; j++){
    //                         if(arrow[j][0]==y && arrow[j][1]==x){
    //                             pix0[y][x] = 0;
    //                             y = arrow[j][2];
    //                             x = arrow[j][3];
    //                             if(y==y1 && x1==x){ //スタートに戻ってきた　終了
    //                                 endflag = true;
    //                             }else{
    //                                 fulldowker[pix0[y][x]-1][0] = n;
    //                                 n++;
    //                             }
    //                             break;
    //                         }
    //                     }
    //                 }else{  //交点
    //                     fulldowker[pix0[y][x]-1][1] = n;
    //                     n++;

    //                 }
    //             }   
    //             break;
    //         }
    //     }
    //     if(endflag) break;
    // }

    // for(let i=0; i<fulldowker.length; i++){
    //     if(fulldowker[i][0]%2==0){
    //         let tmp = fulldowker[i][0];
    //         fulldowker[i][0] = fulldowker[i][1];
    //         fulldowker[i][1] = - tmp;
    //     }
    // }

    // fulldowker.sort(function(a,b){return a[0]-b[0]});

    // let result = new Array(fulldowker.length);
    // for(let i=0; i<result.length; i++)  result[i] = fulldowker[i][1];
    
    // return result;

    //周囲を一周したときtrue, falseが反転する回数
    function f2s(y,x){

        let cou = 0;

        cou += noteq(arg[y-1][x], arg[y-1][x+1]);
        cou += noteq(arg[y-1][x+1], arg[y][x+1]);
        cou += noteq(arg[y][x+1], arg[y+1][x+1]);
        cou += noteq(arg[y+1][x+1], arg[y+1][x]);
        cou += noteq(arg[y+1][x], arg[y+1][x-1]);
        cou += noteq(arg[y+1][x-1], arg[y][x-1]);
        cou += noteq(arg[y][x-1], arg[y-1][x-1]);
        cou += noteq(arg[y-1][x-1], arg[y-1][x]);

        function noteq(a,b){
            if((a==0&&b!=0) || (a!=0&&b==0))    return 1;
            else    return 0;
        }
        
        return cou;
    }
    
}


//ドーカーコードからドーカー対
function dok2pair(dok){
    let list = [[0,0]];
    let result;
    for(let i=0; i<dok.length; i++){
        list.push([i*2+1,dok[i]]);
        list.push([dok[i],i*2+1]);
    }
    list.sort(function(a,b){return(abs(a[0])-abs(b[0]));});
    
    result = new Array(list.length);
    for(let i=0; i<list.length; i++){
        result[i] = list[i][1];
        if(list[i][0]<0)    result[i] *= -1;
    }
    return result;
}


//ドーカーコードをライズ付きドーカーコードにする
function dok2rise(dok){

    let pair = dok2pair(dok);

    let sign = new Array(pair.length);
    let phi = new Array(pair.length);
    let list = new Array(pair.length);
    let used = new Array(pair.length);

    let m=1;
    let len = pair.length - 1;

    for(let i=1; i<pair.length; i++){
        if(pair[i]>0)   sign[i] = 1;
        else    sign[i] = -1;
        pair[i] = abs(pair[i]);
    }

    list[1] = 1;
    list[pair[1]] = -1;

    for(let k=0; k<len; k++){

        used[m] = true;

        phi[m] = 1;
        for(let i=1; i<pair.length-1; i++){
            if(inside(m, pair[m], pair[(m+i-1)%len+1]))   phi[(m+i-1)%len+1] = phi[(m+i+len-2)%len+1]*(-1);
            else    phi[(m+i-1)%len+1] = phi[(m+i+len-2)%len+1];
        }

        for(let i=1; i<list.length; i++){
            if(inside(m, pair[m], i) && !(inside(m, pair[m], pair[i])) && i!=m && i!=pair[m]){
                list[i] = - list[m] * phi[i] * phi[pair[i]];
                list[pair[i]] = - list[i];
            }
        }

        for(let i=1; i<list.length; i++){
            if(list[i]!=null && used[i]==null){
                m = i;
                break;
            }
        }

        if(full(list))    break;
    }


    let result = [];
    for(let i=1; i<pair.length; i+=2){
        result.push([pair[i]*sign[i],list[i]*sign[i]]);
    }
    
    return result;

    function full(a){
        for(let i=1; i<a.length; i++){
            if(a[i] == null)   return false;
        }
        return true;
    }

    function inside(a1, a2, b){
        if(a1 < a2){
            if(a1<=b && b<=a2)    return true;
            else    return false;
        }else{
            if(!(a1<=b && b<=a2)) return true;
            else    return false;
        }
    }
}


//ドーカーコードからアレキサンダー多項式の係数リスト
function dok2alex(dok){

    let doks = dok2rise(dok);
    let sign0 = new Array(doks.length+1);
    let sign = new Array(doks.length*2);
    let result;

    for(let i=0; i<doks.length; i++){
        dok[i] = doks[i][0];
        sign0[i+1] = doks[i][1];
    }

    let pair = dok2pair(dok);

    for(let i=1; i<sign0.length; i++){
        sign[i*2-1] = sign0[i];
        sign[abs(pair[i*2-1])] = sign0[i];
    }

    let arc = [];
    let list = new Array(dok.length);
    
    let sw = true;
    for(let i=1;; i++){
        if(sw){
            if((i%2==1&&pair[i]>0) || (i%2==0&&pair[i]<0)){
                arc.push([i]);
                sw = false;
            }
        }else{
            if((i%2==0&&pair[i]<0) || (i%2==1&&pair[i]>0)){
                arc[arc.length-1].push(i);
                sw = true;
                i--;
                if(arc.length == dok.length)   break;
            }
        }
        if(i > dok.length*2)  i=0;
    }
    
    for(let i=0; i<dok.length; i++){
        for(let j=0; j<arc.length; j++){
            if(inside(arc[j][0],arc[j][1],abs(pair[arc[i][1]]))){
                list[i] = j;
                break;
            }
        }
    }

    let mat = new Array(dok.length-1);
    for(let i=0; i<mat.length; i++) mat[i] = new Array(mat.length);
    for(let i=0; i<mat.length; i++) for(let j=0; j<mat.length; j++) mat[i][j] = [0];

    for(let i=0; i<mat.length; i++){
        if(sign[arc[i][1]]==1){
            mat[i][i] = polyadd([1,0,0],mat[i][i]);
            if(i+1<mat.length)  mat[i][i+1] = polyadd([0,-1,0],mat[i][i+1]);
            if(list[i]<mat.length)  mat[i][list[i]] = polyadd([-1,1,0],mat[i][list[i]]);
        }else{
            mat[i][i] = polyadd([1],mat[i][i]);
            if(i+1<mat.length)  mat[i][i+1] = polyadd([0,-1,0],mat[i][i+1]);
            if(list[i]<mat.length)  mat[i][list[i]] = polyadd([1,-1],mat[i][list[i]]);
        }
    }

    result = polydet(mat);
    for(;;){
        if(result.length==0) break;
        if(result[result.length-1] == 0)  result.pop();
        else    break;
    }
    if(result[0]<0) for(let i=0; i<result.length; i++)  result[i]*=-1;
    
    let str = '';
    str += result[0];

    for(let i=1; i<result.length; i++){
        if(result[i]>0) str += '+';
        if(result[i]<0) str += '-';
        if(result[i]!=0){
            if(abs(result[i])!=1)    str += abs(result[i]);
            str += 't';
            if(i>1) str += '^' + i;
        }
    }

    return str;
    
    function inside(a1, a2, b){
        if(a1 < a2){
            if(a1<b && b<a2)    return true;
            else    return false;
        }else{
            if(!(a1<b && b<a2)) return true;
            else    return false;
        }
    }
}


//ドーカーコードからジョーンズ多項式
function dok2jones(code){

    let coder = dok2rise(code);

    let n2 = code.length*2;

    let pdata = [];

    for(let i=0; i<code.length; i++){
        if(code[i]>0){
            if(coder[i][1]==-1) pdata.push([slide(code[i],-1,n2), 2*i+1, code[i], slide(2*i+1,-1,n2)]);
            else    pdata.push([slide(code[i],-1,n2), slide(2*i+1,-1,n2), code[i], 2*i+1]);
        }else{
            if(coder[i][1]==-1) pdata.push([slide(abs(code[i]),-1,n2), 2*i+1, abs(code[i]), slide(2*i+1,-1,n2)]);
            else    pdata.push([slide(abs(code[i]),-1,n2), slide(2*i+1,-1,n2), abs(code[i]), 2*i+1]);
        }
    }

    function slide(a1, sign, n){
        let result = a1;
        if(sign==1){
            result++;
            if(result>n)    result = 1;
        }else{
            result--;
            if(result==0)   result = n;
        }
        return result;
    }

    let lista = [];

    for(let i=0; i<pdata.length; i++){
        lista[i] = ['A', 'B'];
        lista[i][0] += '[' + pdata[i][0] + ',' + pdata[i][3] + '],' + '[' + pdata[i][1] + ',' + pdata[i][2] + '],';
        lista[i][1] += '[' + pdata[i][0] + ',' + pdata[i][1] + '],' + '[' + pdata[i][2] + ',' + pdata[i][3] + '],';
    }

    let listb = [];

    for(let i=0; i<2**pdata.length; i++){
        let dec = i.toString(2).padStart(pdata.length,'0');

        let tmp = '';
        
        for(let j=0; j<dec.length; j++){
            if(dec.charAt(j)=='0')    tmp += lista[j][0];
            else    tmp += lista[j][1];
        }

        listb.push(tmp);
    }

    let listc = new Array(listb.length);

    for(let i=0; i<listb.length; i++){

        let cou = 0;

        for(let j=0; j<listb[i].length; j++){
            if(listb[i].charAt(j)=='A') cou++;
            if(listb[i].charAt(j)=='B') cou--;
        }

        //A, Bを削除
        listb[i] = listb[i].split('A').join(''); 
        listb[i] = listb[i].split('B').join('');

        listb[i] = '[' + listb[i].slice(0,-1) + ']';    //最後の,を削除して[]で囲む

        listb[i] = JSON.parse(listb[i]);

        listc[i] = cou;
    }

    for(let k0=0; k0<listb.length; k0++){

        listb[k0];

        for(let k1=0; k1<99999; k1++){

            for(let i=0; i<listb[k0].length; i++) listb[k0][i].sort(function(a,b){return a-b});
            listb[k0].sort(function(a,b){return a[0]-b[0]});

            for(let i=0; i<listb[k0].length-1; i++){
                if(listb[k0][i][0]==listb[k0][i+1][0]){
                    listb[k0][i] = [listb[k0][i][1], listb[k0][i+1][1]]
                    listb[k0].splice(i+1,1);
                }
            }

            let flag = true;
            for(let i=0; i<listb[k0].length; i++){
                if(listb[k0][i][0]!=listb[k0][i][1]){
                    flag = false;
                    break;
                }
            }

            if(flag)    break;

        }

    }

    for(let i=0; i<listc.length; i++){
        listc[i] = [listc[i], listb[i].length];
    }

    listc.sort(function(a,b){return a[0]-b[0]});

    for(let i=0; i<listc.length; i++)   listc[i].push(1);

    for(let i=0; i<listc.length-1; i++){
        if(listc[i][0]==listc[i+1][0] && listc[i][1] == listc[i+1][1]){
            listc[i][2]++;
            listc.splice(i+1,1);
            i--;
        }
    }

    let listd = [];
    let hineri = 0;
    let hineriex;

    for(let i=0; i<coder.length; i++){
        hineri += coder[i][1];
    }
    hineriex=-3*hineri;

    for(let k=0; k<listc.length; k++){
        let n1 = listc[k][1]-1;
        for(let i=0; i<=n1; i++){
            listd.push([(-1)**(n1+abs(hineri))*combination(n1,i)*listc[k][2], 2*n1-4*i+listc[k][0]+hineriex]);
        }
    }


    listd.sort(function(a,b){return b[1]-a[1]});

    for(let i=0; i<listd.length-1; i++){
        if(listd[i][1]==listd[i+1][1]){
            listd[i][0] += listd[i+1][0];
            listd.splice(i+1,1);
            i--;
        }
    }

    for(let i=0; i<listd.length; i++){
        if(listd[i][0]==0){
            listd.splice(i,1);
            i--;
        }
    }

    for(let i=0; i<listd.length; i++){
        listd[i][1] /= -4;
    }

    let result='';

    for(let i=0; i<listd.length; i++){

        if(i!=0 && listd[i][0]>0)   result += '+';
        if(listd[i][0]<0) result += '-';
        if((abs(listd[i][0])!=1 && listd[i][0]!=0) || listd[i][1]==0) result += abs(listd[i][0]);

        //if(abs(listd[i][0])!=1 && listd[i][1]!=0)   result+='*';

        if(listd[i][1]!=0)  result+='t';
        if(listd[i][1]!=0 && listd[i][1]!=1)    result+='^';

        if(listd[i][1]>1)   result += listd[i][1];
        if(listd[i][1]<0)   result += '(' + listd[i][1] + ')';
    }

    function combination(n0, r0){
        let result = 1;
        for(let i=n0; i>=n0-r0+1; i--){
            result*=i;
        }
        for(let i=1; i<=r0; i++){
            result/=i;
        }
        return result;
    }
    return result;

}


//ドーカーコードから12交点まででアレキサンダー多項式、ジョーンズ多項式が一致するものを探す
function findknot(code){
    let alex = dok2alex(code);
    let jones = dok2jones(code);

    let result = [];

    for(let i=0; i<knotinfo_name.length; i++){
        if(alex==knotinfo_alex[i] && (jones==knotinfo_jones[i]||polyneg(jones)==knotinfo_jones[i])){
            result.push(knotinfo_name[i]);
        }
    }

    return result;
}


//多項式の係数を全て-1倍する
function polyneg(arg){

    result = arg;

    if(result.charAt(0)!='-')  result = '+' + result;  
    result = result.split('+').join('%');
    result = result.split('(-').join('&');
    result = result.split('-').join('+');
    result = result.split('%').join('-');
    result = result.split('&').join('(-');
    if(result.charAt(0)=='+')   result = result.slice(1);

    return result;
}


//細線画像から点群リストを生成
function pix2plist(arg){

    let pixcopy = matrixCopy(arg);

    let result = [];

    let dy = [-1, 0, 1, 0, -1, 1, 1, -1];
    let dx = [0, 1, 0, -1, 1, 1, -1, -1];

    for(let arcn=0; arcn<99999; arcn++){
        
        let flag2 = false;
        for(let i=0; i<arg.length; i++){
            if(flag2)   break;
            for(let j=0; j<arg[i].length; j++){

                if(pixcopy[i][j]==1 && f2(i,j)==2){ //端点が見つかった
                    flag2 = true;

                    let tmp = [[i,j]];   //ポイントリスト
                    let py = i;
                    let px = j;

                    pixcopy[py][px] = 0;
                    for(let k=1; k<99999; k++){

                        let flag3 = true;
                        for(let d=0; d<8; d++){
                            if(pixcopy[py+dy[d]][px+dx[d]]==1){
                                py = py + dy[d];
                                px = px + dx[d];
                                pixcopy[py][px] = 0;
                                flag3 = false;
                                break;
                            }
                        }

                        if(flag3 || k%5==0) tmp.push([py,px]); 
                        if(flag3)   break;
                    }

                    result.push(tmp);
                    break;
                }

            }

        }

        if(!flag2)    break;
    }

    return result;

    //周囲を一周したときtrue, falseが反転する回数
    function f2(y,x){

        let cou = 0;

        cou += abs(arg[y-1][x] - arg[y-1][x+1]);
        cou += abs(arg[y-1][x+1] - arg[y][x+1]);
        cou += abs(arg[y][x+1] - arg[y+1][x+1]);
        cou += abs(arg[y+1][x+1] - arg[y+1][x]);
        cou += abs(arg[y+1][x] - arg[y+1][x-1]);
        cou += abs(arg[y+1][x-1] - arg[y][x-1]);
        cou += abs(arg[y][x-1] - arg[y-1][x-1]);
        cou += abs(arg[y-1][x-1] - arg[y-1][x]);
        
        return cou;
    }
}


//点群リストを端点のペアを使ってソート 
function sortplist(argpl, argik){

    let result = [argpl[0]];
    let m = 0;

    let sx, sy;

    for(let k=0; k<argpl.length-1; k++){

        for(let i=0; i<argik.length; i++){
            if(argpl[m][argpl[m].length-1][0]==argik[i][0] && argpl[m][argpl[m].length-1][1]==argik[i][1]){
                sx = argik[i][2];
                sy = argik[i][3];
                break;
            }
        }

        let flag = true;

        for(let i=0; i<argpl.length; i++){
            if(sx==argpl[i][0][0] && sy==argpl[i][0][1]){
                result.push(argpl[i]);
                m = i;
                flag = false;
                break;
            }
        }

        for(let i=0; i<argpl.length; i++){
            if(sx==argpl[i][argpl[i].length-1][0] && sy==argpl[i][argpl[i].length-1][1]){
                result.push(argpl[i].reverse());
                m = i;
                break;
            }
        }

    }

    return result;
}


function split2(arg){

    const n = arg.length;

    const slit = 8;

    let lista = [];
    for(let i=0; i<n; i++)  lista[i] = [i, 0, true];

    let va, vb, vc, vd, vcr;

    let listfst, listsec;

    for(let k0=0; k0<n; k0++){

        let k1 = lista[k0][0];

        va = new p5.Vector(arg[k1][arg[k1].length-1][0], arg[k1][arg[k1].length-1][1]);
        vb = new p5.Vector(arg[(k1+1)%arg.length][0][0], arg[(k1+1)%arg.length][0][1]);
        
        lista[k0][5] = {x:va.x, y:va.y};
        lista[k0][6] = {x:vb.x, y:vb.y};

        for(let i=0; i<arg.length; i++){

            let bflag = false;

            for(let j=0; j<arg[i].length-1; j++){

                vc = new p5.Vector(arg[i][j][0], arg[i][j][1]);
                vd = new p5.Vector(arg[i][j+1][0], arg[i][j+1][1]);

                vcr = crosspoint(va, vb, vc, vd);

                if(vcr){    //交点発見

                    let dsum; 
                    let dis;
                    let x1, y1;

                    dsum = dist(vcr.x, vcr.y, vd.x, vd.y);
                    let flag = true;    //スリット幅を超えずに端点に行き着いた

                    //後ろにすきま分だけたどる
                    for(let k=j+1; k<arg[i].length-1; k++){
                        dis = dist(arg[i][k][0], arg[i][k][1], arg[i][k+1][0], arg[i][k+1][1]);
                        dsum += dis;
                        if(dsum>slit){
                            let ratio = (dsum-slit)/dis;
                            
                            x1 = arg[i][k][0]*ratio + arg[i][k+1][0]*(1-ratio);
                            y1 = arg[i][k][1]*ratio + arg[i][k+1][1]*(1-ratio);
                            
                            flag = false;

                            listsec = arg[i].slice(k+1);
                            listsec.unshift([x1,y1]);

                            break;
                        }
                    }

                    if(flag){
                        listsec = [
                            [arg[i][arg[i].length-1][0]*0.9+arg[i][arg[i].length-2][0]*0.1,
                            arg[i][arg[i].length-1][1]*0.9+arg[i][arg[i].length-2][1]*0.1 ],
                            [arg[i][arg[i].length-1][0], arg[i][arg[i].length-1][1] ]
                        ];
                    }

                    dsum = dist(vcr.x, vcr.y, vc.x, vc.y);
                    flag = true;

                    //前にたどる
                    for(let k=j; k>0; k--){
                        dis = dist(arg[i][k][0], arg[i][k][1], arg[i][k-1][0], arg[i][k-1][1]);
                        dsum+=dis;

                        if(dsum>slit){
                            let ratio = (dsum-slit)/dis;

                            x1 = arg[i][k][0]*ratio + arg[i][k-1][0]*(1-ratio);
                            y1 = arg[i][k][1]*ratio + arg[i][k-1][1]*(1-ratio);
                            
                            flag = false;

                            listfst = arg[i].slice(0, k);

                            listfst.push([x1,y1]);

                            break;
                        }

                        if(flag){
                            listfst = [
                                [arg[i][0][0], arg[i][0][1] ],
                                [arg[i][0][0]*0.9 + arg[i][1][0]*0.1, arg[i][0][1]*0.9 + arg[i][1][1]*0.1]
                            ];
                        }

                    }

                    arg.splice(i,1);
                    arg.splice(i,0,listsec);
                    arg.splice(i,0,listfst);
                    
                    lista[k0][7] = {x:vcr.x, y:vcr.y};

                    lista[k0][3] = {x:arg[i][arg[i].length-1][0], y:arg[i][arg[i].length-1][1]};
                    lista[k0][4] = {x:arg[i+1][0][0], y:arg[i+1][0][1]};

                    for(let j1=0; j1<n; j1++)   if(lista[j1][0]>=i)    lista[j1][0]++;
                    lista[k0][1] = i;
                    for(let j1=0; j1<k0; j1++)   if(lista[j1][1]>=i)    lista[j1][1]++;

                    bflag = true;
                    break;
                }
            }

            if(bflag)   break;

        }

    }
   

    return lista;

    
}


//交点情報からドーカーコード　引数：交点情報、始点となるアーク番号、逆回り
function cross2dowker(arg, sp, rev){

    let n2 = arg.length*2;
    let lista = new Array(arg.length);

    //順方向
    
    for(let i=0; i<lista.length; i++){
        let sign = -1;
        if(!rev)    lista[i] = [(arg[i][0]-sp+1+n2)%n2+1, (arg[i][1]-sp+1+n2)%n2+1];
        else    lista[i] = [(n2-arg[i][0]+sp)%n2+1, (n2-arg[i][1]+sp)%n2+1];
        if(lista[i][0]%2==0){
            let tmp = lista[i][0];
            lista[i][0] = lista[i][1];
            lista[i][1] = tmp;
            sign*=-1;
        }
        if(arg[i][2])   sign*=-1;
        lista[i][1]*=sign;
    }

    lista.sort(function(a,b){return a[0]-b[0]});

    let result = new Array(lista.length);
    
    for(let i=0; i<result.length; i++)  result[i] = lista[i][1];

    return result;
}


//ドーカーコードからジョーンズ多項式
function dok2jones(code){

    let coder = dok2rise(code);

    let n2 = code.length*2;

    let pdata = [];

    for(let i=0; i<code.length; i++){
        if(code[i]>0){
            if(coder[i][1]==-1) pdata.push([slide(code[i],-1,n2), 2*i+1, code[i], slide(2*i+1,-1,n2)]);
            else    pdata.push([slide(code[i],-1,n2), slide(2*i+1,-1,n2), code[i], 2*i+1]);
        }else{
            if(coder[i][1]==-1) pdata.push([slide(abs(code[i]),-1,n2), 2*i+1, abs(code[i]), slide(2*i+1,-1,n2)]);
            else    pdata.push([slide(abs(code[i]),-1,n2), slide(2*i+1,-1,n2), abs(code[i]), 2*i+1]);
        }
    }

    function slide(a1, sign, n){
        let result = a1;
        if(sign==1){
            result++;
            if(result>n)    result = 1;
        }else{
            result--;
            if(result==0)   result = n;
        }
        return result;
    }

    let lista = [];

    for(let i=0; i<pdata.length; i++){
        lista[i] = ['A', 'B'];
        lista[i][0] += '[' + pdata[i][0] + ',' + pdata[i][3] + '],' + '[' + pdata[i][1] + ',' + pdata[i][2] + '],';
        lista[i][1] += '[' + pdata[i][0] + ',' + pdata[i][1] + '],' + '[' + pdata[i][2] + ',' + pdata[i][3] + '],';
    }

    let listb = [];

    for(let i=0; i<2**pdata.length; i++){
        let dec = i.toString(2).padStart(pdata.length,'0');

        let tmp = '';
        
        for(let j=0; j<dec.length; j++){
            if(dec.charAt(j)=='0')    tmp += lista[j][0];
            else    tmp += lista[j][1];
        }

        listb.push(tmp);
    }

    let listc = new Array(listb.length);

    for(let i=0; i<listb.length; i++){

        let cou = 0;

        for(let j=0; j<listb[i].length; j++){
            if(listb[i].charAt(j)=='A') cou++;
            if(listb[i].charAt(j)=='B') cou--;
        }

        //A, Bを削除
        listb[i] = listb[i].split('A').join(''); 
        listb[i] = listb[i].split('B').join('');

        listb[i] = '[' + listb[i].slice(0,-1) + ']';    //最後の,を削除して[]で囲む

        listb[i] = JSON.parse(listb[i]);

        listc[i] = cou;
    }

    for(let k0=0; k0<listb.length; k0++){

        listb[k0];

        for(let k1=0; k1<99999; k1++){

            for(let i=0; i<listb[k0].length; i++) listb[k0][i].sort(function(a,b){return a-b});
            listb[k0].sort(function(a,b){return a[0]-b[0]});

            for(let i=0; i<listb[k0].length-1; i++){
                if(listb[k0][i][0]==listb[k0][i+1][0]){
                    listb[k0][i] = [listb[k0][i][1], listb[k0][i+1][1]]
                    listb[k0].splice(i+1,1);
                }
            }

            let flag = true;
            for(let i=0; i<listb[k0].length; i++){
                if(listb[k0][i][0]!=listb[k0][i][1]){
                    flag = false;
                    break;
                }
            }

            if(flag)    break;

        }

    }

    for(let i=0; i<listc.length; i++){
        listc[i] = [listc[i], listb[i].length];
    }

    listc.sort(function(a,b){return a[0]-b[0]});

    for(let i=0; i<listc.length; i++)   listc[i].push(1);

    for(let i=0; i<listc.length-1; i++){
        if(listc[i][0]==listc[i+1][0] && listc[i][1] == listc[i+1][1]){
            listc[i][2]++;
            listc.splice(i+1,1);
            i--;
        }
    }

    let listd = [];
    let hineri = 0;

    for(let i=0; i<coder.length; i++){
        hineri += coder[i][1];
    }
    hineri*=-3;

    for(let k=0; k<listc.length; k++){
        let n1 = listc[k][1]-1;
        for(let i=0; i<=n1; i++){
            listd.push([(-1)**(n1-1)*combination(n1,i)*listc[k][2], 2*n1-4*i+listc[k][0]+hineri]);
        }
    }

    listd.sort(function(a,b){return b[1]-a[1]});

    for(let i=0; i<listd.length-1; i++){
        if(listd[i][1]==listd[i+1][1]){
            listd[i][0] += listd[i+1][0];
            listd.splice(i+1,1);
            i--;
        }
    }

    for(let i=0; i<listd.length; i++){
        if(listd[i][0]==0){
            listd.splice(i,1);
            i--;
        }
    }

    for(let i=0; i<listd.length; i++){
        listd[i][1] /= -4;
    }

    let result='';

    for(let i=0; i<listd.length; i++){

        if(i!=0 && listd[i][0]>0)   result += '+';
        if(listd[i][0]<0) result += '-';
        if((abs(listd[i][0])!=1 && listd[i][0]!=0) || listd[i][1]==0) result += abs(listd[i][0]);

        //if(abs(listd[i][0])!=1 && listd[i][1]!=0)   result+='*';

        if(listd[i][1]!=0)  result+='t';
        if(listd[i][1]!=0 && listd[i][1]!=1)    result+='^';

        if(listd[i][1]>1)   result += listd[i][1];
        if(listd[i][1]<0)   result += '(' + listd[i][1] + ')';
    }

    function combination(n0, r0){
        let result = 1;
        for(let i=n0; i>=n0-r0+1; i--){
            result*=i;
        }
        for(let i=1; i<=r0; i++){
            result/=i;
        }
        return result;
    }

    return result;

}


//2線分の交点
function crosspoint(va,vb,vc,vd){
    if(va.x==vc.x && va.y==vc.y)    return false;
    if(va.x==vd.x && va.y==vd.y)    return false;
    if(vb.x==vc.x && vb.y==vc.y)    return false;
    if(vb.x==vd.x && vb.y==vd.y)    return false;

    let r,s,acx,acy,bunbo;
    acx=vc.x-va.x;
    acy=vc.y-va.y;
    bunbo=(vb.x-va.x)*(vd.y-vc.y)-(vb.y-va.y)*(vd.x-vc.x);
    r=((vd.y-vc.y)*acx-(vd.x-vc.x)*acy)/bunbo;
    s=((vb.y-va.y)*acx-(vb.x-va.x)*acy)/bunbo;
    if(r>=0&&r<=1&&s>=0&&s<=1)    return new p5.Vector((1-r)*va.x+r*vb.x, (1-r)*va.y+r*vb.y);
    else    return false;
}