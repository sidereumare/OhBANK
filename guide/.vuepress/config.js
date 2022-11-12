module.exports = {
    plugins: [
        ['@vuepress/plugin-back-to-top', true],
    ],
    title: "모의해킹 가이드",
    description: "desc",
    theme: "yuu",
    themeConfig: {
        yuu: {
            defaultDarkTheme: true,
            defaultColorTheme: "blue",
            labels: {
				darkTheme: '다크 테마를 활성화합니까?',
				ignoreThemes: '다른 테마를 무시합니까?',
			},
        },
        logo: 'https://user-images.githubusercontent.com/114275157/201018069-4a95e05a-d781-4f5d-9601-b41c519a2dd9.png', // logo 이미지
        sidebar: getSidebarArr(),
        smoothScroll: true // 부드러운 스크롤 사용 여부
    },
    //레파지토리의 이름을 아래에 넣어주면된다.
    // base: "/OhBANK/"
};

function getSidebarArr() {
    var fs = require("fs");
    var docsPath = __dirname + "/../";
    var sidebarArr = [];
    var HomeFilelist = [];
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
    sidebarArr[0].children[0] = ['/.md', 'Introcuion'];
    return sidebarArr;
}
function makeSidebarObject(folder, mdfileList) {
    var path = folder ? "/" + folder + "/" : "/";
    mdfileList = aheadOfReadme(mdfileList);
    var tmpMdfileList = [];
    // remove .md, add Path
    mdfileList.forEach(function(mdfile) {
        if (mdfile.substr(-3) === ".md") {
            mdfile = mdfile.slice(0, -3) === "README" ? "" : mdfile.slice(0, -3);
            tmpMdfileList.push(path + mdfile + ".md");
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
        title = "HOME";
    }
    return {
        title: title,
        children: mdfileList
    };
}
function aheadOfReadme(arr) {
    // ['1.test.md','README.md'] => ['README.md','1.test.md']
    var readmeIdx = arr.indexOf("README.md");
    if (readmeIdx > 0) {
        arr.unshift(arr.splice(readmeIdx, 1)[0]);
    }
    return arr;
}