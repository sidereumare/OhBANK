# 요청값 및 응답값 암복호화

## 1. 암호화란?


 암호화 또는 인크립션은 특별한 지식을 소유한 사람들을 제외하고는 누구든지 읽어볼 수 없도록 알고리즘을 이용하여 정보를 전달하는 과정이다.     이러한 과정을 통해 암호화된 정보를 낳는다. 이에 역행하는 과정을 해독 또는 디크립션이라고 하며 이로써 암호화된 정보를 다시 읽을 수 있다.



## 2. 공격 방법




![qna게시판](https://user-images.githubusercontent.com/53963779/200760339-236b07b9-0b5e-4595-b774-c542494241ba.png)


 Burp Suite에서 인터셉트 기능을 켠 상태에서 “Qna 게시판”의 임의의 게시글을 확인해 봄


![qna게시판-burpsuite](https://user-images.githubusercontent.com/53963779/200765947-f73bb9d0-4311-4e87-b230-2ff2262616f4.png)

<!--#하드코딩 목차 이동-->
#### 요청값과 응답값이 암호화된걸 확인. 
#### jadx를 통해 소스를 분석하던 중 “EncryptDecrypt”라는 암호화와 관련이 있어 보이는 클래스 확인.

![jadx](https://user-images.githubusercontent.com/53963779/200766723-a6a09d62-1ff1-458e-8619-be920ef15362.png)


아래와 같이 위 클래스를 js코드로 컨버팅(converting)함

```javascript
console.log("Script loaded successfully");
Java.perform(function() {
    console.log("Inside java perform function");
    // 루팅 우회
    var RootUtil = Java.use("com.app.damnvulnerablebank.RootUtil");
    RootUtil.isDeviceRooted.overload().implementation = function () {
        console.log("isDeviceRooted");
        return false;
    }
    // frida 우회
    var Frida = Java.use("com.app.damnvulnerablebank.FridaCheckJNI");
    Frida.fridaCheck.overload().implementation = function () {
        console.log("Inside fridaCheck");
        return false;
    }
    var Encrypt = Java.use("com.app.damnvulnerablebank.EncryptDecrypt");
    // 암호화 전 문자열 출력
    Encrypt.encrypt.overload('java.lang.String').implementation = function (str) {
        console.log('encrypt : '+str);
        return Encrypt.encrypt(str);
    }
    // 복호화 후 문자열 출력
    Encrypt.decrypt.overload('java.lang.String').implementation = function (str) {
        var result = Encrypt.decrypt(str);
        console.log('decrypt : '+result);
        return result;
    }
    // request url 출력
    var request = Java.use("com.android.volley.toolbox.JsonObjectRequest")
    request.$init.overload('int', 'java.lang.String', 'org.json.JSONObject', 'com.android.volley.Response$Listener', 'com.android.volley.Response$ErrorListener').implementation = function (method, url, jsonRequest, listener, errorListener) {
        console.log('request : '+url);
        return this.$init(method, url, jsonRequest, listener, errorListener);
    }
    // retry policy 강제 수정
    // retry 수 1회로 제한, timeout 무제한
    // volly 라이브러리의 JsonObjectRequest에서 retry policy를 관리하는 객체를 생성하는 부분에서
    // 강제로 주입하는 방식으로 우회
    var retryPolicy = Java.use("com.android.volley.DefaultRetryPolicy")
    retryPolicy.$init.overload('int', 'int', 'float').implementation = function (initialTimeoutMs, maxNumRetries, backoffMultiplier) {
        maxNumRetries = -1;
        initialTimeoutMs = 0;
        console.log('retryPolicy : '+initialTimeoutMs);
        console.log('retryPolicy : '+maxNumRetries);
        console.log('retryPolicy : '+backoffMultiplier);
        return this.$init(initialTimeoutMs, maxNumRetries, backoffMultiplier);
    }
    // System.loadLibrary()를 통해 라이브러리를 로드하는 부분에서 후킹
    var System = Java.use("java.lang.System");
    System.loadLibrary.overload('java.lang.String').implementation = function (str) {
        console.log('System.load : '+str);
        return System.loadLibrary(str);
    }
});
```

![복호화된 값 확인](https://user-images.githubusercontent.com/53963779/200767028-35929f01-0f27-42e2-8042-faae3e986a96.png)
복호화된 값 확인.

![qna bupr 값 수정](https://user-images.githubusercontent.com/53963779/200767115-29e51579-0c37-4293-b925-e99f564212be.png)

Qna 게시판에서 게시글을 클릭할 때 Burp Suite를 통해 값을 수정하여 다른 사용자의 게시글을 확인 가능함.

![다른 사용자 qna 확인](https://user-images.githubusercontent.com/53963779/200767272-44fef888-4f04-4f1b-a0cf-1bb39952568a.png)

