//import { fs } from 'node:fs';
import * as fs from 'fs';

//const content = 'Some content!';

export function createJsonFile(content){
    fs.writeFile('./uploads/data_full.json', JSON.stringify(content, null, 2), err => {
    if (err) {
        console.error(err);
    } else {
        console.log('json file created.');
    }
    });
}
