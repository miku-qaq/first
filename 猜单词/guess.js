//玩家类
class player{
    constructor(id,healthComponent,pointComponent1,pointComponent2,backgroudComponent,outputComponent){
        //血量
        this.health = 0;
        //小回合胜场数
        this.winCount = 0;
        //当前技能 0为无技能
        this.skill = 0;
        //玩家id 区分玩家1和玩家2
        this.id = id;
        //玩家的html血量显示组件
        this.healthComponent = healthComponent;
        //玩家的小绿花显示组件
        this.pointComponent1 = pointComponent1;
        this.pointComponent2 = pointComponent2;
        //玩家背景组件
        this.backgroudComponent = backgroudComponent;
        //玩家输入框组件
        this.outputComponent = outputComponent;
    }

    //html玩家血量刷新
    htmlHealthRefresh(){
        this.healthComponent.innerHTML = this.health;
    }

    //玩家小回合胜场加1 戴小绿花 并判断是否已赢2回合游戏结束
    getOnePoint(){
        this.winCount++;
        if(this.winCount==1)
            this.pointComponent1.style.backgroundColor="green";
        else if(this.winCount==2){
                this.pointComponent2.style.backgroundColor="green";
                setTimeout(system.bigWin,2000);
            }
    }

    //玩家受伤
    getHurt(){
        this.health--;
        this.htmlHealthRefresh(); 
        //判断本回合玩家是否死亡
        if(this.health == 0){
            //玩家死亡 小回合结束 系统处理
            system.over();
        }
        else {
            //玩家没死 交换次序 背景刷新
            system.exchange();
            system.refreshBackground();
        }
    }

    //发动当前技能
    useSkill(){
        switch(this.skill){
            case 1: system.skill1();
                    break;
            case 2: system.skill2();
                    break;
        }
        this.skillCancel();
    }

    //技能发动完后 取消技能函数
    skillCancel(){
        this.skill = 0; 
        document.getElementById("skill"+this.id).innerHTML="无技能";
    }
}

//系统类对两玩家进行处理
class System{
    constructor(show){
        //词典
        this.wordlist=['kobe','manbo','man','kunkun','laodi','dafen','laoda','dabian','manba','zhiyin'];
        //技能库
        this.skillname=['显示','排除'];
        //谁的回合
        this.turn = 1;
        //当前是否能输入
        this.canInput = true;
        //当前单词状态展示组件
        this.show = show;
        //当前抽出的单词
        this.word = '';
        //当前出的单词状态
        this.g='';
    }

    //单词抽完刷新工作
    choose(){      
        //抽单词
        var x = Math.floor(Math.random() * this.wordlist.length);       
        this.word = this.wordlist[x];
        //玩家血量重设刷新
        player1.health=this.word.length;
        player1.htmlHealthRefresh();
        player2.health=this.word.length;
        player2.htmlHealthRefresh();
        //单词显示初始化刷新
        this.g = '-'.repeat(this.word.length);
        this.show.innerHTML = this.g;
        this.canInput = true;
        //根据顺序 玩家背景刷新
        this.refreshBackground();
    }

    //根据当前turn 刷新背景
    refreshBackground(){
        if(this.turn == 1){
            player1.backgroudComponent.style.backgroundColor = "pink";
            player2.backgroudComponent.style.backgroundColor = "white";
        }
        else{
            player1.backgroudComponent.style.backgroundColor = "white";
            player2.backgroudComponent.style.backgroundColor = "pink";
        }
    }
    
    //根据turn 对应玩家输入展示
    inputShow(input){
        switch(this.turn){
            case 1: player1.outputComponent.innerHTML = input;
                    break;
            case 2: player2.outputComponent.innerHTML = input;
                    break;
        }
    }

    //一小回合结束处理
    lttleWin(){
        //系统根据turn判断谁赢并得一分
        switch(this.turn){
            case 1: player1.getOnePoint();
                    break;
            case 2: player2.getOnePoint();
                    break;
        }
        //小回合败者抽技能
        this.exchange();
        this.chooseSkill();
        //静止输入 播放小绿花动画 过2秒开下一小回合
        this.canInput = false;
        //过两秒抽单词 重开一局
        setTimeout("system.choose()",2000);
    }

    //交换顺序
    exchange(){
        if(this.turn == 1){
            this.turn = 2;
        }
        else if(this.turn == 2){
            this.turn = 1;
        } 
    }

    //根据turn 给玩家抽技能
    chooseSkill(){
        //产生1 2随机下标
        var a = Math.floor(Math.random() * 2) + 1;
        if(this.turn == 1){
            //更改技能状态
            player1.skill = a;
            //更改技能按钮显示文本
            document.getElementById("skill1").innerHTML = this.skillname[a-1];
        }
        else if(this.turn == 2){
            player2.skill=a;
            document.getElementById("skill2").innerHTML = this.skillname[a-1];
        }
    }

