/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF9F9A",
        secondary: '#FFF7AD',
        third:'#D874DD',
        lcol: '#FFADE8',
        scol: '#B4EC9F',
        ocol: '#95DFEE',
        icol: '#9793FE',
        rcol: '#FFB871',
        acol: '#F1E087',
        lcol2:'#F56ACD',
        scol2:'#47D466',
        ocol2:'#5383D6',
        icol2:'#B266DE',
        acol2:'#F1B42F',
        scol3: '#50C878',
        ocol3:'#81D8D0',
        lcol3:'#F653A6',
        pinkbg:'#FFC0CB',
        rcol:'#FC9D6D',
        rcol2:'#EE7031',
        
        


        
        
     
       
        black: {
          100: "#000000",
        },
      },
      backgroundImage: {
        'gradient': 'linear-gradient(to bottom #FF9F9A, #FFF7AD)',
      },
      fontFamily: {
        ibold: ["InriaSans-Bold", "sans-serif"],
        iboldit: ["InriaSans-BoldItalic", "sans-serif"],
        iregular: ["InriaSans-Regular", "sans-serif"],
        iitalic: ["InriaSans-Italic", "sans-serif"],
        ilight: ["InriaSans-Light", "sans-serif"],
        ilightit: ["InriaSans-LightItalic", "sans-serif"],
      },
    },
  },
  
  plugins: [],
}

