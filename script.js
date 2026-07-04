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

  } catch (e) {
    hide('loading');
    showError('通信エラーが発生しました。インターネット接続を確認してください。');
  }
}

function show(id) { document.getElementById(id).classList.add('visible'); }
function hide(id) { document.getElementById(id).classList.remove('visible'); }
function showError(msg) {
  document.getElementById('errorMsg').textContent = msg;
  show('error');
}
