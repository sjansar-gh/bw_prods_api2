import xlsx from "xlsx";
import { createJsonFile } from "./file_writer.js";

export function read_xlx_file2() {
    // Read the file
    //const workbook = xlsx.readFile("./uploads/bw_mini_db_30.xlsx");
    const workbook = xlsx.readFile("./uploads/bw_full_data_2024.xlsx");

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 0, defval: '' });
    console.log('jsonData = ', jsonData);
    console.log('length = ', jsonData.length);

    //write data to json file
    createJsonFile(jsonData);

    // let result = sheet2arr(worksheet);
    // console.log('result = ', result);
    // console.log('result.length = ', result.length);
}

var sheet2arr = function(sheet){
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = xlsx.utils.decode_range(sheet['!ref']);
    for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
       row = [];
        for(colNum=range.s.c; colNum<=range.e.c; colNum++){
           var nextCell = sheet[
              xlsx.utils.encode_cell({r: rowNum, c: colNum})
           ];
           if( typeof nextCell === 'undefined' ){
              row.push('');
           } else row.push(nextCell.w);
        }
        result.push(row);
    }
    return result;
 };
