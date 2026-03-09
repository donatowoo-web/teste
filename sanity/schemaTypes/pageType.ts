import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Página",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "published",
      title: "Publicada",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "sectionsData",
      title: "Secções (JSON)",
      type: "text",
      description: "JSON data for page sections - managed via backoffice",
    }),
  ],

  preview: {
    select: {
      title: "title",
      published: "published",
    },
    prepare({ title, published }) {
      return {
        title,
        subtitle: published ? "Publicada" : "Rascunho",
      };
    },
  },
});
