import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as r,c as n,b as t,d as e,e as s,f as o,r as l}from"./app.d51fb666.js";const c={},g=t("h1",{id:"nox-설치",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#nox-설치","aria-hidden":"true"},"#"),e(" Nox 설치")],-1),d={href:"https://kr.bignox.com/",target:"_blank",rel:"noopener noreferrer"},p=o('<p><img src="https://user-images.githubusercontent.com/53963779/201028139-2dfca496-4dec-4aac-85e0-54740382b8e4.png" alt="image" loading="lazy"></p><ol start="2"><li>녹스 매니저 실행 후 <strong>[앱플레이어 추가]</strong> 클릭</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201034172-65182bc8-491e-46f4-ad19-a767af64bdc9.png" alt="앱 플레이어 추가" loading="lazy"></p><ol start="3"><li><strong>[안드로이드 9 버전]</strong> 설치</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201034373-94c25ef9-4c55-45c2-9bf1-c4cb415daaff.png" alt="안드로이드 9버전 선택" loading="lazy"></p><ol start="4"><li>설치 후 <strong>[설정]</strong> - <strong>[일반]</strong> - <strong>[root 켜기]</strong> 체크</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201034723-bf4e4af8-5355-4f5e-9835-566e4d305c73.png" alt="root" loading="lazy"></p><ol start="5"><li><strong>[설정]</strong> - <strong>[성능]</strong> - <strong>[해상도 설정]</strong> - <strong>[스마트폰]</strong> 설정</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201034963-fdd22c70-b6ba-4ef1-b5b0-08153e24c64d.png" alt="해상도 설정" loading="lazy"></p><h1 id="에뮬레이터-프록시로-잡기" tabindex="-1"><a class="header-anchor" href="#에뮬레이터-프록시로-잡기" aria-hidden="true">#</a> 에뮬레이터 프록시로 잡기</h1><h2 id="프록시-설정" tabindex="-1"><a class="header-anchor" href="#프록시-설정" aria-hidden="true">#</a> 프록시 설정</h2><ol><li>Burp Suite의 Proxy &gt; Options &gt; Proxy Listener에서 <strong>[add]</strong> 클릭</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201246638-4b792014-9130-4c27-bc8c-19194795c0ef.png" alt="image" loading="lazy"></p><ol start="2"><li>port를 8081로 입력하고 <strong>[all interfaces]</strong> 클릭</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201027646-8fbb70cf-21e5-4500-b801-f427bb0a1484.png" alt="인터페이스 추가" loading="lazy"></p><ol start="3"><li>cmd 창에서 <code>ipconfig</code> 명령어를 입력해 IP 확인</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201247017-2f6c8d7e-160c-47dc-a66e-d4f630444140.png" alt="image" loading="lazy"></p><ol start="4"><li>Nox 실행 후 설정 &gt; 네트워크 및 인터넷 &gt; Wi-Fi &gt; 연결된 Wi-Fi 우측 톱니바퀴 &gt; 연필 클릭</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201247669-2a461634-876f-4ed9-82f4-0492f11ccfa3.png" alt="image" loading="lazy"></p><p><img src="https://user-images.githubusercontent.com/53963779/201247765-109202a3-33f5-42a0-ad0d-721398c815f4.png" alt="image" loading="lazy"></p><ol start="5"><li>고급 옵션에서 다음과 같이 설정 후 저장 <ul><li>프록시 - 수동</li><li>프록시 호스트 이름 - Wi-Fi IP (3에서 확인한 IP 주소)</li><li>프록시 포트 - 8081 (2에서 설정한 포트번호)</li></ul></li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201248218-4b61c266-bbfe-4767-8d64-a75bc6c54e45.png" alt="image" loading="lazy"></p><h2 id="인증서-설치" tabindex="-1"><a class="header-anchor" href="#인증서-설치" aria-hidden="true">#</a> 인증서 설치</h2><ol><li>Burp Suite 실행 후 Proxy &gt; Intercept에서 <strong>[Open Browser]</strong> 클릭</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201243801-db5d6c6d-712e-480e-bbe8-af1ad8a4435f.png" alt="image" loading="lazy"></p>',25),m={start:"2"},u={href:"http://burp/",target:"_blank",rel:"noopener noreferrer"},h=t("strong",null,"[CA Certificate",-1),b=o(`<p><img src="https://user-images.githubusercontent.com/53963779/201242986-2d3b841a-5756-41a0-b05d-1df4fdd2f4d4.png" alt="ca 다운" loading="lazy"></p><ol start="3"><li>다운받은 파일의 확장자를 <code>.der</code>에서 <code>.cer</code>로 수정 후 Nox 에뮬레이터에 드래그 앤 드롭</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201243452-1cf5633c-646a-4f64-9378-86e4bacc4dbc.png" alt="image" loading="lazy"></p><ol start="4"><li>보안 및 위치 &gt; 암호화 및 사용자 인증 정보 &gt; 자격증명 저장소 &gt; SD 카드에서 설치 &gt; <code>cacert.cer</code> 선택</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201244662-a198f1c4-2268-4e12-9f84-9e3373e16a7c.png" alt="image" loading="lazy"></p><ol start="5"><li>인증서 이름을 임의로 넣고 <strong>[확인]</strong> 클릭</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201244849-a7ef0e76-57e8-43bd-895e-e7998c801f8f.png" alt="image" loading="lazy"></p><ol start="6"><li>PIN 번호 설정</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201244997-f5d61798-0ff4-4757-95f4-85371ad1785b.png" alt="image" loading="lazy"></p><ol start="7"><li>/system/etc/security/cacerts 경로에 설치한 인증서 복사</li></ol><p><img src="https://user-images.githubusercontent.com/53963779/201245134-54adba11-a69a-4d73-8432-d7f34caf74d7.png" alt="image" loading="lazy"></p><p><img src="https://user-images.githubusercontent.com/53963779/201245666-646d771e-4db0-4f0a-aca4-aee1e4448f2f.png" alt="image" loading="lazy"></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>nox_adb shell
cd /data/misc/user/0/cacert-added
ls -al
mount -o rw, remount /system

mv [파일명] /system/etc/security/cacerts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br><p><img src="https://user-images.githubusercontent.com/53963779/201246185-dd8d1176-03e3-4c08-8cb4-1f1d2cbb9018.png" alt="image" loading="lazy"></p><p>인증서 설치 후 프록시가 잘 잡히는 것 확인 가능</p>`,16),f={href:"https://omoknooni.tistory.com/25",target:"_blank",rel:"noopener noreferrer"};function _(y,x){const a=l("ExternalLinkIcon");return r(),n("div",null,[g,t("ol",null,[t("li",null,[t("a",d,[e("Nox 설치 링크"),s(a)]),e(" 에서 녹스 다운로드 후 설치")])]),p,t("ol",m,[t("li",null,[e("새로 열린 브라우저에서 "),t("a",u,[e("http://burp/"),s(a)]),e(" 접속 후 우측의 "),h,e("] 클릭하여 인증서 다운로드")])]),b,t("p",null,[e("참조사이트: "),t("a",f,[e("https://omoknooni.tistory.com/25"),s(a)])])])}const k=i(c,[["render",_],["__file","nox.html.vue"]]);export{k as default};
