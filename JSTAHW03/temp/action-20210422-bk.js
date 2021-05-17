let todayDate, currentDate;
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

  RenderCalendar(todayDate, dates, true);

  // register btnPrev click event
  document
    .querySelector(".calendar-btnPrev")
    .addEventListener("click", function () {
      currentDate.setMonth(currentDate.getMonth() - 1);

      RenderCalendar(
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

      RenderCalendar(
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


function RenderCalendar(srcdate, srcdatelist, isIncrease) {
  let calendar = document.querySelector(".calendar");

  calendar.querySelector(".calendar-date :first-child").innerText = srcdate.getFullYear();
  calendar.querySelector(".calendar-date :last-child").innerText = monuthNames[srcdate.getMonth()];

  let calendardaysWrap = document.querySelector(".calendar-daysWrap");

  let existcalendarDays = document.querySelector(".calendar-days");
  let calendarDays = CreateCalendardays(srcdate, srcdatelist);

  
  if (existcalendarDays === null) {
    calendardaysWrap.appendChild(calendarDays);
  } else {
    let direction;

    // existcalendarDays.parentNode.removeChild(existcalendarDays);
    // console.log(calendarDays);
    // calendardaysWrap.appendChild(calendarDays);
    calendarDays.style.cssText = "opacity:1; transform:translate(-100%,0);";
    existcalendarDays.style.cssText =
      "opacity:1; transform:translate(100%,0); transition: .2s;";
    calendardaysWrap.appendChild(calendarDays);
    // calendarDays.style.cssText =
    //   "opacity:1; transform:translate(0,0) transition:10s;";
    existcalendarDays.parentNode.removeChild(existcalendarDays);

    //     setTimeout(() => {
    //       console.log(existcalendarDays.parentNode);
    //       console.log(calendarDays);

    //       // calendarDays.style.cssText ="opacity:1; transform:translate(0,0) transition:10s;";
    //       calendarDays.style.cssText =
    //         "opacity:1; transform:translate(0,0); transition:.2s;";

    //       if (existcalendarDays !== null) {
    //         setTimeout(function () {
    //           console.log(existcalendarDays.parentNode);
    //           console.log(existcalendarDays);

    //           existcalendarDays.parentNode.removeChild(existcalendarDays);
    //         }, 1000);
    //       } else {
    //         console.log("null null");
    //       }
    //     }, 10);

    //     // console.log(calendarDays);

    //     // console.log(calendarDays);
  }

  //   console.log(calendarDays);
  //   setTimeout(() => {
  //     // console.log(calendarDays);

  //     existcalendarDays.style.cssText = "opacity:0; transition: all 200ms";
  //     calendarDays.style.cssText = "opacity:1; transform:translate(50px,0);";
  //     setTimeout(() => {
  //       calendarDays.style.cssText =
  //         "opacity:1; transform:translate(0,0);transition: all 200ms;";

  //       setTimeout(() => {
  //         existcalendarDays.parentNode.removeChild(existcalendarDays);
  //       }, 200);
  //     });
  //   }, 200);

  // setTimeout(function (existcalendarDays,calendarDays) {
  //     console.log(calendarDays);
  //     console.log(existcalendarDays);
  //     existcalendarDays.style.cssText = "opacity:0; transition: all 1000ms";
  //     calendarDays.style.cssText = "opacity:1; transition: all 1000ms";
  // }, 5000);
  // console.log(calendarDays);

  // calendardaysWrap.appendChild(CreateCalendardays(targetDate, srcdates));
  // calendardaysWrap.appendChild(CreateCalendardays(targetDate, srcdates));
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
