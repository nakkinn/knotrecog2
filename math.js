function determinant(a){
    let n=a.length;

    if(n==1) return a[0][0];
    if(n==2) return a[0][0]*a[1][1]-a[0][1]*a[1][0];

    let result=0;
    for(let k=0;k<n;k++){
        let b=new Array(n-1);
        for(let i=0;i<n-1;i++)   b[i]=new Array(n-1);
        
        for(let i=0;i<n-1;i++)   for(let j=0;j<n-1;j++){
            if(i<k)    b[i][j]=a[i][j+1];
            else b[i][j]=a[i+1][j+1];
        }

        result+=a[k][0]*((-1)**k)*determinant(b);
    }
    
    return result;
}

//多項式の加算
function polyadd(a,b){
    let n=Math.max(a.length,b.length);
    let result=new Array(n);
    for(let i=0;i<n;i++)    result[i]=0;
    for(let i=0;i<a.length;i++) result[i+n-a.length]+=a[i];
    for(let i=0;i<b.length;i++) result[i+n-b.length]+=b[i];
    for(let i=0;i<n-1;i++){
        if(result[0]==0)    result.shift();
        else    break;
    }
    return result;
}

//多項式の減算
function polysub(a,b){
    let n=Math.max(a.length,b.length);
    let result=new Array(n);
    for(let i=0;i<n;i++)    result[i]=0;
    for(let i=0;i<a.length;i++) result[i+n-a.length]+=a[i];
    for(let i=0;i<b.length;i++) result[i+n-b.length]-=b[i];
    for(let i=0;i<n-1;i++){
        if(result[0]==0)    result.shift();
        else    break;
    }
    return result;
}

//多項式の乗算
function polymul(a,b){
    let n=a.length+b.length-1;
    let arr=new Array(n);
    for(let i=0;i<n;i++)    arr[i]=[];
    result=new Array(n);

    for(let i=0;i<a.length;i++) for(let j=0;j<b.length;j++){
        arr[i+j].push([i,j]);
    }

    for(let i=0;i<n;i++){
        let sum=0;
        for(let j=0;j<arr[i].length;j++)    sum += a[ arr[i][j][0] ] * b[ arr[i][j][1] ];
        result[i]=sum;
    }

    for(let i=0;i<n-1;i++){
        if(result[0]==0)    result.shift();
        else    break;
    }

    return result;
}


function polydot(a,c){
    if(c==0)    return [0];
    let result=new Array(a.length);
    for(let i=0;i<a.length;i++) result[i]=a[i]*c;
    return result;
}

//要素が多項式の行列の行列式
function polydet(a){
    let n=a.length;

    if(n==1) return a[0][0];
    if(n==2) return polysub(polymul(a[0][0],a[1][1]),polymul(a[0][1],a[1][0]));

    let result=[0];
    for(let k=0;k<n;k++)    if(a[k][0]!=0){
        let b=new Array(n-1);
        for(let i=0;i<n-1;i++)   b[i]=new Array(n-1);
        
        for(let i=0;i<n-1;i++)   for(let j=0;j<n-1;j++){
            if(i<k)    b[i][j]=a[i][j+1];
            else b[i][j]=a[i+1][j+1];
        }

        let tem=polymul(a[k][0],polydet(b));
        tem=polydot(tem,(-1)**k);
        result=polyadd(result,tem);
    }
    
    return result;
}

//ザイフェルト行列からアレクサンダー多項式
function sei_alex(a){

    let n = a.length;
    let b = new Array(n);
    let mat = new Array(n);
    for(let i=0; i<n; i++)  mat[i] = new Array(n);

    for(let i=0; i<n; i++)  for(let j=0; j<n; j++)  mat[i][j] = [a[i][j]];

    for(let i=0;i<n;i++)    b[i] = new Array(n);
    for(let i=0;i<n;i++)    for(let j=0;j<n;j++){
        let tem = mat[j][i].concat();
        tem.push(0);
        b[i][j] = tem;
    }

    for(let i=0;i<n;i++)    for(let j=0;j<n;j++)    mat[i][j] = polysub(mat[i][j],b[i][j]);
    return polydet(mat);
}

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
    if(r>=0&&r<=1&&s>=0&&s<=1)    return true;//new p5.Vector((1-r)*va.x+r*vb.x, (1-r)*va.y+r*vb.y);
    else    return false;
}

