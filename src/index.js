import { compose, curry, prop } from 'ramda';
import { log, readFile, writeFile } from './helpers/index';

console.clear();

const curriedLog = curry(log);
//curriedLog('green')('Read file')( path);
//curriedLog('green', 'Read file', path);
const logInfo = curriedLog('green');
const logError = curriedLog('red');

const logErrorWithTitle = logError('Error');
const logReadFile = logInfo('Read file');
const logWriteUrlInfo = logInfo('Write to file');

const getMessage = prop('message');

const logErrorMessage = compose(logErrorWithTitle, getMessage);

const path = '../data';

let fileData = '';

logReadFile(path);

try {
  fileData = readFile(path);
} catch (e) {
  logErrorMessage(e);
}

const urls = fileData.match(/[^\r\n]+/g) || [];

const urlsInfo = [];

for (let i = 0; i < urls.length; i++) {
  let parsedUrl;

  try {
    parsedUrl = new URL(urls[i]);
  } catch (e) {
    logErrorMessage(e);
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

logWriteUrlInfo(formatedUrlsInfo);

try {
  writeFile('urlsInfo.json', '../', formatedUrlsInfo);
} catch (e) {
  logErrorMessage(e);
}
