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
    ["Latisk kalender", [latisk_dato_format_1(d), latisk_dato_format_2(d)]],
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
  const start_date = new Date("2024-01-01");
  let days_since = Math.floor((d - start_date) / (1000 * 60 * 60 * 24));

  let year = 1426;
  let month = 1;

  // Find current year
  while (days_since < 0) {
    year--;
    days_since += is_leap(year) ? 366 : 365;
  }

  while (days_since >= (is_leap(year) ? 366 : 365)) {
    days_since -= is_leap(year) ? 366 : 365;
    year++;
  }

  // Month lengths vary based on leap years
  let a_vassinx_len = 53;
  let a_month_len = 52;

  if (is_leap(year)) {
    a_vassinx_len++;
  }

  let a_months = [
    "Vassinx",
    "Fazak",
    "Jorzak",
    "Luzak",
    "Lyserik",
    "Snezik",
    "Hyzak",
  ];

  if (days_since < a_vassinx_len) {
    month = a_months[0];
  } else {
    let i = 1;
    days_since -= a_vassinx_len;
    while (days_since >= a_month_len) {
      i++;
      days_since -= a_month_len;
    }
    month = a_months[i];
  }

  return (days_since + 1) + ". " + month + " " + year;
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

function latisk_dato_format_1(d) {
  let dato = latisk_dato(d);

  return dato.year + "-" + pad_string(dato.month.toString()) + "-" + pad_string(dato.day.toString());
}

function latisk_dato_format_2(d) {
  var months = [
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

  let dato = latisk_dato(d);
  return pad_string(dato.day.toString()) + ". " + months[dato.month - 1] + " " + dato.year;
}

function latisk_dato(d) {
  const start_date = new Date("2024-01-01");
  let days_since = Math.floor((d - start_date) / (1000 * 60 * 60 * 24));
  
  let year = 1111;
  let month = 1;

  // Find current year
  while (days_since < 0) {
    year--;
    days_since += is_leap(year) ? 366 : 365;
  }

  while (days_since >= (is_leap(year) ? 366 : 365)) {
    days_since -= is_leap(year) ? 366 : 365;
    year++;
  }

  // Find current month
  while (month <= 11 && days_since >= 30)
  {
    days_since -= 30;
    month++;
  }

  return { year: year, month: month, day: days_since + 1};
}

function salvatisk_dato(d) {
  const start_date = new Date("2024-01-01");
  let days_since = Math.floor((d - start_date) / (1000 * 60 * 60 * 24));
  let year = 1426;
  let month = 1;

  // Finn aryansk år for skuddår.
  while (days_since < 0) {
    year--;
    days_since += is_leap(year) ? 366 : 365;
  }

  while (days_since >= (is_leap(year) ? 366 : 365)) {
    days_since -= is_leap(year) ? 366 : 365;
    year++;
  }

  // Finn latisk måned
  while (month <= 11 && days_since >= 30)
  {
    days_since -= 30;
    month++;
  }

  // Finn salvatisk år
  const months = ["A", "R", "K", "O", "X", "G", "E", "T"];
  var t_index = 0;
  const reign_start = [35, 41, 26, 41, 28, 20, 2, 0]
  const reign_stop = [100, 85, 75, 52, 57, 42, 33, 4];
  var base_year = 39;

  var i_year = year;

  if (i_year > 1426)
  {
    base_year += (i_year - 1426);
  }

  while (i_year++ < 1426)
  {
    if (base_year > reign_start[t_index]) {
      base_year--;
    } else {
      t_index++;
      base_year = reign_stop[t_index];
    }
  }

  if (t_index >= months.length)
  {
    return "Før verden ble skapt.";
  }
  return (days_since + 1) + "." + month + "." + base_year + months[t_index];
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
