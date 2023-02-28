import{_ as o}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as s,b as a,d as e,e as d,w as l,f as t,r}from"./app.d51fb666.js";const c={},p=t('<h1 id="파일-다운로드-공격" tabindex="-1"><a class="header-anchor" href="#파일-다운로드-공격" aria-hidden="true">#</a> 파일 다운로드 공격</h1><h2 id="_1-파일-다운로드-취약점이란" tabindex="-1"><a class="header-anchor" href="#_1-파일-다운로드-취약점이란" aria-hidden="true">#</a> 1. 파일 다운로드 취약점이란 ?</h2><ul><li><p>파일 다운로드 취약점은 파일 다운로드 시 애플리케이션의 파라미터 값을 조작하여 웹사이트의 중요한 파일 또는 웹 서버 루트에 있는 중요한 설정 파일 등을 다운받을 수 있는 취약점이다.</p></li><li><p>다운로드 파일이 지정된 디렉토리 이외에 접근이 가능할 때 발생하는 취약점이므로 허용된 경로 이외의 디렉터리와 파일에 접근이 불가능하도록 적용해야 한다.</p></li></ul><h2 id="_2-공격-방법" tabindex="-1"><a class="header-anchor" href="#_2-공격-방법" aria-hidden="true">#</a> 2. 공격 방법</h2>',4),f=a("img",{src:"https://user-images.githubusercontent.com/115529661/200763439-5a742d33-a6b3-4151-88b0-a61dfb9f9110.jpg",alt:"파일다운로드시_요청값",loading:"lazy"},null,-1),h=t('<p>요청값을 통해 api endpoint는 /api/qna/filedown라는 것과, 파일 다운로드는 GET 방식으로 진행되며 파라미터는 filename 으로 upload/파일이름 형태인 것을 확인할 수 있다.</p><p><img src="https://user-images.githubusercontent.com/115529661/200763676-0fa7f626-d56d-4564-ba37-5fae1d8cf617.jpg" alt="없는파일요청" loading="lazy"></p><p>리피터를 통해 없는 파일을 요청하면 다음과 같은 응답값을 보내준다.</p><p><img src="https://user-images.githubusercontent.com/115529661/200764169-79ba34ac-13ce-4d84-95a1-a4119f4f800e.jpg" alt="요청시 응답값" loading="lazy"> 응답값은 암호화가 되어있는 형태이기 때문에 복호화가 필요하다. <img src="https://user-images.githubusercontent.com/115529661/200765970-7322b108-9249-47a4-847a-5a243ad38fdd.jpg" alt="복호화한 응답값" loading="lazy"></p><p>응답값을 복호화하면 다음과 같은 결과가 나오는데 오류 메세지로 filedown은 lib/api/Qna/filedown.js에서 관리하는 것을 알 수 있다.</p><p>filedown.js코드를 확인하기 위해 다운로드를 진행해 본다.</p><p><img src="https://user-images.githubusercontent.com/115529661/200766808-09d97660-1a79-4054-812c-4fbfc08c20c6.jpg" alt="filedown.js다운 요청값" loading="lazy"></p><p>filedown.js파일 다운로드 요청 사항이다.</p><p><img src="https://user-images.githubusercontent.com/115529661/200767009-7fe84fe0-c9bf-4b85-a379-ebd711ef8966.jpg" alt="filedown.js다운 응답값" loading="lazy"></p><p>응답 값으로 다운로드에 성공했고, filedown.js의 소스가 나오는 것을 확인할 수 있다.</p>',10);function u(g,m){const i=r("RouterLink");return n(),s("div",null,[p,a("p",null,[e("파일 다운로드 공격 진행 시 버프스위트로 요청 값을 확인한다. ** 참고자료 "),d(i,{to:"/Exploits/(../footprinting/decrypting_response.html#%ED%95%98%EB%93%9C%EC%BD%94%EB%94%A9-%EB%AA%A9%EC%B0%A8-%EC%9D%B4%EB%8F%99)"},{default:l(()=>[e("암·복호화확인")]),_:1}),e(" ** "),f]),h])}const j=o(c,[["render",u],["__file","file_download.html.vue"]]);export{j as default};
