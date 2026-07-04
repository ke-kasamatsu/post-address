const zipInput = document.getElementById('zipInput');

zipInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') search();
});

zipInput.addEventListener('input', () => {
  const val = zipInput.value.replace(/[^0-9]/g, '');
  if (val.length > 3) {
    zipInput.value = val.slice(0, 3) + '-' + val.slice(3, 7);
  } else {
    zipInput.value = val;
  }
});

async function search() {
  const zip = zipInput.value.replace(/-/g, '').trim();

  hide('result');
  hide('weather');
  hide('error');
  hide('loading');

  if (!/^\d{7}$/.test(zip)) {
    showError('7桁の数字で郵便番号を入力してください（例：1000001）');
    return;
  }

  show('loading');

  try {
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
    const data = await res.json();

    hide('loading');

    if (data.status !== 200) {
      showError('APIの呼び出しに失敗しました。しばらくしてから再試行してください。');
      return;
    }

    if (!data.results) {
      showError('該当する住所が見つかりませんでした。');
      return;
    }

    const r = data.results[0];
    document.getElementById('pref').textContent = r.address1;
    document.getElementById('city').textContent = r.address2;
    document.getElementById('town').textContent = r.address3 || '（町域情報なし）';
    show('result');

    fetchWeather(r.address2, r.address1);

  } catch (e) {
    hide('loading');
    showError('通信エラーが発生しました。インターネット接続を確認してください。');
  }
}

async function fetchWeather(city, pref) {
  show('weatherLoading');
  hide('weatherContent');

  const query = encodeURIComponent(city);

  try {
    const res = await fetch(`https://wttr.in/${query}?format=j1`);
    if (!res.ok) throw new Error('weather fetch failed');
    const data = await res.json();

    hide('weatherLoading');

    const cur = data.current_condition[0];
    const today = data.weather[0];

    document.getElementById('weatherCity').textContent = `${pref} ${city}`;
    document.getElementById('weatherDesc').textContent = translateDesc(cur.lang_ja?.[0]?.value || cur.weatherDesc[0].value);
    document.getElementById('weatherTemp').textContent = cur.temp_C;
    document.getElementById('weatherFeels').textContent = cur.FeelsLikeC;
    document.getElementById('weatherHumidity').textContent = cur.humidity;
    document.getElementById('weatherWind').textContent = cur.windspeedKmph;
    document.getElementById('weatherTempMax').textContent = today.maxtempC;
    document.getElementById('weatherTempMin').textContent = today.mintempC;
    document.getElementById('weatherIcon').textContent = getWeatherEmoji(cur.weatherCode);

    show('weatherContent');
    show('weather');

  } catch (e) {
    hide('weatherLoading');
    document.getElementById('weatherError').textContent = '天気情報を取得できませんでした。';
    show('weatherError');
    show('weather');
  }
}

function getWeatherEmoji(code) {
  const c = parseInt(code);
  if (c === 113) return '☀️';
  if (c === 116) return '⛅';
  if (c === 119 || c === 122) return '☁️';
  if ([143, 248, 260].includes(c)) return '🌫️';
  if ([176, 263, 266, 281, 284, 293, 296, 299, 302, 305, 308, 311, 314, 317, 350, 353, 356, 359, 362, 365, 374, 377].includes(c)) return '🌧️';
  if ([179, 182, 185, 227, 230, 320, 323, 326, 329, 332, 335, 338, 368, 371, 395].includes(c)) return '❄️';
  if ([200, 386, 389, 392].includes(c)) return '⛈️';
  return '🌤️';
}

function translateDesc(desc) {
  const map = {
    'Sunny': '晴れ', 'Clear': '快晴', 'Partly cloudy': '曇り時々晴れ',
    'Cloudy': '曇り', 'Overcast': '曇天', 'Mist': '霧',
    'Fog': '濃霧', 'Light rain': '小雨', 'Moderate rain': '雨',
    'Heavy rain': '大雨', 'Light snow': '小雪', 'Moderate snow': '雪',
    'Heavy snow': '大雪', 'Thundery outbreaks possible': '雷雨の可能性',
    'Blizzard': '吹雪', 'Light drizzle': '霧雨',
  };
  return map[desc] || desc;
}

function show(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('visible');
}
function hide(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('visible');
}
function showError(msg) {
  document.getElementById('errorMsg').textContent = msg;
  show('error');
}
