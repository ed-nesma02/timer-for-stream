// Login Data
var twitch_channel_name = ""
var streamlabs_token = ""
var streamelements_token = ""
var streamloots_token = ""
var donationAlertsToken = "EuX6RNPcdOQx4v5VNupW"

// Initial Counter Config
var initialHours = 5
var initialMinutes = 0
var initialSeconds = 0

// If this option true - time can be added after reaching "00:00:00", if it false - timer will stop forever after reaching "00:00:00" once
var canIncreaseTimeAfterStop = false;

var isGreenBackground = true;

// Counter controls (in seconds)
var timeIncrease = 10 * 60 // 10 min
var timeDecrease = 10 * 60 // 10 min

// Donation alerts
// This value will be multiplied by donation amount
// Donation is converted automatically to the MAIN donation alerts account currency
var secondsAddedPerCurrency = 1 / 10; // 100 rubles (if account store money in rubles) adds 10 sec
