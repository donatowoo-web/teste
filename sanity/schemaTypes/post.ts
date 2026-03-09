import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Post",
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

    // 🖼️ IMAGEM DO BLOG (NOVA)
    defineField({
      name: "mainImage",
      title: "Imagem do Post",
      type: "image",
      options: {
        hotspot: true, // permite focar a imagem
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Resumo",
      type: "text",
      rows: 3,
      description: "Pequeno resumo usado na listagem do blog",
    }),

    defineField({
      name: "publishedAt",
      title: "Publicado em",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
defineField({
  name: "content",
  title: "Conteúdo",
  type: "array",
  of: [
    { type: "block" }, // texto normal
    {
      type: "image",   // imagens dentro do artigo
      options: {
        hotspot: true,
      },
    },
  ],
  validation: (Rule) => Rule.required(),
}),
  ],

  preview: {
    select: {
      title: "title",
      media: "mainImage",
      subtitle: "publishedAt",
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString("pt-PT")
          : "Sem data",
      };
    },
  },
});
