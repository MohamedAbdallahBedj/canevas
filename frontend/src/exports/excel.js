import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
export const excel = (columns, rows, fileName) => {
    // create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Feuille 01");

    // add the data to the worksheet
    worksheet.columns = columns;

    rows.forEach((row) => {
        worksheet.addRow(row);
    });

    // save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer]), `${fileName}.xlsx`);
    });
}

export default excel;