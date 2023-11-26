import { allPass, anyPass, complement, compose, curry, equals, isNil, partial, partialRight, prop } from 'ramda';
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
const getHostname = prop('hostname');
const getProtocol = prop('protocol');

const formatUrlsInfo = partialRight(JSON.stringify, [null, 2]);
const writeUrlsInfo = partial(writeFile, ['urlsInfo.json', '../']);

const isMarketHostname = equals('market.yandex.ru');
const isHttpProtocol = equals('http:');
const isHttpsProtocol = equals('https:');

const logErrorMessage = compose(logErrorWithTitle, getMessage);
const isMarketHostUrl = compose(isMarketHostname, getHostname);
const isHttpUrl = compose(isHttpProtocol, getProtocol);
const isHttpsUrl = compose(isHttpsProtocol, getProtocol);

const hasUrl = complement(isNil);

const isHttpOrHttpsUrl = anyPass([isHttpUrl, isHttpsUrl]);
const isMarketUrl = allPass([hasUrl, isHttpOrHttpsUrl, isMarketHostUrl]);

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

  if (isMarketUrl(parsedUrl)) {
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
