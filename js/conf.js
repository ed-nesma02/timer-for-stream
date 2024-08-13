(async () => {
  try {
    const conf = await window.electronAPI.getJsonData();
    console.log('Received JSON data:', conf);

    const setButton = document.querySelector('.save-conf');
    const form = document.getElementById('config');

    const initialHours = document.getElementById('initialHours');
    const initialMinutes = document.getElementById('initialMinutes');
    const initialSeconds = document.getElementById('initialSeconds');
    const secondsAddedPerCurrency = document.getElementById(
      'secondsAddedPerCurrency'
    );
    const donationAlertsToken = document.getElementById('donationAlertsToken');
    const isGreenBackground = document.getElementById('isGreenBackground');
    const timeIncrease = document.getElementById('timeIncrease');
    const timeDecrease = document.getElementById('timeDecrease');
    const substrateColor = document.getElementById('substrateColor');
    const isSubstrate = document.getElementById('isSubstrate');
    const colorFont = document.getElementById('colorFont');
    const colorFontAddSec = document.getElementById('colorFontAddSec');
    const shadowColor = document.getElementById('shadowColor');
    const isShadow = document.getElementById('isShadow');

    initialHours.value = conf.initialHours;
    initialMinutes.value = conf.initialMinutes;
    initialSeconds.value = conf.initialSeconds;
    secondsAddedPerCurrency.value = conf.secondsAddedPerCurrency;
    donationAlertsToken.value = conf.donationAlertsToken;
    isGreenBackground.checked = conf.isGreenBackground;
    timeIncrease.value = +conf.timeIncrease;
    timeDecrease.value = +conf.timeDecrease;
    substrateColor.value = conf.substrateColor;
    isSubstrate.checked = conf.isSubstrate;
    colorFont.value = conf.colorFont;
    colorFontAddSec.value = conf.colorFontAddSec;
    shadowColor.value = conf.shadowColor;
    isShadow.checked = conf.isShadow;
    console.log('isShadow: ', isShadow);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const dataJson = Object.fromEntries(data);
      dataJson.secondsAddedPerCurrency = +dataJson.secondsAddedPerCurrency;
      dataJson.timeIncrease = +dataJson.timeIncrease;
      dataJson.timeDecrease = +dataJson.timeDecrease;
      dataJson.isGreenBackground = dataJson.isGreenBackground ? true : false;
      dataJson.isSubstrate = dataJson.isSubstrate ? true : false;
      dataJson.isShadow = dataJson.isShadow ? true : false;
      electronAPI.saveConfRestart(dataJson);
    });
  } catch (err) {
    console.error('Error fetching JSON data:', err);
  }
})();
