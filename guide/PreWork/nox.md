# Nox 설치


1. [Nox 설치 링크](https://kr.bignox.com/)
에서 녹스 다운로드 후 설치

![image](https://user-images.githubusercontent.com/53963779/201028139-2dfca496-4dec-4aac-85e0-54740382b8e4.png)


2. 녹스 매니저 실행 후 **[앱플레이어 추가]** 클릭

![앱 플레이어 추가](https://user-images.githubusercontent.com/53963779/201034172-65182bc8-491e-46f4-ad19-a767af64bdc9.png)


3. **[안드로이드 9 버전]** 설치

![안드로이드 9버전 선택](https://user-images.githubusercontent.com/53963779/201034373-94c25ef9-4c55-45c2-9bf1-c4cb415daaff.png)


4. 설치 후 **[설정]** - **[일반]** - **[root 켜기]** 체크

![root](https://user-images.githubusercontent.com/53963779/201034723-bf4e4af8-5355-4f5e-9835-566e4d305c73.png)


5. **[설정]** - **[성능]** - **[해상도 설정]** - **[스마트폰]** 설정

![해상도 설정](https://user-images.githubusercontent.com/53963779/201034963-fdd22c70-b6ba-4ef1-b5b0-08153e24c64d.png)


 

 # 에뮬레이터 프록시로 잡기

## 프록시 설정

1. Burp Suite의 Proxy > Options > Proxy Listener에서 **[add]** 클릭

![image](https://user-images.githubusercontent.com/53963779/201246638-4b792014-9130-4c27-bc8c-19194795c0ef.png)

2. port를 8081로 입력하고 **[all interfaces]** 클릭

![인터페이스 추가](https://user-images.githubusercontent.com/53963779/201027646-8fbb70cf-21e5-4500-b801-f427bb0a1484.png)

3. cmd 창에서 `ipconfig` 명령어를 입력해 IP 확인

![image](https://user-images.githubusercontent.com/53963779/201247017-2f6c8d7e-160c-47dc-a66e-d4f630444140.png)


4. Nox 실행 후 설정 > 네트워크 및 인터넷 > Wi-Fi > 연결된 Wi-Fi 우측 톱니바퀴 > 연필 클릭

![image](https://user-images.githubusercontent.com/53963779/201247669-2a461634-876f-4ed9-82f4-0492f11ccfa3.png)

![image](https://user-images.githubusercontent.com/53963779/201247765-109202a3-33f5-42a0-ad0d-721398c815f4.png)



5. 고급 옵션에서 다음과 같이 설정 후 저장
    - 프록시 - 수동
    - 프록시 호스트 이름 - Wi-Fi IP (3에서 확인한 IP 주소)
    - 프록시 포트 - 8081 (2에서 설정한 포트번호)

![image](https://user-images.githubusercontent.com/53963779/201248218-4b61c266-bbfe-4767-8d64-a75bc6c54e45.png)



## 인증서 설치

1. Burp Suite 실행 후 Proxy > Intercept에서 **[Open Browser]** 클릭

![image](https://user-images.githubusercontent.com/53963779/201243801-db5d6c6d-712e-480e-bbe8-af1ad8a4435f.png)



2. 새로 열린 브라우저에서 http://burp/ 접속 후 우측의 **[CA Certificate**] 클릭하여 인증서 다운로드

 ![ca 다운](https://user-images.githubusercontent.com/53963779/201242986-2d3b841a-5756-41a0-b05d-1df4fdd2f4d4.png)



3. 다운받은 파일의 확장자를 `.der`에서 `.cer`로 수정 후 Nox 에뮬레이터에 드래그 앤 드롭

![image](https://user-images.githubusercontent.com/53963779/201243452-1cf5633c-646a-4f64-9378-86e4bacc4dbc.png)


4. 보안 및 위치 > 암호화 및 사용자 인증 정보 > 자격증명 저장소 > SD 카드에서 설치 > `cacert.cer` 선택

![image](https://user-images.githubusercontent.com/53963779/201244662-a198f1c4-2268-4e12-9f84-9e3373e16a7c.png)


5. 인증서 이름을 임의로 넣고 **[확인]** 클릭

![image](https://user-images.githubusercontent.com/53963779/201244849-a7ef0e76-57e8-43bd-895e-e7998c801f8f.png)


6. PIN 번호 설정

![image](https://user-images.githubusercontent.com/53963779/201244997-f5d61798-0ff4-4757-95f4-85371ad1785b.png)


7. /system/etc/security/cacerts 경로에 설치한 인증서 복사

![image](https://user-images.githubusercontent.com/53963779/201245134-54adba11-a69a-4d73-8432-d7f34caf74d7.png)

![image](https://user-images.githubusercontent.com/53963779/201245666-646d771e-4db0-4f0a-aca4-aee1e4448f2f.png)

```
nox_adb shell
cd /data/misc/user/0/cacert-added
ls -al
mount -o rw, remount /system

mv [파일명] /system/etc/security/cacerts
```
<br>

![image](https://user-images.githubusercontent.com/53963779/201246185-dd8d1176-03e3-4c08-8cb4-1f1d2cbb9018.png)

인증서 설치 후 프록시가 잘 잡히는 것 확인 가능

참조사이트: https://omoknooni.tistory.com/25