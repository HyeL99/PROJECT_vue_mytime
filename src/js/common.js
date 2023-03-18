const $getToday = () => {
  const today = new Date();
  let yy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (mm < 10) mm = '0' + mm;
  if (dd < 10) dd = '0' + dd;
  return `${yy}-${mm}-${dd}`
}
const $getDayString = (date) => {
  let yy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  if (mm < 10) mm = '0' + mm;
  if (dd < 10) dd = '0' + dd;
  return `${yy}-${mm}-${dd}`
}
const $getDateAndTimeString = (date) => {
  let dateString = $getDayString(date);
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();

  if(hh < 10) hh = '0' + hh;
  if(mm < 10) mm = '0' + mm;
  if(ss < 10) ss = '0' + ss;

  console.log(dateString,hh,mm,ss);
  return `${dateString} ${hh}:${mm}:${ss}`;
}
const $getDay = (val) => {
  let dayList = ['일','월','화','수','목','금','토'];
  return dayList[new Date(val).getDay()];
}
const $getDateWithDay = (val) => {
  if(!val) return '';
  let dateArray = val.split('-');
  let day = $getDay(val);
  return `${dateArray[0]}.${dateArray[1]}.${dateArray[2]}(${day})`
}
const $getDDays = (day,array) => {
  let list = array;
  list.forEach(item => {
    let date = item.date;
    let gap = new Date(day).getTime() - new Date(date).getTime();
    gap = gap / (1000*60*60*24);
    // gap = gap < 0 ? -1 * Math.ceil(gap) + '일 남음' : Math.floor(gap) + '일 지남';
    // item.count = gap;
    // if(item.count === '0일 지남') item.count = '오늘'
    gap = gap < 0 ? Math.ceil(gap) : '+' + Math.floor(gap);
    item.count = 'D' + gap;
    if(item.count === 'D+0') item.count = 'D-day'
  });
  return list;
};

const $secToTime = (val) => {
  let sec = val;
  let hh = Math.floor(sec / (60 * 60));
  sec -= hh * 60 * 60;
  let mm = Math.floor(sec / 60);
  sec -= mm * 60;
  sec = Math.floor(sec);

  if(hh < 10) hh = '0' + hh;
  if(mm < 10) mm = '0' + mm;
  if(sec < 10) sec = '0' + sec;
  return `${hh}:${mm}:${sec}`;
}

export default {$getToday, $getDDays, $getDayString, $secToTime, $getDateWithDay, $getDateAndTimeString}
