(async () => {
  const conf = await window.electronAPI.getJsonData();
  console.log('Received JSON data DA:', conf);

  const DA_CENTRIFUGE_URL =
    'wss://centrifugo.donationalerts.com/connection/websocket';
  const DA_SUBSCRIBE_URL =
    'https://www.donationalerts.com/api/v1/centrifuge/subscribe';
  const RECONNECTION_DELAY_MIN = 1000;
  const RECONNECTION_DELAY_MAX = 5000;

  if (conf.donationAlertsToken !== '') {
    const config = {
      socket: 'wss://socket.donationalerts.ru',
      socketPort: '443',
      type: 'alert_widget',
    };

    const donationalerts = io(`${config.socket}:${config.socketPort}`);
    donationalerts.emit('add-user', {
      token: conf.donationAlertsToken,
      type: config.type,
    });
    donationalerts.on('donation', (donate) => {
      donate = JSON.parse(donate);
      console.log(donate);
      if (donate.alert_type == '1') {
        const {amount_main} = donate;
        window.electronAPI.updateCounter(
          amount_main * (3600 / +conf.secondsAddedPerCurrency)
        );
        // addTime(
        //   endingTime,
        //   amount_main * (3600 / +conf.secondsAddedPerCurrency)
        // );
      }
    });
  }
})();
