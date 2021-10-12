import * as fs from 'fs';

/**
 *
 * @param params
 * @returns
 */
export function parse(params: Uint8Array) {
  const obj: any = {};
  const NEWLINE = '\n';
  const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
  const RE_NEWLINES = /\\n/g;
  const NEWLINES_MATCH = /\n|\r|\r\n/;

  // convert Buffers before splitting into lines and processing
  params
    .toString()
    .split(NEWLINES_MATCH)
    .forEach((line: string, idx: number) => {
      // matching "KEY' and 'VAL' in 'KEY=VAL'
      if (line.length) console.warn(idx / 2);
      const keyValueArr = line.match(RE_INI_KEY_VAL);

      // matched?
      if (keyValueArr) {
        const key: string = keyValueArr[1].toLocaleLowerCase();
        // default undefined or missing values to empty string
        let val: string = keyValueArr[2] || '';
        const end = val.length - 1;
        const isDoubleQuoted: boolean = val[0] === '"' && val[end] === '"';
        const isSingleQuoted: boolean = val[0] === "'" && val[end] === "'";

        // if single or double quoted, remove quotes
        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, end);

          // if double quoted, expand newlines
          if (isDoubleQuoted) {
            val = val.replace(RE_NEWLINES, NEWLINE);
          }
        } else {
          // remove surrounding whitespace
          val = val.trim();
        }

        obj[key] = val;
      }
    });

  return obj;
}

export async function writeFile(json: any) {
  const data = JSON.parse(JSON.stringify(json));
  await fs.writeFile('./items.json', data, 'utf8', (err) => {
    if (err) return console.log('writeFile', err);
    console.log('write finish!');
  });
}

export function readFile(name: string) {
  return fs.readFile(`./${name}`, 'utf8', (err, res) => {
    if (err) return console.log('error read File', err);
    console.log('read finish!', res);
    return JSON.stringify(res);
  });
}

export async function readStream(name: string) {
  return await fs.createReadStream(`./${name}`);
}

export async function isExist(path: string) {
  const envFilePath = __dirname + path; // Ruta del archivo de configuracion
  const existPath = await fs.existsSync(envFilePath); // Booleano si existe el envFilePath
  return existPath;
}
