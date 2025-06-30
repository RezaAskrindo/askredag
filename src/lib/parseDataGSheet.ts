/* eslint-disable @typescript-eslint/no-explicit-any */
// import { marked } from "marked";

export const handleSpreadSheetApiResponse = (googleSheetRows: any[] | null | undefined) => {
  if (googleSheetRows?.length) {
    return googleSheetRows.slice(1).reduce((obj: any, item) => {
      const newArray: any = {}
      item.forEach((el: string, i: number) => {
        Object.assign(newArray, { [googleSheetRows[0][i]]: el });
      });

      obj.push(newArray)
      return obj
    }, []);
  }
  return;
}

// export const handleSpreadSheetApiResponseMarkdown = (googleSheetRows: any[] | null | undefined) => {
//   if (googleSheetRows?.length) {
//     return googleSheetRows.map((row) => ({
//       id_product: row[0],
//       description_title: row[1],
//       description_sub_title: row[2] || null,
//       description_content: row[3] ? parseMarkdown(row[3], row[1]) : null,
//     }))
//   }
//   return;
// }

// export const parseMarkdown = (raw: string, title?: string) => {
//   let result = raw
//   if (result.indexOf('data:image') > -1) {
//     const titleImage = title ?? ''
//     result = '!['+titleImage+']('+raw+')';
//   }

//   return marked.parse(result)
// }