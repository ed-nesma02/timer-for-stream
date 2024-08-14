(async () => {
  try {
    const conf = await window.electronAPI.getJsonData();
    console.log('Received JSON data:', conf);

    const fontsList = [
      'Manrope',
      'Arial',
      'Impact',
      'Lucida Console',
      'Tahoma',
      'Times New Roman',
      'Calibri',
      'Georgia',
      'Verdana',
      'Roboto',
      'Montserrat',
    ];

    const tokenBtn = document.querySelector('.token-btn');
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
    const substrateRadius = document.getElementById('substrateRadius');
    const fontSize = document.getElementById('fontSize');
    const substrateWidth = document.getElementById('substrateWidth');
    const substrateHeight = document.getElementById('substrateHeight');
    const isFontBold = document.getElementById('isFontBold');
    const isFontItalic = document.getElementById('isFontItalic');
    const isShadowAddSec = document.getElementById('isShadowAddSec');
    const colorShadowAddSec = document.getElementById('colorShadowAddSec');
    const fontFamily = document.getElementById('fontFamily');
    const letterSpacing = document.getElementById('letterSpacing');

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
    substrateRadius.value = conf.substrateRadius;
    fontSize.value = conf.fontSize;
    substrateWidth.value = conf.substrateWidth;
    substrateHeight.value = conf.substrateHeight;
    isFontBold.checked = conf.isFontBold;
    isFontItalic.checked = conf.isFontItalic;
    isShadowAddSec.checked = conf.isShadowAddSec;
    colorShadowAddSec.value = conf.colorShadowAddSec;
    fontFamily.value = conf.fontFamily;
    letterSpacing.value = conf.letterSpacing;

    isGreenBackground.addEventListener('change', (e) => {
      electronAPI.updateIsGreenBackground(e.target.checked);
    });
    substrateColor.addEventListener('change', (e) => {
      electronAPI.updateSubstrateColor({
        color: e.target.value,
        isSubstrate: isSubstrate.checked,
      });
    });
    isSubstrate.addEventListener('change', (e) => {
      electronAPI.updateSubstrateColor({
        isSubstrate: e.target.checked,
        color: substrateColor.value,
      });
    });
    colorFont.addEventListener('change', (e) => {
      electronAPI.updateColorFont(e.target.value);
    });
    shadowColor.addEventListener('change', (e) => {
      electronAPI.updateShadowColor({
        color: e.target.value,
        isShadow: isShadow.checked,
      });
    });
    isShadow.addEventListener('change', (e) => {
      electronAPI.updateShadowColor({
        isShadow: e.target.checked,
        color: shadowColor.value,
      });
    });
    substrateRadius.addEventListener('change', (e) => {
      electronAPI.updateSubstrateRadius(e.target.value);
    });
    fontSize.addEventListener('change', (e) => {
      electronAPI.updateFontSize(e.target.value);
    });
    substrateWidth.addEventListener('change', (e) => {
      electronAPI.updateSubstrateWidth(e.target.value);
    });
    substrateHeight.addEventListener('change', (e) => {
      electronAPI.updateSubstrateHeight(e.target.value);
    });
    isFontBold.addEventListener('change', (e) => {
      electronAPI.updateIsFontBold(e.target.checked);
    });
    isFontItalic.addEventListener('change', (e) => {
      electronAPI.updateIsFontItalic(e.target.checked);
    });
    colorFontAddSec.addEventListener('change', (e) => {
      electronAPI.updateColorFontAddSec(e.target.value);
    });
    colorShadowAddSec.addEventListener('change', (e) => {
      electronAPI.updateColorShadowAddSec({
        color: e.target.value,
        isShadow: isShadowAddSec.checked,
      });
    });
    isShadowAddSec.addEventListener('change', (e) => {
      electronAPI.updateColorShadowAddSec({
        isShadow: e.target.checked,
        color: colorShadowAddSec.value,
      });
    });

    letterSpacing.addEventListener('change', (e) => {
      electronAPI.updateLetterSpacing(e.target.value);
    });

    const createSelect = () => {
      for (let i = 0; i < fontsList.length; i++) {
        const option = document.createElement('option');
        option.value = fontsList[i];
        option.text = fontsList[i];
        if (conf.fontFamily === fontsList[i]) option.selected = true;
        fontFamily.add(option);
      }
    };
    createSelect();

    fontFamily.addEventListener('change', (e) => {
      console.log(e.target.value);
      electronAPI.updateFontFamily(e.target.value);
    });

    tokenBtn.addEventListener('click', () => {
      if (donationAlertsToken.type === 'text') {
        donationAlertsToken.type = 'password';
        tokenBtn.textContent = 'Показать';
      } else {
        donationAlertsToken.type = 'text';
        tokenBtn.textContent = 'Скрыть';
      }
    });

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
      dataJson.isFontBold = dataJson.isFontBold ? true : false;
      dataJson.isFontItalic = dataJson.isFontItalic ? true : false;
      dataJson.isShadowAddSec = dataJson.isShadowAddSec ? true : false;
      electronAPI.saveConfRestart(dataJson);
    });
  } catch (err) {
    console.error('Error fetching JSON data:', err);
  }
})();
