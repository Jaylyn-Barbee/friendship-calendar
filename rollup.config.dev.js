import resolve from "@rollup/plugin-node-resolve";
import html from "@open-wc/rollup-plugin-html";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "index.html",
  output: {
    dir: "build",
    format: "es",
  },
  plugins: [
    resolve({
      exportConditions: ['development']
    }),
    html(),
    typescript({
      tsconfig: "tsconfig.dev.json",
    }),
    replace({
      __apiKey__ : process.env.apiKey,
      __authDomain__ : process.env.authDomain,
      __projectId__: process.env.projectId,
      __clientID__ : process.env.clientID,
      __PRODUCTION__ : "__DEVELOPMENT__"
    }),
    copy({
      targets: [
        { src: "assets/**/*", dest: "build/assets/" },
        { src: "styles/global.css", dest: "build/styles/" },
        { src: "manifest.json", dest: "build/" },
      ],
    }),
  ],
};
