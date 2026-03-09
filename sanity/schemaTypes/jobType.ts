import { UsersIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const jobType = defineType({
  name: 'job',
  title: 'Vaga de Emprego',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Profissão / Cargo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Localização',
      type: 'string',
      description: 'Ex: Porto, Remoto, Híbrido',
    }),
    defineField({
      name: 'type',
      title: 'Tipo de Contrato',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'full-time' },
          { title: 'Part-time', value: 'part-time' },
          { title: 'Estágio', value: 'internship' },
          { title: 'Freelance', value: 'freelance' },
        ],
      },
    }),
    defineField({
      name: 'requirements',
      title: 'Requisitos',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Lista de requisitos para a vaga',
    }),
    defineField({
      name: 'proposal',
      title: 'O que Oferecemos',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Benefícios e proposta da empresa',
    }),
    defineField({
      name: 'description',
      title: 'Descrição da Vaga',
      type: 'text',
      rows: 5,
      description: 'Descrição detalhada das responsabilidades',
    }),
    defineField({
      name: 'isActive',
      title: 'Vaga Ativa',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de Publicação',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, location, isActive } = selection
      return {
        title: title,
        subtitle: `${location || 'Sem localização'} ${isActive ? '✓' : '(Inativa)'}`,
      }
    },
  },
})
