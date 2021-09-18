function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function serialize(instance) {
    let str = JSON.stringify(instance);
    download(`saved_GEN-${instance.GENERATION}.json`, str);
}

function unserialize(str, theClass) {
    let instance = new theClass(0, 0);                  // NOTE: if your constructor checks for unpassed arguments, then just pass dummy ones to prevent throwing an error
    let serializedObject = JSON.parse(str);
    return instance.loadJSON(serializedObject);
}