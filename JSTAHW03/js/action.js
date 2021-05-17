let todayDate, currentDate;
let flags = { render_busy: false };
const monuthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Septemper",
  "October",
  "November",
  "December",
];
const dayOfWeek = 7;

window.onload = function () {
  todayDate = new Date();
  currentDate = new Date(todayDate.getFullYear(), todayDate.getMonth());
  console.log(currentDate);
  console.log(todayDate);

  let dates = CreateDates(todayDate.getFullYear(), todayDate.getMonth());
  //   console.log(dates);

  RenderCalendarDays(todayDate, dates, true);

  // register btnPrev click event
  document
    .querySelector(".calendar-btnPrev")
    .addEventListener("click", function () {
      currentDate.setMonth(currentDate.getMonth() - 1);

      RenderCalendarDays(
        new Date(currentDate.getFullYear(), currentDate.getMonth()),
        CreateDates(currentDate.getFullYear(), currentDate.getMonth()),
        false
      );
    });

  // register btnNext click event
  document
    .querySelector(".calendar-btnNext")
    .addEventListener("click", function () {
      currentDate.setMonth(currentDate.getMonth() + 1);

      RenderCalendarDays(
        new Date(currentDate.getFullYear(), currentDate.getMonth()),
        CreateDates(currentDate.getFullYear(), currentDate.getMonth()),
        true
      );
    });
};

function CreateDates(year, month) {
  // get the first day of the month
  let startDate = new Date(year, month);
  // get the last day of the month
  let endDate = new Date(year, month + 1, 0);
  // get the day of week at the first day
  let startDayOfWeek = startDate.getDay();

  let dayCount = startDayOfWeek + endDate.getDate() - startDate.getDate() + 1;

  let count = Math.floor(dayCount / dayOfWeek);
  count = dayCount % dayOfWeek === 0 ? count : count + 1;
  let loopCount = count * dayOfWeek;

  let dates = [];
  startDate.setDate(startDate.getDate() - startDayOfWeek);

  // generate dates
  for (let i = 0; i < loopCount; i++) {
    if (i !== 0) {
      startDate.setDate(startDate.getDate() + 1);
    }
    dates.push(new Date(startDate));
  }

  return dates;
}

function YMD_Equal(dateA, dateB) {
  // debugger;
  if (!YM_Equal(dateA, dateB)) {
    return false;
  }
  if (dateA.getDate() !== dateB.getDate()) {
    return false;
  }
  if (dateA.getDay() !== dateB.getDay()) {
    return false;
  }
  return true;
}

function YM_Equal(dateA, dateB) {
  if (dateA.getFullYear() !== dateB.getFullYear()) {
    return false;
  }
  if (dateA.getMonth() !== dateB.getMonth()) {
    return false;
  }

  return true;
}


function RenderCalendarDays(srcdate, srcdatelist, isIncrease) {
  let calendar = document.querySelector(".calendar");

  calendar.querySelector(".calendar-date :first-child").innerText = srcdate.getFullYear();
  calendar.querySelector(".calendar-date :last-child").innerText = monuthNames[srcdate.getMonth()];

  let calendardaysWrap = document.querySelector(".calendar-daysWrap");

  let existcalendarDays = calendardaysWrap.querySelector(".calendar-days");
  let calendarDays = CreateCalendardays(srcdate, srcdatelist);

  // calendarDays is not exist, add new calendardays 
  // calendarDays is exist,=> add new calendardays ,then remove previous calendarDays
  if (existcalendarDays === null) {
    calendardaysWrap.appendChild(calendarDays);
  } else {
    if (isIncrease) {
      existcalendarDays.style.cssText = "opacity:0; transform:translate(-100%,0); transition: .2s;";
      calendarDays.style.cssText = "opacity:1; transform:translate(100%,0);";
    } else {
      existcalendarDays.style.cssText = "opacity:0; transform:translate(100%,0); transition: .2s;";
      calendarDays.style.cssText = "opacity:1; transform:translate(-100%,0);";
    }
    calendardaysWrap.appendChild(calendarDays);
    setTimeout(() => {
      calendarDays.style.cssText = "opacity:1; transform:translate(0,0);";
      let calendardaysWrap = document.querySelector(".calendar-daysWrap");
      let calendarArray = calendardaysWrap.querySelectorAll(".calendar-days");
      if (calendarArray.length > 1) {
        calendardaysWrap.removeChild(calendarArray[0]);
      }
    }, 50);
  }
}

function CreateCalendardays(srcdate, srcdatelist) {
  let calendarDays = document.createElement("div");
  calendarDays.classList.add("calendar-days");

  let dayInfo = document.querySelector("#tpl-dayInfo");

  srcdatelist.forEach((item, index) => {
    let clonedayInfo = dayInfo.content.cloneNode(true);
    let dayinfo = clonedayInfo.querySelector(".dayInfo");
    // let daytitle = clonedayInfo.querySelector(".dayTitle");

    let istodayDate = YMD_Equal(item, todayDate);
    if (istodayDate) {
      dayinfo.classList.add("currentDay");
    }

    if (YM_Equal(item, srcdate)) {
      dayinfo.querySelector("span").innerText = item.getDate();
      if (istodayDate) {
        dayinfo.classList.add("intarget");
      }
    } else {
      dayinfo.querySelector("span").innerText = `${monuthNames[item.getMonth()]
        } ${item.getDate()}`;
      dayinfo.classList.add("outtarget");
    }
    calendarDays.appendChild(clonedayInfo);
  });

  return calendarDays;
}
