/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      display: ['Roboto'],
      title: ['Roboto'],
      headline: ['Roboto'],
      label: ['Inter'],
      body: ['Inter'],
    },
    extend: {
      boxShadow: {
        'elevation-1': '0px 3px 10px 0px #0000000D;',
        'elevation-2':
          '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
        'elevation-3':
          '0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
        'elevation-4':
          '0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
        'elevation-5':
          '0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
        'elevation-6': '0px 3px 15px 0px rgba(196, 196, 196, 0.4)',
      },
      colors: {
        base: {
          primary: {
            900: '#10475F',
            800: '#155E7C',
            700: '#1181B8',
            600: '#239BCD',
            500: '#27AAE1',
            400: '#52BBE7',
            300: '#6EC6EB',
            200: '#9CD8F1',
            100: '#BCE5F6',
            50: '#E9F7FC',
          },
          pink: {
            900: '#641D4F',
            800: '#832767',
            700: '#A93285',
            600: '#D940AB',
            500: '#EE46BC',
            400: '#F16BC9',
            300: '#F483D2',
            200: '#F7AAE0',
            100: '#FAC6EA',
            50: '#FDEDF8',
          },
          purple: {
            900: '#290064',
            800: '#360083',
            700: '#4600A9',
            600: '#5900D9',
            500: '#6200EE',
            400: '#8133F1',
            300: '#9654F4',
            200: '#B78AF7',
            100: '#CEB0FA',
            50: '#EFE6FD',
          },
          orange: {
            900: '#6B5311',
            800: '#8C6C17',
            700: '#B58C1D',
            600: '#E8B325',
            500: '#FFC529',
            400: '#FFD154',
            300: '#FFD870',
            200: '#FFE49D',
            100: '#FFEDBD',
            50: '#FFF9EA',
          },
          neutral: {
            black: '#000000',
            white: '#FFFFFF',
            gray: {
              900: '#666666',
              800: '#858586',
              700: '#ACACAD',
              600: '#DCDCDD',
              500: '#F2F2F3',
              400: '#F5F5F5',
              300: '#F6F6F7',
              200: '#F9F9F9',
              100: '#FBFBFB',
            },
            erie: {
              500: '#1B2021',
            },
          },
          semantic: {
            success: {
              900: '#083D21h',
              800: '#0A502B',
              700: '#0D6838',
              600: '#118548',
              500: '#13924F',
              400: '#42A872',
              300: '#61B689',
              200: '#92CDAE',
              100: '#B6DDC8',
              50: '#E7F4ED',
            },
            warning: {
              900: '#623814',
              800: '#81491A',
              700: '#A65E21',
              600: '#D5792B',
              500: '#EA852F',
              400: '#EE9D59',
              300: '#F1AD74',
              200: '#F5C79F',
              100: '#F8D9BF',
              50: '#FDF3EA',
            },
            danger: {
              900: '#621715',
              800: '#801E1C',
              700: '#A52724',
              600: '#D4322E',
              500: '#E93732',
              400: '#ED5F5B',
              300: '#F07976',
              200: '#F5A3A1',
              100: '#F8C1BF',
              50: '#FDEBEB',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
