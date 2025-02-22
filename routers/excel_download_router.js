import express from "express";
import * as fs from 'fs';

export const download_router = express.Router();

//upload_router.route('/data_sheet').post( upload.none(), (req, resp) => {
download_router.route("/excel_sheet").get((req, resp) => {
  
  let stats = fs.statfsSync("./uploads/bw_mini_db_30.xlsx");
  console.log('size = ', stats?.bsize);
  const file_size = stats?.bsize | 0;
  
  var options = {
    root: ".",
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
      'Content-Type': 'application/vnd.ms-excel',
      'Content-Length': file_size
    }
  }

  resp.status(200).sendFile("./uploads/bw_mini_db_30.xlsx", options, (err) => {
    if(err){
        console.log('Error = ', err);
    }else{
        console.log('Excel file sent successfully');
    }
  })
});
