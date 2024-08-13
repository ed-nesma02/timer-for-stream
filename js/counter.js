const main = async () => {
  const settings = await window.electronAPI.getJsonData();
  console.log('Received JSON data settings:', settings);

  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE' && e.ctrlKey) {
      window.electronAPI.isOpenConf(true);
    }
  });

  electronAPI.onUpdateCounter((sec) => {
    addTime(endingTime, sec);
  });

  const timeText = document.getElementById('timeText');
  const pauseIconElement = document.getElementById('pauseIcon');

  let endingTime = new Date(Date.now());
  let startTime = new Date(Date.now());
  let pauseTime = 0;
  const resetTime = () => {
    endingTime = new Date(new Date(Date.now()) - pauseTime);
    endingTime = timeFunc.addHours(endingTime, +settings.initialHours);
    endingTime = timeFunc.addMinutes(endingTime, +settings.initialMinutes);
    endingTime = timeFunc.addSeconds(endingTime, +settings.initialSeconds);
  };

  resetTime();

  if (settings.isGreenBackground) {
    document.body.style.backgroundColor = '#00ff00';
  }

  let countdownEnded = false;
  let users = [];
  let time;

  let isPause = true;

  let prevPauseDate = new Date(Date.now());

  const getNextTime = () => {
    const now = new Date(Date.now());
    if (isPause && prevPauseDate) {
      const cur = now;
      pauseTime += now - prevPauseDate;
      prevPauseDate = cur;
    }

    let currentTime = now - pauseTime;
    let differenceTime = endingTime - currentTime;

    time = `${timeFunc.getHours(differenceTime)}:${timeFunc.getMinutes(
      differenceTime
    )}:${timeFunc.getSeconds(differenceTime)}`;
    if (differenceTime <= 0) {
      if (canIncreaseTimeAfterStop) {
        endingTime = new Date(currentTime);
      } else {
        clearInterval(countdownUpdater);
        countdownEnded = true;
      }
      time = '00:00:00';
    }
    timeText.innerText = time;

    requestAnimationFrame(getNextTime);
  };

  requestAnimationFrame(getNextTime);

  const addTime = async (time, s) => {
    endingTime = timeFunc.addSeconds(time, s);
    let addedTime = document.createElement('p');
    addedTime.classList = 'addedTime';
    addedTime.innerText = `${s > 0 ? '+' : ''}${s}s`;
    document.body.appendChild(addedTime);
    addedTime.style.display = 'block';
    await sleep(50);
    addedTime.style.left = `${randomInRange(35, 65)}%`;
    addedTime.style.top = `${randomInRange(15, 40)}%`;
    addedTime.style.opacity = '1';
    await sleep(2500);
    addedTime.style.opacity = '0';
    await sleep(500);
    addedTime.remove();
  };

  const testAddTime = (times, delay) => {
    let addTimeInterval = setInterval(async () => {
      if (times > 0) {
        await sleep(randomInRange(50, delay - 50));
        addTime(endingTime, 30);
        --times;
      } else {
        clearInterval(addTimeInterval);
      }
    }, delay);
  };

  document.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowUp':
        addTime(endingTime, +settings.timeIncrease * 60);
        return;
      case 'ArrowDown':
        addTime(endingTime, -(+settings.timeDecrease * 60));
        return;
      case 'KeyR':
        resetTime();
        return;
      case 'Space':
        prevPauseDate = isPause ? null : new Date(Date.now());
        pauseIconElement.style.display = isPause ? 'none' : 'block';
        isPause = !isPause;
        if (isPause) {
          const timeCounter = document
            .getElementById('timeText')
            .innerText.split(':');

          const newSettings = Object.assign({}, settings);
          newSettings.initialHours = parseInt(timeCounter[0]);
          newSettings.initialMinutes = parseInt(timeCounter[1]);
          newSettings.initialSeconds = parseInt(timeCounter[2]);
          console.log(newSettings);
          window.electronAPI.saveConf(newSettings);
        }

        return;
    }
  });
};

main();
