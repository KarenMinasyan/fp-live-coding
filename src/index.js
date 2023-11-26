import { curry } from 'ramda';
import { log, readFile, writeFile } from './helpers/index';

console.clear();

const curriedLog = curry(log);
//curriedLog('green')('Read file')( path);
//curriedLog('green', 'Read file', path);
const logInfo = curriedLog('green');
const logError = curriedLog('red');
const logErrorWithTitle = logError('Error');

const path = '../data';

let fileData = '';

logInfo('Read file', path);

try {
  fileData = readFile(path);
} catch (e) {
  logErrorWithTitle(e.message);
}

const urls = fileData.match(/[^\r\n]+/g) || [];

const urlsInfo = [];

for (let i = 0; i < urls.length; i++) {
  let parsedUrl;

  try {
    parsedUrl = new URL(urls[i]);
  } catch (e) {
    logErrorWithTitle(e.message);
  }

  if (
    parsedUrl &&
    (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') &&
    parsedUrl.hostname === 'market.yandex.ru'
  ) {
    const { hostname, pathname, protocol, search } = parsedUrl;

    urlsInfo.push({
      protocol,
      hostname,
      pathname,
      query: search,
    });
  }
}

const formatedUrlsInfo = JSON.stringify(urlsInfo, null, 2);

logInfo('Write to file', formatedUrlsInfo);

try {
  writeFile('urlsInfo.json', '../', formatedUrlsInfo);
} catch (e) {
  logErrorWithTitle(e.message);
}
