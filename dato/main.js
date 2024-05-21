// Setup date conversion
date.valueAsDate = new Date();
calculate_dates();
date.onchange = function () {
  calculate_dates();
};

// Setup time zones
time.value = new Date().toISOString().substring(11, 16);
calculate_times();
time.onchange = function () {
  calculate_times();
};

function calculate_times() {
  let city_time_pairs = [
    ["Imperium", -8],
    ["Venedig", -8],
    ["Zargon", -3],
    ["Riguar", -2],
    ["Zalutt", 7],
    ["Reichs-Stat", 8],
    ["Arikz Ruzuv", 9],
    ["Caster", 10],
    ["Ankorr", 11],
    ["Folvik", 11],
  ];

  tidssoner.innerHTML = "";
  let td = new Date(time.valueAsDate);
  city_time_pairs.forEach((x) => {
    tidssoner.innerHTML += create_time_element(...x, td);
  });
}

function create_time_element(name, time_zone, td) {
  return `<div><b>${name}</b><p>${format_time(time_zone, td)}<p></div>`;
}

function calculate_dates() {
  let d = new Date(date.valueAsDate);
  let calendars = [
    ["Aryansk kalender", [aryansk_dato(d)]],
    ["Commensk kalender", [commensk_dato(d), gammel_commensk_dato(d)]],
    ["Fermansk kalender", [fermansk_dato(d)]],
    ["Latisk kalender", [latisk_dato(d, false), latisk_dato(d, true)]],
    ["Salvatisk kalender", [salvatisk_dato(d)]],
  ];

  kalendere.innerHTML = "";
  calendars.forEach((x) => {
    create_date_element(kalendere, ...x);
  });
}

function create_date_element(location, name, date) {
  let de = document.createElement("DIV");
  let dt = document.createElement("B");
  dt.innerHTML = name;
  let dc = document.createElement("P");

  date.forEach((x) => {
    dc.append(buttonize(x));
  });

  de.append(dt);
  de.append(dc);

  location.append(de);
}

function buttonize(data) {
  let line = document.createElement("DIV");
  line.class = "box";

  let out = document.createElement("OUTPUT");
  out.innerHTML = data;

  let img = document.createElement("IMG");
  img.src = "copy.svg";
  img.width = "16";
  img.height = "16";
  img.onclick = (event) => copy_click(event);

  line.append(out);
  line.append(img);

  return line;
}

function copy_click(e) {
  let out = e.target.parentNode.firstChild;
  navigator.clipboard.writeText(out.value);
}

function fermansk_dato(d) {
  return (
    pad_string(d.getUTCDate().toString()) +
    "." +
    pad_string((d.getUTCMonth() + 1).toString()) +
    "." +
    d.getUTCFullYear()
  );
}

function aryansk_dato(d) {
  let a_months = [
    "Vassinx",
    "Fazak",
    "Jorzak",
    "Luzak",
    "Lyserik",
    "Snezik",
    "Hyzak",
  ];
  let a_vassinx_len = 53;
  let a_month_len = 52;

  let a_year = d.getUTCFullYear() - 598;
  let a_month;
  let a_day = get_day(d);

  if (is_leap(d.getUTCFullYear())) {
    a_vassinx_len++;
  }

  if (a_day <= a_vassinx_len) {
    a_month = a_months[0];
  } else {
    let i = 1;
    a_day -= a_vassinx_len;
    while (a_day > a_month_len) {
      i++;
      a_day -= a_month_len;
    }
    a_month = a_months[i];
  }

  return a_day + ". " + a_month + " " + a_year;
}

function commensk_dato(d) {
  return (
    pad_string(d.getUTCDate().toString()) +
    "." +
    pad_string((d.getUTCMonth() + 1).toString()) +
    "." +
    d.getUTCFullYear()
  );
}

function gammel_commensk_dato(d) {
  return (
    pad_string(d.getUTCDate().toString()) +
    "." +
    pad_string((d.getUTCMonth() + 1).toString()) +
    "." +
    (d.getUTCFullYear() + 5508)
  );
}

function latisk_dato(d, alt) {
  var l_months = [
    "primember",
    "secundember",
    "tertember",
    "quartember",
    "quintmber",
    "sextember",
    "september",
    "octember",
    "november",
    "december",
    "undecember",
    "duodecember",
  ];
  let l_year = d.getUTCFullYear() - 598;
  let l_day = get_day(d);
  let l_month = Math.floor(l_day / 30) + 1;
  l_day = ((l_day - 1) % 30) + 1;
  if (l_month == 13) {
    l_month = 12;
    l_day += 30;
  }

  let alt1 =
    l_year +
    "-" +
    pad_string(l_month.toString()) +
    "-" +
    pad_string(l_day.toString());
  let alt2 =
    pad_string(l_day.toString()) + ". " + l_months[l_month - 1] + " " + l_year;

  if (alt) {
    return alt2;
  }
  return alt1;
}

function salvatisk_dato(_d) {
  return "Det er ingen som forstår hvordan det skal gjøres.";
}

function is_leap(year) {
  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
    console.log("Det er skuddår gutta!");
    return true;
  }
  return false;
}

function get_day(d) {
  var day_length = 1000 * 60 * 60 * 24;
  var start = new Date(d.getUTCFullYear(), 0, 0);
  return Math.floor((d - start) / day_length);
}

function pad_string(string) {
  return string.padStart(2, "0");
}

function format_time(time_zone, td) {
  let th = td.getUTCHours() + time_zone;
  if (th > 23) th -= 24;
  if (th < 0) th += 24;
  let thf = pad_string(th.toString());
  let tm = pad_string(td.getUTCMinutes().toString());
  return thf + ":" + tm;
}
