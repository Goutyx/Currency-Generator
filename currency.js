const currencyToCountry = {
    USD: "US", EUR: "EU", GBP: "GB", INR: "IN", JPY: "JP", AUD: "AU", CAD: "CA", CHF: "CH", CNY: "CN", HKD: "HK",
    NZD: "NZ", SEK: "SE", KRW: "KR", SGD: "SG", NOK: "NO", MXN: "MX", RUB: "RU", ZAR: "ZA", TRY: "TR", BRL: "BR",
    TWD: "TW", DKK: "DK", PLN: "PL", THB: "TH", IDR: "ID", HUF: "HU", CZK: "CZ", ILS: "IL", CLP: "CL", PHP: "PH",
    AED: "AE", SAR: "SA", MYR: "MY", RON: "RO"
};
const getCountry = c => currencyToCountry[c] || c.slice(0,2);

const fromSelect = document.getElementById('from-currency');
const toSelect = document.getElementById('to-currency');
const fromFlag = document.getElementById('from-flag');
const toFlag = document.getElementById('to-flag');
const amountInput = document.querySelector('.in');
const valueDiv = document.querySelector('.value');
const button = document.getElementById('button');

async function loadCurrencies() {
    let res = await fetch('https://open.er-api.com/v6/latest/USD');
    let data = await res.json();
    let codes = Object.keys(data.rates).sort();
    fromSelect.innerHTML = toSelect.innerHTML = '';
    codes.forEach(c => {
        fromSelect.innerHTML += `<option value="${c}">${c}</option>`;
        toSelect.innerHTML += `<option value="${c}">${c}</option>`;
    });
    fromSelect.value = 'USD';
    toSelect.value = 'INR';
    fromFlag.src = `https://flagsapi.com/${getCountry('USD')}/flat/64.png`;
    toFlag.src = `https://flagsapi.com/${getCountry('INR')}/flat/64.png`;
}
fromSelect.onchange = () => fromFlag.src = `https://flagsapi.com/${getCountry(fromSelect.value)}/flat/64.png`;
toSelect.onchange = () => toFlag.src = `https://flagsapi.com/${getCountry(toSelect.value)}/flat/64.png`;

button.onclick = async () => {
    let amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) return valueDiv.textContent = 'Enter a valid amount.';
    valueDiv.textContent = 'Converting...';
    try {
        let res = await fetch(`https://open.er-api.com/v6/latest/${fromSelect.value}`);
        let data = await res.json();
        let rate = data.rates[toSelect.value];
        valueDiv.textContent = rate
            ? `${amount} ${fromSelect.value} = ${(amount * rate).toFixed(2)} ${toSelect.value}`
            : 'Conversion not available.';
    } catch {
        valueDiv.textContent = 'Error fetching rates.';
    }
};

loadCurrencies();