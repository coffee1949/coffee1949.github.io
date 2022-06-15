module.exports = {
  title: "学习笔记",
  description: "not only frontend",
  themeConfig: {
    logo: "/logo.png",
    nav: [
      {
        text: "FrontEnd",
        items: [
          { text: "React", link: "/FrontEnd/React/" },
          { text: "YApi", link: "/FrontEnd/YApi/" },
        ],
      },
      {text: "NodeJS", items: [
        {text: "MongoDB", link: "/NodeJS/MongoDB/"},
        {text: "NPM", link: "/NodeJS/NPM/"},
        {text: "NRM", link: "/NodeJS/NRM/"},
        {text: "NVM", link: "/NodeJS/NVM/"},
        {text: "NodePackage", link: "/NodeJS/NodePackage/"},
      ]},
      { text: "Python", link: "/Python/" },
      { text: "VsCode", link: "/Tools/VsCode/" },

      {
        text:'理财',
        link: '/Money/'
      },
      // { text: "External", link: "https://google.com" },
    ],
    sidebar: {
      "/Python/": ["", "FrameWork"],
      "/Tools/VsCode/": [""],
      "/FrontEnd/ElementUI/": [""],
      "/FrontEnd/MiniProgram/": ["", "Error"],
      "/FrontEnd/React/": ["", "Component", "Props", "Redux", "ReactHook", "Mbox"],
      "/FrontEnd/YApi/": [""],
      "/Money/": ["","Explain", "Start"],
      "/Other/DevOps/": ["", "CICD"],
      "/NodeJS/MongoDB/": [""],
      "/NodeJS/NPM/": [""],
      "/NodeJS/NRM/": [""],
      "/NodeJS/NVM/": [""],
      "/NodeJS/NodePackage/": [""],
    },
  },
};
