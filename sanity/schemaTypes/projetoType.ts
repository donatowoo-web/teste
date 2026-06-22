import { defineField, defineType } from "sanity";

export default defineType({
  name: "projeto",
  title: "Projeto",
  type: "document",

  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (link)",
      type: "slug",
      options: { source: "titulo", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "descricao", title: "Descrição", type: "text", rows: 4 }),
    defineField({ name: "localizacao", title: "Localização", type: "string" }),
    defineField({ name: "sistema", title: "Sistema construtivo", type: "string" }),
    defineField({ name: "area", title: "Área (ex: 138 m²)", type: "string" }),
    defineField({ name: "ano", title: "Ano", type: "string" }),
    defineField({ name: "finalidade", title: "Finalidade", type: "string" }),
    defineField({
      name: "thumbnail",
      title: "Imagem de capa (URL)",
      type: "string",
    }),
    defineField({
      name: "imagens",
      title: "Galeria (lista de URLs)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "ordem", title: "Ordem na listagem", type: "number" }),
  ],

  preview: {
    select: { title: "titulo", subtitle: "localizacao", media: "thumbnail" },
  },
});
