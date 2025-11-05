import ejs from "ejs";

export async function getHTMLfromEJS(
  templatePath: string,
  data: Record<string, any>
) {
  return await ejs.renderFile(templatePath, data);
}