    //技能1
    skill1(){
        var arr = new Array() , k = 0;
        if(this.g.includes('-'))
        {
            //未猜出 可抽出的字母塞入数组
            for(var i = 0 ; i < this.word.length ; i++)
            {
                if(this.g[i] == "-")
                    arr[k++]=i;
            }
            //利用随机数抽出字母
            var a = arr[Math.floor(Math.random() * k)];
            //修改
            for(var i in this.word){
                if(this.word[a] == this.word[i])
                {
                    this.g = this.g.substring(0,i) + this.word[a] + this.g.substring(parseInt(i)+1);
                }
            }
            this.show.innerHTML = this.g;
            //判断单词是否猜完
            if(!this.g.includes('-'))
                //猜完 小回合结束
                this.lttleWin();
            else{
                //未猜完 交换顺序 刷新背景
                this.exchange();
                this.refreshBackground();
            }
        }
    }

    //技能2
    skill2(){
        //随机抽一个字母 知道本回合的单词不含抽出的字母
        var s="abcdefghijklmnopqrstuvwxyz";
        var n=s[Math.floor(Math.random()*26)];
        while(this.word.includes(n))
        {
            var n=s[Math.floor(Math.random()*26)];
        }
        //弹出提示
        alert(n + "字母是错误的");
    }

    //猜错 系统根据turn 让玩家掉血
    fault(){              
        if(this.turn == 1){
            player1.getHurt();
        }
        else if(this.turn == 2){
            player2.getHurt();
        }
    }

    //玩家死亡处理
    over(){           
        //对方得一分
        switch(this.turn){
            case 1: player2.getOnePoint();
                    break;
            case 2: player1.getOnePoint();
                    break;
        }
        this.canInput=false;
        this.chooseSkill();
        setTimeout("system.choose()",2000);
    }

    //整个游戏结束处理
    bigWin(){
        document.write("<div style=\"position: fixed;width: 100%;height: 100%;background-color: rgb(215, 232, 232);top: 0px;left: 0px;display: flex;align-items: center;justify-content: center;\"><div style=\"width: 700px;height: 300px;box-sizing: border-box;background-color: aliceblue;padding: 20px;display: flex;justify-content: center;align-items: center;border-radius: 18px;box-shadow: 3px 3px 30px  red;\"><span id=\"playwin\" style=\"font-size: xx-large;\">你过关！</span></div></div>");
        if(player1.winCount>player2.winCount)
            document.getElementById("playwin").innerHTML="player" + 1 + " Win!";
        else
            document.getElementById("playwin").innerHTML="player" + 2 + " Win!";
    }

}

//两个玩家对象
var player1,player2;
//系统对象
var system;

// html加载完后 js执行初始化函数
function init(){
    //玩家，系统初始化
    var bg1 = document.getElementById("bg1");
    var bg2 = document.getElementById("bg2");
    var show =  document.getElementById("meme");
    var health1 = document.getElementById("health1");
    var health2 = document.getElementById("health2");
    var bt1 = document.getElementById("bt1");
    var bt2 = document.getElementById("bt2");
    var bt3 = document.getElementById("bt3");
    var bt4 = document.getElementById("bt4");
    var output1 = document.getElementById("content1");
    var output2 = document.getElementById("content2");

    player1 = new player(1,health1,bt1,bt2,bg1,output1);
    player2 = new player(2,health2,bt3,bt4,bg2,output2);
    system = new System(show);

    //抽单词 初始设置
    system.choose();

    //输入处理设置
    window.onkeydown = function(ev){
        //键入的小写字母为input
        var input = String.fromCharCode(ev.keyCode).toLowerCase();
        //检测是否为字母和能够输入
        if(/[a-z]/.test(input) && system.canInput)
            {
                //输入显示
                system.inputShow(input);
                //判断是否猜中且无重复猜中
                if(system.word.includes(input) && !system.g.includes(input))         
                {
                    //猜中
                    //当前单词循环修改
                    for(var i in system.word){
                            if(input == system.word[i])   //修改
                            {
                                system.g = system.g.substring(0,i) + input + system.g.substring(parseInt(i)+1);
                            }
                    }
                    //单词显示刷新
                    system.show.innerHTML = system.g;
                    //判断单词是否全猜完
                    if(!system.g.includes('-'))
                        //猜完 小回合结束
                        system.lttleWin();
                    else{
                        //未猜完 交换次序
                        system.exchange();
                        system.refreshBackground();
                    }
                }
                //没猜中
                else{
                    system.fault();
                }
            }
    }
}

// player1技能按钮绑定的回调函数
function bid1(){
    if(system.turn == 1)
        player1.useSkill(); 
}

// player2技能按钮绑定的回调函数
function bid2(){
    if(system.turn == 2)
        player2.useSkill();
}
