import xlsx from "xlsx";

export function read_xlx_file() {
    // Read the file
    const workbook = xlsx.readFile("./uploads/bw_mini_db_30.xlsx");

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    //const range = worksheet["!ref"];
    //var range = xlsx.utils.decode_range(sheet['!ref']);

    // Convert sheet to JSON
    // const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 0 });
    // console.log('jsonData = ', jsonData);
    // console.log('length = ', jsonData.length)

    let result = sheet2arr(worksheet);
    console.log('result = ', result);
    console.log('result.length = ', result.length);
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
