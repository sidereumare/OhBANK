import{_ as e}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as a,c as t,f as s}from"./app.d51fb666.js";const n={},c=s(`<h1 id="민감-정보-노출" tabindex="-1"><a class="header-anchor" href="#민감-정보-노출" aria-hidden="true">#</a> 민감 정보 노출</h1><h2 id="logcat" tabindex="-1"><a class="header-anchor" href="#logcat" aria-hidden="true">#</a> LOGCAT</h2><p>지금까지 앱을 사용하면서 여러가지 log들이 쌓여있으며 또한 이것을 logcat 명령어를 통해 우리는 확인할 수 있다.</p><p>adb를 통해 logcat 명령어를 사용하면 다음과 같이 log들을 볼 수 있다.</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>logcat | more
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="https://user-images.githubusercontent.com/43737348/201027525-3ee0dddf-ff18-4a69-a2cb-6b28d3ad477e.png" alt="logcat" loading="lazy"></p><p>여기에서 우리는 Process ID들을 통해 log들을 확인할 수 있으며 원하는 PID로 검색하기 위해 Oh Bank 앱의 패키지 이름인 com.app.damnvulnerablebank를 ps -ef 명령어를 통해 검색하면 앱의 PID를 확인할 수 있다.</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ps -ef | grep com.app.damnvulnerablebank
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="https://user-images.githubusercontent.com/43737348/201026844-b65ec2e3-a4d2-42b5-bacd-8d84ee4ed823.png" alt="ps-ef" loading="lazy"></p><p>이걸 통해 얻은 PID를 이용하여 Oh Bank 앱에서 사용하는 accesstoken을 logcat을 통해 확인할 수 있다.</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>logcat | grep 3348 | grep accesstoken
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><img src="https://user-images.githubusercontent.com/43737348/201027773-fa07054a-5aec-4b63-a5b1-4b93be0e4a69.png" alt="accesstoken" loading="lazy"></p>`,12),d=[c];function l(i,r){return a(),t("div",null,d)}const p=e(n,[["render",l],["__file","logcat.html.vue"]]);export{p as default};