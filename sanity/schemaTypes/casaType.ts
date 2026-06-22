import { defineField, defineType } from "sanity";

export default defineType({
  name: "casa",
  title: "Casa (modelo)",
  type: "document",

  fields: [
    defineField({
      name: "nomeProjeto",
      title: "Nome do modelo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (link)",
      type: "slug",
      options: { source: "nomeProjeto", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tipologia",
      title: "Tipologia (ex: V2)",
      type: "string",
    }),
    defineField({
      name: "areaTotal",
      title: "Área total (m²)",
      type: "number",
    }),
    defineField({
      name: "wc",
      title: "Casas de banho",
      type: "number",
    }),
    defineField({
      name: "descricao",
      title: "Descrição",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "thumbnail",
      title: "Imagem de capa (URL)",
      type: "string",
      description: "Caminho da imagem (ex: /Casas/Oakland/1.jpg) ou URL enviado pelo backoffice",
    }),
    defineField({
      name: "galeria",
      title: "Galeria (lista de URLs)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "planta",
      title: "Planta (URL)",
      type: "string",
    }),
    defineField({
      name: "ordem",
      title: "Ordem na listagem",
      type: "number",
      description: "Menor = aparece primeiro",
    }),
  ],

  preview: {
    select: { title: "nomeProjeto", subtitle: "tipologia", media: "thumbnail" },
  },
});
