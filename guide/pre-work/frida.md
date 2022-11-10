


https://github.com/frida/frida/releases

![Untitled (13)](https://user-images.githubusercontent.com/53963779/201031056-06bc0b5b-7a76-4076-9ecf-99ab81fae4dc.png)

nox 에뮬레이터의 경우 64.xz로 끝나는 파일 다운로드

```
 pip install frida
```
```
pip install frida-tools
```

```
frida --version
```
을 통해 pc에 frida가 설치됬는지 확인


frida-server 압축 해제

```
cd [frida 압축 해제 경로]
dir -> 이동한 경로에 frida 파일이 있는지 확인
nox_adb push [frida 파일 명] /data/local/tmp
```

파일 이동 후 adb shell을 입력해 모바일 기기에 접속 한 뒤 frida 파일을 /system/priv-app에 이동시킵니다.

```
nox_adb shell
su root
cd /data/local/tmp
chmod 755 frida-server-14.2.13-android-arm64  
mount -o rw,remount /system
cp frida-server-14.2.13-android-arm64 /system/priv-app/
```


```
cd /systemp/priv-app
./[frida 서버 파일명]
```


```
frida-ps U
```
로 잘 설치됬는지 확인


