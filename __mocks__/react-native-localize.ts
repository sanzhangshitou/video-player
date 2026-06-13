export function getLocales() {
  return [{ languageCode: 'en', languageTag: 'en' }];
}

export function getCountry() {
  return 'US';
}

export function getCurrency() {
  return 'USD';
}

export function getNumberFormatSettings() {
  return {
    decimalSeparator: '.',
    groupingSeparator: ',',
  };
}
