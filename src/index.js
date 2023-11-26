import {
  allPass,
  anyPass,
  applySpec,
  complement,
  compose,
  curry,
  equals,
  isNil,
  match,
  partial,
  partialRight,
  prop
} from 'ramda';
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
const getSearch = prop('search');
const getPathname = prop('pathname');

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

const parseUrl = (url) => new URL(url);
const splitFileByLine = match(/[^\r\n]+/g);

const getUrlInfo = applySpec({
  hostname: getHostname,
  protocol: getProtocol,
  pathname: getPathname,
  query: getSearch,
})

const path = '../data';

let fileData = '';

logReadFile(path);

try {
  fileData = readFile(path);
} catch (e) {
  logErrorMessage(e);
}

const urls = splitFileByLine(fileData);

const urlsInfo = [];

for (let i = 0; i < urls.length; i++) {
  let parsedUrl;

  try {
    parsedUrl = parseUrl(urls[i]);
  } catch (e) {
    logErrorMessage(e);
  }

  if (isMarketUrl(parsedUrl)) {
    urlsInfo.push(getUrlInfo(parsedUrl));
  }
}

const formatedUrlsInfo = formatUrlsInfo(urlsInfo);

logWriteUrlInfo(formatedUrlsInfo);

try {
  writeUrlsInfo(formatedUrlsInfo);
} catch (e) {
  logErrorMessage(e);
}
