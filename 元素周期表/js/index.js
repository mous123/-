(function(){
    //创建125个li
    let aLi = [];
    let oList = document.getElementById("list");
    let rX = 0,
        rZ= -3000,
        rY = 0;
    (function(){
        let fragment = document.createDocumentFragment();//创建文档碎片
        for(i=0;i<125;i++){
            //随机的位置
            let ranX = Math.floor(Math.random()*7000-4000);
            let ranY = Math.floor(Math.random()*8000-4000);
            let ranZ = Math.floor(Math.random()*9000-5000);
            //添加前120个，后面的五个需要手动补齐；
            let d = data[i] || {"order":"103","name":"Lr","mass":"(260)"};
            let oLi = document.createElement("li");
            //添加内容
            oLi.innerHTML=`
                <p>${d.name}</p>
                <p>${d.order}</p>
                <p>${d.mass}</p>
            `;
            oLi.style.transform = `translate3d(${ranX}px,${ranY}px,${ranZ}px)`;
            aLi.push(oLi);
            fragment.appendChild(oLi);
        }
        oList.appendChild(fragment);
        oList.offsetLeft;    //浏览器重新绘制
    })();

        
    //鼠标拖拽事件
    (function(){
        //初始值
        let sX,//鼠标按下的的位置
            sY,
            nX,//鼠标抬起的位置
            nY,
            sRoatX,
            sRoatY,
            nRoatX,
            nRoatY,
            xx,
            yy,
            lastX,
            lastY,
            SX=0,
            SY=0,
            moveTimer=0,
            timer;
        //鼠标按下事件
        document.addEventListener("mousedown",function(e){
            sX = e.pageX;
            sY = e.pageY;
            sRoatX = rX;
            sRoatY = rY;
            this.addEventListener("mousemove",move);
        });
        //鼠标抬起事件
        document.addEventListener("mouseup",function(e){
            this.removeEventListener("mousemove",move);
            
            if(new Date - moveTimer > 100)return;
            timer = requestAnimationFrame(m);
            function m(){
                SX *= 0.95;
                SY *= 0.95;

                rX += SY*0.1;
                rY -= SX*0.1;

                nRoatX = sRoatX + xx*0.2;
                nRoatY = sRoatY + yy*0.2;
                
                oList.style.transform=`translateZ(${rZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
                if(Math.abs(SX)<=0.5 && Math.abs(SY)<=0.5)return;//判断
                timer =  requestAnimationFrame(m);
            }

        });

       //鼠标按下拖拽
        function move(e){
            moveTimer = new Date;
            nX = e.pageX;
            nY = e.pageY;
            //鼠标移动距离
            xx = nX - sX;
            yy = nY - sY;
            
            //角度变化值
            nRoatX = sRoatX + yy*0.2;
            nRoatY = sRoatY + xx*0.2;

            
            //记录新的值
            rX = nRoatX;
            rY = nRoatY;
            
            oList.style.transform=`translateZ(${rZ}px) rotateX(${nRoatX}deg) rotateY(${nRoatY}deg)`;
            //最后两点之间的距离
            SX = lastX - nX;
            SY = lastY - nY;

            lastX = nX;
            lastY = nY;
    
        };
    })();

    //放大和缩小
    (function(){
        //火狐e.detail   值为三   往上滚动是负值
        document.addEventListener("DOMMouseScroll",whell);
        //谷歌e.wheelDelta   值为120  往上滚是正值
        document.addEventListener("mousewheel",whell);

        function whell(e){
            let d = e.detail/3 || e.wheelDelta/120;
            rZ += d*120;
                     
            rZ = Math.max(rZ,-6000);//最大值
            rZ = Math.min(rZ,500);//最小值

            oList.style.transform=`translateZ(${rZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;

        }
    })();
    Table();
    //tab事件
    (function(){
        let TabLi = document.querySelectorAll("#tab li");
        TabLi.forEach((node,i)=>{
            node.onclick = function(){
                switch(i){
                    case 0:
                        Table();
                        break;
                    case 1:
                        Sphere();
                        break;
                    case 2:
                        Helix();
                        break;
                    case 3:
                        Grid();
                        break;
                }
            }
        })
    })();

      //Grid布局
    function Grid(){
        aLi.forEach((node,index)=>{
            //通过遍历每一个li的下标求它的坐标
            let X = index % 5;
            let Y = Math.floor(index %25 /5);
            let Z = Math.floor(index /25);

            //以坐标2,2为基点，通过正负值判断每一个li的移动方向
            let xx = X - 2;
            let yy = Y - 2;
            let zz = 2- Z;

            //移动li到相应的位置
            node.style.transform = `translate3d(${xx*240}px,${yy*240}px,${zz*800}px)`;
        });

    };
    //Helix布局
    function Helix(){
        aLi.forEach((node,index)=>{
            let dg = 360/(125/4);
            node.style.transform = `rotateY(${index*dg}deg) translate3d(0px,${(index-62)*10}px,1000px)`;
        })
    };
    //球体布局
    function Sphere(){
        let arr = [1,3,7,9,11,14,21,16,12,10,9,7,4,1];
        let len = arr.length;
        let deg = 180 / (len-1);

        aLi.forEach((node,index)=>{
            let turns , num;
            let sum = 0;
            for(let i = 0; i<len; i++){
                sum += arr[i];
                if(sum >= (index+1)){
                    turns = i;
                    num = sum-(index+1);
                    break;
                }
            }
            let xdg = 90 - turns * deg;
            let ydg = 360 / arr[turns]*num;
            node.style.transform=`rotateY(${ydg}deg) rotateX(${xdg}deg)  translateZ(900px)`;

        })
    };
    //表格布局
    function Table(){
        let coord = [
            {x:0,y:0},
            {x:17,y:0},
            {x:0,y:1},
            {x:1,y:1},
            {x:12,y:1},
            {x:13,y:1},
            {x:14,y:1},
            {x:15,y:1},
            {x:16,y:1},
            {x:17,y:1},
            {x:0,y:2},
            {x:1,y:2},
            {x:12,y:2},
            {x:13,y:2},
            {x:14,y:2},
            {x:15,y:2},
            {x:16,y:2},
            {x:17,y:2},
        ];
        let x;
        let y;
        aLi.forEach((node,index)=>{
        
        if(index < 18){
            x = coord[index].x;
            y = coord[index].y;
        }else if (index < 90){
            x = index % 18;
            y = Math.floor(index / 18)+2;
        }else if (index <105){
            x = index % 18 + 1.5;
            y = Math.floor(index / 18)+2;
        }else if(index < 120){
            x = (index + 3)% 18 + 1.5;
            y = Math.floor((index + 3) / 18)+2;
        }else{
            x = 17;
            y = 6;
        }

        let x_ = x - 8.5;
        let y_= y - 4;

        node.style.transform = `translate(${x_*180}px,${y_*200}px)`;
        })
    };
})();
