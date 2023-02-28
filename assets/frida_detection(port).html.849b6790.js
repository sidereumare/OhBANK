import{_ as o}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as s,c as r,b as e,d as t,e as n,f as c,r as i}from"./app.d51fb666.js";const d={},l=c('<h1 id="안티-디버깅-우회" tabindex="-1"><a class="header-anchor" href="#안티-디버깅-우회" aria-hidden="true">#</a> 안티 디버깅 우회</h1><h2 id="_1-안티-디버깅이란" tabindex="-1"><a class="header-anchor" href="#_1-안티-디버깅이란" aria-hidden="true">#</a> 1. 안티 디버깅이란?</h2><p>디버깅을 방지하여 소스코드 분석을 하지 못하도록 하는 기술이다.</p><h2 id="_2-공격-방법" tabindex="-1"><a class="header-anchor" href="#_2-공격-방법" aria-hidden="true">#</a> 2. 공격 방법</h2>',4),h={href:"http://libfrida-check.so",target:"_blank",rel:"noopener noreferrer"},_=e("p",null,"*.so 파일은 안드로이드에서 사용하는 라이브러리 파일이다. 이 파일을 분석하기 위해서는 IDA나 ghidra같은 디버깅 도구를 사용해야한다.",-1),p=e("p",null,[e("img",{src:"https://user-images.githubusercontent.com/53963779/200975846-a569e0d0-dfce-42a3-a175-34b8ed9757ad.png",alt:"so 파일",loading:"lazy"})],-1),u=e("p",null,[e("img",{src:"https://user-images.githubusercontent.com/53963779/200976776-42ec84c2-6797-4df3-a39a-f5a5175eb5e1.png",alt:"ghidra 화면",loading:"lazy"})],-1),f=e("p",null,"기드라 분석",-1),g=e("p",null,"기드라를 통해 fridaCheck 함수의 의사 코드를 볼 수 있다. 20행의 0xa269는 포트 번호를 나타낸다.",-1),b=e("p",null,"대부분의 네트워크 통신의 경우, 빅엔디안 형식의 코드를 사용하다. 따라서 0xa269의 실제 값은 27042이다. 이는 프리다가 사용하는 기본 포트 번호이다.",-1),m={href:"http://libfrida-check.so",target:"_blank",rel:"noopener noreferrer"},x=e("p",null,[e("img",{src:"https://user-images.githubusercontent.com/53963779/200977079-35271620-98b1-4e59-bdc1-3e11d5ea4b04.png",alt:"adb 포트 포워딩",loading:"lazy"})],-1),k=e("p",null,"단말기를 컴퓨터와 연결한 경우, adb를 사용해 포트 포워딩을 해주고, NOX 가상 에뮬레이터를 사용중인 경우 nox_adb를 통해 포트를 포워딩 해준다.",-1),y=e("p",null,[e("img",{src:"https://user-images.githubusercontent.com/53963779/200977207-576d4b1c-f986-44c8-926b-210630ec9691.png",alt:"frida-server 포트 포워딩",loading:"lazy"})],-1),z=e("p",null,"frida-server도 17000 포트로 포워딩 해준다.",-1),v=e("p",null,[e("img",{src:"https://user-images.githubusercontent.com/53963779/200977351-6a8e607b-3de8-4fcf-9944-fbf3d30b8355.png",alt:"포트포워딩 프리다 코드",loading:"lazy"})],-1),N=e("p",null,"변경된 포트로 후킹할 수 있게끔 코드를 수정해준다.",-1),V=e("p",null,[e("img",{src:"https://user-images.githubusercontent.com/53963779/200977562-960b1f1e-f41f-4d43-8bdd-f050193041ee.png",alt:"앱 실행 성공",loading:"lazy"})],-1),B=e("p",null,"프리다 탐지를 우회하고 성공적으로 앱을 실행시킬 수 있다.",-1);function E(I,C){const a=i("ExternalLinkIcon");return s(),r("div",null,[l,e("p",null,[t('디컴파일한 소스코드에서 "'),e("a",h,[t("libfrida-check.so"),n(a)]),t('"파일을 확인한다.')]),_,p,u,f,g,b,e("p",null,[e("a",m,[t("libfrida-check.so"),n(a)]),t(" 파일은 frida의 기본 포트가 사용중인지 확인하여 프리다를 사용할 수 없게끔 한다는 것을 알 수 있으며 이를 우회하기 위해서는 frida의 기본 포트를 사용하지 않아야 한다.")]),x,k,y,z,v,N,V,B])}const D=o(d,[["render",E],["__file","frida_detection(port).html.vue"]]);export{D as default};