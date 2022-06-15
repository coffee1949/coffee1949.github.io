module.exports = {
  title: "学习笔记",
  description: "not only frontend",
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "Home", link: "/" },
      // { text: "Guide", link: "/guide/" },
      {
        text: "FrontEnd",
        items: [
          { text: "ElementUI", link: "/FrontEnd/ElementUI/" },
          { text: "Javascript", link: "/FrontEnd/Javascript/" },
          { text: "MiniProgram", link: "/FrontEnd/MiniProgram/" },
          { text: "React", link: "/FrontEnd/React/" },
          { text: "YApi", link: "/FrontEnd/YApi/" },
          { text: "Echarts", link: "/FrontEnd/Echarts/" },
        ],
      },
      {text: "NodeJS", items: [
        {text: "NodeJS", link: "/NodeJS/NodeJS/"},
        {text: "Express", link: "/NodeJS/Express/"},
        {text: "Koa2", link: "/NodeJS/Koa2/"},
        {text: "MongoDB", link: "/NodeJS/MongoDB/"},
        {text: "NPM", link: "/NodeJS/NPM/"},
        {text: "NRM", link: "/NodeJS/NRM/"},
        {text: "NVM", link: "/NodeJS/NVM/"},
        {text: "NodePackage", link: "/NodeJS/NodePackage/"},
      ]},
      { text: "Python", link: "/Python/" },

      {
        text: "Tools",
        items: [
          { text: "VsCode", link: "/Tools/VsCode/" },
          { text: "PyCharm", link: "/Tools/PyCharm/" },
        ],
      },
      {
        text: "Other",
        items: [
          {text: "DevOps", link: "/Other/DevOps/"},
        ]
      },
      {
        text:'理财',
        link: '/Money/'
      },
      {
        text: "Languages",
        ariaLabel: "Language Menu",
        items: [
          { text: "Chinese", link: "/language/chinese/" },
          { text: "Japanese", link: "/language/japanese/" },
        ],
      },
      { text: "External", link: "https://google.com" },
    ],
    sidebar: {
      "/Python/": ["", "FrameWork"],
      "/Tools/VsCode/": [""],
      "/FrontEnd/ElementUI/": [""],
      "/FrontEnd/MiniProgram/": ["", "Error"],
      "/FrontEnd/React/": ["", "Component", "Props", "Redux", "ReactHook", "Mbox"],
      "/FrontEnd/YApi/": [""],
      "/FrontEnd/Echarts/": [""],
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
