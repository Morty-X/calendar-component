// 第一步，以当前年月 2024年12月为例，制作一个卡片
// 将它渲染到日历组件中

//1.获取当前月份有多少天(以实际生活为准)
function getCurrentMonthCount(year, month) {
  // 返回下个月的第0天，就是这个月的最后一天，也就
  // 知道了这个月有多少天
  let date = new Date(year, month, 0);
  return date.getDate();
}
//2.返回当前月的第一天是周几
function getFirstDayOfWeek(year, month) {
  let date = new Date(year, month - 1, 1);
  // 返回一个具体日期中一周的第几天，0 表示星期天
  return date.getDay();
}

const A_WEEK_DAY = 7;
const CURRENT = "current";
const PREV = "previous";
const NEXT = "next";
let todayDate = new Date();
let todayYear = todayDate.getFullYear();
let todayMonth = todayDate.getMonth() + 1;
let todayDay = todayDate.getDate();

let nowDate = new Date();
let currentYear = nowDate.getFullYear();
let currentMonth = nowDate.getMonth() + 1;
let calendarRoot = document.querySelector(".calendar");
let calendarHeadTitle = document.querySelector(".calendar-head-title");
let mainBody = document.querySelector(".calendar-main-body");
calendarRoot.style.setProperty("--month", `'${currentMonth}'`);

// 创建日期节点碎片,按照从 start 至 end的顺序创建
// 因为 有上个月和下个月的补丁，样式不一样，所以分3种情况
// 创建并赋予不同的样式
function createDateCellFragment(start, end, type) {
  let fragement = document.createDocumentFragment();
  for (let i = start; i <= end; i++) {
    let divNode = document.createElement("DIV");
    divNode.innerHTML = i;
    switch (type) {
      case "previous":
        divNode.classList.add("date-disable");
        break;
      case "current":
        divNode.classList.add("date-baseStyle");
        divNode.customDateInfo = {
          year: currentYear,
          month: currentMonth,
          day: i,
        };
        let divDateInfo = divNode.customDateInfo;
        let flag =
          divDateInfo.year === todayYear &&
          divDateInfo.month === todayMonth &&
          divDateInfo.day === todayDay;
        if (flag) {
          divNode.classList.add("today");
        }
        break;
      case "next":
        divNode.classList.add("date-disable");
        break;
    }
    fragement.appendChild(divNode);
  }
  return fragement;
}

function createCalendar(year, month) {
  // 当前月份的总天数
  let currentMonthCount = getCurrentMonthCount(year, month);
  //   上个月的总天数
  let previousMonthCount = getCurrentMonthCount(year, month - 1);
  // 获取上一个月的补丁数(即当月第一天是周几就补几个，当然这是在JS中运算的)
  let previousMonthPadding = getFirstDayOfWeek(year, month);
  //获取下一个月的补丁
  let nextMonthPadding =
    A_WEEK_DAY - ((currentMonthCount + previousMonthPadding) % 7);
  if (nextMonthPadding === 7) nextMonthPadding = 0;

  let prevoiusMonthStart = previousMonthCount - previousMonthPadding + 1;
  // 创建上个月补丁的单元格碎片
  let previousMonthPaddingCell = createDateCellFragment(
    prevoiusMonthStart,
    previousMonthCount,
    PREV
  );
  // 创建当前月的单元格碎片
  let currentMonthPaddingCell = createDateCellFragment(
    1,
    currentMonthCount,
    CURRENT
  );
  //  创建下个月补丁的单元格碎片
  let nextMonthPaddingCell = createDateCellFragment(1, nextMonthPadding, NEXT);
  let fragement = document.createDocumentFragment();
  fragement.appendChild(previousMonthPaddingCell);
  fragement.appendChild(currentMonthPaddingCell);
  fragement.appendChild(nextMonthPaddingCell);
  // 在插入之前先清空
  mainBody.innerHTML = "";
  mainBody.appendChild(fragement);
  return [
    currentMonthCount,
    previousMonthCount,
    previousMonthPadding,
    nextMonthPadding,
  ];
}

// 处理点击上一个月和下一个月箭头后 日历更新问题
function bindEvent() {
  let dateInstance = new Date(currentYear, currentMonth - 1);
  calendarRoot.addEventListener("click", function (e) {
    //创建一个Date对象，每次点击就更新这个对象的月份，而年份
    //的话该对象会自动处理
    if (e.target.className === "calendar-head-left-arrow") {
      dateInstance.setMonth(dateInstance.getMonth() - 1);
      console.log(dateInstance.toLocaleDateString());
      let newYear = dateInstance.getFullYear();
      let newMonth = dateInstance.getMonth() + 1;
      // 一定要先更新再创建！！
      updateCalendarYearMonth(newYear, newMonth);
      createCalendar(newYear, newMonth);
    } else if (e.target.className === "calendar-head-right-arrow") {
      // 下一月
      dateInstance.setMonth(dateInstance.getMonth() + 1);
      console.log(dateInstance.toLocaleDateString());
      let newYear = dateInstance.getFullYear();
      let newMonth = dateInstance.getMonth() + 1;
      // 一定要先更新再创建！！
      updateCalendarYearMonth(newYear, newMonth);
      createCalendar(newYear, newMonth);
    }
  });
}
bindEvent();
// 更新日历年和月的方法
function updateCalendarYearMonth(newYear, newMonth) {
  calendarHeadTitle.innerHTML = `${newYear} 年 ${newMonth}月`;
  calendarRoot.style.setProperty("--month", `'${newMonth}'`);
  currentYear = newYear;
  currentMonth = newMonth;
}
createCalendar(currentYear, currentMonth);
