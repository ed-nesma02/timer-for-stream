const main = async () => {
  const settings = await window.electronAPI.getJsonData();
  console.log('Received JSON data settings:', settings);

  const timer = document.getElementById('timeText');
  const cotnainer = document.getElementById('container');

  document.body.style.backgroundColor = settings.isGreenBackground
    ? '#00ff00'
    : '#f7fff7';
  timer.style.fontSize = settings.fontSize + 'px';
  timer.style.color = settings.colorFont;
  timer.style.fontWeight = settings.isFontBold ? '700' : '400';
  timer.style.fontStyle = settings.isFontItalic ? 'italic' : '';

  cotnainer.style.backgroundColor = settings.isSubstrate
    ? settings.substrateColor
    : 'transparent';
  cotnainer.style.borderRadius = settings.substrateRadius + 'px';
  cotnainer.style.boxShadow = settings.isShadow
    ? `0 0 1.25rem 0.5rem` + settings.shadowColor + '33'
    : 'none';
  cotnainer.style.width = settings.substrateWidth + 'px';
  cotnainer.style.height = settings.substrateHeight + 'px';
  document.documentElement.style.setProperty(
    '--color-add-time',
    settings.colorFontAddSec
  );
  document.documentElement.style.setProperty(
    '--shadow-color-add-time',
    settings.colorShadowAddSec + '33'
  );

  electronAPI.onUpdateIsGreenBackground((arg) => {
    document.body.style.backgroundColor = arg ? '#00ff00' : '#f7fff7';
  });
  electronAPI.onUpdateSubstrateColor(({color, isSubstrate}) => {
    console.log({color, isSubstrate});
    cotnainer.style.backgroundColor = isSubstrate ? color : 'transparent';
  });
  electronAPI.onUpdateShadowColor(({color, isShadow}) => {
    cotnainer.style.boxShadow = isShadow
      ? `0 0 1.25rem 0.5rem` + color + '33'
      : 'none';
  });
  electronAPI.onUpdateSubstrateWidth((arg) => {
    cotnainer.style.width = arg + 'px';
  });
  electronAPI.onUpdateSubstrateHeight((arg) => {
    cotnainer.style.height = arg + 'px';
  });
  electronAPI.onUpdateSubstrateRadius((arg) => {
    cotnainer.style.borderRadius = arg + 'px';
  });
  electronAPI.onUpdateColorFont((arg) => {
    timer.style.color = arg;
  });
  electronAPI.onUpdateFontSize((arg) => {
    timer.style.fontSize = arg + 'px';
  });
  electronAPI.onUpdateIsFontBold((arg) => {
    timer.style.fontWeight = arg ? '700' : '400';
  });
  electronAPI.onUpdateIsFontItalic((arg) => {
    timer.style.fontStyle = arg ? 'italic' : '';
  });

  electronAPI.onUpdateColorFontAddSec((arg) => {
    document.documentElement.style.setProperty('--color-add-time', arg);
  });
  electronAPI.onUpdateColorShadowAddSec(({color, isShadow}) => {
    document.documentElement.style.setProperty(
      '--shadow-color-add-time',
      isShadow ? color + '33' : 'transparent'
    );
  });

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
