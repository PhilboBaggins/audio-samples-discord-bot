function baseName(path) {
  return path.split('/').reverse()[0];
}

// TODO: There has got to be a better way to do this.... Javascript can't be this shit
function formatInteger(length, num) {
  return String(num).padStart(length, '0');
}

function getIntegerLength(num) {
  const str = `${num}`;
  return str.length;
}

function justFileName(path) {
  let fileNameWithExt = baseName(path);
  return fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf('.')) || fileNameWithExt;
}

// https://stackoverflow.com/a/26230409
function partition(array, n) {
  return array.length ? [array.splice(0, n)].concat(partition(array, n)) : [];
}

module.exports = {
    baseName: baseName,
    formatInteger: formatInteger,
    getIntegerLength: getIntegerLength,
    justFileName: justFileName,
    partition: partition,
}
