import { compose, curry, partial, partialRight, prop } from 'ramda';
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

const formatUrlsInfo = partialRight(JSON.stringify, [null, 2]);
const writeUrlsInfo = partial(writeFile, ['urlsInfo.json', '../']);

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

const formatedUrlsInfo = formatUrlsInfo(urlsInfo);

logWriteUrlInfo(formatedUrlsInfo);

try {
  writeUrlsInfo(formatedUrlsInfo);
} catch (e) {
  logErrorMessage(e);
}
