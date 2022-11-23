
# Frida 설치


1. [frida 설치 링크](https://github.com/frida/frida/releases)
    - Nox 에뮬레이터의 경우 64.xz로 끝나는 파일 다운로드

![Untitled (13)](https://user-images.githubusercontent.com/53963779/201031056-06bc0b5b-7a76-4076-9ecf-99ab81fae4dc.png)


<br>

3. cmd에서 frida와 frida-tools 설치 후 버전 확인
    - 정상적으로 설치되지 않았을 경우 버전 확인 불가

```
pip install frida
pip install frida-tools
frida --version
```
<br>

3. 다운로드 받은 frida-server 파일 압축 해제 후 Nox 에뮬레이터로 push

```
cd [frida 압축 해제 경로]
nox_adb push [frida 파일 명] /data/local/tmp
```
<br>

4. `nox_adb shell`로  Nox에 접속한 뒤, /system/priv-app 경로에 frida-server 파일 복사

```
nox_adb shell
su root
cd /data/local/tmp
chmod 755 frida-server-14.2.13-android-arm64  
mount -o rw,remount /system
cp frida-server-14.2.13-android-arm64 /system/priv-app/
```
<br>

5. Nox의 /system/priv-app 경로에서 frida-server 실행

![image](https://user-images.githubusercontent.com/53963779/201240170-d0feb32e-c6ff-48d6-9987-66a843411610.png)

```
cd /system/priv-app
./[frida 서버 파일명]
```

<br>

6. 새 cmd 창에 `frida-ps -U` 입력 후 frida-server가 잘 실행되는지 확인
    - frida-ps -U : 단말기(Nox 에뮬레이터)에서 실행 중인 프로세스를 나열하는 명령어
    - 명령어 입력 시 아무 것도 출력되지 않으면 frida-server 버전이나 실행 여부 확인 필요

![frida-ps-U](https://user-images.githubusercontent.com/53963779/201240491-8d8b2730-4ef6-4833-9610-23d0d415819a.png)




