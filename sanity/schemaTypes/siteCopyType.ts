import { defineField, defineType } from "sanity";

// Documento único (_id: "siteCopy") com os textos editados no backoffice,
// guardados como JSON (chave -> texto). Lido pelo build via scripts/fetch-copy.mjs.
export default defineType({
  name: "siteCopy",
  title: "Textos do site",
  type: "document",
  fields: [
    defineField({
      name: "json",
      title: "Textos (JSON)",
      type: "text",
      description: "Gerido pelo backoffice — não editar à mão.",
    }),
  ],
});
