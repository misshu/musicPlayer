window.onload = function () {
    let audioPlayer = document.querySelector('#audio-player');//audio标签
    let songName = document.querySelector('.song-name');//歌名标签
    let singer = document.querySelector('.singer');//歌手标签
    let basebar = document.querySelector('.basebar');//进度条外层div
    let progressBar = document.querySelector('.progressbar');//进度条长度
    let progressBtn = document.querySelector('.progress-btn');//进度条按钮
    let musicPhoto = document.querySelector('.photo');//专辑图片外层div
    let photoImg = document.querySelector('.photo img');//专辑图片
    let freeButton = document.querySelector('.freebutton');//随机播放按钮标签
    let preButton = document.querySelector('.prebutton');//上一首按钮
    let cutover = document.querySelector('.cutover');//播放、暂停切换按钮
    let nextButton = document.querySelector('.nextbutton');//下一首按钮
    let loopButton = document.querySelector('.loopbutton');//循环播放按钮
    let timeCurrent = document.querySelector('.time-current');//显示歌曲播放时长 
    let timeTotal = document.querySelector('.time-total');//歌曲总时长
   
    var num = 1; //用于判断是否播放，首次进入不自动播放
    
    //为播放按钮添加事件
    cutover.onclick = function () {
        audioPlayer.onplaying = null; //清除audio标签绑定事件
        if(audioPlayer.paused){
            cutover.style.backgroundImage = 'url(./img/cutover.png)';
            audioPlayer.play();
        }else{
            cutover.style.backgroundImage = 'url(./img/zanting.png)';
            audioPlayer.pause();
        }
    }
    //获取歌曲总时长
    audioPlayer.addEventListener('canplay', function () {
        timeTotal.innerHTML = rounding(audioPlayer.duration);
    })
    //下一首按钮
    nextButton.onclick = function () {
        getMusic();
    }
    var isloading = false;
    var progressTimer = setInterval(activeProgressBar,300);

    //激活进度条
    function activeProgressBar () {
        let percentNum = Math.floor((audioPlayer.currentTime / audioPlayer.duration)*10000)/100 + '%';
        progressBar.style.width = percentNum;
        progressBtn.style.left = percentNum;
        timeCurrent.innerHTML = rounding(audioPlayer.currentTime);
        if(percentNum == '100%' && !isloading && audioPlayer.loop){
            isloading = true;
            getMusic();        
        }
        if(audioPlayer.paused){
            cutover.style.backgroundImage = 'url(./img/zanting.png)';
            return;
        }else{
            cutover.style.backgroundImage = 'url(./img/cutover.png)';
        }
    }

    //进度条控制音乐播放进度
    progressBtn.addEventListener('touchstart', function () {
        clearInterval(progressTimer);
    })
    progressBtn.addEventListener('touchmove', function (e) {
        let percentNum = (e.targetTouches[0].pageX - progressBar.offsetLeft)/progressBar.offsetWidth;
        if(percentNum > 1){
            percentNum = 1
        }else if(percentNum < 0){
            percentNum = 0
        }
        this.style.left = percentNum * 100 + '%';
        progress.style.width = percentNum * 100 + '%';
    })
    progressBtn.addEventListener('touchend', function (e) {
        let percentNum = (e.changedTouches[0].pageX - progressBar.offsetLeft)/progressBar.offsetWidth;
        audioPlayer.currentTime = audioPlayer.duration * percentNum;
        progressTimer = setInterval(activeProgressBar, 300);
    })
    
    //获取音乐
    function getMusic () {
        ajax({
            method: 'GET',
            url: 'http://api.jirengu.com/fm/getSong.php',
            success: function(response){
                let jsonObj = JSON.parse(response);
                let songObj = jsonObj['song'][0];
                songName.innerHTML = songObj.title;
                singer.innerHTML = songObj.artist;
                photoImg.src = songObj.picture;
                audioPlayer.src = songObj.url;
                audioPlayer.setAttribute('data-sid', songObj.sid);
                audioPlayer.setAttribute('data-ssid', songObj.ssid);
                audioPlayer.play();
                isloading = false;
                if (num === 1){
                    audioPlayer.onplaying = function (){
                      this.pause();
                      audioPlayer.onplaying = null;
                    };
                    num ++;
                }
            }
        })
    }
    //循环
    loopButton.onclick = function (){
        let status = audioPlayer.dataset.staus;
        if(status === 'loop'){
            audioPlayer.loop = false;
            loopButton.style.backgroundImage = 'url(./img/btn_loop_d.png)';
        }else{
            audioPlayer.loop = true;
            loopButton.style.backgroundImage = 'url(./img/btn_loop.png)';
        }
    }
    //时间格式化
   function rounding(t){
    let m = Math.floor(t/60);
    let s = Math.floor(t%60);
    if(m <= 9){
        m = '0' + m;
    }
    if(s <= 9){
        s = '0' + s;
    }
    return m + ':' +s;
}

}
