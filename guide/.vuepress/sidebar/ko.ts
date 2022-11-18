import { sidebar } from 'vuepress-theme-hope';
import * as fs from 'fs';

export const koSidebar = sidebar(
  getSidebarArr()
);

function aheadOfReadme(arr) {
  // ['1.test.md','README.md'] => ['README.md','1.test.md']
  var readmeIdx = arr.indexOf("README.md");
  if (readmeIdx > 0) {
      arr.unshift(arr.splice(readmeIdx, 1)[0]);
  }
  return arr;
}
function makeSidebarObject(folder, mdfileList) {
  var path = folder ? "/" + folder + "/" : "/";
  mdfileList = aheadOfReadme(mdfileList);
  let tmpMdfileList : Array<String> = [];
  // remove .md, add Path
  mdfileList.forEach(function(mdfile) {
      if (mdfile.substr(-3) === ".md") {
          mdfile = mdfile.slice(0, -3) === "README" ? "" : mdfile.slice(0, -3);
          if(mdfile !== "") {
            tmpMdfileList.push(path + mdfile + ".md");
          }else{
            tmpMdfileList.push(path+'README.md');
          }
      }
  });
  mdfileList = tmpMdfileList;
  // remove folder prefix number
  if (folder) {
      var dotIdx = folder.indexOf(".");
      var title = Number(folder.substr(0, dotIdx))
      ? folder.substr(dotIdx + 1)
      : folder;
  } else {
    return {
      text: "Home",
      link: path,
      collapsable: true
    }
  }
  return {
      text: title,
      // link: path,
      children: mdfileList,
      collapsable: true
  };
}
function getSidebarArr() {
  console.log("getSidebarArr");
  var docsPath = __dirname + "/../..";
  let sidebarArr: Array< any > = [];
  let HomeFilelist: Array<String> = [];
  // var filelist = fs.readdirSync(docsPath);
  var filelist = ['.vuepress', 'PreWork', 'Bypass', 'Footprinting', 'Exploits', 'Etc', 'README.md']
  filelist.forEach(function(file) {
      if (file === ".vuepress") return;
      var stat = fs.lstatSync(docsPath + "/" + file);
      if (stat.isDirectory()) {
          // directory
          // title is file, children is readdirSync
          var docsFolderPath = docsPath + "/" + file;
          var list = fs.readdirSync(docsFolderPath);
          sidebarArr.push(makeSidebarObject(file, list));
      } else {
          // NOT directory
          // title is '/' children is file
          HomeFilelist.push(file);
      }});
  sidebarArr.unshift(makeSidebarObject("", HomeFilelist));

  // home 페이지 이름 강제 설정
  // sidebarArr[0].children[0] = ['/.md', 'Introcuion'];
  console.log(sidebarArr);
  return sidebarArr;
}

